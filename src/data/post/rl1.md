---
publishDate: 2026-04-24T00:00:00Z
title: 强化学习笔记01
excerpt: 从 Bellman equation 到 Policy Iteration and Value Iteration
category: 理论学习
tags:
- rl
author: Yiming Zeng 
---

> 本文参考[强化学习的数学原理](https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning)
# 强化学习的基本概念
- state 
- action
- state transition
- policy **强化学习的最终目的就是学习到 policy**
- reward
- trajectory
- return 一个 trajectory 的奖励之和
- MDP
## State Value

状态值，也就是从当前状态出发得到的回报的期望
$$
v_{\pi}(s) = \mathbb{E}[G_{t}|S_{t} = s]
$$
**状态值常用来衡量一个策略的好坏**，但该策略较好时，每个状态的状态值都应该较高。

## Bellman equation
$$
\begin{align}
v_{\pi}(s) &= \mathbb{E}[G_{t}| S_{t} = s] \\
&=\mathbb{E}[R_{t+1} + \gamma G_{t+1} | S_{t} = s] \\
&=\mathbb{E}[R_{t+1} |S_{t}  = s] + \gamma\mathbb{E}[G_{t+1}|S_{t} = s] \\
&=\sum_{a\in A}\pi(a|s)\left[ \sum_{r\in R}p(r|s,a)r + \gamma \sum_{s'\in S}p(s'|s,a)v_{\pi(s')} \right]
\end{align}
$$
这就是 bellman equation。
bellman equation 也可以写成矩阵形式：
$$
v_{\pi} = r_{\pi} +\gamma P_{\pi}v_{\pi}
$$
重点在于如何求解 bellman equation，因为求解 bellman equation 就是一个对于策略的评价的过程。
1. 当所有的条件都已知的时候，当然可以使用解析的方式求解
2. 数学上可以证明，我们可以通过迭代的方式求解 bellman equation
$$
v_{k+1} = r_{\pi} + \gamma P_{\pi}v_{k},\quad k=0,1,2,\dots
$$
	即我们可以随便选取初始的 $v$ 然后通过不断迭代的方法，最终 $v$ 会收敛到真实的状态值。

## action value

动作值，即从一个状态和一个动作出发得到的回报的期望
$$
q_{\pi}(s,a) = \mathbb{E}[G_{t}|S_{t}=s,A_{t}=a]
$$
同样可以化成如同 $v_{\pi}(s)$ 一样的求和公式，不再赘述。
值得注意的是 $v_{\pi}$ 和 $q_{\pi}$ 的关系：
$$
v_{\pi} = \sum_{a\in A}\pi(a|s)q_{\pi}(s,a)
$$
可以理解为状态值是动作值的平均。
**动作值可以用来评估在当前状态下不同动作的好坏，从而选择更好的动作**。

## 最优状态值与最优策略

存在一个策略 $\pi^*$，使得对于其他任意策略 $\pi$ 以及任意状态 $s$ 都满足:
$$
v_{\pi^*}(s) \geq v_{\pi}(s)
$$
则该策略为最优策略，对应的状态值为最优状态值。

## Bellman Optimal Equation

$$
v(s) = \max_{\pi(s)\in \Pi(s)} \sum \pi(a|s)\left( \sum_{r\in R}p(r|s,a)r + \gamma \sum_{s'\in S}p(s'|s,a)v(s') \right) 
$$
$$
\begin{align}
v &= \max_{\pi\in\Pi }(r_{\pi} + \gamma P_{\pi}v) \\
&= \max_{\pi(s) \in \Pi(s)}\sum \pi(a|s)q(s,a)
\end{align}
$$
这是一个关于 $v$ 和 $\pi$ 的方程，初次看可能会难以理解，不过可以简单理解为求解这个方程我们就可以得到最优状态值和最优策略。而求解 BOE 得到的最优策略是一个 greedy 策略，即在每个状态选择动作值最高的动作作为该状态下应该执行的动作。

数学上同样可以证明，我们可以通过一种的代的方法来求解：
$$
v_{k+1} = f(v_{k}) = \max_{\pi\in\Pi}(r_{\pi} + \gamma P_{\pi}v_{k})
$$
跟求解 bellman equation 相似，我们可以随便找一个初始值，然后不断迭代，最终可以得到 bellman optimal equation 的解。

# Value Iteration

value iteration 实际上就是用于求解 BOE 的方法，具体如下：
1. policy updata
$$
\pi_{k+1} = \arg\max_{\pi}(r_{\pi}+\gamma P_{\pi}v_{k})
$$
2. value update
$$
v_{k+1} = r_{\pi_{k+1}} + \gamma P_{\pi_{k+1}}v_{k}
$$
重复上述步骤，完成迭代。

```
对每个状态 $s\in S$
	对每个状态 $a\in A$
		计算 q 值
	最大价值动作: $a^*_{k}(a|s) = \arg\max_{a}q_{k}(s,a)$
	策略更新：将该状态下的动作设定为动作值最大的对应动作
	值更新: $v_{k+1} = \max_{a}q_{k}(s,a)$
```

# Policy Iteration

policy iteration 也是一种求解最优策略的迭代方法，其思想在于不断交替进行 policy evaluation 和 policy improvement。

1. policy evaluation
	该步骤实际上就是通过求解 bellman equation 对策略进行评估。
$$
v_{\pi_{k}} = r_{\pi_{k}} + \gamma P_{\pi_{k}}v_{\pi_{k}}
$$
	可以使用解析的方式，也可以使用迭代的方式。值得注意的是如果使用迭代的方式理论上要经过无数步才能收敛到真实的 state value，但实际上只会执行有限步，这在 [Truncated policy iteration](#truncated-policy-iteration) 中会有所体现

2. policy improvement
	同样在得到了 state value 之后可以计算 action value，然后与 value iteration 一样进行策略更新。

# Truncated policy iteration

不难发现，value iteration 实际上与在 policy evalution 环节中只执行一步的 policy evaluation 十分相似。而 truncated policy iteration 实际上就是一种特殊的 policy iteration，即在 policy evaluation 中只执行少量步骤，使用粗略估计的 state value 进行 policy improvement。

或者说，value iteration 和 policy iteration 都是特殊的 truncated policy iteration。
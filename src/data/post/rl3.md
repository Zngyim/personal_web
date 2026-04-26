---
publishDate: 2026-04-25T00:00:00Z
title: 强化学习笔记03
excerpt: 从 MC Based Algorithm 到 TD Algorithm
category: 理论学习
tags:
- rl
author: Yiming Zeng 
---

> 本文参考[强化学习的数学原理](https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning)
# MC Basic

## 什么是 model-free

在求解贝尔曼方程的时候，不论是使用解析法还是使用迭代法，都需要知道 model，即 $\{p(r|s,a),p(s'|s,a)\}$。但有时候我们没有办法得到这些数据，那就需要使用 model-free 的方法。

根据 action value 的定义，
$$
q_{\pi}(s,a) = \mathbb{E}[G_{t}|S_{t}=s,A_{t}=a]
$$
我们可以执行策略，收集执行策略得到的回报，然后估计该 action value
$$
q_{\pi}(s,a) = \mathbb{E}[G_{t}|S_{t}=s,A_{t}=a] \approx \frac{1}{n}\sum^n_{i=1}g_{\pi_{k}}^{(i)}(s,a)
$$
简单来说，MC Basic 算法就是收集足够多的从任意(s,a)出发的回合，然后对 action value 进行估计，从而进行策略更新。

# MC Exploring Starts

MC Basic 算法利用数据的效率太过于低下，于是衍生出了 MC Exploring Starts 方法。
$$
\begin{align}
	s_{1} \xrightarrow{a_{2}}s_{2}\xrightarrow{a_{4}}s_{3}\xrightarrow{a_{1}}\dots
\end{align}
$$
简单而言就是在这个 trajectory 中，我们不仅将回报数据运用于计算(s_1,a_2)的动作值，我们还可以使用“子 trajectory”来计算(s_2,a_4)等动作值。

该算法存在一个不太合理的条件，就是 exploring starts 条件，它要求所有的 state-action pairs 都能够被访问到足够多次，这对于 greedy 的策略来说是不合理的

# MC $\epsilon-greedy$ 策略
## $\epsilon$-greedy 策略
$$
\pi(a|s) = 
\begin{cases}
	1 - \frac{\epsilon}{|A(s)|}(|A(s)| - 1)，对于最大价值动作\\
	\frac{\epsilon}{|A(s)|}，\text{对于其他动作}
\end{cases}
$$

简单来说，就是将最大价值动作的概率设置为最大，将其他动作的概率设置为较小但相等的值，从而保留一定的探索性

## Offline 与 Online

offline 与 online 的区别在于 offline 是执行完策略得到 episode 之后再更新策略，而 online 是在执行的过程中就更新策略

## 算法流程

```
对于每个回合
	选择初始state-action pair。执行策略，生成长度为T的episode
	对回合的每一步t = T-1, T-2, T-3...
		g <- \gamma g + r_{t+1} #表示从当前的sa pair出发得到的return
		将return存入到对应的sa pair中
		
		策略评估：
		通过求平均得到各个sa pair的action value
		
		策略改进：
		使用@e - greedy的方法更新策略
		
```

# TD 算法

## 估计状态

给定一个策略，我们的目标是估计状态值。假设我们有一些由 $\pi$ 生成的经验样本 $(s_{0},r_{1},s_{1},\dots,s_{t},r_{t+1},\dots)$ 。我们可以通过以下的方式估计状态值：
$$
v_{t+1}(s_{t}) = v_{t}(s_{t}) - \alpha_{t}(s_{t})[v_{t}(s_{t} - (r_{t+1} + \gamma v_{t}(s_{t+1}))]
$$
$$
v_{t+1}(s) = v_{t}(s),\quad 当s不等于s_{t}
$$
该方法本质上还是在求解一个 bellman equation，只不过使用了 RM 的方法求解。
$$
v_{\pi}(s) = \mathbb{E}[R_{t+1} + \gamma v_{\pi}(S_{t+1}) | S_{t} = s]
$$

该算法还有很多有意思的性质。
$$
TD_{target} = r_{t+1} + \gamma v_{t}(s_{t+1})
$$
$$
TD_{error} = v_{t}(s_{t}) - TD_{target} = v_{t}(s_{t}) -(r_{t+1} + \gamma v_{t}(s_{t+1}))
$$
TD算法本质上就是想要减少 TD error，从而得到更加准确的估计。

TD 方法相比于 MC 方法有以下区别：
1. TD 方法可以处理 episodic 和 continuing 的任务，而 MC 方法只能处理 episodic 的任务
2. TD 方法依赖于 bootstrapping，需要初始值，而 MC 方法则不需要。

## Sarsa

Sarsa 本质上也是一种 TD 算法，可以用于估计动作值，从而能够完成策略的更新。
$$
\begin{align}
	q_{t+1}(s_{t},a_{t}) &= q_{t}(s_{t},a_{t})-\alpha_{t}(s_{t},a_{t})\left[ q_{t}(s_{t},a_{t}) - (r_{t+1} + \gamma q_{t}(s_{t+1},a_{t+1})) \right] \\
	q_{t+1}(s,a) &= q_{t}(s,a),\quad 当(s,a)\neq(s_{t},a_{t})
\end{align}
$$
Sarsa 算法本质上也是使用 RM 方法求解 bellman equation
$$
q_{\pi}(s,a) = \mathbb{E}[R + \gamma q_{\pi}(S',A')|s,a]
$$
![sarsa](/images/posts/rl02/sarsa.png)

**Sarsa 算法是 On-Policy 的**，因为 policy 除了在状态 $s_{t}$ 的时候用于生成 $a_{t}$，同时在状态 $s_{t+1}$ 的时候用于生成 $a_{t+1}$。Sarsa 使用这个经验数据来估计  $\mathbf{\pi_{b}}$  的 $q_{\pi}(s_{t},a_{t})$,并基于此进行策略更新，因此最后得到的 target policy 就是 behavior policy。
## Expected Sarsa
$$
\begin{align}
	q_{t+1}(s_{t},a_{t}) &= q_{t}(s_{t},a_{t})-\alpha_{t}(s_{t},a_{t})\left[ q_{t}(s_{t},a_{t}) - (r_{t+1} + \gamma \mathbb{E}[q_{t}(s_{t+1},a_{t+1})) ]\right] \\
	q_{t+1}(s,a) &= q_{t}(s,a),\quad 当(s,a)\neq(s_{t},a_{t})
\end{align}
$$
这个算法是 Sarsa 的变种，可以发现，该算法并没有生成 $a_{t+1}$，因此它可以是 Off-Policy 的，即 target policy 和 behavior policy 不相同。
## n-step Sarsa
$$
\begin{align}
	q_{t+1}(s_{t},a_{t}) &= q_{t}(s_{t},a_{t})-\alpha_{t}(s_{t},a_{t})\left[ q_{t}(s_{t},a_{t}) - (r_{t+1} + \gamma r_{t+2} + \dots\gamma^nq_{t}(s_{t+n},a_{t+n})) \right] \\
	q_{t+1}(s,a) &= q_{t}(s,a),\quad 当(s,a)\neq(s_{t},a_{t})
\end{align}
$$
值得注意的是，当 n 变为无穷，或者整个 episode 的长度的时候，其实就变成了蒙特卡洛算法。
# Q-Learning

Sarsa 算法本身是在估计给定策略的动作值，而如果想要更新策略还需要结合策略改进的步骤。而 Q-learning 本身就是在求解一个 bellman optimal equation，求解 BOE 之后直接可以得到 $\pi^*$ 和 $v^*$，可以理解为本身就是一个更新策略的方法。
$$
\begin{align}
	q_{t+1}(s_{t},a_{t}) &= q_{t}(s_{t},a_{t})-\alpha_{t}(s_{t},a_{t})\left[ q_{t}(s_{t},a_{t}) - (r_{t+1} + \gamma \max_{a\in A}q_{t}(s_{t+1},a_{t+1})) \right] \\
	q_{t+1}(s,a) &= q_{t}(s,a),\quad 当(s,a)\neq(s_{t},a_{t})
\end{align}
$$
该算法本质就是使用 RM 方法求解一个 bellman optimal equation
$$
q(s,a) = \mathbb{E}[R_{t+1}+\gamma\max_{a}q(S_{t+1},a)|S_{t}=s,A_{t}= a]
$$
Q-learning 既可以是Off-Policy 的，也可以是 On-Policy 的。因为它求解的是贝尔曼最优方程，而不是某个策略的贝尔曼方程。可以直接通过评价得到的 optimal action 去修改另一个策略，也可以修改当前策略。
![on_policy_q_learning](/images/posts/rl02/on_policy_q_learning.png)
![off_policy_q_learning](/images/posts/rl02/off_policy_q_learning.png)

# TD 算法的统一框架

所有的 TD 算法都可以被视为是使用 RM 方法求解 Bellman equation 或者 Bellman optimal equation。他们可以写成统一的表达式。
$$
q_{t+1}(s_{t},a_{t}) = q_{t}(s_{t},a_{t})-\alpha_{t}(s_{t},a_{t})\left[ q_{t}(s_{t},a_{t}) - \bar{q}_{t}\right]
$$
$\bar{q}_{t}$ 是 TD target。
---
publishDate: 2026-04-26T00:00:00Z
title: 强化学习笔记04
excerpt: 值函数方法与策略梯度方法
category: 理论学习
tags:
- rl
author: Yiming Zeng 
---

# 值函数方法

顾名思义，即用函数的方式表示 value（state value 或 action value）。

## 状态值估计

优化目标：
$$
J(w) = \mathbb{E}[(v_{\pi}(S) - \hat{v}(S,w))^2]
$$
我们可以使用 SGD 算法求解：
$$
w_{t+1} = w_{t} + \alpha_{t}(v_{\pi}(s_{t}) - \hat{v}(s_{t},w_{t}))\nabla_{w}\hat{v}(s_{t},w_{t})
$$
但是我们并不知道 $v_{\pi}(s_{t})$，有两种方式可以对其进行估计，一是使用蒙特卡洛方法 $v_{\pi}(s_{t}) = g_{t}$，二是使用 TD target $v_{\pi}(s_{t}) = r_{t+1} + \gamma \hat{v}(s_{t+1},w_{t})$。从而我们可以得到基于值函数的 MC 方法和基于值函数的 TD 方法。

## 基于值函数的 Sarsa 算法

将状态值拓展为动作值后，我们可以进行策略的更新。
$$
w_{t+1} = w_{t} + \alpha_{t}[v_{\pi}(r_{t+1} + \gamma \hat{q}(s_{t+1},a_{t+1},w_{t})- \hat{q}(s_{t},a_{t},w_{t})]\nabla_{w}\hat{q}(s_{t},a_{t},w_{t})
$$
![sarsa_function](/images/posts/rl04/sarsa_function.png)
## 基于值函数的 Q-learning
$$
w_{t+1} = w_{t} + \alpha_{t}[v_{\pi}(r_{t+1} + \gamma \max_{a\in A(s_{t+1})}\hat{q}(s_{t+1},a_{t+1},w_{t})- \hat{q}(s_{t},a_{t},w_{t})]\nabla_{w}\hat{q}(s_{t},a_{t},w_{t})
$$
![qlearning_function](/images/posts/rl04/qlearning_function.png)

执行过程与基于表格的 Sarsa 算法以及 Q-learning 算法基本无异。

## DQN

1. 使用两个网络，主网络和目标网络，其作用在于方便计算梯度
2. 使用经验回放提高数据的利用率，同时便于网络的训练
![dqn](/images/posts/rl04/dqn.png)

# 策略梯度方法

策略梯度本质上就是用函数的方法表示策略，但同时，我们需要找到一个能够衡量策略好坏的目标函数，去优化这个目标函数，从而得到最佳策略。

## 目标函数

一种方式是使用平均状态值作为目标函数
$$
\bar{v}_{\pi} = \sum_{s\in S}d(s)v_{\pi}(s) = \mathbb{E}_{S\sim d}[v_{\pi}(S)] = \mathbb{E}\left[ \sum_{t=0}^{\infty} \gamma^tR_{t+1} \right] = \sum_{s\in S}d_{s}\mathbb{E}\left[ \sum_{t= 0}^{\infty}\gamma^tR_{t+1}|S_{0} =s \right]
$$
相当于
$$
J(\theta) = \mathbb{E}_{\tau \sim p(\tau)}\left[ \sum_{t=1}^H r(s_{t},a_{t}) \right]
$$
另一种方式是使用平均奖励
$$
J(\theta) = \bar{r}_{\pi} = \sum_{s\in S}d_{\pi}(s)r_{\pi}(s) = \mathbb{E}_{S\sim d_{\pi}}[r_{\pi}(S)] = \lim_{ n \to \infty } \frac{1}{n}\mathbb{E}\left[ \sum_{t=0}^{n-1}R_{t+1} \right]
$$

## 目标函数的梯度

有了目标函数之后，我们需要求得目标函数的梯度，并更具梯度来更新参数。幸运的是，大多数情况下我们不需要知道目标函数的梯度是怎么来的，我们只需要知道其表达式。
$$
\begin{align}
	\nabla_{\theta}J(\theta) &=\sum_{s\in S}\eta(s)\sum_{a\in A}\nabla_{\theta}\pi(a|s,\theta)q_{\pi}(s,a)  \\
	&= \mathbb{E}_{s\sim \eta,A\sim \pi(S,\theta)}[\nabla_{\theta}\ln \pi(A|S,\theta)q_{\pi}(S,A)] 
\end{align}
$$
$J(\theta)$ 可以是不同的目标函数，$\eta$ 可以是不同的分布，$=$ 可以表示等于或约等于。总之，所有目标函数的梯度都可以用这一个式子来表示，非常的优美，对于数学过程这里从略。

## REINFORCE

拥有了梯度之后，我们就可以使用梯度上升来最大化目标函数，同时由于梯度是期望，我们可以使用随机梯度方法
$$
\theta_{t+1} = \theta_{t} + \alpha \nabla_{\theta}\ln \pi(a_{t}|s_{t},\theta_{t})q_{t}(s_{t},a_{t})
$$
但我们目前还不知道 $q_{t}(s_{t},a_{t})$。我们可以使用蒙特卡洛方法求得，也可以使用 TD 方法求得。使用蒙特卡洛方法便得到了 REINFORCE 算法。
该剃度上升算法有很多良好的性质，可以从数学上证明其具有以下性质：
1. action value 很大的时候会倾向于提高该动作的概率
2. 如果原有的该动作的概率很小，会倾向于提高该动作概率，以平衡 exploration 和 exploitation
![reinforce](/images/posts/rl04/reinforce.png)
REINFORCE 算法是 On-policy 的，但是是 Offline 的。

# Actor-Critic

在 REINFORCE 算法中，我们使用了蒙特卡洛方法来估计 action value。然而，我们也可以通过 TD 方法来估计 action value，因此我们需要用到值函数的方法。那么就至少要有两组参数，一组用于策略函数，一组用于价值函数。**Actor 对应的是策略更新，即策略参数的更新，Critic 对应的是价值更新，即价值参数的更新**
## QAC
QAC 是最为简单的 AC 方法。
![qac](/images/posts/rl04/qac.png)

## A2C(advantage actor-critic)

该算法的核心是通过引入一个基准（baseline）来减少估计的方差
$$
J(\theta) = \mathbb{E}_{s\sim \eta,A\sim \pi}[\nabla_{\theta}\ln \pi(A|S,\theta_{t})(q_{\pi}(S,A) - b(S))]
$$
一般选择 $b(S) = v_{\pi}(S)$
$$
\delta_{\pi}(S,A) = q_{\pi}(S,A) - v_{\pi}(S)
$$
被称为优势函数，反映了一个动作相较于其他动作的优势。
实际在使用的过程中，常常会使用以下方式估计优势函数：
$$
q_{\pi}(s_{t},a_{t}) - v_{\pi}(s_{t}) \approx r_{t+1} + \gamma v_{t}(s_{t+1}) - v_{t}(s_{t})
$$
这样我们就可以只使用一个估计 state value 的神经网络。
![qac](/images/posts/rl04/a2c.png)

## Off-Policy方法

到目前为止，我们所讨论的方法都是 On-Policy 的，但我们可以通过重要性采样的方法得到 Off-Policy 的方法，从而能够更好地使用由其他策略生成的样本。其梯度公式如下：
$$
\nabla_{\theta}J(\theta) = \mathbb{E}_{S\sim \eta,A\sim \beta}\left[ \frac{\pi(A|S,\theta)}{\beta(A|S)}\nabla_{\theta}\ln \pi(A|S,\theta)q_{\pi}(S,A) \right]
$$
可以看到，这里求期望的时候，动作 A 是从策略 $\beta$ 中采样的，通过一个重要性采用，更新策略 $\pi$。
同时我们也可以引入优势函数
$$
\nabla_{\theta}J(\theta) = \mathbb{E}_{S\sim \eta,A\sim \beta}\left[ \frac{\pi(A|S,\theta)}{\beta(A|S)}\nabla_{\theta}\ln \pi(A|S,\theta)\delta_{t}(s_{t},a_{t}) \right]
$$
![off_policy_ac](/images/posts/rl04/off_policy_ac.png)
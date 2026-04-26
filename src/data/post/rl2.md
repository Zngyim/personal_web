---
publishDate: 2026-04-24T12:00:00Z
title: 强化学习笔记02
excerpt: 随机近似算法
category: 理论学习
tags:
- rl
author: Yiming Zeng 
---

> 本文参考[强化学习的数学原理](https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning)
> 本文主要说明 SGD 的有效性，为强化学习中的 TD 算法打下基础，同时也是对深度学习中习以为常的方法进行说明。

# RM(Robbins-Monro)算法

假设我们需要求解以下方程:
$$
g(w) = 0
$$
并且我们不知道函数表达式，那么我们可以通过以下方法求解
$$
\tilde{g}(w,\eta) = g(w) + \eta
$$
$$
w_{k+1} = w_{k} -\alpha_{k}\tilde{g}(w_{k},\eta_{k})
$$
其中 $\eta$ 是观测噪声。
该算法即为 RM 算法，但其存在一定的成立条件，其中有一些重要的条件在于
1. g 必须是单调递增的，但其梯度必须有界
2. $a_{k}$ 最终要收敛到 0,但不能收敛的太快
等等。对于其数学的严谨证明这里从略。

## 增量式估计期望

对于蒙特卡洛方法估计期望已经非常常见，但还存在一种增量式的估计期望方法。
$$
w_{k+1} = w_{k} - \frac{1}{k}(w_{k} - x_{k})
$$
该方法对于每给定一个新的 $x_{k}$ 都会产生一个新的 $w$，最终会收敛到真实期望。

如果使用 RM 算法的角度看这个增量式的估计期望方法，即求解：
$$
g(w) = w-\mathbb{E}[X]
$$
那么
$$
\tilde{g}(w,\eta) = w - x = (w - \mathbb{E}[X]) + (\mathbb{E}[X] - x) = g(w) + \eta
$$
满足上述的 RM 公式，因此这个增量式方法本质就是在使用 RM 方法。

# SGD

随机梯度下降在机器学习领域非常常见，其本质是处理一个优化问题
$$
\min_{w} J(w) = \mathbb{E}[f(w,X)]
$$
而处理该问题的运筹学方法就是使用梯度下降
$$
w_{k+1} = w_{k} -\alpha_{k}\nabla_{w}J(w_{k}) = w_{k} - \alpha_{k}\mathbb{E}[\nabla_{w}f(w_{k},X)]
$$
而随机梯度下降算法则是随机选取样本进行剃度下降：
$$
w_{k+1} = w_{k} - \alpha_{k}\nabla_{w}f(w_{k},X)
$$
同时还有对应的 mini-batch SGD:
$$
w_{k+1} = w_{k} -\alpha_{k}\frac{1}{m}\sum_{j}\nabla_{w}f(w_{k},x_{j})
$$

证明其有效性可以用到 RM 算法，最小化问题可以等价为求解
$$
g(w) = \nabla_{w}J(w) = \mathbb{E}[\nabla_{w}f(w,X)] = 0
$$
$$
\tilde{g}(w,\eta) = \nabla_{w}f(w,x) = \mathbb{E}[\nabla_{w}f(w,X)] + \nabla_{w}f(w,x) - \mathbb{E}[\nabla_{w}f(w,X)] = g(w) + \eta
$$
从而我们便使用 RM 算法证明了 SGD 的有效性。
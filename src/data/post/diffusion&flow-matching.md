---
publishDate: 2026-03-27T00:00:00Z
title: Diffusion and Flow matching
excerpt: The summary about two generative models, Diffusion and Flow matching, which based on MIT6.S184.
category: 研究笔记
tags:
- generative model
- Diffusion
- Flow Matching
author: Yiming Zeng 
---

# 核心思想

每个数据（例如图片）都可以看做是一个高维度的向量。一个数据就是一个 data point，所有相关的数据构成了一个关于数据的概率分布 distribution，即 $p_{data}$，我们想做的事情就是把一个原始的概率分布（probability distribution） $p_{init}$ 转化为 $p_{data}$，从而能够通过采样的方式得到我们想要得到的数据。

## 核心概念

- probability path
	- **conditional probability path**: $p_t(\cdot|z)$，$p_0(\cdot|z)=p_{init}$，$p_1(\cdot|z)=\delta_z$，即 z 的单点分布，conditional path 描述的是：当我获得一个数据点 z 时，我能够找到一条路径，这条路径的起点是初始概率分布，这条路径的终点是关于该数据点 z 的单点分布，也就是说从初始分布到数据点。
	- **marginal probability path**：$$p_t(x)=\int p_t(x|z)p_{data}(z)dz$$, 其中 $p_0=p_{init}，p_1=p_{data}$。规定了每个点在时刻 t 的概率密度。实质上是规定了一条路径，这个路径给出了在时刻 t 下的概率分布，可以通过某种方式通过这条路径，从而将 $p_{init}$ 转化为 $p_{data}$。
- vector field
	这个概念来自于 ordinary different equation。先考虑一个如下形式的微分方程 $$\frac{d}{dt}X_t=u_t(x|z)$$ 其中 $X_t\sim p_t(\cdot|z),X_0\sim p_{init}$ 。
	通过模拟这个微分方程，我们可以对给定 data point (z) 时的概率分布中的每个"点"规定移动方向，从而让整体往 $p_1(\cdot|z)$ 移动。
	- **conditional vector field**
		$u_t^{target}(X_t|z)$，本质上是一个随着时间 t 变化的向量场，并且该向量场是根据上述所规定的 conditional probability path 所唯一确定的（至于怎么确定以及为什么是唯一的暂时不管）。通过这个向量场确定的 ODE（ordinary different equation，常微分方程）$$\frac{d}{dt}X_t=u_t^{target}(x|z)$$ 能够将概率分布从 $p_{init}$ 转化为 $\delta_z$。
	- **marginal vector field**
		conditional vector field 是在给定 z 的情况下确定概率密度的变化方向。而 marginal vector field 则是对不给定 z 情况下概率密度变化方向进行规定。其形式本质上是 conditional vector field 乘上一个后验比例并进行积分。通过这个 marginal vector field 构成的 ODE 能够将初始的概率分布 $p_{init}$ 转化为 $p_{data}$
		$$u_t^{target}(x) = \int u_t^{target}(x|z)\frac{p_t(x|z)p_{data}(z)}{p_t(x)}dz$$ 其对应微分方程为 $\frac{d}{dt}X_t=u_t^{target}(x)$
- score function
	先假设这是个很有用的工具，至于为什么有用暂时不管。并且这个工具只用在 Diffusion 中。
	- **conditional score function**
		本质上是每个时刻概率密度的梯度 $\nabla p_t(x|z)$
	- **marginal score function**
		和 marginal vector field 的形式相似，也就是 conditional score function 乘上一个后验分布，这里不在多赘述。
		对应的微分方程使用的是 Stochastic Different Equation（SDE）$$dX_t=\left[u_t^{target}(x|z)+ \nabla p_t(x|z)\right]dt + \sigma_tdW_t$$ 其中 $\sigma_t$ 是随机因子，$dW_t$ 是随机游走（布朗运动），直观上理解 SDE 就是在 ODE 的基础上增添了一些随机因素，同时增加了 score function 进行辅助。
## 训练过程
### Flow matching

通过遍历已有的数据集，每次选取一个数据 z，构造一条从初始分布到该数据点的路径，这条路径一般是是 Gaussian Path，从而我们可以得到 Gaussian 对应的 vector field。我们训练的目标就是想要想要训练一个 vector 生成器使得 $u_t^\theta(x)\approx u_t^{target}(x)$。我们可以直观的想象，**target 的vector field 能够让初始分布变为数据分布，那么只要训练得到的 vector field 接近这个 target向量场，那么我们就能将初始分布转变为数据分布**。可能有人会有疑问为什么不能直接使用 target 向量场，还需要直接训练一个新的向量场，因为上述那个积分是不可积的。所以 marginal vector field 我们并不知道。

在训练过程中我们的优化目标是缩小 vector field 和 conditional vector field的差距，因为我们不知道 marginal vector field，所以我们无法将优化目标定为缩小 vector field 和 marginal vector field 的差距，但是可以证明如果差距使用均方差来描述的话，二者的均方差相差一个常数，而 conditional vector field 又是已知的，因此这样的优化目标是合理的。

### Diffusion

上述所说的关于 Flow Matching 的过程是人为规定一条从初始分布到数据分布的路径，然后通过学习 vector field，从而实现生成数据。

Diffusion 的范式和 Flow Matching 略有不同。对于给定的数据点 z，人们规定了一条从这个数据点到噪音的路径，这个噪音是指标准分布，对应 flow matching 中的初始分布，而这条路径本质上就是从标准分布使用 Gaussian Path 到 data point 的逆路径。通过这条路径，实现 data point 到初始分布，这个过程被称为 forward process。

将 data point 变为初始分布之后，有一个反演的过程，被称为 time-reversal，在这个过程中就是将初始分布使用上述的 SDE 得到 data distribution。这个 time-reversal 实际上走的也是我们上述的 marginal probability path（Gaussian Path）。

在训练过程中，对于 SDE，我们看似有两个需要训练的目标，一个是我们希望训练 vector field 接近 target marginal vector field，另一个是我们希望训练 score function 去接近 target marginal score function。但是对于 Gaussian Path，我们可以证明 target marginal vector field 可以用 target marginal score function 来表示，因此在实际训练过程中我们只训练 score function 去接近 target marginal score function。

同样，marginal score function 的积分也是不可积的，但与上述 flow matching 的训练过程同理，我们本质上也是通过优化 score function 和 target conditional score funtion 的均方差来实现。

diffusion 和 flow matching 最大的不同在于使用的微分方程不同，后者是 ODE，而前者是 SDE。其次的不同是 flow matching 的 probability path 是认为规定的（虽然大多数情况下大家使用的都是 Gaussian Path），而 diffusion 就是指使用 Gaussian path 。

## 总结

从直觉上看，
- Flow Matching 和 Diffusion 这两个模型都完成了从一个"混沌状态"（噪音）到数据的分布。
- 上述的噪音和数据分布指的都是概率密度，从更为直观的角度来看，我们可以假设数据分布是一个以 (1,1) 为中心的标准高斯分布，噪音是指一个以 (0,0) 为中心的标准高斯分布。
- 在训练过程中，我们想要训练的就是让模型学会如何将初始分布的噪音转化为数据分布。
- 通过在数据集上采样，再使用某种训练方法，让模型知道，某一点的概率密度需要往哪个方向流动，这样就能将整体分布变为数据分布。这就是训练过程。

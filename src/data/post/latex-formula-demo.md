---
publishDate: 2026-03-27T00:00:00Z
draft: true
title: LaTeX 公式示例：在博客中书写常见数学表达
excerpt: 这是一篇用于测试数学公式渲染的示例文章，包含行内公式、块公式、矩阵、对齐公式与简单推导。
category: 理论学习
tags:
  - LaTeX
  - 数学公式
  - 写作示例
author: Your Name
---

这篇文章主要用于测试博客中的数学公式是否可以正常渲染。以后你写研究笔记、论文阅读或者理论推导时，都可以直接参照这里的写法。

## 1. 行内公式

行内公式适合出现在段落中，比如高斯分布可以写成 $X \sim \mathcal{N}(0, 1)$，或者写损失函数
$\mathcal{L}(\theta)$、条件概率 $p(x \mid y)$、期望 $\mathbb{E}[X]$。

如果只是简单提到一个符号、一个定义或者一个等式，通常用行内公式就够了。

## 2. 块公式

当公式较长，或者需要单独强调时，可以使用块公式：

$$
f(x) = \frac{1}{\sqrt{2\pi}\sigma}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right).
$$

再例如，定积分的基本形式可以写为：

$$
\int_a^b f(x)\,dx = F(b) - F(a).
$$

## 3. 多行对齐公式

推导时常常需要多行对齐。比如对平方项做展开：

$$
\|x - y\|^2
= (x-y)^\top(x-y)
= x^\top x - 2x^\top y + y^\top y.
$$

再比如一个更常见的优化目标：

$$
\mathcal{L}(\theta)
= \frac{1}{N} \sum_{i=1}^N \ell(f_\theta(x_i), y_i)
+ \lambda \|\theta\|_2^2.
$$

## 4. 矩阵与向量

线性代数相关的内容也可以直接写：

$$
A =
\begin{bmatrix}
1 & 2 & 3 \\
0 & 1 & 4 \\
0 & 0 & 1
\end{bmatrix},
\qquad
x =
\begin{bmatrix}
x_1 \\
x_2 \\
x_3
\end{bmatrix}.
$$

于是矩阵乘法 $Ax$ 的结果为

$$
Ax =
\begin{bmatrix}
x_1 + 2x_2 + 3x_3 \\
x_2 + 4x_3 \\
x_3
\end{bmatrix}.
$$

## 5. 概率与期望

写概率论相关内容时，经常会用到如下表达：

$$
\mathbb{E}[X] = \sum_x x\,p(x),
\qquad
\mathrm{Var}(X) = \mathbb{E}[X^2] - (\mathbb{E}[X])^2.
$$

如果是连续情形，则可以写成

$$
\mathbb{E}[X] = \int_{-\infty}^{\infty} x\,p(x)\,dx.
$$

## 6. 一个简单推导示例

设目标函数为

$$
J(w) = \frac{1}{2}\|Xw - y\|^2.
$$

那么它对参数 $w$ 的梯度可以写成

$$
\nabla_w J(w) = X^\top(Xw - y).
$$

这类写法在机器学习、优化和统计建模里都非常常见，所以很适合作为博客里的标准模板。

## 7. 总结

如果这篇文章可以正常显示，说明你现在已经可以在博客中稳定使用 LaTeX 公式了。后续你只需要在 Markdown 里继续使用：

- 行内公式：`$ ... $`
- 块公式：`$$ ... $$`

就可以写大多数研究笔记和理论推导内容。

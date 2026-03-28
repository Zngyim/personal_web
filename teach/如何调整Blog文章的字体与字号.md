# 如何调整 Blog 文章的字体与字号

这份文档专门讲一件事：

**如果你想调整博客文章页面的字体、字号、行距、标题大小，应该改哪里。**

这份说明只关注博客文章阅读页，不讨论首页、导航栏、项目页等其他区域。

---

## 1. 先说结论：最重要的 4 个文件

如果你现在只想改 blog 文章的阅读体验，最重要的是这 4 个文件：

- `src/components/blog/SinglePost.astro`
  控制博客文章详情页的标题、摘要、正文容器类名，是最核心的文件。
- `src/layouts/MarkdownLayout.astro`
  控制普通 Markdown 页面排版，和博客正文风格很接近。
- `src/components/CustomStyles.astro`
  控制全局字体变量，比如正文用什么字体、标题用什么字体。
- `tailwind.config.js`
  控制 Tailwind 的字体变量如何映射成 `font-sans`、`font-serif`、`font-heading`。

如果只改一处，通常先从：

- `src/components/blog/SinglePost.astro`

开始。

---

## 2. 当前博客字体链路是怎么工作的

当前博客文章详情页正文主要由这个组件控制：

- `src/components/blog/SinglePost.astro`

里面最关键的是这段：

```astro
<div
  class="mx-auto px-4 max-w-3xl prose prose-lg dark:prose-invert prose-headings:text-page dark:prose-headings:text-white prose-headings:font-heading prose-a:text-primary dark:prose-a:text-blue-400 prose-img:rounded-sm prose-img:shadow-none mt-10 prose-headings:scroll-mt-[80px] prose-li:my-1"
>
  <slot />
</div>
```

这里有几个关键点：

- `prose`
  启用 Tailwind Typography 的文章排版样式。
- `prose-lg`
  决定正文整体字号是“大号文章排版”。
- `prose-headings:font-heading`
  决定标题使用 `font-heading` 这套字体。
- `prose-li:my-1`
  控制列表项上下间距。

也就是说，**正文排版的第一控制点不是普通 CSS，而是这组 `prose` 类名。**

---

## 3. 当前字体变量在哪里定义

全局字体变量定义在：

- `src/components/CustomStyles.astro`

里面这几行尤其关键：

```css
--aw-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--aw-font-serif: Georgia, 'Times New Roman', serif;
--aw-font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

这三个变量的含义是：

- `--aw-font-sans`
  默认无衬线字体
- `--aw-font-serif`
  衬线字体
- `--aw-font-heading`
  标题字体

然后在：

- `tailwind.config.js`

里又把这些变量映射成 Tailwind 的字体族：

```js
fontFamily: {
  sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
  serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
  heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
},
```

所以你可以把链路理解成：

`CustomStyles.astro` 里的字体变量  
-> `tailwind.config.js` 里的 `fontFamily`  
-> 页面组件里的 `font-heading` / `font-sans` / `font-serif`

---

## 4. 如果你只想改“博客正文大小”，改哪里

最直接的地方：

- `src/components/blog/SinglePost.astro`

当前正文是：

```astro
class="... prose prose-lg ..."
```

其中：

- `prose-sm`：更小
- `prose-base`：标准
- `prose-lg`：偏大
- `prose-xl`：更大

### 例子：把正文调小一点

把：

```astro
prose prose-lg
```

改成：

```astro
prose prose-base
```

### 例子：把正文调大一点

改成：

```astro
prose prose-xl
```

### 什么时候适合改这个

- 你觉得现在文章读起来太大
- 你觉得页面显得太稀疏
- 你希望更接近论文阅读器或博客阅读页

---

## 5. 如果你想改“博客标题大小”，改哪里

还是在：

- `src/components/blog/SinglePost.astro`

当前文章主标题是：

```astro
<h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-page dark:text-white">
  {post.title}
</h1>
```

这里控制逻辑是：

- `text-4xl`
  小屏时大小
- `md:text-5xl`
  中屏以上大小
- `font-bold`
  字重
- `leading-tight`
  行高更紧

### 例子：把标题缩小一点

改成：

```astro
<h1 class="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-page dark:text-white">
```

### 例子：把标题更强调一点

改成：

```astro
<h1 class="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-page dark:text-white">
```

---

## 6. 如果你想改“摘要字号”，改哪里

摘要就是标题下面这段：

```astro
{post.excerpt && <p class="mt-4 text-lg leading-8 text-muted dark:text-slate-400">{post.excerpt}</p>}
```

当前设置：

- `text-lg`
  字号偏大
- `leading-8`
  行距较宽

### 例子：让摘要更紧凑

改成：

```astro
<p class="mt-4 text-base leading-7 text-muted dark:text-slate-400">
```

### 例子：让摘要更像导语

改成：

```astro
<p class="mt-4 text-xl leading-9 text-muted dark:text-slate-400">
```

---

## 7. 如果你想改“文章正文使用什么字体”，改哪里

这里分两种情况。

### 情况 A：改全站默认字体

改：

- `src/components/CustomStyles.astro`

比如你想让正文更像传统博客，可以把：

```css
--aw-font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

改成：

```css
--aw-font-sans: 'Source Serif 4', Georgia, 'Times New Roman', serif;
```

不过要注意：

- 如果这个字体本地没有，用户可能看不到
- 更稳妥是先用系统字体或你已经引入的字体

### 情况 B：只让博客正文用衬线字体

可以直接改博客正文容器类名，在：

- `src/components/blog/SinglePost.astro`

正文容器上加：

```astro
font-serif
```

例如：

```astro
class="mx-auto px-4 max-w-3xl prose prose-lg font-serif ..."
```

这样只会影响博客正文，不一定影响整个网站。

这是我最推荐的做法之一，因为：

- 改动范围小
- 效果直观
- 很适合学术或长文阅读

---

## 8. 如果你想改“文章标题字体”，改哪里

当前正文内部各级标题使用的是：

```astro
prose-headings:font-heading
```

而 `font-heading` 对应的是：

- `--aw-font-heading`

所以你有两种改法。

### 改法 1：改全局标题字体

在：

- `src/components/CustomStyles.astro`

把：

```css
--aw-font-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

改成你想要的字体。

### 改法 2：只改博客正文的标题字体

可以把：

```astro
prose-headings:font-heading
```

改成：

```astro
prose-headings:font-serif
```

前提是 Tailwind 中支持这个字体类。当前项目已经支持 `font-serif`。

例如：

```astro
class="... prose prose-lg prose-headings:font-serif ..."
```

这样正文标题就会更像出版物或论文笔记风格。

---

## 9. 如果你想改“正文行距”，改哪里

正文的行距主要由 `prose` 默认样式控制，但你也可以加自己的类。

例如在正文容器上直接加：

```astro
leading-8
```

或者更宽一点：

```astro
leading-9
```

例如：

```astro
class="mx-auto px-4 max-w-3xl prose prose-lg leading-8 ..."
```

这个做法适合：

- 中文文章偏多
- 希望阅读更松一点
- 长文阅读为主

---

## 10. 如果你想改“Markdown 页”的字体和字号

除了博客正文页，还有一个相关文件：

- `src/layouts/MarkdownLayout.astro`

当前里面也有一段：

```astro
class="mx-auto prose prose-lg max-w-4xl dark:prose-invert ... "
```

所以如果你未来使用普通 Markdown 页面，而不是博客文章页，也要同步改这里。

### 推荐做法

如果你想让“博客页”和“普通 Markdown 页”视觉统一，就同时修改：

- `src/components/blog/SinglePost.astro`
- `src/layouts/MarkdownLayout.astro`

否则会出现：

- 博客文章一种字体
- 普通 Markdown 页另一种字体

---

## 11. 最常见的几种调整方案

下面给你几个实际可用的方向。

### 方案 A：更像普通现代博客

目标：

- 标题清晰
- 正文字号适中
- 使用无衬线字体

建议：

- 正文：`prose-base`
- 正文容器：保留默认 `font-sans`
- 标题：`text-3xl md:text-4xl`

### 方案 B：更像学术笔记

目标：

- 更适合长时间阅读
- 正文更接近纸质阅读体验

建议：

- 正文容器加 `font-serif`
- 正文：`prose-lg`
- 标题使用 `font-heading` 或 `font-serif`
- 行距加宽一点，比如 `leading-8`

### 方案 C：更像论文注释风格

目标：

- 页面克制
- 正文略小
- 信息密度高

建议：

- 正文：`prose-base`
- 摘要：`text-base`
- 标题：`text-3xl md:text-4xl`
- 容器宽度可以略收一点

---

## 12. 我最推荐你的第一步修改

如果你现在只想做一次最有效的调整，我建议先试这两步：

### 第一步

在：

- `src/components/blog/SinglePost.astro`

把正文容器从：

```astro
prose prose-lg
```

改成：

```astro
prose prose-base font-serif leading-8
```

### 第二步

把摘要从：

```astro
text-lg leading-8
```

改成：

```astro
text-base leading-7
```

这样通常会让博客立刻更接近“学术笔记 / 理论博客”的阅读感。

---

## 13. 哪些修改最安全，哪些要谨慎

### 最安全的修改

- 改 `prose-lg` 为 `prose-base` / `prose-xl`
- 改标题 `text-4xl` 这类字号类名
- 改摘要字号和行距
- 在正文容器上加 `font-serif`

### 要谨慎的修改

- 直接重写 Tailwind Typography 默认样式
- 一次性同时改全局字体变量和所有页面组件
- 使用没有正确引入的外部字体

建议顺序始终是：

1. 先改 `SinglePost.astro`
2. 看效果
3. 再决定要不要同步改 `MarkdownLayout.astro`
4. 最后再考虑动 `CustomStyles.astro`

---

## 14. 一句话总结

如果你想调整 blog 文章的字体和字号，**最优先改的是 `src/components/blog/SinglePost.astro` 里的标题类名、摘要类名和正文容器的 `prose` 类；如果要改全局字体风格，再去改 `src/components/CustomStyles.astro`。**


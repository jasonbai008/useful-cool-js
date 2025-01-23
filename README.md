# useful-cool-js
a collection of cool js tools

## Dynamic Counter 数字动画插件

一个轻量级的数字递增/递减动画插件，支持千分符格式化，可自定义动画时间。

### 特性

- 支持正数和负数的动画效果
- 支持千分符格式化
- 可配置动画持续时间
- 平滑的动画效果（60fps）
- 无依赖，原生 JavaScript 实现

### 安装

直接在 HTML 中引入 `dynamic-counter.js` 文件：


### 使用方法

#### HTML 结构

在 HTML 中添加带有 `counter` 类名的元素，使用 `data-target` 属性设置目标数值，可选使用 `data-precision` 属性设置小数点精度：

<!-- 基础用法 -->
<span class="counter" data-target="876"></span>

<!-- 带货币符号和2位小数 -->
<div class="counter-item">
    <span class="currency">$</span>
    <span class="counter" data-target="876.50" data-precision="2"></span>
</div>

<!-- 百分比格式 -->
<div class="counter-item">
    <span class="counter" data-target="-64.82" data-precision="2"></span><span>%</span>
</div>

#### 初始化


### 配置选项

| 参数            | 类型    | 默认值 | 说明                   |
| --------------- | ------- | ------ | ---------------------- |
| duration        | Number  | 2      | 动画持续时间，单位：秒 |
| formatThousands | Boolean | true   | 是否启用千分符格式化   |
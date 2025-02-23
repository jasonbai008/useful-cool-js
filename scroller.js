/**
 * Scroller - 双向滚动走马灯插件
 *
 * Author: Jason Bai <byygkcg@163.com>
 * Github: https://github.com/jasonbai008/useful-cool-js
 *
 * 使用方法:
 *
 * 1. 引入此JS文件
 * // 普通引入
 * <script src="https://unpkg.com/useful-cool-js@latest/scroller.js"></script>
 *
 * // 模块化引入
 * import 'useful-cool-js/scroller.js'
 *
 * 2. 创建实例：
 *    const scroller = new Scroller({
 *      container: document.querySelector('.scroll-container'), // 容器元素
 *      speed: 1, // 可选，滚动速度，默认1
 *      direction: 'right' // 可选，初始滚动方向，默认right
 *    });
 *
 * 3. 控制方法：
 *    scroller.start() - 开始滚动
 *    scroller.stop() - 停止滚动
 *    scroller.setDirection('left'/'right') - 设置滚动方向
 */

class Scroller {
  constructor(options) {
    // 初始化配置
    this.container = options.container;
    this.speed = options.speed || 1;
    this.direction = options.direction || "right";

    // 初始化状态
    this.isScrolling = false;
    this.isPaused = false;
    this.animationFrameId = null;

    // 创建内部包装器
    this.wrapper = document.createElement("div");
    this.wrapper.style.cssText = `
      display: inline-flex;
      white-space: nowrap;
      position: relative;
      left: 0;
    `;

    // 克隆并包装内容
    this.initContent();

    // 绑定事件
    this.bindEvents();
  }

  // 初始化内容
  initContent() {
    // 保存原始内容
    const originalContent = Array.from(this.container.children);
    this.container.innerHTML = "";
    this.container.appendChild(this.wrapper);

    // 将原始内容移动到包装器中
    originalContent.forEach((child) => this.wrapper.appendChild(child));

    // 计算需要克隆的次数以填满容器
    const containerWidth = this.container.offsetWidth;
    const contentWidth = this.wrapper.offsetWidth;
    const cloneCount = Math.ceil(containerWidth / contentWidth) + 1;

    // 克隆内容填满容器
    for (let i = 0; i < cloneCount; i++) {
      originalContent.forEach((child) => {
        const clone = child.cloneNode(true);
        this.wrapper.appendChild(clone);
      });
    }

    // 设置容器样式
    this.container.style.overflow = "hidden";
  }

  // 绑定事件
  bindEvents() {
    // 绑定滚轮事件
    window.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) {
        // 向下滚动，向右移动
        this.setDirection("right");
      } else {
        // 向上滚动，向左移动
        this.setDirection("left");
      }
    });

    // 绑定鼠标悬停事件
    this.container.addEventListener("mouseenter", () => {
      this.isPaused = true;
    });

    this.container.addEventListener("mouseleave", () => {
      this.isPaused = false;
    });
  }

  // 开始滚动
  start() {
    if (this.isScrolling) return;
    this.isScrolling = true;
    this.scroll();
  }

  // 停止滚动
  stop() {
    this.isScrolling = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  // 设置滚动方向
  setDirection(direction) {
    if (direction !== "left" && direction !== "right") return;
    this.direction = direction;
  }

  // 滚动动画
  scroll() {
    if (!this.isScrolling) return;
    if (!this.isPaused) {
      const currentLeft = parseFloat(this.wrapper.style.left || 0);
      const contentWidth = this.wrapper.offsetWidth / 2; // 使用一半宽度作为重置点

      if (this.direction === "right") {
        this.wrapper.style.left = `${currentLeft - this.speed}px`;
        // 当滚动到一半内容时重置位置
        if (Math.abs(currentLeft) >= contentWidth) {
          this.wrapper.style.left = "0";
        }
      } else {
        this.wrapper.style.left = `${currentLeft + this.speed}px`;
        // 当滚动到起始位置时重置到一半位置
        if (currentLeft >= 0) {
          this.wrapper.style.left = `-${contentWidth}px`;
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.scroll());
  }
}

window.Scroller = Scroller;

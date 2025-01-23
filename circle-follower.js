/**
 * 鼠标跟随插件
 *
 * Author: Jason Bai & Claude-3.5-sonnet
 * Github: https://github.com/jasonbai008/circle-follower
 *
 * 使用示例：
 * 1. 引入插件：普通引入或模块儿化引入，二选一
 *
 * // 普通引入
 * <script src="https://unpkg.com/circle-follower@latest/index.js"></script>
 *
 * // 模块化引入
 * import Follower from 'circle-follower'
 *
 * 2. 实例化并配置
 * const follower = new Follower({
 *   size: 30,                             // 圆环默认大小
 *   bgColor: 'transparent',               // 背景色
 *   borderColor: '#00c569',               // 边框颜色
 *   borderWidth: 2,                       // 边框宽度
 *   backdropFilter: '',                   // 背景滤镜效果
 *   hoverSize: 60,                        // hover时圆环大小
 *   hoverBgColor: 'rgba(0, 255, 0, 0.3)', // hover时背景色
 *   hoverBackdropFilter: ''               // hover时的背景滤镜效果
 *   speed: 0.15,                          // 跟随速度(0-1之间)
 * })
 *
 * 3. 销毁实例
 * follower.destroy()
 */

class Follower {
  // 添加静态实例属性
  static instance = null;

  constructor(options = {}) {
    // 实现单例模式
    if (Follower.instance) {
      console.warn("Follower 实例已存在，请勿重复创建");
      return Follower.instance;
    }

    // 保存唯一实例
    Follower.instance = this;

    // 默认配置
    this.options = {
      size: 30,
      bgColor: 'transparent',
      borderColor: "#00c569",
      borderWidth: 2,
      hoverSize: 60,
      hoverBgColor: "rgba(0, 255, 0, 0.3)",
      speed: 0.15,
      backdropFilter: "",
      hoverBackdropFilter: "",
      ...options,
    };

    // 初始化状态
    this.mouseX = -100; // 初始时，确保圆环在屏幕外
    this.mouseY = -100; // 初始时，确保圆环在屏幕外
    this.cursorX = this.mouseX;
    this.cursorY = this.mouseY;
    this.isHover = false;
    this.animationFrameId = null;

    // 创建DOM元素
    this.createCursor();
    // 绑定事件
    this.bindEvents();
    // 启动动画
    this.startAnimation();
  }

  // 创建跟随光标的DOM元素
  createCursor() {
    this.cursor = document.createElement("div");
    this.cursor.className = "custom_cursor";
    // 添加基础样式
    Object.assign(this.cursor.style, {
      position: "fixed",
      pointerEvents: "none",
      zIndex: "9999",
      left: "0",
      top: "0",
      transform: "translate3d(0, 0, 0) translate(-50%, -50%)",
      willChange: "transform",
      transition: "width 0.15s ease-out, height 0.15s ease-out, background-color 0.15s ease-out, border 0.15s ease-out",
      borderRadius: "50%",
      backdropFilter: "blur(5px)",
    });
    this.updateCursorStyle();
    document.body.appendChild(this.cursor);
  }

  // 更新光标样式
  updateCursorStyle() {
    const size = this.isHover ? this.options.hoverSize : this.options.size;
    Object.assign(this.cursor.style, {
      width: `${size}px`,
      height: `${size}px`,
      border: this.isHover ? "none" : `${this.options.borderWidth}px solid ${this.options.borderColor}`,
      backgroundColor: this.isHover ? this.options.hoverBgColor : this.options.bgColor,
      backdropFilter: this.isHover ? this.options.hoverBackdropFilter : this.options.backdropFilter,
    });
  }

  // 绑定事件
  bindEvents() {
    // 使用箭头函数绑定this
    this.handleMouseMove = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      const targetElement = e.target;
      const cursorStyle = window.getComputedStyle(targetElement).cursor;
      this.isHover = cursorStyle === "pointer";
      this.updateCursorStyle();
    };

    this.handleMouseLeave = () => {
      this.cursor.style.opacity = "0";
    };

    this.handleMouseEnter = () => {
      this.cursor.style.opacity = "1";
    };

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseleave", this.handleMouseLeave);
    document.addEventListener("mouseenter", this.handleMouseEnter);
  }

  // 启动动画
  startAnimation() {
    const animate = () => {
      this.cursorX += (this.mouseX - this.cursorX) * this.options.speed;
      this.cursorY += (this.mouseY - this.cursorY) * this.options.speed;

      // 保持 -50% 偏移
      this.cursor.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) translate(-50%, -50%)`;

      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  // 销毁实例
  destroy() {
    // 移除事件监听
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseleave", this.handleMouseLeave);
    document.removeEventListener("mouseenter", this.handleMouseEnter);

    // 取消动画
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // 移除DOM元素
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
    }

    // 清除单例引用
    Follower.instance = null;
  }
}

// 绑定到全局
window.Follower = Follower;

// 如果是在模块化环境下使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = Follower;
}

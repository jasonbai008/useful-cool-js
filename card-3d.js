/**
 * Card3D - 一个轻量级的卡片3D悬浮效果插件
 *
 * Author: Jason Bai <byygkcg@163.com>
 * Github: https://github.com/jasonbai008/useful-cool-js
 *
 * 特性：
 * - 根据鼠标位置实现卡片3D倾斜效果
 * - 支持多个卡片同时使用
 * - 可自定义最大旋转角度
 * - 平滑的动画过渡效果
 *
 * 使用方法：
 *
 * 使用示例：
 * 1. 引入插件：普通引入或模块儿化引入，二选一
 *
 * // 普通引入
 * <script src="https://unpkg.com/useful-cool-js@latest/card-3d.js"></script>
 *
 * // 模块化引入
 * import 'useful-cool-js/card-3d.js'
 *
 * 1. HTML结构：
 *    <div class="card-3d">Card Content</div>
 *
 * 2. 初始化插件：
 *    new Card3D({
 *      rotation: 10  // 可选，最大旋转角度，默认10度
 *    });
 *
 * 配置选项：
 * @param {Object} options - 配置对象
 * @param {Number} options.rotation - 最大旋转角度，默认10度
 */
class Card3D {
  constructor(options = {}) {
    // 默认配置
    this.options = {
      rotation: 10, // 最大旋转角度
      ...options,
    };

    // 内部固定配置
    this.perspective = 1000; // 透视值
    this.selector = ".card-3d"; // 选择器

    this.init();
  }

  init() {
    // 获取所有卡片元素
    const cards = document.querySelectorAll(this.selector);

    cards.forEach((card) => {
      // 创建容器元素
      const container = document.createElement("div");
      container.style.perspective = `${this.perspective}px`;
      container.style.position = "relative";

      // 包装卡片
      card.parentNode.insertBefore(container, card);
      container.appendChild(card);

      // 设置卡片样式
      card.style.transition = "all 0.2s ease-out";
      card.style.transform = "rotateX(0deg) rotateY(0deg)";

      // 绑定事件
      this.bindEvents(card);
    });
  }

  bindEvents(card) {
    // 鼠标移动事件
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 计算旋转角度
      const x = ((mouseX - cardWidth / 2) / (cardWidth / 2)).toFixed(2);
      const y = (-(mouseY - cardHeight / 2) / (cardHeight / 2)).toFixed(2);

      // 应用变换
      card.style.transform = `rotateX(${y * this.options.rotation}deg) rotateY(${x * this.options.rotation}deg)`;
    });

    // 鼠标移出事件
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  }
}

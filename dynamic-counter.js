/**
 * DynamicCounter - 数字动画计数器插件
 * 一个轻量级的数字递增/递减动画插件，支持千分符格式化和小数点精度设置
 *
 * Author Jason Bai
 * Github: https://github.com/jasonbai008/useful-cool-js
 *
 * 使用方法:
 * 1. 原生JS使用:
 *    <script src="https://unpkg.com/useful-cool-js@latest/dynamic-counter.js"></script>
 *
 *    <!-- HTML结构 -->
 *    <span class="counter" data-target="876.50" data-precision="2"></span>
 *
 *    <!-- 初始化 -->
 *    new DynamicCounter({
 *        duration: 2,           // 可选，动画持续时间（秒），默认2秒
 *        formatThousands: true  // 可选，是否使用千分符，默认true
 *    });
 *
 * 2. Vue项目使用:
 *    // 方式一：通过 import 引入（推荐）
 *    import { DynamicCounter, DynamicCounterPlugin } from './dynamic-counter'
 *    
 *    // 安装插件
 *    Vue.use(DynamicCounterPlugin)
 *
 *    // 方式二：通过 CDN 引入
 *    <script src="https://unpkg.com/useful-cool-js@latest/dynamic-counter.js"></script>
 *    
 *    // 安装插件
 *    Vue.use(DynamicCounterPlugin)
 *
 *    // Vue 组件中使用
 *    export default {
 *        mounted() {
 *            // 初始化计数器（必需）
 *            window.counterInstance = new DynamicCounter({
 *                duration: 2,
 *                formatThousands: true
 *            });
 *        }
 *    }
 *
 *    <!-- 模板中使用 -->
 *    <span v-counter="number"></span>              <!-- 不带小数点 -->
 *    <span v-counter:2="price"></span>            <!-- 保留2位小数 -->
 *
 * 3. 属性说明:
 *    原生JS:
 *    - class="counter": 必需，标识这是一个计数器元素
 *    - data-target: 必需，目标数值，支持正数、负数和小数
 *    - data-precision: 可选，小数点精度，默认为0
 *
 *    Vue指令:
 *    - v-counter: 必需，绑定目标数值
 *    - v-counter:2: 可选，通过参数设置精度，如:2表示2位小数
 *
 * 4. 示例:
 *    原生JS:
 *    <!-- 基础用法 -->
 *    <span class="counter" data-target="876"></span>
 *
 *    <!-- 带货币符号和2位小数 -->
 *    <div class="counter-item">
 *        <span class="currency">$</span>
 *        <span class="counter" data-target="876.50" data-precision="2"></span>
 *    </div>
 *
 *    Vue组件:
 *    <!-- 基础用法 -->
 *    <template>
 *        <div>
 *            <span v-counter="number"></span>
 *            <span v-counter:2="price"></span>
 *            
 *            <!-- 带货币符号 -->
 *            <div class="counter-item">
 *                <span class="currency">$</span>
 *                <span v-counter:2="price"></span>
 *            </div>
 *        </div>
 *    </template>
 *
 *    <script>
 *    export default {
 *        data() {
 *            return {
 *                number: 34482,
 *                price: 876.50
 *            }
 *        },
 *        mounted() {
 *            window.counterInstance = new DynamicCounter({
 *                duration: 2,
 *                formatThousands: true
 *            });
 *        }
 *    }
 *    </script>
 *
 * 5. 特性:
 *    - 支持正数和负数
 *    - 支持小数点精度设置
 *    - 支持千分符格式化
 *    - 支持Vue动态数据更新
 *    - 平滑的动画效果(60fps)
 *    - 无依赖，原生JavaScript实现
 */

class DynamicCounter {
  constructor(options = {}) {
    // 默认配置参数
    this.defaults = {
      duration: 2, // 默认动画时间2秒
      formatThousands: true, // 默认开启千分符格式化
    };
    this.options = { ...this.defaults, ...options };
    this.init();
  }

  // 添加重新初始化方法
  reinit() {
    this.init();
  }

  init() {
    // 获取所有counter元素
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {
      // 设置初始值为0
      counter.innerText = "0";
      this.updateCounter(counter);
    });
  }

  // 格式化数字，添加千分符和小数点
  formatNumber(num, precision = 0) {
    // 处理小数点
    const fixedNum = Number(num).toFixed(precision);

    if (!this.options.formatThousands) {
      return fixedNum;
    }

    // 分割整数和小数部分
    const [intPart, decimalPart] = fixedNum.split(".");

    // 添加千分符到整数部分
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 如果有小数部分，则组合返回
    return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
  }

  updateCounter(counter) {
    // 获取目标值
    const target = parseFloat(counter.getAttribute("data-target"));
    // 获取精度
    const precision = parseInt(counter.getAttribute("data-precision") || "0");
    // 当前值
    const current = parseFloat(counter.innerText.replace(/,/g, ""));

    // 计算每次增加的值，考虑精度
    const increment =
      Math.ceil(
        (Math.abs(target) / (this.options.duration * 60)) *
          Math.pow(10, precision)
      ) / Math.pow(10, precision);

    let newValue = current;

    if (target > current) {
      // 正数递增
      newValue = Math.min(current + increment, target);
    } else if (target < current) {
      // 负数递减
      newValue = Math.max(current - increment, target);
    }

    // 更新显示值，应用精度格式化
    counter.innerText = this.formatNumber(newValue, precision);

    // 如果还没到达目标值，继续更新
    if (Math.abs(newValue - target) > Math.pow(10, -precision) / 2) {
      // 约60fps的更新频率
      requestAnimationFrame(() => this.updateCounter(counter));
    }
  }
}

// 创建 Vue 插件对象
const DynamicCounterPlugin = {
    install(Vue, options = {}) {
        // 注册全局指令
        Vue.directive("counter", {
            bind(el, binding) {
                el.classList.add("counter");
                el.setAttribute("data-target", binding.value);
                if (binding.arg) {
                    el.setAttribute("data-precision", binding.arg);
                }
            },
            update(el, binding) {
                el.setAttribute("data-target", binding.value);
                if (window.counterInstance) {
                    window.counterInstance.reinit();
                }
            },
            unbind(el) {
                el.classList.remove("counter");
            },
        });
    }
};

// 导出方式修改
if (typeof module !== "undefined" && module.exports) {
    // CommonJS 模块导出
    module.exports = {
        DynamicCounter,
        DynamicCounterPlugin
    };
} else {
    // 浏览器环境
    window.DynamicCounter = DynamicCounter;
    window.DynamicCounterPlugin = DynamicCounterPlugin;
}

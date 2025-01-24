/**
 * DynamicCounterVue - Vue2数字动画计数器指令插件
 * 一个轻量级的数字递增/递减动画Vue指令
 *
 * 使用方法:
 * 
 * 1. 引入并注册插件:    
 *
 *    import DynamicCounterVue from 'useful-cool-js/dynamic-counter-vue'
 * 
 *    Vue.use(DynamicCounterVue, {
 *        duration: 2,           // 可选，动画持续时间（秒），默认2秒
 *        formatThousands: true  // 可选，是否使用千分符，默认true
 *    })
 *
 * 2. 在组件中使用:
 *    <span v-counter="number"></span>              // 不带小数点
 *    <span v-counter:2="price"></span>            // 保留2位小数
 */

// 格式化数字，添加千分符和小数点
function formatNumber(num, precision = 0, useThousands = true) {
  // 处理小数点
  const fixedNum = Number(num).toFixed(precision);

  if (!useThousands) {
    return fixedNum;
  }

  // 分割整数和小数部分
  const [intPart, decimalPart] = fixedNum.split(".");

  // 添加千分符到整数部分
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 如果有小数部分，则组合返回
  return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
}

// 更新计数器
function updateCounter(el, target, options = {}) {
  const { duration = 2, formatThousands = true, precision = 0 } = options;

  // 获取当前值
  const current = parseFloat(el.innerText.replace(/,/g, "")) || 0;

  // 计算每次增加的值
  const increment =
    Math.ceil((Math.abs(target) / (duration * 60)) * Math.pow(10, precision)) /
    Math.pow(10, precision);

  let newValue = current;

  if (target > current) {
    // 正数递增
    newValue = Math.min(current + increment, target);
  } else if (target < current) {
    // 负数递减
    newValue = Math.max(current - increment, target);
  }

  // 更新显示值
  el.innerText = formatNumber(newValue, precision, formatThousands);

  // 如果还没到达目标值，继续更新
  if (Math.abs(newValue - target) > Math.pow(10, -precision) / 2) {
    requestAnimationFrame(() => updateCounter(el, target, options));
  }
}

const DynamicCounterVue = {
  install(Vue, globalOptions = {}) {
    // 注册全局指令
    Vue.directive("counter", {
      bind(el, binding) {
        // 获取精度
        const precision = parseInt(binding.arg) || 0;
        // 获取目标值
        const target = parseFloat(binding.value);

        // 设置初始值为0
        el.innerText = "0";

        // 开始计数动画
        updateCounter(el, target, {
          ...globalOptions,
          precision,
        });
      },

      update(el, binding) {
        // 值发生变化时更新
        if (binding.value !== binding.oldValue) {
          const precision = parseInt(binding.arg) || 0;
          const target = parseFloat(binding.value);

          updateCounter(el, target, {
            ...globalOptions,
            precision,
          });
        }
      },
    });
  },
};

// 暴露到全局
window.DynamicCounterVue = DynamicCounterVue;

if (typeof module !== "undefined" && module.exports) {
  // CommonJS 环境
  module.exports = DynamicCounterVue;
}

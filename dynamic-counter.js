/**
 * DynamicCounter - 数字动画计数器插件
 * 一个轻量级的数字递增/递减动画插件，支持千分符格式化和小数点精度设置
 * 
 * Author Jason Bai
 * Github: https://github.com/jasonbai008/useful-cool-js
 * 
 * 使用方法: 
 * <script src="https://unpkg.com/useful-cool-js@latest/dynamic-counter.js"></script>
 * 
 * 1. HTML结构:
 *    <span class="counter" data-target="876.50" data-precision="2"></span>
 * 
 * 2. 属性说明:
 *    - class="counter": 必需，标识这是一个计数器元素
 *    - data-target: 必需，目标数值，支持正数、负数和小数
 *    - data-precision: 可选，小数点精度，默认为0
 * 
 * 3. 初始化:
 *    new DynamicCounter({
 *        duration: 2,           // 可选，动画持续时间（秒），默认2秒
 *        formatThousands: true  // 可选，是否使用千分符，默认true
 *    });
 * 
 * 4. 示例:
 *    <!-- 基础用法 -->
 *    <span class="counter" data-target="876"></span>
 * 
 *    <!-- 带货币符号和2位小数 -->
 *    <div class="counter-item">
 *        <span class="currency">$</span>
 *        <span class="counter" data-target="876.50" data-precision="2"></span>
 *    </div>
 * 
 *    <!-- 百分比格式 -->
 *    <div class="counter-item">
 *        <span class="counter" data-target="-64.82" data-precision="2"></span><span>%</span>
 *    </div>
 * 
 * 5. 特性:
 *    - 支持正数和负数
 *    - 支持小数点精度设置
 *    - 支持千分符格式化
 *    - 平滑的动画效果(60fps)
 *    - 无依赖，原生JavaScript实现
 */

class DynamicCounter {
    constructor(options = {}) {
        // 默认配置参数
        this.defaults = {
            duration: 2, // 默认动画时间2秒
            formatThousands: true // 默认开启千分符格式化
        };
        this.options = { ...this.defaults, ...options };
        this.init();
    }

    init() {
        // 获取所有counter元素
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            // 设置初始值为0
            counter.innerText = '0';
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
        const [intPart, decimalPart] = fixedNum.split('.');
        
        // 添加千分符到整数部分
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // 如果有小数部分，则组合返回
        return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
    }

    updateCounter(counter) {
        // 获取目标值
        const target = parseFloat(counter.getAttribute('data-target'));
        // 获取精度
        const precision = parseInt(counter.getAttribute('data-precision') || '0');
        // 当前值
        const current = parseFloat(counter.innerText.replace(/,/g, ''));
        
        // 计算每次增加的值，考虑精度
        const increment = Math.ceil(Math.abs(target) / (this.options.duration * 60) * Math.pow(10, precision)) / Math.pow(10, precision);
        
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

// 导出插件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicCounter;
} else {
    window.DynamicCounter = DynamicCounter;
}

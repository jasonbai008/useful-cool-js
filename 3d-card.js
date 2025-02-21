class Card3D {
    constructor(options = {}) {
        // 默认配置
        this.options = {
            rotation: 10,         // 最大旋转角度
            ...options
        };
        
        // 内部固定配置
        this.perspective = 1000;  // 透视值
        this.selector = '.d3-card'; // 选择器
        
        this.init();
    }

    init() {
        // 获取所有卡片元素
        const cards = document.querySelectorAll(this.selector);
        
        cards.forEach(card => {
            // 创建容器元素
            const container = document.createElement('div');
            container.style.perspective = `${this.perspective}px`;
            container.style.position = 'relative';
            
            // 包装卡片
            card.parentNode.insertBefore(container, card);
            container.appendChild(card);
            
            // 设置卡片样式
            card.style.transition = 'all 0.2s ease-out';
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            
            // 绑定事件
            this.bindEvents(card);
        });
    }

    bindEvents(card) {
        // 鼠标移动事件
        card.addEventListener('mousemove', (e) => {
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
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    }
}

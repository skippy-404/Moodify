document.addEventListener('DOMContentLoaded', function () {
  // 初始化Vue应用
  initVueApp();
});

function initVueApp() {
  new Vue({
    el: '#app',
    data: {
      happiness: 50,
      anger: 50,
      anticipation: 50,
      disgust: 50,
      currentColor: { r: 255, g: 255, b: 255 },
      colorUpdateTimeout: null,
      emotionColors: {
        '快乐': '#f1c40f',
        '悲伤': '#3498db',
        '生气': '#e74c3c',
        '恐惧': '#2ecc71',
        '期待': '#e67e22',
        '惊讶': '#1abc9c',
        '厌恶': '#9b59b6',
        '担忧': '#e84393'
      },
      uploadedPhoto: null,
      generatedPhoto: null,
      lastColor: { r: 255, g: 255, b: 255 }
    },
    computed: {
      currentColorHex() {
        return this.rgbToHex(this.currentColor);
      },
      emotionPercentages() {
        return {
          '快乐': Math.round((this.happiness / 100) * 100),
          '悲伤': Math.round(((100 - this.happiness) / 100) * 100),
          '生气': Math.round((this.anger / 100) * 100),
          '恐惧': Math.round(((100 - this.anger) / 100) * 100),
          '期待': Math.round((this.anticipation / 100) * 100),
          '惊讶': Math.round(((100 - this.anticipation) / 100) * 100),
          '厌恶': Math.round((this.disgust / 100) * 100),
          '担忧': Math.round(((100 - this.disgust) / 100) * 100)
        };
      }
    },
    mounted() {
      document.body.classList.add('color-transition');
      this.updateBackground();
    },
    methods: {
      calculateMixedColor() {
        // 定义基础颜色
        const colors = {
          happiness: { r: 241, g: 196, b: 15 },    // 快乐(黄色)
          sadness: { r: 52, g: 152, b: 219 },      // 悲伤(蓝色)
          anger: { r: 231, g: 76, b: 60 },         // 生气(红色)
          fear: { r: 46, g: 204, b: 113 },         // 恐惧(绿色)
          anticipation: { r: 230, g: 126, b: 34 }, // 期待(橙色)
          surprise: { r: 26, g: 188, b: 156 },     // 惊讶(青绿色)
          disgust: { r: 155, g: 89, b: 182 },      // 厌恶(紫色)
          worry: { r: 232, g: 67, b: 147 }         // 担忧(粉红色)
        };

        // 计算每个情绪的强度 (0-1范围)
        const intensities = {
          happiness: Math.abs(this.happiness - 50) / 50,
          sadness: Math.abs(50 - this.happiness) / 50,
          anger: Math.abs(this.anger - 50) / 50,
          fear: Math.abs(50 - this.anger) / 50,
          anticipation: Math.abs(this.anticipation - 50) / 50,
          surprise: Math.abs(50 - this.anticipation) / 50,
          disgust: Math.abs(this.disgust - 50) / 50,
          worry: Math.abs(50 - this.disgust) / 50
        };

        // 计算方向 (向正色还是反色)
        const directions = {
          happiness: this.happiness > 50 ? 1 : -1,
          sadness: this.happiness < 50 ? 1 : -1,
          anger: this.anger > 50 ? 1 : -1,
          fear: this.anger < 50 ? 1 : -1,
          anticipation: this.anticipation > 50 ? 1 : -1,
          surprise: this.anticipation < 50 ? 1 : -1,
          disgust: this.disgust > 50 ? 1 : -1,
          worry: this.disgust < 50 ? 1 : -1
        };

        // 初始颜色为白色
        let r = 255, g = 255, b = 255;

        // 混合颜色
        Object.keys(colors).forEach(color => {
          const intensity = intensities[color] * directions[color];
          if (intensity > 0) {
            // 从白色向目标颜色过渡
            r += (colors[color].r - 255) * intensity;
            g += (colors[color].g - 255) * intensity;
            b += (colors[color].b - 255) * intensity;
          }
        });

        // 限制颜色范围
        return {
          r: Math.max(0, Math.min(255, Math.round(r))),
          g: Math.max(0, Math.min(255, Math.round(g))),
          b: Math.max(0, Math.min(255, Math.round(b)))
        };
      },

      updateBackground() {
        if (this.colorUpdateTimeout) {
          cancelAnimationFrame(this.colorUpdateTimeout);
        }

        this.colorUpdateTimeout = requestAnimationFrame(() => {
          const newColor = this.calculateMixedColor();
          this.currentColor = newColor;

          // 创建渐变背景 - 修改透明度值为0.7使颜色更深
          const angle = (Date.now() / 100) % 360;
          const lightColor = this.adjustColor(newColor, 15);
          const darkColor = this.adjustColor(newColor, -15);

          const gradientString = `linear-gradient(${angle}deg, 
                          rgba(${lightColor.r}, ${lightColor.g}, ${lightColor.b}, 0.7), 
                          rgba(${darkColor.r}, ${darkColor.g}, ${darkColor.b}, 0.7))`;

          document.body.style.background = gradientString;
        });
      },

      adjustColor(color, amount) {
        return {
          r: Math.max(0, Math.min(255, color.r + amount)),
          g: Math.max(0, Math.min(255, color.g + amount)),
          b: Math.max(0, Math.min(255, color.b + amount))
        };
      },

      generateColorCode() {
        const code = `情绪状态:
快乐/悲伤: ${this.happiness}
生气/恐惧: ${this.anger}
期待/惊讶: ${this.anticipation}
厌恶/担忧: ${this.disgust}

背景色值:
RGB: ${this.currentColor.r}, ${this.currentColor.g}, ${this.currentColor.b}
HEX: ${this.currentColorHex}

情绪占比:
${Object.entries(this.emotionPercentages).map(([name, value]) => `${name}: ${value}%`).join(' | ')}`;
        alert(code);
      },

      copyColor() {
        navigator.clipboard.writeText(this.currentColorHex)
          .then(() => alert(`已复制颜色值: ${this.currentColorHex}`))
          .catch(() => alert('复制失败，请手动复制'));
      },

      rgbToHex(color) {
        return '#' + [color.r, color.g, color.b]
          .map(c => c.toString(16).padStart(2, '0'))
          .join('');
      },

      handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedPhoto = e.target.result;
            this.generatedPhoto = null; // 清除之前生成的照片
          };
          reader.readAsDataURL(file);
        }
      },

      async generateNewPhoto() {
        if (!this.uploadedPhoto) return;

        try {
          const loading = this.showLoading("正在生成情绪照片...");

          // 模拟API响应延迟
          await new Promise(resolve => setTimeout(resolve, 2000));

          // 应用滤镜生成新照片
          this.generatedPhoto = this.applyFilterToPhoto(this.uploadedPhoto);

          loading.close();
        } catch (error) {
          console.error("生成照片失败:", error);
          alert("生成照片失败，请重试");
        }
      },

      applyFilterToPhoto(photoData) {
        // 创建一个canvas来应用滤镜
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = photoData;

        // 等待图片加载完成
        return new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // 应用基于当前情绪颜色的滤镜
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 简单的颜色叠加效果
            for (let i = 0; i < data.length; i += 4) {
              // 混合原始像素和情绪颜色
              data[i] = data[i] * 0.7 + this.currentColor.r * 0.3;     // R
              data[i + 1] = data[i + 1] * 0.7 + this.currentColor.g * 0.3; // G
              data[i + 2] = data[i + 2] * 0.7 + this.currentColor.b * 0.3; // B
            }

            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg'));
          };
        });
      },

      showLoading(message) {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
          <div class="loading-spinner"></div>
          <div class="loading-text">${message}</div>
        `;
        document.body.appendChild(loading);

        return {
          close: () => {
            document.body.removeChild(loading);
          }
        };
      },

      removePhoto() {
        this.uploadedPhoto = null;
        this.generatedPhoto = null;
      },

      removeGeneratedPhoto() {
        this.generatedPhoto = null;
      },

      downloadPhoto() {
        if (!this.generatedPhoto) return;

        const link = document.createElement('a');
        link.href = this.generatedPhoto;
        link.download = `emotion-photo-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  });
}
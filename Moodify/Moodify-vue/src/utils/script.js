const background = document.querySelector(".background")
const emoText = document.querySelector(".background span")
const h1 = document.querySelector("h1")
const previewSection = document.querySelector(".preview-section")

// 检查图片加载状态
function preloadBackgroundImage(url, callback) {
    const img = new Image();
    img.src = url;
    img.onload = callback;
    img.onerror = callback; // 即使加载失败也继续
}

// 页面加载动画
window.addEventListener('load', () => {
    // 获取背景图片URL
    const bgUrl = window.getComputedStyle(background).backgroundImage.replace(/url\(['"]?([^'"]*)['"]?\)/g, '$1');
    
    // 预加载背景图片
    preloadBackgroundImage(bgUrl, () => {
        // 添加淡入动画类
        document.body.classList.add('loaded');
        
        // 添加过渡效果
        background.style.transition = "background-position 0.5s ease-out";
        
        // 文字淡入效果
        if (emoText) {
            emoText.style.opacity = "0";
            emoText.style.transform = "translateY(20px)";
            emoText.style.transition = "opacity 1.5s ease, transform 1.5s ease";
            
            setTimeout(() => {
                emoText.style.opacity = "1";
                emoText.style.transform = "translateY(0)";
            }, 300);
        }
        
        // 标题淡入效果
        if (h1) {
            h1.style.opacity = "0";
            h1.style.transform = "translateY(-20px)";
            h1.style.transition = "opacity 1.5s ease, transform 1.5s ease";
            
            setTimeout(() => {
                h1.style.opacity = "1";
                h1.style.transform = "translateY(0)";
            }, 600);
        }
        
        // 确保预览区域初始显示
        if (previewSection) {
            previewSection.style.opacity = "0";
            previewSection.style.transition = "opacity 1s ease";
            
            setTimeout(() => {
                previewSection.style.opacity = "1";
                
                // 初始化预览板块功能
                initPreview();
            }, 1000);
        }
        
        // 启动滚动动画
        startScrollAnimation();
        
        // 加载轮播图
        loadCarouselImages();
    });
});

// 优化的滚动效果
let lastScrollY = 0;
let animationFrame;

// 开始滚动动画
function startScrollAnimation() {
    // 使用requestAnimationFrame来优化滚动性能
    function updateBackgroundPosition() {
        const scrollY = window.scrollY;
        
        // 仅在滚动位置变化时更新
        if (scrollY !== lastScrollY) {
            lastScrollY = scrollY;
            
            // 应用平滑的背景位置变化
            if (scrollY !== 0) {
                const offsetX = scrollY * 0.3;
                const offsetY = scrollY * 0.2;
                background.style.backgroundPosition = `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`;
                
                // 添加文字缩放和淡出效果
                const scale = 1 - Math.min(scrollY / 1000, 0.2);
                const opacity = 1 - Math.min(scrollY / 500, 0.9);
                
                if (emoText) {
                    emoText.style.transform = `scale(${scale})`;
                    emoText.style.opacity = opacity;
                }
                
                // 标题淡出效果
                if (h1) {
                    h1.style.opacity = Math.max(0, 1 - scrollY / 300);
                }
            } else {
                background.style.backgroundPosition = '50% 50%';
                if (emoText) {
                    emoText.style.transform = 'scale(1)';
                    emoText.style.opacity = 1;
                }
                if (h1) {
                    h1.style.opacity = 1;
                }
            }
        }
        
        // 继续下一帧的动画
        animationFrame = requestAnimationFrame(updateBackgroundPosition);
    }

    // 开始动画循环
    animationFrame = requestAnimationFrame(updateBackgroundPosition);
}

// 监听滚动事件，但不直接在事件中执行动画（避免性能问题）
document.addEventListener('scroll', () => {
    // 滚动事件只用于触发，实际动画在requestAnimationFrame中处理
});

// 清理动画帧，避免内存泄漏
window.addEventListener('beforeunload', () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
});

// 轮播图加载函数
function loadCarouselImages() {
    try {
        // 示例图片URL数组 - 使用确认可访问的图片
        const demoImages = [
            'https://pic3.zhimg.com/80/v2-c89106fddfeac8c3be5612e7c73df1d5_720w.webp',
            'https://pic1.zhimg.com/80/v2-8d9e85eadf583e30ef2df2139a22af6d_720w.webp',
            'https://pic1.zhimg.com/80/v2-99c76879eb358fb382325b9f5156acc0_720w.webp'
        ];
        
        // 加载轮播图片
        const items = document.querySelectorAll('.item');
        items.forEach((item, index) => {
            // 确保每个item都有背景图片
            const imageUrl = demoImages[index] || demoImages[0];
            
            // 直接设置背景图片
            item.style.backgroundImage = `url(${imageUrl})`;
            
            // 延迟一下再添加loaded类，让加载动画有效果
            setTimeout(() => {
                item.classList.add('loaded');
            }, 500 + index * 200);
        });
        
        // 尝试从API获取图片（如果可用）
        fetchImagesFromAPI();
        
    } catch (error) {
        console.error('轮播图加载失败:', error);
    }
}

// 从API获取图片（模拟lunbo.html中的功能）
async function fetchImagesFromAPI() {
    try {
        // 尝试从API获取数据
        const response = await fetch('http://localhost:8080/homePage').catch(() => {
            console.log('API不可用，使用默认图片');
            return null;
        });
        
        // 如果API不可用，直接返回
        if (!response || !response.ok) return;
        
        const result = await response.json();
        console.log('从API获取的原始数据:', result);
        
        // 定义一个函数来提取图片URL，处理多种可能的数据结构
        function extractImageUrls(data) {
            const urls = [];
            
            // 如果是数组形式
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (item && typeof item === 'object' && item.url) {
                        urls.push(item.url);
                    } else if (typeof item === 'string') {
                        urls.push(item);
                    }
                });
            } 
            // 如果是对象形式，遍历其所有属性
            else if (data && typeof data === 'object') {
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    if (item && typeof item === 'object' && item.url) {
                        urls.push(item.url);
                    } else if (typeof item === 'string') {
                        urls.push(item);
                    }
                });
            }
            
            return urls;
        }
        
        // 从不同层级尝试提取URL
        let imageUrls = [];
        
        // 尝试从result.data中提取
        if (result.data) {
            imageUrls = extractImageUrls(result.data);
        } 
        // 尝试从result.images中提取
        else if (result.images) {
            imageUrls = extractImageUrls(result.images);
        }
        // 尝试从result本身提取
        else {
            imageUrls = extractImageUrls(result);
        }
        
        console.log('提取的图片URL:', imageUrls);
        
        // 确保至少有三个URL
        while (imageUrls.length < 3 && imageUrls.length > 0) {
            imageUrls.push(imageUrls[0]); // 重复使用第一个URL
        }
        
        // 如果没有提取到任何URL，使用默认图片
        if (imageUrls.length === 0) {
            imageUrls = [
                'https://pic3.zhimg.com/80/v2-c89106fddfeac8c3be5612e7c73df1d5_720w.webp',
                'https://pic1.zhimg.com/80/v2-8d9e85eadf583e30ef2df2139a22af6d_720w.webp',
                'https://pic1.zhimg.com/80/v2-99c76879eb358fb382325b9f5156acc0_720w.webp'
            ];
        }
        
        // 更新轮播图片
        document.querySelectorAll('.item').forEach((item, index) => {
            if (index < imageUrls.length) {
                const imageUrl = imageUrls[index];
                
                // 创建一个图片对象来预加载和检查URL有效性
                const imgLoader = new Image();
                
                imgLoader.onload = () => {
                    // URL有效，设置背景
                    item.style.backgroundImage = `url(${imageUrl})`;
                    item.classList.add('loaded');
                };
                
                imgLoader.onerror = () => {
                    // URL无效，使用默认图片
                    console.error(`图片加载失败: ${imageUrl}`);
                    
                    // 获取默认图片
                    const defaultImage = 'https://pic3.zhimg.com/80/v2-c89106fddfeac8c3be5612e7c73df1d5_720w.webp';
                    item.style.backgroundImage = `url(${defaultImage})`;
                    item.classList.add('loaded');
                };
                
                // 开始加载图片
                imgLoader.src = imageUrl;
            }
        });
    } catch (error) {
        console.error('API数据加载失败:', error);
    }
}

// 预览板块功能
function initPreview() {
    // 预览图片数据
    const previewImages = [
        {
            src: 'https://haowallpaper.com/link/common/file/getCroppingImg/15268984382131520',
            title: '夏日宁静',
            desc: '基于"平静"情绪生成'
        },
        {
            src: 'https://haowallpaper.com/link/common/file/getCroppingImg/15268984382131520',
            title: '温暖回忆',
            desc: '基于"怀念"情绪生成'
        },
        {
            src: 'https://haowallpaper.com/link/common/file/getCroppingImg/15268984382131520',
            title: '激情活力',
            desc: '基于"兴奋"情绪生成'
        }
    ];
    
    let currentIndex = 0;
    const imageCard = document.querySelector('.image-card img');
    const overlayTitle = document.querySelector('.overlay-title');
    const overlayDesc = document.querySelector('.overlay-desc');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');
    
    // 函数：更新预览图片
    function updatePreview(index) {
        // 如果元素不存在，则返回
        if (!imageCard || !overlayTitle || !overlayDesc) return;
        
        // 设置淡出效果
        imageCard.style.opacity = '0';
        overlayTitle.style.opacity = '0';
        overlayDesc.style.opacity = '0';
        
        // 500ms后更新内容
        setTimeout(() => {
            // 更新图片和文字
            const item = previewImages[index];
            imageCard.src = item.src;
            overlayTitle.textContent = item.title;
            overlayDesc.textContent = item.desc;
            
            // 更新指示器
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // 设置淡入效果
            imageCard.style.opacity = '1';
            overlayTitle.style.opacity = '1';
            overlayDesc.style.opacity = '1';
        }, 300);
    }
    
    // 添加过渡效果
    if (imageCard) {
        imageCard.style.transition = 'opacity 0.3s ease';
    }
    if (overlayTitle) {
        overlayTitle.style.transition = 'opacity 0.3s ease';
    }
    if (overlayDesc) {
        overlayDesc.style.transition = 'opacity 0.3s ease';
    }
    
    // 上一张按钮点击事件
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + previewImages.length) % previewImages.length;
            updatePreview(currentIndex);
        });
    }
    
    // 下一张按钮点击事件
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % previewImages.length;
            updatePreview(currentIndex);
        });
    }
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updatePreview(currentIndex);
        });
    });
    
    // 自动切换图片
    let autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % previewImages.length;
        updatePreview(currentIndex);
    }, 5000);
    
    // 鼠标悬停时暂停自动切换
    const imagePreview = document.querySelector('.image-preview');
    if (imagePreview) {
        imagePreview.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        imagePreview.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % previewImages.length;
                updatePreview(currentIndex);
            }, 5000);
        });
    }
    
    // 处理按钮动画效果
    const previewBtns = document.querySelectorAll('.preview-btn');
    previewBtns.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'translateY(0)';
        });
        
        btn.addEventListener('click', () => {
            // 添加点击动画
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });
    
    // 功能项动画
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-3px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });
} 
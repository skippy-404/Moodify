// 这是一个临时脚本，用于添加图生图按钮事件监听
console.log('app-pictopic.js 开始加载'); // 脚本加载调试信息

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM已完全加载，开始设置图生图功能'); // DOM加载调试信息
  
  // 添加图生图按钮事件
  const pictopicBtn = document.getElementById('pictopic');
  console.log('图生图按钮元素:', pictopicBtn); // 调试信息
  
  if (pictopicBtn) {
    pictopicBtn.addEventListener('click', function(event) {
      console.log('图生图按钮被点击'); // 调试信息
      
      // 阻止默认行为和事件冒泡
      event.preventDefault();
      event.stopPropagation();
      
      // 获取文字描述
      const textPromptElement = document.querySelector('.text-prompt-input');
      console.log('文本输入元素:', textPromptElement); // 调试信息
      
      const textPrompt = textPromptElement ? textPromptElement.value.trim() : '';
      console.log('文本描述:', textPrompt); // 调试信息
      
      if (!textPrompt) {
        alert("请输入文字描述！");
        return;
      }
      
      // 显示加载动画 - 使用window上的showLoading函数，如果存在的话
      try {
        if (window.showLoading) {
          console.log('使用window.showLoading()');
          window.showLoading();
        } else {
          console.log('使用document.getElementById("loadingOverlay").classList.add("active")');
          const loadingOverlay = document.getElementById('loadingOverlay');
          if (loadingOverlay) {
            loadingOverlay.classList.add('active');
          } else {
            console.error('无法找到loadingOverlay元素');
          }
        }
      } catch (err) {
        console.error('显示加载动画时出错:', err);
      }
      
      console.log('显示加载动画'); // 调试信息
      
      // 获取当前预览图像的URL
      const previewImage = document.querySelector('.preview-image');
      console.log('预览图像元素:', previewImage); // 调试信息
      
      let imageUrl = previewImage ? previewImage.src : null;
      console.log('图像URL:', imageUrl); // 调试信息
      
      // 调用图生图功能
      generatePicToPic(textPrompt, imageUrl);
    });
    console.log('已为图生图按钮添加点击事件'); // 调试信息
  } else {
    console.error('未找到图生图按钮元素!'); // 调试信息
  }
});

// 图生图功能
async function generatePicToPic(textPrompt, referenceImageUrl) {
  console.log('generatePicToPic函数被调用'); // 调试信息
  try {
    console.log("图生图功能启动，文字描述:", textPrompt);
    console.log("参考图片URL:", referenceImageUrl);
    
    // 构建提示词
    const generatePrompt = `基于以下描述和参考图像，生成一副新的图像：
    
文字描述: ${textPrompt}

请保持参考图像的整体风格和色调，但根据文字描述调整内容。`;
    
    // 调用OpenAI API
    const response = await fetch('https://api.openai-hub.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-6eTQmEK4vXfvE82bJd9HSeJezPnrg0tBT7zo9a5A7RQs6wEh',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-image-vip',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: generatePrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: referenceImageUrl
                }
              }
            ]
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API响应错误:', errorText);
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    // 解析响应
    const data = await response.json();
    console.log('API响应:', data);
    
    // 从响应中提取图像URL
    const content = data.choices[0].message.content;
    console.log('返回内容:', content);
    
    // 解析图像URL - 匹配Markdown图片格式或直接URL
    let newImageUrl = null;
    const markdownMatch = content.match(/\!\[(.*?)\]\((https:\/\/.*?\.(?:png|jpg|jpeg|gif))\)/i);
    if (markdownMatch && markdownMatch[2]) {
      newImageUrl = markdownMatch[2];
    } else {
      // 尝试匹配直接URL
      const urlMatch = content.match(/(https:\/\/.*?\.(?:png|jpg|jpeg|gif))/i);
      if (urlMatch && urlMatch[1]) {
        newImageUrl = urlMatch[1];
      }
    }
    
    if (newImageUrl) {
      console.log('提取到的新图像URL:', newImageUrl);
      
      // 更新预览图像 - 使用window上的updatePreviewImage函数，如果存在的话
      try {
        if (typeof window.updatePreviewImage === 'function') {
          console.log('使用window.updatePreviewImage()');
          window.updatePreviewImage(newImageUrl, textPrompt);
        } else {
          console.log('自定义更新预览图像');
          const previewImage = document.querySelector('.preview-image');
          if (previewImage) {
            previewImage.src = newImageUrl;
            
            // 更新图像说明
            const caption = document.querySelector('.preview-image-caption');
            if (caption) {
              caption.textContent = textPrompt;
            }
            
            // 更新Vue应用数据（如果存在）
            if (window.app) {
              window.app.generatedPhoto = newImageUrl;
              window.app.currentMoodText = textPrompt;
            }
          }
        }
      } catch (err) {
        console.error('更新预览图像时出错:', err);
      }
      
      // 显示成功消息 - 使用window上的showNotification函数，如果存在的话
      try {
        if (typeof window.showNotification === 'function') {
          console.log('使用window.showNotification()');
          window.showNotification('图生图完成');
        } else {
          console.log('自定义显示通知');
          // 自定义创建通知
          const notification = document.createElement('div');
          notification.textContent = '图生图完成';
          notification.style.position = 'fixed';
          notification.style.bottom = '20px';
          notification.style.left = '50%';
          notification.style.transform = 'translateX(-50%)';
          notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          notification.style.color = 'white';
          notification.style.padding = '10px 20px';
          notification.style.borderRadius = '20px';
          notification.style.zIndex = '10000';
          document.body.appendChild(notification);
          
          setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => document.body.removeChild(notification), 500);
          }, 2000);
        }
      } catch (err) {
        console.error('显示通知时出错:', err);
      }
    } else {
      console.error('无法从响应中提取图像URL');
      alert('无法生成图像，请稍后再试');
    }
  } catch (error) {
    console.error('图生图功能出错:', error);
    alert('生成图像失败: ' + error.message);
  } finally {
    // 隐藏加载动画 - 使用window上的hideLoading函数，如果存在的话
    try {
      if (window.hideLoading) {
        console.log('使用window.hideLoading()');
        window.hideLoading();
      } else {
        console.log('使用document.getElementById("loadingOverlay").classList.remove("active")');
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
          loadingOverlay.classList.remove('active');
        } else {
          console.error('无法找到loadingOverlay元素');
        }
      }
    } catch (err) {
      console.error('隐藏加载动画时出错:', err);
    }
  }
}

// 将图生图功能暴露给全局，以便调用
window.generatePicToPic = generatePicToPic;

console.log('app-pictopic.js 已加载完成'); // 脚本加载完成调试信息 
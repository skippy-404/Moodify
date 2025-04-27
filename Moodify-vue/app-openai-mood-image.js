// OpenAI情绪图像生成功能
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM加载完成，开始添加OpenAI情绪图像生成功能");
  
  // 创建并添加按钮
  addMoodImageButton();
  
  // 在页面加载后的一段时间再次尝试添加，确保DOM完全加载
  setTimeout(addMoodImageButton, 1000);
  
  // 因为某些页面可能在导航后变化，添加更多的尝试
  setTimeout(addMoodImageButton, 2000);
  
  // OpenAI API 密钥
  const openaiApiKey = "sk-KcdkCYkCRbtoHtEijuAqpx7bwGIgyeDTKSJmPY6Myt1kM82z"; // 请替换为您的OpenAI API密钥
  
  // 尝试使用不同的API端点
  const OPENAI_API_ENDPOINTS = [
    'https://api.openai-hub.com/v1/images/generations', // 原始端点
    'https://api.openai.com/v1/images/generations'       // 官方端点
  ];
  
  // 添加情绪图像生成按钮到页面的函数
  function addMoodImageButton() {
    console.log("尝试添加情绪图像生成按钮");
    
    // 检查按钮是否已存在
    if (document.getElementById('generateMoodImageBtn')) {
      console.log("情绪图像生成按钮已存在，无需重复添加");
      return;
    }
    
    // 查找分析结果区域，我们将在这里添加按钮
    const analysisResult = document.getElementById('analysisResult');
    if (!analysisResult) {
      console.error("未找到分析结果区域，无法添加按钮");
      return;
    }
    
    // 查找分析内容区域
    const analysisContent = document.getElementById('analysisContent');
    if (!analysisContent) {
      console.error("未找到分析内容区域，无法添加按钮");
      return;
    }
    
    // 检查是否存在已有的按钮容器
    let buttonContainer = analysisResult.querySelector('.analysis-footer');
    
    // 如果不存在，则创建新的按钮容器
    if (!buttonContainer) {
      console.log("创建新的按钮容器");
      buttonContainer = document.createElement('div');
      buttonContainer.className = 'analysis-footer';
      buttonContainer.style.marginTop = '15px';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'space-between';
      
      // 将按钮容器添加到分析结果区域
      analysisResult.appendChild(buttonContainer);
    } else {
      console.log("使用现有的按钮容器");
    }
    
    // 检查是否已有生成图像按钮
    if (buttonContainer.querySelector('#generateMoodImageBtn')) {
      console.log("生成图像按钮已存在，无需重复添加");
      return;
    }
    
    // 创建生成图像按钮
    const generateButton = document.createElement('button');
    generateButton.className = 'btn-primary mood-image-btn';
    generateButton.id = 'generateMoodImageBtn';
    generateButton.innerHTML = '<span class="emoji">🎨</span>生成情绪图像';
    generateButton.style.background = 'linear-gradient(135deg, #4d79ff, #7e6fff)';
    generateButton.style.color = 'white';
    generateButton.style.border = 'none';
    generateButton.style.borderRadius = '8px';
    generateButton.style.padding = '10px 15px';
    generateButton.style.fontWeight = '600';
    generateButton.style.cursor = 'pointer';
    
    // 将生成按钮添加到容器的第一个位置
    if (buttonContainer.childNodes.length > 0) {
      buttonContainer.insertBefore(generateButton, buttonContainer.firstChild);
    } else {
      buttonContainer.appendChild(generateButton);
    }
    
    // 添加生成按钮点击事件
    generateButton.addEventListener('click', function(event) {
      console.log("生成情绪图像按钮被点击");
      event.preventDefault(); // 防止默认事件
      
      // 获取当前DeepSeek的情绪分析文本
      const moodDescription = analysisContent.innerText || analysisContent.textContent;
      console.log("获取到的情绪描述:", moodDescription);
      
      if (!moodDescription || moodDescription.trim() === '') {
        console.error("情绪描述为空");
        alert('请先进行情绪分析');
        return;
      }
      
      // 显示生成中状态
      analysisContent.innerHTML += `
        <div class="generating-indicator" id="generatingIndicator">
          <div class="loading-spinner"></div>
          <div class="loading-text">正在生成情绪图像，请稍候...</div>
        </div>
      `;
      
      // 禁用生成按钮
      generateButton.disabled = true;
      generateButton.style.opacity = '0.7';
      generateButton.innerHTML = '<span class="emoji">⏳</span>生成中...';
      
      // 调用OpenAI API生成图像
      generateMoodImage(moodDescription)
        .then(imageData => {
          console.log("生成图像成功:", imageData);
          
          // 移除生成中提示
          const indicator = document.getElementById('generatingIndicator');
          if (indicator) {
            indicator.remove();
          }
          
          // 恢复按钮状态
          generateButton.disabled = false;
          generateButton.style.opacity = '1';
          generateButton.innerHTML = '<span class="emoji">🎨</span>重新生成';
          
          if (imageData && imageData.url) {
            // 在右侧预览区显示生成的图像
            displayImageInPreview(imageData.url, moodDescription);
          } else {
            console.error("没有返回图像URL");
            alert('生成图像失败，请稍后再试');
          }
        })
        .catch(error => {
          console.error('生成图像时出错:', error);
          
          // 移除生成中提示
          const indicator = document.getElementById('generatingIndicator');
          if (indicator) {
            indicator.remove();
          }
          
          // 恢复按钮状态
          generateButton.disabled = false;
          generateButton.style.opacity = '1';
          generateButton.innerHTML = '<span class="emoji">🎨</span>重试';
          
          // 显示错误信息
          alert('生成图像时出错: ' + error.message);
        });
    });
    
    console.log("情绪图像生成按钮已添加");
  }
  
  // 使用OpenAI API生成情绪图像
  async function generateMoodImage(moodDescription) {
    try {
      console.log("准备生成情绪图像...");
      
      // 构建prompt
      const prompt = `基于以下情绪描述，创建一幅艺术风格的图像：
      
${moodDescription}

图像应表现出这种情绪状态的视觉表达，使用抽象或具象的方式。可以使用色彩、构图、形状和纹理来传达情绪。`;
      
      console.log("发送到OpenAI的提示词:", prompt);
      
      // 准备请求体
      const requestBody = JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      });
      
      // 准备请求头
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      };
      
      // 尝试所有可能的API端点
      let response = null;
      let error = null;
      
      for (const apiUrl of OPENAI_API_ENDPOINTS) {
        try {
          console.log(`尝试调用API端点: ${apiUrl}`);
          
          // 调用OpenAI API
          const resp = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: requestBody
          });
          
          console.log(`端点 ${apiUrl} 响应状态:`, resp.status);
          
          if (resp.ok) {
            response = resp;
            break; // 成功获取响应，跳出循环
          } else {
            const errorText = await resp.text();
            console.error(`端点 ${apiUrl} 错误响应:`, errorText);
            error = new Error(`API请求失败: ${resp.status} - ${errorText}`);
          }
        } catch (e) {
          console.error(`端点 ${apiUrl} 访问失败:`, e);
          error = e;
        }
      }
      
      // 如果没有成功的响应，抛出最后的错误
      if (!response) {
        throw error || new Error('所有API端点请求均失败');
      }
      
      const data = await response.json();
      console.log("API返回完整结果:", data);
      
      if (data.data && data.data.length > 0) {
        console.log("成功获取图像URL:", data.data[0].url);
        return {
          url: data.data[0].url,
          prompt: prompt
        };
      } else {
        console.error("API返回数据格式错误:", data);
        throw new Error('API返回格式错误');
      }
    } catch (error) {
      console.error('调用OpenAI API出错:', error);
      throw error;
    }
  }
  
  // 在右侧预览区域显示生成的图像
  function displayImageInPreview(imageUrl, moodDescription) {
    console.log("准备在预览区显示图像:", imageUrl);
    
    // 查找预览图像容器
    const previewImageContainer = document.querySelector('.preview-image-container');
    if (!previewImageContainer) {
      console.error('未找到预览图像容器');
      return;
    }
    
    // 查找预览图像元素
    const previewImage = previewImageContainer.querySelector('.preview-image');
    if (!previewImage) {
      console.error('未找到预览图像元素');
      return;
    }
    
    // 查找预览图像说明元素
    const previewCaption = previewImageContainer.querySelector('.preview-image-caption');
    
    console.log("找到预览区元素，设置图像...");
    
    // 设置图像来源
    previewImage.src = imageUrl;
    
    // 提取情绪名称
    let moodName = "情绪图像";
    const nameMatch = moodDescription.match(/状态表现为"([^"]+)"/);
    if (nameMatch && nameMatch[1]) {
      moodName = nameMatch[1];
    }
    
    console.log("提取的情绪名称:", moodName);
    
    // 设置说明文字
    if (previewCaption) {
      previewCaption.textContent = moodName;
    }
    
    // 更新Vue应用的数据（如果存在）
    if (window.app && typeof app.generatedPhoto !== 'undefined') {
      console.log("更新Vue应用数据");
      app.generatedPhoto = imageUrl;
      app.currentMoodText = moodName;
    } else {
      console.warn("无法更新Vue应用数据，app对象不存在或没有预期的属性");
    }
    
    // 添加下载按钮（如果不存在）
    if (!document.getElementById('downloadMoodImageBtn')) {
      const previewControls = document.querySelector('.preview-controls');
      if (previewControls) {
        console.log("添加下载按钮");
        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn-primary';
        downloadButton.id = 'downloadMoodImageBtn';
        downloadButton.innerHTML = '<span class="emoji">💾</span>下载情绪图像';
        downloadButton.addEventListener('click', function() {
          // 下载图像
          downloadImage(imageUrl, `情绪图像_${moodName}.png`);
        });
        
        // 添加到控制区域最前面
        previewControls.insertBefore(downloadButton, previewControls.firstChild);
      }
    }
    
    console.log("图像显示完成");
  }
  
  // 下载图像函数
  function downloadImage(url, filename) {
    console.log("准备下载图像:", url, filename);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log("图像下载操作完成");
  }
  
  // 添加样式
  const moodImageStyle = document.createElement('style');
  moodImageStyle.textContent = `
    .generating-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 15px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
    }
    
    .btn-primary.mood-image-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(77, 121, 255, 0.3);
    }
    
    body.dark-mode .generating-indicator {
      background: rgba(255, 255, 255, 0.1);
    }
  `;
  document.head.appendChild(moodImageStyle);
  
  // 修改Vue应用，扩展功能
  if (window.app) {
    console.log("找到Vue应用对象，添加方法");
    
    // 添加新的数据属性
    app.data = app.data || {};
    app.data.moodImageUrl = '';
    app.data.moodName = '';
    
    // 添加新方法
    app.methods = app.methods || {};
    app.methods.generateMoodImage = async function(moodDescription) {
      try {
        console.log("Vue应用调用生成图像方法");
        // 显示加载动画
        document.getElementById('loadingOverlay').classList.add('active');
        
        // 调用API生成图像
        const imageData = await generateMoodImage(moodDescription);
        
        // 显示图像
        if (imageData && imageData.url) {
          this.generatedPhoto = imageData.url;
          
          // 提取情绪名称
          let moodName = "情绪图像";
          const nameMatch = moodDescription.match(/状态表现为"([^"]+)"/);
          if (nameMatch && nameMatch[1]) {
            moodName = nameMatch[1];
          }
          this.currentMoodText = moodName;
          console.log("Vue应用更新了图像:", this.generatedPhoto);
        }
      } catch (error) {
        console.error('生成情绪图像失败:', error);
        alert('生成情绪图像失败: ' + error.message);
      } finally {
        // 隐藏加载动画
        document.getElementById('loadingOverlay').classList.remove('active');
      }
    };
  } else {
    console.warn("未找到Vue应用对象");
  }

  // 在DOM加载后检查window.app是否正确初始化
  console.log("当前window.app状态:", window.app);
}); 
// DeepSeek API情绪分析功能
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM加载完成，开始添加情绪分析功能");
  
  // 创建并添加按钮
  addAnalyzeButton();
  
  // 在页面加载后的一段时间再次尝试添加，确保DOM完全加载
  setTimeout(addAnalyzeButton, 1000);
  
  // 因为某些页面可能在导航后变化，添加更多的尝试
  setTimeout(addAnalyzeButton, 2000);
  
  // 添加分析按钮到页面的函数
  function addAnalyzeButton() {
    console.log("尝试添加情绪分析按钮");
    
    // 检查按钮是否已存在
    if (document.getElementById('analyzeEmotionBtn')) {
      console.log("情绪分析按钮已存在，无需重复添加");
      return;
    }
      
    // 创建按钮
    const analyzeButton = document.createElement('button');
    analyzeButton.className = 'btn-primary emotion-analyze-btn';
    analyzeButton.id = 'analyzeEmotionBtn';
    analyzeButton.innerHTML = '<span class="emoji">🧠</span>AI情绪分析';
    
    // 尝试查找原始的"生成图像"按钮
    const generateBtn = document.querySelector('.generate-with-prompt-btn');
    
    // 查找按钮容器
    const promptButtons = document.querySelector('.prompt-buttons');
    
    if (promptButtons) {
      // 创建固定宽度的按钮容器
      const fixedButtonsContainer = document.createElement('div');
      fixedButtonsContainer.className = 'fixed-buttons-container';
      
      // 克隆现有按钮到新容器中，保持原样式但确保宽度适当
      if (generateBtn) {
        const clonedGenerateBtn = generateBtn.cloneNode(true);
        fixedButtonsContainer.appendChild(clonedGenerateBtn);
        
        // 移除原按钮
        generateBtn.parentNode.removeChild(generateBtn);
        
        // 给克隆的按钮添加相同的功能
        clonedGenerateBtn.addEventListener('click', function(e) {
          // 触发原按钮的点击事件
          const customEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          // 在文档中查找实际按钮并触发点击
          const actualBtn = document.querySelector('.generate-with-prompt-btn');
          if (actualBtn && actualBtn !== clonedGenerateBtn) {
            actualBtn.dispatchEvent(customEvent);
          }
        });
      }
      
      // 将分析按钮添加到容器
      fixedButtonsContainer.appendChild(analyzeButton);
      
      // 替换原有的按钮容器
      promptButtons.parentNode.replaceChild(fixedButtonsContainer, promptButtons);
      
      console.log("情绪分析按钮已添加到按钮容器");
    } else {
      // 如果找不到按钮容器，创建浮动按钮
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'emotion-analyze-container floating';
      buttonContainer.appendChild(analyzeButton);
      document.body.appendChild(buttonContainer);
      console.log("已添加浮动情绪分析按钮");
    }
    
    // 添加结果显示区域
    addAnalysisResultArea();
  }
  
  // 添加分析结果区域
  function addAnalysisResultArea() {
    // 检查结果区域是否已存在
    if (document.getElementById('analysisResult')) {
      return;
    }
    
    // 寻找合适的结果容器
    const containers = [
      document.querySelector('.prompt-container'),
      document.querySelector('.text-prompt-panel'),
      document.querySelector('.emotion-panel'),
      document.querySelector('.app-container'),
      document.querySelector('#app')
    ];
    
    let resultContainer = null;
    
    for (let container of containers) {
      if (container) {
        resultContainer = container;
        break;
      }
    }
    
    if (!resultContainer) {
      console.error("找不到可添加分析结果的容器");
      return;
    }
    
    const resultDiv = document.createElement('div');
    resultDiv.className = 'analysis-result';
    resultDiv.id = 'analysisResult';
    resultDiv.style.display = 'none';
    resultDiv.innerHTML = `
      <div class="analysis-title">情绪分析结果</div>
      <div class="analysis-content" id="analysisContent"></div>
      <div class="analysis-footer">
        <button class="analysis-close-btn" id="closeAnalysisBtn">关闭</button>
      </div>
    `;
    
    resultContainer.appendChild(resultDiv);
    
    // 添加关闭按钮事件
    document.getElementById('closeAnalysisBtn').addEventListener('click', function() {
      document.getElementById('analysisResult').style.display = 'none';
    });
  }
  
  // 添加情绪分析按钮样式
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* 固定宽度的按钮容器 */
    .fixed-buttons-container {
      display: flex;
      flex-direction: column; /* 垂直排列按钮 */
      gap: 10px;
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
    }
    
    /* 调整所有按钮的通用样式 */
    .fixed-buttons-container button {
      width: 100% !important;
      margin: 0 !important;
      box-sizing: border-box !important;
      padding: 10px !important;
      min-height: 44px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;
      white-space: nowrap !important;
      overflow: visible !important;
      font-size: 0.95rem !important;
    }
    
    /* 情绪分析按钮样式 */
    .emotion-analyze-btn {
      background: linear-gradient(135deg, #4d79ff, #7e6fff) !important;
      color: white !important;
      border: none !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      box-shadow: 0 4px 8px rgba(77, 121, 255, 0.3) !important;
      transition: all 0.3s ease !important;
      position: relative !important;
      z-index: 101 !important;
    }
    
    .emotion-analyze-btn:hover {
      transform: translateY(-3px) !important;
      box-shadow: 0 6px 12px rgba(77, 121, 255, 0.4) !important;
      background: linear-gradient(135deg, #3d69ff, #6e5fff) !important;
    }
    
    .emotion-analyze-btn span.emoji {
      margin-right: 5px !important;
    }
    
    /* 浮动按钮容器样式 */
    .emotion-analyze-container.floating {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: auto;
      margin: 0;
      z-index: 9999;
    }
    
    /* 浮动按钮样式 */
    .floating .emotion-analyze-btn {
      border-radius: 50px !important;
      padding: 12px 20px !important;
      animation: pulse 2s infinite !important;
    }
    
    /* 添加脉动动画定义 */
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(77, 121, 255, 0.4);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(77, 121, 255, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(77, 121, 255, 0);
      }
    }
    
    /* 修复文字提示输入区域 */
    .text-prompt-panel {
      overflow: visible !important;
    }
    
    .prompt-container {
      overflow: visible !important;
    }
    
    /* 确保按钮容器在所有缩放下可见 */
    @media screen and (max-width: 768px) {
      .fixed-buttons-container {
        flex-direction: column;
      }
      
      .fixed-buttons-container button {
        font-size: 0.85rem !important;
        padding: 8px !important;
      }
    }
    
    .analysis-result {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      margin-top: 15px;
      animation: fadeIn 0.5s ease;
      max-height: 400px; /* 增加最大高度 */
      overflow-y: auto; /* 添加垂直滚动条 */
      width: 100%; /* 确保宽度占满容器 */
      box-sizing: border-box; /* 确保padding不会增加宽度 */
      backdrop-filter: blur(10px); /* 添加模糊背景效果 */
      -webkit-backdrop-filter: blur(10px);
      z-index: 10; /* 确保结果显示在最上层 */
      position: relative;
    }
    
    .analysis-title {
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 15px;
      color: rgb(46, 47, 112);
      position: relative;
      padding-bottom: 8px;
    }
    
    .analysis-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #4d79ff, #7e6fff);
      border-radius: 3px;
    }
    
    .analysis-content {
      font-size: 1rem;
      line-height: 1.6;
      color: rgb(51, 52, 124);
      white-space: pre-line; /* 保留换行符 */
      word-wrap: break-word; /* 长词自动换行 */
      margin-bottom: 15px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
    }
    
    .analysis-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
    
    .analysis-close-btn {
      background: linear-gradient(135deg, #4d79ff, #7e6fff);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .analysis-close-btn:hover {
      background: linear-gradient(135deg, #3d69ff, #6e5fff);
      transform: translateY(-2px);
    }
    
    body.dark-mode .emotion-analyze-btn {
      background: linear-gradient(135deg, #3d69ff, #5d4fef);
    }
    
    body.dark-mode .emotion-analyze-btn:hover {
      background: linear-gradient(135deg, #2d59ef, #4d3fdf);
    }
    
    body.dark-mode .analysis-result {
      background-color: rgba(40, 44, 65, 0.45);
      border: 1px solid rgba(70, 70, 90, 0.4);
    }
    
    body.dark-mode .analysis-title {
      color: rgba(255, 255, 255, 0.95);
    }
    
    body.dark-mode .analysis-content {
      color: rgba(255, 255, 255, 0.85);
      background-color: rgba(40, 44, 65, 0.5);
    }
    
    body.dark-mode .analysis-close-btn {
      background: linear-gradient(135deg, #3d69ff, #5d4fef);
    }
    
    body.dark-mode .analysis-close-btn:hover {
      background: linear-gradient(135deg, #2d59ef, #4d3fdf);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* 修复缩放比例问题 */
    @media (max-width: 768px) {
      .analysis-result {
        max-height: 350px;
        padding: 15px;
      }
      
      .analysis-title {
        font-size: 1rem;
        margin-bottom: 12px;
      }
      
      .analysis-content {
        font-size: 0.95rem;
        line-height: 1.5;
        padding: 8px;
      }
      
      .analysis-close-btn {
        padding: 5px 10px;
        font-size: 0.85rem;
      }
    }
    
    @media (max-width: 480px) {
      .analysis-result {
        max-height: 300px;
        padding: 12px;
      }
      
      .analysis-title {
        font-size: 0.95rem;
        margin-bottom: 10px;
      }
      
      .analysis-content {
        font-size: 0.9rem;
        line-height: 1.4;
        padding: 6px;
      }
    }
  `;
  document.head.appendChild(styleEl);
  
  // 添加情绪分析按钮事件
  document.body.addEventListener('click', function(event) {
    if (event.target.id === 'analyzeEmotionBtn' || event.target.closest('#analyzeEmotionBtn')) {
      console.log("分析按钮被点击");
      
      // 获取Vue实例
      const appInstance = window.app || {};
      
      // 获取当前情绪值
      const happiness = appInstance.happiness || 50;
      const anger = appInstance.anger || 50;
      const anticipation = appInstance.anticipation || 50;
      const disgust = appInstance.disgust || 50;
      
      console.log("当前情绪值:", happiness, anger, anticipation, disgust);
      
      // 情绪解释文本
      const explainText = `
        我有四个情绪参数值：
        1. 快乐-悲伤: ${happiness}（0代表极度悲伤，100代表极度快乐）
        2. 愤怒-恐惧: ${anger}（0代表极度恐惧，100代表极度愤怒）
        3. 期待-惊讶: ${anticipation}（0代表极度惊讶，100代表极度期待）
        4. 厌恶-信任: ${disgust}（0代表极度信任，100代表极度厌恶）
        
        请分析这组情绪值代表什么样的心情状态？用简短的一段话描述这种情绪组合的特点和可能的心理状态。
        另外，请根据这些情绪值，给这种心情起一个有创意的名称。
      `;
      
      // 显示分析结果区域，并显示加载中状态
      const resultDiv = document.getElementById('analysisResult');
      const contentDiv = document.getElementById('analysisContent');
      
      if (contentDiv) {
        contentDiv.innerHTML = `
          <div class="loading-indicator">
            <div class="loading-spinner"></div>
            <div class="loading-text">正在分析情绪，请稍候...</div>
            <div class="loading-details">
              快乐: ${happiness} | 愤怒: ${anger} | 期待: ${anticipation} | 厌恶: ${disgust}
            </div>
          </div>
        `;
      }
      
      if (resultDiv) {
        resultDiv.style.display = 'block';
      }
      
      // 尝试调用DeepSeek API
      callDeepSeekAPI(explainText)
        .then(apiResult => {
          if (contentDiv && apiResult) {
            // 格式化API返回的结果文本，确保换行显示正确
            contentDiv.innerHTML = apiResult.replace(/\n/g, '<br>');
          }
        })
        .catch(error => {
          console.error('API调用错误:', error);
          
          // 使用本地分析逻辑
          const result = fallbackAnalysis(happiness, anger, anticipation, disgust);
          
          if (contentDiv) {
            // 格式化结果文本，确保换行显示正确
            contentDiv.innerHTML = result.replace(/\n/g, '<br>');
          }
        });
    }
  });
  
  // 添加加载状态样式
  const loadingStyle = document.createElement('style');
  loadingStyle.textContent = `
    .loading-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #4d79ff;
      animation: spin 1s infinite linear;
      margin-bottom: 15px;
    }
    
    .loading-text {
      font-size: 1rem;
      margin-bottom: 10px;
      color: rgb(51, 52, 124);
    }
    
    .loading-details {
      font-size: 0.9rem;
      color: rgba(51, 52, 124, 0.8);
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    body.dark-mode .loading-spinner {
      border-color: rgba(255, 255, 255, 0.1);
      border-top-color: #4d79ff;
    }
    
    body.dark-mode .loading-text {
      color: rgba(255, 255, 255, 0.9);
    }
    
    body.dark-mode .loading-details {
      color: rgba(255, 255, 255, 0.7);
    }
  `;
  document.head.appendChild(loadingStyle);
  
  // DeepSeek API调用函数
  async function callDeepSeekAPI(prompt) {
    try {
      // 使用DeepSeek API
      const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
      const apiKey = 'sk-1a44e77dbbcf4331844c6dbfc3ed2ad1'; // DeepSeek API密钥
      
      console.log("调用DeepSeek API...");
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: '你是一位情绪分析专家，擅长根据情绪参数分析人的心理状态。请用简洁、有洞察力的语言回应用户。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API返回结果:", data);
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('API调用错误:', error);
      return null;
    }
  }
  
  // 本地备用分析逻辑
  function fallbackAnalysis(happiness, anger, anticipation, disgust) {
    console.log("使用本地分析逻辑");
    // 将参数转换为更易理解的值
    const h = happiness > 50 ? '快乐' : '悲伤';
    const a = anger > 50 ? '愤怒' : '恐惧';
    const ant = anticipation > 50 ? '期待' : '惊讶';
    const d = disgust > 50 ? '厌恶' : '信任';
    
    // 计算主导情绪
    const emotions = [
      { name: h, value: Math.abs(happiness - 50) },
      { name: a, value: Math.abs(anger - 50) },
      { name: ant, value: Math.abs(anticipation - 50) },
      { name: d, value: Math.abs(disgust - 50) }
    ];
    
    emotions.sort((a, b) => b.value - a.value);
    const dominant = emotions[0].name;
    const secondary = emotions[1].name;
    
    // 根据主导情绪和次要情绪组合生成分析结果
    const combinations = {
      '快乐-期待': '充满希望的乐观',
      '快乐-信任': '幸福满足的安心感',
      '快乐-惊讶': '惊喜的愉悦',
      '快乐-恐惧': '忐忑的喜悦',
      '快乐-愤怒': '亢奋的激动',
      '快乐-厌恶': '复杂的快乐',
      '悲伤-期待': '期待中的忧伤',
      '悲伤-信任': '安心的忧郁',
      '悲伤-惊讶': '震惊的伤感',
      '悲伤-恐惧': '深度的消沉',
      '悲伤-愤怒': '愤恨的悲伤',
      '悲伤-厌恶': '厌世的悲观',
      '期待-信任': '信心满满的期待',
      '期待-惊讶': '充满变数的期待',
      '期待-恐惧': '忐忑的期待',
      '期待-愤怒': '焦躁的期待',
      '期待-厌恶': '矛盾的期待',
      '信任-惊讶': '意外的信任',
      '信任-恐惧': '不安的依赖',
      '信任-愤怒': '复杂的信任',
      '信任-厌恶': '矛盾的信任',
      '惊讶-恐惧': '惊恐',
      '惊讶-愤怒': '震怒',
      '惊讶-厌恶': '厌恶的震惊',
      '恐惧-愤怒': '恐慌中的愤怒',
      '恐惧-厌恶': '厌世的恐惧',
      '愤怒-厌恶': '憎恶'
    };
    
    const key = `${dominant}-${secondary}`;
    const mood = combinations[key] || `${dominant}与${secondary}的混合情绪`;
    
    return `你当前的情绪状态表现为"${mood}"。\n\n主要由${dominant}和${secondary}组成，同时伴随着其他情绪的影响。这种情绪组合表现出一种独特的心理状态，可能会影响你的行为和决策方式。`;
  }
}); 
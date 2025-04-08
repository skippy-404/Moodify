/**
 * 认证相关的工具函数
 */

/**
 * 发送带有认证token的请求
 * @param {string} url - 请求URL
 * @param {Object} options - fetch请求选项
 * @returns {Promise<Response>} fetch响应
 */
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('未登录或token已过期');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // 如果返回401，说明token无效或过期
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
    throw new Error('登录已过期，请重新登录');
  }

  return response;
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * 退出登录
 */
function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}

/**
 * 获取当前登录用户的token
 * @returns {string|null} 用户token或null
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * 保存用户token
 * @param {string} token - 用户token
 */
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// 导出所有函数
export {
  fetchWithAuth,
  checkAuth,
  logout,
  getAuthToken,
  setAuthToken
}; 
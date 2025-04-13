<template>
  <div class="image-generator">
    <div class="input-section">
      <textarea v-model="prompt" placeholder="输入提示词..."></textarea>
      
      <div class="upload-section">
        <div class="file-input-wrapper">
          <input type="file" @change="handleImageUpload" accept="image/jpeg,image/png,image/jpg" id="imageUpload">
          <label for="imageUpload" class="upload-button">选择图片</label>
        </div>
        
        <div v-if="uploadError" class="error-message">
          {{ uploadError }}
        </div>
        
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="预览图片">
          <button @click="clearUploadedImage" class="clear-button">清除</button>
        </div>
      </div>

      <button @click="generateImage" :disabled="isGenerating">
        {{ isGenerating ? '生成中...' : '生成AI图像' }}
      </button>
    </div>

    <div v-if="isGenerating" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <div v-if="generatedImage" class="image-viewer">
      <div class="viewer-content">
        <span class="close-viewer" @click="closeViewer">&times;</span>
        <img :src="generatedImage" class="viewer-image">
        <div class="viewer-caption">{{ prompt }}</div>
        <button @click="downloadImage" class="download-image">下载图片</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { img2imgRequest } from '../api/img2img';

export default {
  name: 'ImageGenerator',
  setup() {
    const prompt = ref('');
    const isGenerating = ref(false);
    const generatedImage = ref('');
    const uploadedImage = ref(null);
    const imagePreview = ref(null);
    const uploadError = ref('');

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      uploadError.value = '';
      
      if (!file) {
        return;
      }

      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        uploadError.value = '请上传JPG或PNG格式的图片';
        return;
      }

      // 验证文件大小（限制为5MB）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        uploadError.value = '图片大小不能超过5MB';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImage.value = e.target.result;
        imagePreview.value = e.target.result;
      };
      reader.onerror = () => {
        uploadError.value = '图片读取失败，请重试';
      };
      reader.readAsDataURL(file);
    };

    const clearUploadedImage = () => {
      uploadedImage.value = null;
      imagePreview.value = null;
      uploadError.value = '';
    };

    const generateImage = async () => {
      if (!prompt.value.trim()) {
        alert('请输入提示词');
        return;
      }

      isGenerating.value = true;
      try {
        const payload = {
          prompt: prompt.value,
          negative_prompt: "模糊的，低质量的，草稿，粗糙的，不完整的",
          styles: [],
          seed: -1,
          batch_size: 1,
          n_iter: 1,
          steps: 30,
          cfg_scale: 7,
          width: 512,
          height: 512,
          restore_faces: true,
          tiling: false,
          sampler_index: "Euler a",
          send_images: true,
          save_images: false
        };

        if (uploadedImage.value) {
          let cleanBase64 = uploadedImage.value;
          if (cleanBase64.startsWith('data:image')) {
            cleanBase64 = cleanBase64.split(',')[1];
          }
          
          payload.init_images = [cleanBase64];
          payload.denoising_strength = 0.7;
          payload.resize_mode = 0;
        }

        const response = await img2imgRequest(payload);
        if (response.images && response.images.length > 0) {
          generatedImage.value = `data:image/png;base64,${response.images[0]}`;
        }
      } catch (error) {
        console.error('生成图像失败:', error);
        alert('生成图像失败: ' + error.message);
      } finally {
        isGenerating.value = false;
      }
    };

    const closeViewer = () => {
      generatedImage.value = '';
    };

    const downloadImage = () => {
      if (generatedImage.value) {
        const link = document.createElement('a');
        link.href = generatedImage.value;
        link.download = `AI生成图像-${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };

    return {
      prompt,
      isGenerating,
      generatedImage,
      imagePreview,
      uploadError,
      handleImageUpload,
      clearUploadedImage,
      generateImage,
      closeViewer,
      downloadImage
    };
  }
};
</script>

<style scoped>
.image-generator {
  padding: 20px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.close-viewer {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.viewer-image {
  max-width: 100%;
  max-height: 70vh;
}

.viewer-caption {
  margin-top: 10px;
  text-align: center;
}

.download-image {
  display: block;
  margin: 10px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-section {
  margin: 10px 0;
}

.file-input-wrapper {
  position: relative;
  margin-bottom: 10px;
}

#imageUpload {
  display: none;
}

.upload-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:hover {
  background-color: #1976D2;
}

.error-message {
  color: #f44336;
  margin: 5px 0;
  font-size: 14px;
}

.image-preview {
  margin-top: 10px;
  position: relative;
  max-width: 300px;
}

.image-preview img {
  max-width: 100%;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.clear-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.clear-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style> 
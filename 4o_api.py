import http.client
import json
import os
import requests
import base64

conn = http.client.HTTPSConnection("api.openai-hub.com")
# 消息内容
new_content = [
    {
        "type": "text",
        "text": "生成草原的图片"
    },
    {
        "type": "image_url",
        "image_url": {
            "url": f"data:image/jpeg;base64,{image_base64}"
        }
    }
]

payload = json.dumps({
   "model": "gpt-4o-image-vip",
   "messages": [
      {
         "role": "user",
         "content": new_content
      }
   ]
})
headers = {
   'Accept': 'application/json',
   'Authorization': 'sk-KcdkCYkCRbtoHtEijuAqpx7bwGIgyeDTKSJmPY6Myt1kM82z',
   'Content-Type': 'application/json'
}
conn.request("POST", "/v1/chat/completions", payload, headers)
res = conn.getresponse()
data = res.read()
response_json = json.loads(data.decode("utf-8"))

# 保存图片的文件夹
save_folder = 'output'

# image_urls 为实际响应体里的字段，我还没找到这个字段在哪
if 'image_urls' in response_json:
    for i, image_url in enumerate(response_json['image_urls']):
        try:
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                image_path = os.path.join(save_folder, f'generated_image_{i}.png')
                with open(image_path, 'wb') as f:
                    f.write(image_response.content)
                print(f'图片已保存到: {image_path}')
            else:
                print(f'无法下载图片 {image_url}, 状态码: {image_response.status_code}')
        except requests.RequestException as e:
            print(f'下载图片 {image_url} 时出错: {e}')
else:
    print('未在响应中找到图片 URL:', response_json)
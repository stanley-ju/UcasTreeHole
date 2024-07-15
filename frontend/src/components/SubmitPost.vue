<template>
  <div class="post-container">
    <div class="post-header">您想跟大家分享什么：</div>
    <el-input
      v-model="textarea"
      class="post-textarea"
      :rows="12"
      type="textarea"
      :resize="'none'"
      placeholder="在这里输入你的内容吧！"
    />
    <div class="upload-header">上传图片：</div>
    <el-upload
      list-type="picture-card"
      :file-list="uploadFiles"
      action="#"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      accept="image/png,image/jpeg"
      :limit="4"
      :auto-upload="false"
    >
      <template #tip>
        <div class="upload-tip">仅支持 jpg/png 格式的图片，每张不超过500KB</div>
      </template>
    </el-upload>
    <el-button type="primary" @click="submitPost" class="submit-button" :disabled="!textarea && uploadFiles.length == 0 ">发布</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { submitPostRequest } from '@/types/type';
import { userStore } from '@/store/store';
import { axiosPostApi } from '@/api/api';
import { ElMessage } from 'element-plus';

export default defineComponent({
  setup() {
    const textarea = ref('');
    const quoteId = ref('-1');
    const uploadFiles = ref([]);

    function submitPost() {
      if (!textarea.value.trim() && uploadFiles.value.length === 0) {
        ElMessage.error('内容不能为空');
        return;
      }
      const submitPostParam: submitPostRequest = {
        student_number: userStore().userId,
        content: textarea.value,
        quoteId: quoteId.value,
        file: uploadFiles.value
      };
      axiosPostApi(submitPostParam, '/treehole/submitPost').then(response => {
        console.log(response);
        window.location.reload();
      }).catch(error => {
        console.error(error);
        window.alert("发帖失败！");
      });
    }

    const handleExceed = (files: File[], fileList: File[]) => {
      ElMessage.warning(`最多只能上传 4 个文件`);
    };

    const isFileDuplicate = (file) => {
      // 检查文件是否重复，基于文件名和大小
      return uploadFiles.value.some(f => f.name === file.name && f.raw.size === file.raw.size);
    };

    const handleChange = (file: File, fileList: File[]) => {
      console.log(uploadFiles.value);
      if (isFileDuplicate(file)) {
        ElMessage.error('不能上传相同文件名的图片');
        uploadFiles.value = uploadFiles.value.filter(f => f.name !== file.name);
      }
      uploadFiles.value.push(file);
    };

    const handleRemove = (file, fileList) => {
      uploadFiles.value = fileList;
    };

    return {
      textarea,
      uploadFiles,
      submitPost,
      handleExceed,
      handleChange,
      handleRemove,
    }
  }
});
</script>

<style lang="less" scoped>
.post-container {
  border: 1px solid #dcdcdc;
  padding: 20px;
  width: 70%;
  min-height: 20vh;
  margin: 20px auto;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: bold;
  color: #333333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.post-textarea {
  width: 90%;
  height: 300px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #fafafa;
  resize: none;
}

.upload-header {
  margin-top: 25px;
  font-size: 20px;
  color: #666666;
  margin-bottom: 10px;
}

.upload-tip {
  color: #999;
  font-size: 14px;
}

.submit-button {
  display: block;
  margin: 20px auto;
  width: 120px;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 20px;
}
</style>

<template>
  <div :style="{borderColor: '#ff0000', border: '2px',padding: '10px', width: '100%', height: '100%'}">
    <div>发帖页</div>
    <el-input
        v-model="textarea"
        :style="{width: '240px', height: '200px', padding: '10px'}"
        :autosize="{ minRows: 6, maxRows: 10 }"
        type="textarea"
        placeholder="Please input"
    />
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
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>

    <el-button type="primary" @click="submitPost">提交</el-button>
  </div>
</template>


<script lang="ts">
import {defineComponent, ref} from 'vue';
import {submitPostRequest} from '@/types/type';
import {userStore} from '@/store/store';
import {axiosPostApi} from '@/api/api';
import {ElMessage} from 'element-plus';

export default defineComponent({
  setup() {
    const textarea = ref('')
    const quoteId = ref('-1')
    const uploadFiles = ref([])

    function submitPost() {
      const submitPostParam: submitPostRequest = {
        student_number: userStore().userId,
        content: textarea.value,
        quoteId: quoteId.value,
        file: uploadFiles.value
      }
      axiosPostApi(submitPostParam, '/treehole/submitPost').then(response => {
        console.log(response)
        window.location.reload()
      }).catch(error => {
        console.error(error)
        window.alert("发帖失败！")
      })
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
})
</script>

<style lang="less" scoped>

</style>
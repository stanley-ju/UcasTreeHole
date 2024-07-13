<template>
  <div>查看/管理 本人发布的帖子  上传头像  更改密码 退出登录</div>
  <el-button type="danger" @click="quitLogin">退出登录</el-button>
  <el-upload
      list-type="picture-card"
      action="#"
      :file-list="avatarFile"
      :on-change="handleChange"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      accept="image/png,image/jpeg"
      :limit="1"
      :auto-upload="false"
  >
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
  <el-button type="primary" @click="uploadAvatar">上传头像</el-button>
</template>
    
    
<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {changePasswordRequest, deleteUserPostRequest, queryUserPostRequest, uploadAvatarRequest} from "@/types/type";
import {userStore} from "@/store/store";
import {axiosPostApi} from "@/api/api";
import {ElMessage} from "element-plus";
import {updateUrl} from "@/utils/utils";


export default defineComponent({
    setup(){
      const postList = ref([])
      const avatarFile = ref([])
      onMounted(()=>{
        queryUserPost()
      })
      function quitLogin(){
        localStorage.removeItem("token")
        window.location.reload()
      }

      function queryUserPost(){
        const queryUserPostParam : queryUserPostRequest = {
          student_number : userStore().userId,
        }
        axiosPostApi(queryUserPostParam,'/treehole/queryUserPost').then(response => {
          if (response.postList !== null) {
            postList.value = response.postList
          }
        }).catch(error => {
          console.log(error)
        })
      }

      function deleteUserPost(postId){
        const deleteUserPostParam : deleteUserPostRequest = {
          student_number : userStore().userId,
          postId : postId
        }
        axiosPostApi(deleteUserPostParam,'/treehole/deleteUserPost').then(response => {
          console.log(response)
          window.location.reload()
        }).catch(error => {
          console.log(error)
        })
      }

      function changePassword(confirmPassword:string, newPassword:string){
        const changePasswordParam : changePasswordRequest = {
          student_number: userStore().userId,
          confirmPassword: confirmPassword,
          newPassword: newPassword
        }
        axiosPostApi(changePasswordParam,'/user/changePassword').then(response => {
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
      }

      const handleExceed = () => {
        ElMessage.warning(`最多只能上传 1 个文件`);
      };

      const handleChange = (file: File, fileList: File[]) => {
        avatarFile.value = fileList;
      };

      const handleRemove = (file: File, fileList: File[]) => {
        avatarFile.value = fileList;
      };

      function uploadAvatar(){
        if(avatarFile.value == null){
          window.alert('请选择要上传的头像')
          return
        }
        const uploadAvatarParam : uploadAvatarRequest = {
          student_number: userStore().userId,
          avatar: avatarFile.value
        }

        axiosPostApi(uploadAvatarParam, '/user/uploadAvatar').then(response => {
          console.log(response)
          localStorage.setItem("avatarUrl", updateUrl(response.avatarURL))
          window.location.reload()
        }).catch(error => {
          console.log(error)
        })
      }

      return {
        quitLogin,
        queryUserPost,
        changePassword,
        handleExceed,
        handleRemove,
        handleChange,
        uploadAvatar,
        deleteUserPost,
        avatarFile
      }
    }
})
</script>
    
<style lang="less" scoped>
    
</style>
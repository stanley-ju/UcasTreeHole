<template>
    <div>查看/管理 本人发布的帖子  参与回复的帖子  上传头像  更改密码 退出登录</div>
    <el-button type="danger" @click="quitLogin">退出登录</el-button>
</template>
    
    
<script lang="ts">
import { defineComponent } from 'vue';
    
export default defineComponent({
    setup(){
        function quitLogin(){
            localStorage.removeItem("token")
            window.location.reload()
        }
    
        return {
            quitLogin
        }
    }
})
</script>
    
<style lang="less" scoped>
    
</style>
<template>
    <div>帖子详情页 查看帖子内容和评论 收藏按钮 评论按钮</div>
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
<template>
    <div>近一天/一周/一月 热榜帖子列表 浏览量top10 收藏量top10 评论量top10</div>
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
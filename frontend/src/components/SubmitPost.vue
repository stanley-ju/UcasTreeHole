<template>
    <div :style="{backgroundColor: '#ff0000'}">
        <div>发帖页</div>
        <el-input
            v-model="textarea"
            style="width: 240px"
            :autosize="{ minRows: 6, maxRows: 10 }"
            type="textarea"
            placeholder="Please input"
        />
        <el-button type="primary" @click="submitPost">提交</el-button>
    </div>
</template>
    
    
<script lang="ts">
import { defineComponent,ref } from 'vue';
import { submitPostRequest } from '@/types/type';
import { userStore } from '@/store/store';
import { axiosPostApi } from '@/api/api';
    
export default defineComponent({
    setup(){
        const textarea = ref('')
        const quoteId = ref('-1')
        function submitPost(){
            const submitPostParam : submitPostRequest = {
                student_number : userStore().userId,
                content : textarea.value,
                quoteId : quoteId.value
            } 
            axiosPostApi(submitPostParam,'/treehole/submitPost').then(response=>{
                console.log(response)
            }).catch(error=>{
                console.error(error)
                window.alert("发帖失败！")
            })
            window.location.reload()
        }
        return {
            textarea,
            submitPost
        }
    }
})
</script>
    
<style lang="less" scoped>
    
</style>
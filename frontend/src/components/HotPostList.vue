<template>
  <ul class="infinite-list">
    <li v-for="post in postList" :key="post.postId">
      <el-card style="max-width: 480px" shadow="always">
        <template #header>
          <div class="card-header">
            <span># {{post.postId}}</span>
          </div>
        </template>

        <p>{{ post.content }}</p>
        <el-image v-for="(url, index) in post.imageUrlList.split(';').filter(part => part !== '')" :key="index" style="width: 100px; height: 100px" :src="url" :fit="'contain'" />

        <template #footer>
          <span class="dialog-footer">
            <font-awesome-icon :icon="post.isFavour=='both'||post.isFavour=='like'?['fas', 'thumbs-up']:['far','thumbs-up']"/>
            <span>{{ post.likeNum }}</span>

            <font-awesome-icon :icon="post.isFavour=='both'||post.isFavour=='favor'?['fas', 'star']:['far','star']"/>
            <span>{{ post.favourNum }}</span>

            <font-awesome-icon :icon="['far', 'comment-dots']" />
            <span>{{ post.commentList.length }}</span>
          </span>
          <el-button type="success" @click="showDetail(post)">查看</el-button>
        </template>
      </el-card>
    </li>
  </ul>

  <el-dialog
      v-model="isVisible2"
      title="帖子详情"
      center
      :lock-scroll="false"
      :close-on-click-modal="false"
      class="post-details-dialog"
  >
    <div class="dialog-content">
      <PostDetail :postDetail = "postDetailContent"></PostDetail>
    </div>
  </el-dialog>
</template>
    
    
<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import {queryHotListRequest} from "@/types/type";
import {axiosPostApi} from "@/api/api";
import {userStore} from "@/store/store";
import PostDetail from "@/components/PostDetail.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    
export default defineComponent({
  components: {PostDetail},
    setup(){
      const isVisible2 = ref(false)
      const postList = ref([])
      const postDetailContent = ref(null)
      onMounted(()=>{
        postList.value = []
        queryHotList(userStore().userId,'favour_num','month')
      })
      function queryHotList(studentNumber:string, type:string, duration:string){
        const queryHotListParam : queryHotListRequest = {
          student_number:studentNumber,
          type:type,
          duration:duration,
        }

        axiosPostApi(queryHotListParam,'/treehole/queryHotPost').then(response => {
          postList.value = response.postList
          console.log(response)
        }).catch(error => {
          console.log(error)
        })
      }
      function showDetail(post) {
        isVisible2.value = true
        postDetailContent.value = post
      }
      const load = () => {
        console.log('reach bottom')
      }
      return {
        postList,
        queryHotList,
        load,
        isVisible2,
        postDetailContent,
        showDetail,
        FontAwesomeIcon
      }
    }
})
</script>
    
<style lang="less" scoped>
.infinite-list {
  height: 680px;
  padding: 0;
  margin: 0;
  list-style: none;
}

</style>
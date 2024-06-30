<template>
  <ul>
    <li v-for="post in postList" :key="post.postId" v-infinite-scroll="load" infinite-scroll-distance="30" class="infinite-list" style="overflow: auto">
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
import {queryFavoritePostRequest} from "@/types/type";
import {axiosPostApi} from "@/api/api";
import {userStore} from "@/store/store";
import PostDetail from "@/components/PostDetail.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default defineComponent({
  components: {PostDetail},
  setup(){
    const startIndex = ref(1)
    const postNum = ref(10)
    const isVisible2 = ref(false)
    const postList = ref([])
    const postDetailContent = ref(null)
    onMounted(()=>{
      startIndex.value = 1
      postList.value = []
      queryFavoritePost()
    })
    function queryFavoritePost(){
      const queryFavoritePostParam : queryFavoritePostRequest = {
        student_number: userStore().userId,
        startIndex: String(startIndex.value),
        postNum: String(postNum.value)
      }

      axiosPostApi(queryFavoritePostParam,'/treehole/queryFavoritePost').then(response => {
        if (response.postList !== null) {
          postList.value.push(...response.postList)
          startIndex.value = startIndex.value + postNum.value
          console.log(postList.value)
        }
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
      queryFavoritePost()
    }
    return {
      postList,
      isVisible2,
      postDetailContent,
      showDetail,
      load,
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
<template>
  <div>帖子列表 + 搜索框 +发帖按钮</div>
  <el-button type="success" @click="showSubmit">发帖</el-button>

  <el-button v-show="isVisible" :icon="Close" @click="closeSubmit" size="large"/>
  <SubmitPost v-show="isVisible"></SubmitPost>
  <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
    <li v-for="post in postList" :key="post.postId">
      <p>{{ post.content }}</p>
      <el-button type="success" @click="showDetail(post)">查看</el-button>
    </li>
  </ul>
  <el-button v-show="isVisible2" :icon="Close" @click="closeSubmit" size="large"/>
  <div v-show="isVisible2">
    <PostDetail>
      <template #content>{{postDetailContent}}</template>
      <template #img>
        <el-image v-for="(url, index) in imageUrlList" :key="index" style="width: 100px; height: 100px" :src="url" :fit="'contain'" />
      </template>
    </PostDetail>
  </div>

</template>


<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';
import SubmitPost from './SubmitPost.vue';
import PostDetail from './PostDetail.vue';
import {Close} from '@element-plus/icons-vue'
import {queryPostRequest} from '@/types/type';
import {axiosPostApi} from '@/api/api';
import {userStore} from '@/store/store';

export default defineComponent({
  setup() {
    const startIndex = ref(0)
    const postNum = ref(10)
    const postList = ref([])
    const isVisible = ref(false)
    const isVisible2 = ref(false)
    const postDetailContent = ref("")
    const imageUrlList = ref([])
    onMounted(() => {
      const queryPostParam: queryPostRequest = {
        student_number: userStore().userId,
        startIndex: String(startIndex.value),
        postNum: String(postNum.value)
      }
      axiosPostApi(queryPostParam, '/treehole/queryPost').then(response => {
        postList.value = response.postList
        console.log(response)
      }).catch(error => {
        console.error(error)
      })
    })

    function showSubmit() {
      isVisible.value = true
    }

    function closeSubmit() {
      isVisible.value = false
      isVisible2.value = false
      imageUrlList.value = []
    }

    function showDetail(post) {
      isVisible2.value = true
      postDetailContent.value = post.content

      if (post.imageUrlList.length > 0){
        imageUrlList.value = post.imageUrlList.split(';').filter(part => part !== "");
      }
    }

    const load = () => {
      console.log('reach bottom')
    }

    return {
      postList,
      load,
      showSubmit,
      closeSubmit,
      showDetail,
      isVisible,
      isVisible2,
      postDetailContent,
      imageUrlList,
      Close
    }
  },
  components: {
    SubmitPost,
    PostDetail
  }
})
</script>

<style lang="less" scoped>

</style>
<template>
  <el-affix :offset="affixOffset">
    <el-button
      size="large"
      type="primary"
      :icon="Plus"
      circle
      @click="showSubmit"
      class="submitAffix"
    />
  </el-affix>
  <ul
    id="post-list"
    v-infinite-scroll="load"
    :infinite-scroll-distance="10"
    class="infinite-list"
  >
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="posts">
          <el-input v-model="keyword" placeholder="请输入内容" class="search-post" clearable>
            <template #append>
              <el-button type="primary" :icon="Search" @click="queryPostWithKeyword"></el-button>
            </template>
          </el-input>
          <Post v-for="post in postList" :postId="post.postId" :senderId="post.senderId" :sendTime="post.sendTime"
            :likeNum="post.likeNum" :favourNum="post.favourNum" :content="post.content" :isFavour="post.isFavour"
            :commentList="post.commentList" :senderAvatar="post.senderAvatar" :imageUrlList="post.imageUrlList" />
        </div>
      </el-col>
    </el-row>
  </ul>

  <el-dialog v-model="isVisible" title="发帖页" center :lock-scroll="false" :close-on-click-modal="false"
    class="post-details-dialog">
    <SubmitPost></SubmitPost>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";
import SubmitPost from "./SubmitPost.vue";
import Post from "./Post.vue";
import { Close, Plus, Search } from "@element-plus/icons-vue";
import { queryPostRequest, queryPostWithKeywordRequest } from "@/types/type";
import { axiosPostApi } from "@/api/api";
import { userStore } from "@/store/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  setup() {
    const startIndex = ref(1);
    const postNum = ref(10);
    const postList = ref([]);
    const isVisible = ref(false);
    const keyword = ref("");
    const affixOffset = ref(window.innerHeight * 0.84);
    let searchFlag = 0;
    const scrollPosition = ref(0);
    const scrollContainer = ref(null);

    onMounted(() => {
      searchFlag = 0;
      startIndex.value = 1;
      postList.value = [];
    });

    function queryPosts() {
      const queryPostParam: queryPostRequest = {
        student_number: userStore().userId,
        startIndex: String(startIndex.value),
        postNum: String(postNum.value),
      };
      axiosPostApi(queryPostParam, "/treehole/queryPost")
        .then((response) => {
          if (response.postList !== null) {
            postList.value.push(...response.postList);
            startIndex.value = startIndex.value + postNum.value;
            console.log(postList.value);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    //搜索框根据关键词搜索帖子
    function queryPostWithKeyword() {
      if (searchFlag == 0) {
        postList.value = [];
        searchFlag = 1;
        startIndex.value = 1;
      }
      const queryPostWithKeywordParam: queryPostWithKeywordRequest = {
        student_number: userStore().userId,
        startIndex: String(startIndex.value),
        postNum: String(postNum.value),
        keyword: keyword.value,
      };
      axiosPostApi(queryPostWithKeywordParam, "/treehole/queryPostWithKeyword")
        .then((response) => {
          if (response.postList !== null) {
            postList.value.push(...response.postList);
            startIndex.value = startIndex.value + postNum.value;
            console.log(postList.value);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    function showSubmit() {
      isVisible.value = true;
    }

    const load = () => {
      if (searchFlag == 0) {
        queryPosts();
      } else {
        queryPostWithKeyword();
      }
    };

    return {
      postList,
      load,
      showSubmit,
      isVisible,
      keyword,
      affixOffset,
      queryPostWithKeyword,
      scrollContainer,
      Close,
      Search,
      Plus,
    };
  },
  components: {
    SubmitPost,
    Post,
    FontAwesomeIcon,
  },
});
</script>

<style lang="less" scoped>
.infinite-list {
  overflow: auto;
  height: calc(100vh - 52px);
  padding: 0px;
  margin: 0px;
  --el-main-padding: 0px;
}

.posts {
  background-color: rgba(255, 255, 255, 0.53);
  margin: 12px 0px 20px 0px;
  padding: 12px 20px 20px 20px;
  border-radius: 12px;
  text-align: left;
}

.el-affix {
  height: 0;
}

.submitAffix {
  float: right;
  margin-right: 3.3%;
  --el-button-size: 50px;
}
</style>

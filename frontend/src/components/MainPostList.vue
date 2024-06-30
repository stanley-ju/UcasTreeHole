<template>
  <ul
    v-infinite-scroll="load"
    :infinite-scroll-distance="10"
    class="infinite-list"
  >
    <el-input
      v-model="keyword"
      placeholder="请输入内容"
      class="search-post"
      clearable
    >
      <template #append>
        <el-button
          type="primary"
          :icon="Search"
          @click="queryPostWithKeyword"
        ></el-button>
      </template>
    </el-input>

    <el-button type="success" @click="showSubmit">发帖</el-button>
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="posts">
          <Post
            v-for="post in postList"
            :senderId="post.senderId"
            :sendTime="post.sendTime"
            :likeNum="post.likeNum"
            :favourNum="post.favourNum"
            :content="post.content"
            :isFavour="post.isFavour"
          />
        </div>
      </el-col>
    </el-row>
  </ul>

  <el-dialog
    v-model="isVisible"
    title="发帖页"
    center
    :lock-scroll="false"
    :close-on-click-modal="false"
    class="post-details-dialog"
  >
    <SubmitPost></SubmitPost>
  </el-dialog>

  <el-dialog
    v-model="isVisible2"
    title="帖子详情"
    center
    :lock-scroll="false"
    :close-on-click-modal="false"
    class="post-details-dialog"
  >
    <div class="dialog-content">
      <PostDetail :postDetail="postDetailContent"></PostDetail>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import SubmitPost from "./SubmitPost.vue";
import PostDetail from "./PostDetail.vue";
import Post from "./Post.vue";
import { Close, Search } from "@element-plus/icons-vue";
import { queryPostRequest, queryPostWithKeywordRequest } from "@/types/type";
import { axiosPostApi } from "@/api/api";
import { userStore } from "@/store/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  setup() {
    const testPost1 = {
      postId: 1, //帖子id
      senderId: 202328018629005, //发送人学号
      sendTime: 1719036863, //发送时间,unix时间戳格式
      likeNum: 5, //点赞量
      favourNum: 10, //收藏量
      content: "测试内容1", //帖子内容
      quoteId: -1, //引用的帖子Id -1
      isFavour: "true",
    };
    const testPost2 = {
      postId: 2, //帖子id
      senderId: 202328018629006, //发送人学号
      sendTime: 1719036863, //发送时间,unix时间戳格式
      likeNum: 1, //点赞量
      favourNum: 2, //收藏量
      content: "测试内容2", //帖子内容
      quoteId: -1, //引用的帖子Id -1
      isFavour: "false",
    };

    onMounted(() => {
      let testPostList = [testPost1, testPost2];
      postList.value = testPostList;
    });
    const startIndex = ref(1);
    const postNum = ref(10);
    const postList = ref([]);
    const isVisible = ref(false);
    const isVisible2 = ref(false);
    const postDetailContent = ref(null);
    const keyword = ref("");
    let searchFlag = 0;

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

    function showDetail(post) {
      isVisible2.value = true;
      postDetailContent.value = post;
    }

    const load = () => {
      postList.value.push(testPost1);
      postList.value.push(testPost2);
      console.log(postList.value);
      // console.log('reach bottom')
      // if(searchFlag == 0) {
      //   queryPosts()
      // }else{
      //   queryPostWithKeyword()
      // }
    };

    return {
      postList,
      load,
      showSubmit,
      showDetail,
      isVisible,
      isVisible2,
      keyword,
      postDetailContent,
      queryPostWithKeyword,
      Close,
      Search,
    };
  },
  components: {
    PostDetail,
    Post,
    FontAwesomeIcon,
  },
});
</script>

<style lang="less" scoped>
.infinite-list {
  overflow: auto;
  height: calc(100vh - 84px);
  padding: 0px;
  margin: 0px;
  --el-main-padding: 0px;
}

.posts {
  width: 100%;
  background-color: white;
  padding: 12px 20px;
  border-radius: 12px;
  text-align: left;
}

.post-details-dialog {
  /* 模态框的宽度和高度设置 */
  width: 40%;
  height: 80vh; /* vh 单位：视口高度的百分比 */
  margin: auto; /* 使模态框在视口中水平居中 */
  overflow: auto; /* 如果内容超出，允许垂直滚动 */
  position: relative; /* 相对定位，以便于内部内容可以绝对定位 */
  top: 50%;
  transform: translateY(-50%); /* 垂直居中 */
  background-color: rgba(0, 0, 0, 0.8); /* 背景色变暗 */
  z-index: 1000; /* 确保模态框在最上层 */
}

.dialog-content {
  /* 根据需要设置内部内容的样式 */
  max-height: 100%; /* 内容的最大高度为模态框的高度 */
  overflow: auto; /* 如果内容超出，允许滚动 */
}

.dialog-footer .el-icon + .el-icon {
  margin-left: 10px;
}
</style>

<template>
  <ul
    v-infinite-scroll="load"
    :infinite-scroll-distance="10"
    class="infinite-list"
  >
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
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import SubmitPost from "./SubmitPost.vue";
import PostDetail from "./PostDetail.vue";
import Post from "./Post.vue";

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
    const postList = ref([]);

    onMounted(() => {
      let testPostList = [testPost1, testPost2];
      postList.value = testPostList;
    });

    const load = () => {
      postList.value.push(testPost1);
      postList.value.push(testPost2);
      console.log(postList.value);
    };

    return {
      postList,
      load,
    };
  },
  components: {
    SubmitPost,
    PostDetail,
    Post,
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
</style>

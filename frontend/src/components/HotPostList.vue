<template>
  <ul class="infinite-list">
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="posts">
          <Post v-for="post in postList" :postId="post.postId" :senderId="post.senderId" :sendTime="post.sendTime"
            :likeNum="post.likeNum" :favourNum="post.favourNum" :content="post.content" :isFavour="post.isFavour"
            :commentList="post.commentList" :senderAvatar="post.senderAvatar" :imageUrlList="post.imageUrlList" />
        </div>
      </el-col>
    </el-row>
  </ul>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";
import SubmitPost from "./SubmitPost.vue";
import Post from "./Post.vue";
import { Close, Plus, Search } from "@element-plus/icons-vue";
import { queryHotListRequest } from "@/types/type";
import { axiosPostApi } from "@/api/api";
import { userStore } from "@/store/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default defineComponent({
  setup() {
    const startIndex = ref(1);
    const postNum = ref(10);
    const postList = ref([]);
    const keyword = ref("");
    const affixOffset = ref(window.innerHeight * 0.84);
    let searchFlag = 0;
    const scrollPosition = ref(0);
    const scrollContainer = ref(null);

    onMounted(() => {
      searchFlag = 0;
      startIndex.value = 1;
      postList.value = [];
      load();
    });

    const load = () => {
      const queryHotListParam: queryHotListRequest = {
        student_number: userStore().userId,
        duration: "month",
        type: "like_num",
      };
      axiosPostApi(queryHotListParam, "/treehole/queryHotPost")
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
    };

    return {
      postList,
      load,
      keyword,
      affixOffset,
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
  margin: 12px 20px 20px 20px;
  padding: 12px 20px 20px 20px;
  border-radius: 12px;
  text-align: left;
}
</style>

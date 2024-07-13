<template>
  <div class="post">
    <el-row @click="showDetail">
      <el-col :span="2">
        <el-avatar :src="updateUrl(postAvatarUrl)" />
      </el-col>
      <el-col :span="8" style="font-size: 16px">
        <div>{{ senderId }}</div>
        <div style="color: #bbbbbb">{{ unixTimeToString(sendTime) }}</div>
      </el-col>
    </el-row>
    <div class="content" @click="showDetail">
      {{ content }}
    </div>
    <el-row style="font-size: 16px; color: #bbbbbb">
      <el-col
        :span="2"
        :style="{
          color:
            isFavour == 'both' || isFavour == 'like'
              ? 'var(--el-color-primary)'
              : '',
        }"
        @click="likeAndFavor('like')"
      >
        <font-awesome-icon
          :icon="
            isFavour == 'both' || isFavour == 'like'
              ? ['fas', 'thumbs-up']
              : ['far', 'thumbs-up']
          "
        />
        &nbsp;{{ likeNum }}
      </el-col>
      <el-col
        :span="2"
        :style="{
          color:
            isFavour == 'both' || isFavour == 'favor'
              ? 'var(--el-color-primary)'
              : '',
        }"
        @click="likeAndFavor('favor')"
      >
        <font-awesome-icon
          :icon="
            isFavour == 'both' || isFavour == 'favor'
              ? ['fas', 'star']
              : ['far', 'star']
          "
        />
        &nbsp;{{ favourNum }}
      </el-col>
      <el-col :span="2" @click="showDetail">
        <font-awesome-icon :icon="['far', 'comment-dots']" />&nbsp;{{
          commentList.length
        }}
      </el-col>
      <el-col :span="18" @click="showDetail" />
    </el-row>
  </div>

  <el-dialog
    v-model="isDetailVisible"
    title="帖子详情"
    center
    :lock-scroll="false"
    :close-on-click-modal="false"
    class="post-details-dialog"
  >
    <div class="dialog-content">
      <PostDetail :postDetail="detail"></PostDetail>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { queryStudentInfoRequest, favoritePostRequest } from "@/types/type";
import { axiosPostApi } from "@/api/api";
import { userStore } from "@/store/store";
import PostDetail from "./PostDetail.vue";

function updateUrl(url: string) {
  if (url.includes("/")) {
    const index = url.indexOf("/");
    return "http://localhost:8081" + url.substring(index);
  } else {
    return url;
  }
}

export default {
  props: {
    postId: Number,
    senderId: String,
    sendTime: Number,
    likeNum: Number,
    favourNum: Number,
    content: String,
    isFavour: String,
    commentList: Array,
  },
  setup(props) {
    const postAvatarUrl = ref("");
    const postDetailContent = ref(null);
    const isDetailVisible = ref(false);
    const favour = ref("");
    const detail = ref();
    const urls = ref([]);

    onMounted(() => {
      favour.value = props.isFavour;
      urls.value = new Array(props.commentList.length).fill("");
      queryPostAvatar(props.senderId, props.commentList);
    });

    watchEffect(() => {
      for (let i = 0; i < props.commentList.length; ++i) {
        props.commentList[i]["senderAvatar"] = urls.value[i];
      }
      detail.value = {
        postId: props.postId,
        senderId: props.senderId,
        sendTime: props.sendTime,
        likeNum: props.likeNum,
        favourNum: props.favourNum,
        content: props.content,
        isFavour: props.isFavour,
        commentList: props.commentList,
        senderAvatar: postAvatarUrl.value,
      };
    });

    function queryPostAvatar(senderId, comments) {
      const queryPostParam: queryStudentInfoRequest = {
        student_number: senderId,
      };
      axiosPostApi(queryPostParam, "user/queryStudentInfo")
        .then((response) => {
          postAvatarUrl.value = response.avatarURL;
        })
        .catch((error) => {
          console.error(error);
          postAvatarUrl.value = "";
        });
      for (let i = 0; i < comments.length; ++i) {
        const queryPostParam: queryStudentInfoRequest = {
          student_number: comments[i].senderId,
        };
        axiosPostApi(queryPostParam, "user/queryStudentInfo")
          .then((response) => {
            urls.value.splice(i, 1, response.avatarURL);
          })
          .catch((error) => {
            console.error(error);
            urls.value[i] = "";
          });
      }
    }

    function likeAndFavor(type) {
      const favoritePostRequestParam: favoritePostRequest = {
        student_number: userStore().userId,
        postId: String(props.postId),
        type: type,
      };
      if (
        (type == "like" &&
          (favour.value == "none" || favour.value == "favor")) ||
        (type == "favor" && (favour.value == "none" || favour.value == "like"))
      ) {
        axiosPostApi(favoritePostRequestParam, "treehole/favoritePost")
          .then((response) => {
            if (response.respMessage == "success") {
              if (favour.value == "none") {
                favour.value = type;
              } else {
                favour.value = "both";
              }
            }
            console.log(favour.value);
          })
          .catch((error) => {
            console.error(error);
          });
      } else if (
        (type == "like" &&
          (favour.value == "both" || favour.value == "like")) ||
        (type == "favor" && (favour.value == "both" || favour.value == "favor"))
      ) {
        axiosPostApi(favoritePostRequestParam, "treehole/cancelFavoritePost")
          .then((response) => {
            if (response.respMessage == "success") {
              if (favour.value == "both") {
                if (type == "favor") {
                  favour.value = "like";
                } else {
                  favour.value = "favor";
                }
              } else {
                favour.value = "none";
              }
            }
            console.log(favour.value);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }

    function unixTimeToString(timestamp) {
      timestamp = timestamp + "000";
      var date = new Date(parseInt(timestamp));
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }

    function showDetail(post) {
      isDetailVisible.value = true;
      postDetailContent.value = post;
    }

    return {
      senderId: props.senderId,
      sendTime: props.sendTime,
      likeNum: props.likeNum,
      favourNum: props.favourNum,
      content: props.content,
      isFavour: favour,
      unixTimeToString,
      postAvatarUrl,
      postDetailContent,
      isDetailVisible,
      showDetail,
      likeAndFavor,
      updateUrl,
      detail,
    };
  },
  components: {
    PostDetail,
  },
};
</script>

<style lang="less" scoped>
.post {
  border-bottom-style: solid;
  border-width: 1px;
  border-color: #f5f5f5;
  margin: 10px 0px;
  padding-bottom: 10px;
}

.content {
  font-size: 18px;
  margin-top: 5px;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.blue {
  color: var(--el-color-primary);
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

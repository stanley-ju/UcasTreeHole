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
      <PostDetail :postDetail="postDetailContent"></PostDetail>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { queryStudentInfoRequest, favoritePostRequest } from "@/types/type";
import { axiosPostApi } from "@/api/api";
import { userStore } from "@/store/store";

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

    onMounted(() => {
      favour.value = props.isFavour;
      queryPostAvatar(props.senderId);
      console.log(postAvatarUrl.value);
    });

    function queryPostAvatar(senderId) {
      const queryPostParam: queryStudentInfoRequest = {
        student_number: senderId,
      };
      axiosPostApi(queryPostParam, "user/queryStudentInfo")
        .then((response) => {
          postAvatarUrl.value = response.avatarURL;
        })
        .catch((error) => {
          console.error(error);
        });
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
    };
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
</style>

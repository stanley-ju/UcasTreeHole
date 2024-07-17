<template>
  <div class="post">
    <el-row @click="showDetail">
      <el-col :span="2">
        <el-avatar :src="updateUrl(senderAvatar)" />
      </el-col>
      <el-col :span="8" style="font-size: 16px">
        <div>{{ senderId }}</div>
        <div style="color: #bbbbbb">{{ unixTimeToString(sendTime) }}</div>
      </el-col>
    </el-row>
    <div class="content" @click="showDetail">
      {{ content }}
    </div>
    <div v-if="imageUrls.length == 1">
      <el-image :src="imageUrls[0]" fit="cover" class="image" />
    </div>
    <div v-else-if="imageUrls.length > 1">
      <div v-for="imageUrl in imageUrls" style="display: inline-block">
        <el-image class="images" :src="imageUrl" fit="cover" />
      </div>
    </div>

    <el-row style="font-size: 16px; color: #bbbbbb">
      <el-col :span="2" :style="{
        color:
          isFavour == 'both' || isFavour == 'like'
            ? 'var(--el-color-primary)'
            : '',
      }" @click="showDetail">
        <font-awesome-icon :icon="isFavour == 'both' || isFavour == 'like'
          ? ['fas', 'thumbs-up']
          : ['far', 'thumbs-up']
          " />
        &nbsp;{{ likeNum }}
      </el-col>
      <el-col :span="2" :style="{
        color:
          isFavour == 'both' || isFavour == 'favor'
            ? 'var(--el-color-primary)'
            : '',
      }" @click="showDetail">
        <font-awesome-icon :icon="isFavour == 'both' || isFavour == 'favor'
          ? ['fas', 'star']
          : ['far', 'star']
          " />
        &nbsp;{{ favourNum }}
      </el-col>
      <el-col :span="2" @click="showDetail">
        <font-awesome-icon :icon="['far', 'comment-dots']" />&nbsp;{{
          commentList.length
        }}
      </el-col>
      <el-col :span="1" @click="showDetail" />
      <el-col span="2" @click="deletePost" v-if="canDelete">
        <div style="color: var(--el-color-primary);">
          删除
        </div>
      </el-col>
      <el-col :span="15" @click="showDetail" />

    </el-row>
  </div>

  <el-dialog v-model="isDetailVisible" title="帖子详情" center :lock-scroll="false" :close-on-click-modal="false"
    class="post-details-dialog">
    <div class="dialog-content">
      <PostDetail :postDetail="detail"></PostDetail>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { favoritePostRequest, deleteUserPostRequest } from "@/types/type";
import { axiosPostApi } from "@/api/api";
import { userStore } from "@/store/store";
import PostDetail from "./PostDetail.vue";
import { updateUrl } from "@/utils/utils";

export default {
  emits: ["dialog-closed"],
  props: {
    postId: Number,
    senderId: String,
    sendTime: Number,
    likeNum: Number,
    favourNum: Number,
    content: String,
    isFavour: String,
    senderAvatar: String,
    commentList: Array,
    imageUrlList: String,
    canDelete: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    const postAvatarUrl = ref("");
    const postDetailContent = ref(null);
    const isDetailVisible = ref(false);
    const favour = ref("");
    const detail = ref();
    const imageUrls = ref([]);

    onMounted(() => {
      favour.value = props.isFavour;
    });

    watchEffect(() => {
      imageUrls.value = props.imageUrlList
        .split(";")
        .filter((part) => part !== "");
      detail.value = {
        postId: props.postId,
        senderId: props.senderId,
        sendTime: props.sendTime,
        likeNum: props.likeNum,
        favourNum: props.favourNum,
        content: props.content,
        isFavour: props.isFavour,
        commentList: props.commentList,
        senderAvatar: props.senderAvatar,
        imageUrlList: props.imageUrlList,
      };
    });

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

    function deletePost() {
      const deletePostParam: deleteUserPostRequest = {
        student_number: props.senderId,
        postId: props.postId.toString()
      }
      axiosPostApi(deletePostParam, '/treehole/deleteUserPost').then(response => {
        location.reload();
      }).catch(error => {
        window.alert("删帖失败")
        console.error(error)
      })
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
      deletePost,
      imageUrls,
    };
  },
  components: {
    PostDetail,
  },
};
</script>

<style lang="less" scoped>
.post {
  background-color: rgb(243, 255, 254);
  margin: 10px 20px 20px 20px;
  padding: 20px;
  border-radius: 8px;
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
  white-space: pre-line;
}

.image {
  width: 284px;
  height: auto;
  max-height: 402px;
  border-radius: 8px;
}

.images {
  width: 138px;
  height: 138px;
  margin-right: 8px;
  border-radius: 8px;
}

.blue {
  color: var(--el-color-primary);
}

.post-details-dialog {
  /* 模态框的宽度和高度设置 */
  width: 40%;
  height: 80vh;
  /* vh 单位：视口高度的百分比 */
  margin: auto;
  /* 使模态框在视口中水平居中 */
  overflow: auto;
  /* 如果内容超出，允许垂直滚动 */
  position: relative;
  /* 相对定位，以便于内部内容可以绝对定位 */
  top: 50%;
  transform: translateY(-50%);
  /* 垂直居中 */
  background-color: rgba(0, 0, 0, 0.8);
  /* 背景色变暗 */
  z-index: 1000;
  /* 确保模态框在最上层 */
}

.dialog-content {
  /* 根据需要设置内部内容的样式 */
  max-height: 100%;
  /* 内容的最大高度为模态框的高度 */
  overflow: auto;
  /* 如果内容超出，允许滚动 */
}

.dialog-footer .el-icon+.el-icon {
  margin-left: 10px;
}
</style>

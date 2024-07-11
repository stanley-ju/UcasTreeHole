<template>
  <div class="forum-post-detail">
    <div class="post-header">
      <div class="post-sender">
        <span class="post-sender-id"><strong>{{ postDetail.senderId }}</strong></span>
      </div>
      <div class="post-info">
        <div class="post-time">{{ formattedPostTime(postDetail.sendTime) }}</div>
      </div>
    </div>
    <div class="post-content">
      <p class="post-text">{{ postDetail.content }}</p>
      <div class="image-gallery">
        <el-image
          v-for="(image, index) in imageUrlArray"
          :key="index"
          :src="image"
          alt="Post Image"
          class="thumbnail"
          fit="cover"
          :preview-teleported="true"
          :preview-src-list="imageUrlArray"
          :initial-index="viewerIndex"
          @click="handleImageClick(index)"
        />
      </div>
    </div>
    <div class="post-actions">
      <button @click="toggleLike" class="thumb-icon">
        👍 {{ postDetail.likeNum }}
      </button>
      <button @click="toggleFavor" class="star-icon">
        ⭐ {{ postDetail.favourNum }}
      </button>
      <button @click="scrollToCommentInput" class="comment-icon">
        💬 {{ postDetail.commentList.length }}
      </button>
    </div>
    <div class="comment-form-container" ref="commentForm">
      <div class="comment-form">
        <el-input
          v-model="content"
          placeholder="在这里输入你的评论吧！"
          class="comment-input"
          clearable
        >
        </el-input>
        <button @click="submitComment(postDetail.senderId, postDetail.postId)" class="submit-button" :disabled="!content">评论</button>
      </div>
    </div>
    <div class="post-comments">
      <h3>评论区</h3>
      <el-card v-for="comment in postDetail.commentList" :key="comment.commentId" class="comment-card">
        <div class="comment-header">
          <strong class="comment-sender">{{ comment.senderId }}</strong>
          <span class="comment-time">{{ formattedPostTime(comment.sendTime) }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import { favoritePostRequest, querySinglePostRequest, submitCommentRequest } from "@/types/type";
import { axiosPostApi } from "@/api/api";
import { userStore } from '@/store/store';
import { ElImageViewer } from 'element-plus';

export default defineComponent({
  props: {
    postDetail: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const content = ref("")
    const postDetail = ref(props.postDetail)
    const commentForm = ref(null);
    const viewerVisible = ref(false);
    const viewerIndex = ref(0);
    const avatarUrl = localStorage.getItem('avatarUrl');

    const imageUrlArray = computed(() => {
      return postDetail.value.imageUrlList 
        ? postDetail.value.imageUrlList.split(';').filter(url => url) 
        : [];
    });

    watch(() => props.postDetail, (newVal) => {
      postDetail.value = { ...newVal };
    });

    const toggleLike = () => {
      if (postDetail.value.isFavour === 'like' || postDetail.value.isFavour === 'both') {
        setFavoritePost(userStore().userId, postDetail.value.postId, "like", 0)
      } else {
        setFavoritePost(userStore().userId, postDetail.value.postId, "like", 1)
      }
    };

    const scrollToCommentInput = () => {
      commentForm.value.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleFavor = () => {
      if (postDetail.value.isFavour === 'favor' || postDetail.value.isFavour === 'both') {
        setFavoritePost(userStore().userId, postDetail.value.postId, "favor", 0)
      } else {
        setFavoritePost(userStore().userId, postDetail.value.postId, "favor", 1)
      }
    };

    function querySinglePost(studentNumber: string, postId: string) {
      const querySinglePostParam: querySinglePostRequest = {
        student_number: studentNumber,
        postId: postId
      }
      axiosPostApi(querySinglePostParam, '/treehole/querySinglePost').then(response => {
        postDetail.value = response.singlePost
      }).catch(error => {
        console.error(error)
      })
    }

    function setFavoritePost(studentNumber: string, postId: string, favorType: string, flag: number) {
      const favoritePostParam: favoritePostRequest = {
        student_number: studentNumber,
        postId: postId,
        type: favorType,
      }
      const url = flag === 0 ? '/treehole/cancelFavoritePost' : '/treehole/favoritePost';
      axiosPostApi(favoritePostParam, url).then(response => {
        querySinglePost(studentNumber, postId)
      }).catch(error => {
        console.error(error)
      })
    }

    function submitComment(studentNumber: string, postId: string) {
      if (!content.value) return; // 判定评论输入是否为空
      const submitCommentParam: submitCommentRequest = {
        student_number: studentNumber,
        postId: postId,
        content: content.value,
        replyId: "-1"
      }
      axiosPostApi(submitCommentParam, '/treehole/commentPost').then(response => {
        querySinglePost(studentNumber, postId)
        content.value = ""
      }).catch(error => {
        console.error(error)
      })
    }

    const formattedPostTime = (timestamp) => {
      let date = new Date(timestamp * 1000);
      return date.toLocaleString();
    };

    const handleImageClick = (index) => {
      viewerIndex.value = index;
      viewerVisible.value = true;
    };

    return {
      content,
      submitComment,
      formattedPostTime,
      toggleLike,
      toggleFavor,
      postDetail,
      commentForm,
      scrollToCommentInput,
      imageUrlArray,
      viewerVisible,
      viewerIndex,
      handleImageClick,
    }
  }
})
</script>

<style lang="less" scoped>
.forum-post-detail {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid #e0e0e0;

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
    margin-bottom: 20px;

    .post-sender {
      font-size: 1.6em;
      font-weight: bold;
      color: #333;
    }

    .post-time {
      color: #888;
      font-size: 0.9em;
    }
  }

  .post-content {
    font-size: 1.2em;
    line-height: 1.6;
    color: #333;
    margin-bottom: 20px;

    .image-gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      .thumbnail {
        width: 200px;
        height: 200px;
        border-radius: 5px;
        cursor: pointer;
        object-fit: cover;
        transition: transform 0.3s;
        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }

  .post-actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    button {
      background-color: #5fc831;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.3s;

      &:hover {
        background-color: #4e8a2b;
      }
    }

    .thumb-icon, .star-icon, .comment-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
  }

  .comment-form-container {
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;

    .comment-form {
      text-align: center;

      .comment-input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
        resize: none;
      }

      .submit-button {
        background-color: #5fc831;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s;

        &:hover {
          background-color: #4e8a2b;
        }

        &:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      }
    }
  }

  .post-comments {
    .comment-card {
      margin-bottom: 10px;
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 15px;
      background-color: #fff;

      .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .comment-sender {
          font-weight: bold;
          color: #333;
        }

        .comment-time {
          color: #888;
          font-size: 0.9em;
        }
      }

      .comment-content {
        font-size: 1em;
        color: #555;
      }
    }
  }
}
</style>

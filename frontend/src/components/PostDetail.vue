<template>
  <div>
    <span>{{ postDetail }}</span>
  </div>
</template>


<script lang="ts">
import {defineComponent,ref} from 'vue';
import {favoritePostRequest, querySinglePostRequest, submitCommentRequest} from "@/types/type";
import {axiosPostApi} from "@/api/api";

export default defineComponent({
  props: {
    postDetail: {
      type: Object,
      required: true,
    }
  },
  setup() {
    //测试用变量
    const content = ref("")
    const url = ref("")

    //查询单个post，在收藏或评论后调用重新渲染内容
    const postDetail = ref("")
    function querySinglePost(studentNumber: string, postId: string) {
      const querySinglePostParam : querySinglePostRequest = {
        student_number: studentNumber,
        postId:  postId
      }
      axiosPostApi(querySinglePostParam,'/treehole/querySinglePost').then(response => {
        postDetail.value = response.singlePost
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    }

    //收藏/点赞/取消点赞收藏帖子 通过favor type表示收藏或点赞，favor表示收藏，like表示点赞，flag为0为取消，为1则正常
    function setFavoritePost(studentNumber: string, postId: string, favorType: string, flag: number) {
      const favoritePostParam : favoritePostRequest = {
        student_number: studentNumber,
        postId: postId,
        type: favorType,
      }
      var url : string
      if (flag === 0){
        url = '/treehole/cancelFavoritePost'
      }else if(flag === 1){
        url = '/treehole/favoritePost'
      }
      axiosPostApi(favoritePostParam, url).then(response => {
        console.log(response)
        querySinglePost(studentNumber,postId)
        //更新响应式变量的值
      }).catch(error => {
        console.error(error)
      })
    }

    function submitComment(studentNumber: string, postId: string, content: string) {
      const submitCommentParam : submitCommentRequest = {
        student_number: studentNumber,
        postId: postId,
        content: content,
        replyId : "-1"
      }
      axiosPostApi(submitCommentParam,'/treehole/commentPost').then(response => {
        console.log(response)
        querySinglePost(studentNumber,postId)
        //更新响应式变量的值
      }).catch(error => {
        console.error(error)
      })
    }

    return {
      content,
      setFavoritePost,
      submitComment,
      url,
    }
  }
})
</script>

<style lang="less" scoped>

</style>
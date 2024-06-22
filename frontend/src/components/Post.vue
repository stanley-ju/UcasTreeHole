<template>
  <div class="post">
    <el-row>
      <el-col :span="2">
        <el-avatar />
      </el-col>
      <el-col :span="8" style="font-size: 16px">
        <div>用户名</div>
        <div>发帖时间</div>
      </el-col>
    </el-row>
    <div class="content">
      {{ content }}
    </div>
    <el-row style="font-size: 16px">
      <el-col :span="2">
        <el-icon><Select /></el-icon>&nbsp;{{ likeNum }}
      </el-col>
      <el-col :span="2">
        <el-icon><Star /></el-icon>&nbsp;{{ favourNum }}
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    senderId: Number,
    sendTime: Number,
    likeNum: Number,
    favourNum: Number,
    content: String,
    isFavour: Boolean,
  },
  setup(props) {
    // setup() 接收 props 作为第一个参数
    console.log(props.content);
    return {
      senderId: props.senderId,
      sendTime: props.sendTime,
      likeNum: props.likeNum,
      favourNum: props.favourNum,
      content: props.content,
      isFavour: props.isFavour,
    };
  },
};
</script>

<style lang="less" scoped>
.post {
  border-top-style: solid;
  border-width: 1px;
  border-color: #f5f5f5;
  margin: 10px 0px;
  padding-top: 10px;
}
.content {
  font-size: 18px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>

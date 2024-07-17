<template>
  <el-container>
    <el-header height="48px" class="header">
      <el-row>
        <el-col :span="2" :offset="2">
          <!-- <img-->
          <!--            src="https://static.nowcoder.com/fe/file/logo/1.png"-->
          <!--            alt="logo"-->
          <!--            class="icon"-->
          <!--          /> -->

        </el-col>
        <el-col :span="16">
          <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect"
            style="border-bottom: none; height: 48px">
            <el-menu-item index="1">主页</el-menu-item>
            <el-menu-item index="2">热榜</el-menu-item>
            <el-menu-item index="3">收藏夹</el-menu-item>
            <el-menu-item index="4" style="margin-right: 10%">个人主页</el-menu-item>
            <img src='../../../public/logo.png' alt="logo" class="icon" style="height: 48px; padding-top: 0px;" />
          </el-menu>
        </el-col>
        <el-col :span="2" style="padding-top: 4px">
          <el-avatar :src="avatarUrL" style="float: right; margin-right: 15%" />
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main">
      <MainPostList v-if="curIndex === '1'" />
      <HotPostList v-if="curIndex === '2'" />
      <FavorPostList v-if="curIndex === '3'" />
      <StudentInfo v-if="curIndex === '4'" />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, computed } from "vue";
import StudentInfo from "../../components/StudentInfo.vue";
import MainPostList from "../../components/MainPostList.vue";
import HotPostList from "../../components/HotPostList.vue";
import FavorPostList from "../../components/FavorPostList.vue";

export default defineComponent({
  setup() {
    const activeIndex = ref("1");
    const curIndex = ref("1");
    const avatarUrL = computed(() => localStorage.getItem("avatarUrl"));
    const MainPostListRef = ref(null);
    const keyword = ref("");

    const handleSelect = (key) => {
      curIndex.value = String(key);
    };
    return {
      MainPostListRef,
      handleSelect,
      keyword,
      activeIndex,
      avatarUrL,
      curIndex,
    };
  },
  components: {
    StudentInfo,
    MainPostList,
    HotPostList,
    FavorPostList,
  },
});
</script>

<style lang="less" scoped>
.header {
  padding: 0;
  box-shadow: 0 0 0 0 transparent, 0 0 0 0 transparent,
    0 1px 4px 0 rgba(0, 0, 0, 0.02), 0 2px 12px 0 rgba(0, 0, 0, 0.04),
    0 2px 6px 0 rgba(0, 0, 0, 0.02);
  z-index: 999;
}

.main {
  background: linear-gradient(var(--el-color-primary-light-9), #f8f8f8);
  background-repeat: no-repeat;
  --el-main-padding: 0px;
}

.icon {
  height: 24px;
  float: left;
  bottom: 0px;
  padding-top: 10px;
}
</style>

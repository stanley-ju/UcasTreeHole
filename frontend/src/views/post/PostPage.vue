<template>
  <el-container>
    <el-header height="48px">
      <el-row>
        <el-col :span="2" :offset="2">
          <img
            src="https://static.nowcoder.com/fe/file/logo/1.png"
            alt="logo"
            class="icon"
          />
        </el-col>
        <el-col :span="8">
          <el-menu
            :default-active="activeIndex"
            mode="horizontal"
            @select="handleSelect"
            style="border-bottom: none; height: 48px"
          >
            <el-menu-item index="1">主页</el-menu-item>
            <el-menu-item index="2">热榜</el-menu-item>
            <el-menu-item index="3">收藏夹</el-menu-item>
            <el-menu-item index="4">个人主页</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="2" :offset="6">
          <el-avatar :src="avatarUrL" style="float: right" />
        </el-col>
      </el-row>
    </el-header>
    <el-main
      style="background-color: #f5f5f5; --el-main-padding: 20px 0px 0px 0px"
    >
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
import { Search } from "@element-plus/icons-vue";

export default defineComponent({
  setup() {
    const activeIndex = ref("1");
    const curIndex = ref("1");
    const avatarUrL = computed(() => localStorage.getItem("avatarUrl"));
    const MainPostListRef = ref(null);
    const keyword = ref("");

    onMounted(() => {
      console.log(1);
    });
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
.icon {
  height: 24px;
  float: left;
  bottom: 0px;
  padding-top: 10px;
}
</style>

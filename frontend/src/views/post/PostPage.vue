<!--<template>-->
<!--    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" -->
<!--        background-color="#545c64"-->
<!--        text-color="#fff"-->
<!--        active-text-color="#ffd04b">-->
<!--        <el-menu-item index="1">主页</el-menu-item>-->
<!--        <el-menu-item index="2">热榜</el-menu-item>-->
<!--        <el-menu-item index="3">收藏夹</el-menu-item>-->
<!--        <el-menu-item index="4">个人主页</el-menu-item>-->
<!--        <el-avatar :src="avatarUrL"/>-->
<!--    </el-menu>-->
<!--    <MainPostList ref="MainPostListRef" v-if="curIndex === '1'"/>-->
<!--    <HotPostList v-if="curIndex === '2'"/>-->
<!--    <FavorPostList v-if="curIndex === '3'"/>-->
<!--    <StudentInfo v-if="curIndex === '4'"/>-->
<!--</template>-->
<template>
  <el-container>
    <el-header height="48px">
      <el-row>
        <el-col :span="2">
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
        <el-col :span="3" :offset="9">
          <el-menu
              mode="horizontal"
              style="border-bottom: none; height: 48px"
              ellipsis="false"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-avatar :src="avatarUrL" style="float: right" />
              </template>
              <el-menu-item index="2-1">主页</el-menu-item>
              <el-menu-item index="2-2">退出</el-menu-item>
            </el-sub-menu>
          </el-menu>
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
import { ref,defineComponent,onMounted,computed} from 'vue'
import StudentInfo from '../../components/StudentInfo.vue';
import MainPostList from '../../components/MainPostList.vue';
import HotPostList from '../../components/HotPostList.vue';
import FavorPostList from '../../components/FavorPostList.vue';

export default defineComponent({
  setup(){
    const activeIndex = ref('1')
    const curIndex = ref('1')
    const avatarUrL = computed(()=>localStorage.getItem("avatarUrl"))
    const MainPostListRef = ref(null)
    const keyword = ref('')

    onMounted(()=>{
        console.log(1)
    })
    const handleSelect = (key) => {
      if (curIndex.value === key && curIndex.value) {
        curIndex.value = null
        setTimeout(()=>{
          curIndex.value = key
        },0)
      }else {
        curIndex.value = String(key)
      }
    }

    return {
      MainPostListRef,
      handleSelect,
      keyword,
      activeIndex,
      avatarUrL,
      curIndex
    }
  },
  components: {
    StudentInfo,
    MainPostList,
    HotPostList,
    FavorPostList,
  }
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
<template>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" 
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">主页</el-menu-item>
        <el-menu-item index="2">热榜</el-menu-item>
        <el-menu-item index="3">收藏夹</el-menu-item>
        <el-menu-item index="4">个人主页</el-menu-item>
        <el-avatar :src="avatarUrL"/>
    </el-menu>
    <MainPostList v-if="curIndex === '1'"/>
    <HotPostList v-if="curIndex === '2'"/>
    <FavorPostList v-if="curIndex === '3'"/>
    <StudentInfo v-if="curIndex === '4'"/>
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
    
    onMounted(()=>{
        console.log(1)
    })
    const handleSelect = (key) => {
        curIndex.value = String(key)
    }
    return {
        handleSelect,
        activeIndex,
        avatarUrL,
        curIndex
    }
  },
  components: {
    StudentInfo,
    MainPostList,
    HotPostList,
    FavorPostList
  }
});
</script>

<style lang="less" scoped>

</style>
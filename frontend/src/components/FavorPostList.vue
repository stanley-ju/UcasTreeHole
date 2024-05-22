<template>
  <div>收藏的帖子列表</div>
</template>


<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  setup() {
    function quitLogin() {
      localStorage.removeItem("token")
      window.location.reload()
    }

    return {
      quitLogin
    }
  }
})
</script>

<style lang="less" scoped>

</style>
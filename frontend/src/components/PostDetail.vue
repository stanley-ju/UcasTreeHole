<template>
  <div>
    <slot name="content" />
  </div>
  <div>
    <slot name="img" />
  </div>
</template>


<script lang="ts">
import {defineComponent,ref} from 'vue';

export default defineComponent({
  setup() {
    const content = ref("")
    const url = ref("")

    function quitLogin() {
      localStorage.removeItem("token")
      window.location.reload()
    }

    return {
      quitLogin,
      content,
      url,
    }
  }
})
</script>

<style lang="less" scoped>

</style>
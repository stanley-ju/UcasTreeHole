<template>
    <nav>this is main page</nav>
    <div>{{ msg }}</div>
</template>

<script>
import { ref,defineComponent } from 'vue'
export default defineComponent({
  setup(){
    const msg = ref('')
    msg.value = localStorage.getItem('avatarUrl')
    return {
        msg
    }
  }
});
</script>

<style lang="less" scoped>

</style>
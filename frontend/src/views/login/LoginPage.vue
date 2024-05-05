<template>
  <el-row class="login-page">
    <el-col :span="6" :offset="3" class="form">
      <el-form size="large" autocomplete="off" v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item>
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="Register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登陆相关表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item>
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="Login" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
 

<script lang="ts">
import { ref,defineComponent,reactive,toRefs, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { userLogin, userRegister } from '@/api/loginApi'
import { loginRequest, registerRequest } from '@/types/type';

export default defineComponent({
  setup(){
    const isRegister = ref<boolean>(false)
    const userInfo = reactive({
      username: '',
      password: ''
    })
    const userInfoRefs = toRefs(userInfo)

    function Register(){
      const registerParam : registerRequest = {
        student_number: userInfo.username,
        password: userInfo.password
      }
      userRegister(registerParam).then(response => {
        console.log(response);
      }).catch(error => {
        console.error(error);
        window.alert("账号已存在！")
      })
    }

    function Login(){
      const loginParam : loginRequest = {
        student_number: userInfo.username,
        password: userInfo.password
      }
      userLogin(loginParam).then(response => {
        console.log(response);
      }).catch(error => {
        console.error(error);
        window.alert("用户名或密码错误！")
        userInfo.password = ''
      })
    }

    watch(isRegister,()=>{
      userInfo.username = ''
      userInfo.password = ''
    })

    return {
      isRegister,
      User,
      Lock,
      Register,
      Login,
      ...userInfoRefs
    }
  },
  name: 'LoginPage',
});
</script>
 

<style lang="less" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
<template>
  <el-row class="login-page">
    <el-col :span="6" :offset="3" class="form">
      <el-form ref="registerForm" :rules="rules" :model="userInfo" size="large" autocomplete="off" v-if="isRegister">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="userInfo.password"></el-input>
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
      <el-form ref="loginForm" :rules="rules" :model="userInfo" size="large" autocomplete="off" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            v-model="userInfo.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
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
import { ref, defineComponent, reactive, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { axiosPostApi } from '@/api/api'
import Post from "./Post.vue";
import { loginRequest, registerRequest } from '@/types/type'
import { useRouter } from 'vue-router'
import { userStore } from '@/store/store'
import { updateUrl } from "@/utils/utils";

export default defineComponent({
  setup() {
    const isRegister = ref<boolean>(false)
    const userInfo = reactive({
      username: '',
      password: ''
    })
    const router = useRouter()
    const loginForm = ref(null)
    const registerForm = ref(null)

    const rules = reactive({
      username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }
      ],
    })

    function Register() {
      const registerParam: registerRequest = {
        student_number: userInfo.username,
        password: userInfo.password
      }
      registerForm.value.validate((valid: boolean) => {
        if (valid) {
          axiosPostApi(registerParam, '/user/signup').then(response => {
            localStorage.setItem("avatarUrl", updateUrl(response.avatarURL))
            window.alert("注册成功，请登录")
            window.location.reload()
          }).catch(error => {
            window.alert("注册失败")
            console.error(error)
          })
        }
      })
    }

    function Login() {
      const loginParam: loginRequest = {
        student_number: userInfo.username,
        password: userInfo.password
      }
      loginForm.value.validate((valid: boolean) => {
        if (valid) {
          axiosPostApi(loginParam, '/user/login').then(response => {
            userStore().userId = userInfo.username
            localStorage.setItem("avatarUrl", updateUrl(response.avatarURL))
            localStorage.setItem("token", response.token)
            router.push('/posts')
          }).catch(error => {
            console.log(error)
            userInfo.password = ''
          })
        }
      })
    }

    watch(isRegister, () => {
      userInfo.username = ''
      userInfo.password = ''
    })

    return {
      isRegister,
      User,
      Lock,
      Register,
      Login,
      rules,
      loginForm,
      registerForm,
      userInfo,
    }
  },
  name: 'LoginPage',
});
</script>

<style lang="less" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../../../public/guokeda.jpg') no-repeat center center;
  background-size: cover;

  .form {
    background-color: rgba(255, 255, 255, 0.9);
    /* 半透明背景 */
    padding: 40px 30px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .title {
      margin: 0 auto;
      text-align: center;
      color: #333;
      font-size: 24px;
    }

    .button {
      width: 100%;
      background-color: #409eff;
      border-color: #409eff;
      color: #fff;
      font-size: 16px;

      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 20px;

      .el-link {
        font-size: 14px;
        color: #409eff;

        &:hover {
          color: #66b1ff;
        }
      }
    }

    .el-form-item {
      margin-bottom: 20px;

      .el-input__inner {
        border-radius: 4px;
      }
    }
  }
}
</style>

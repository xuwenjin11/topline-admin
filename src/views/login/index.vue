<template>
    <div class="login-wrap">
        <div class="form-wrap">
        <div class="form-head">
            <img src="./logo_index.png" alt="黑马头条">
        </div>
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item prop="mobile">
            <el-col :span="24">
                <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
            </el-col>
            </el-form-item>
            <el-form-item prop="code">
                 <el-col :span="12"><el-input v-model="form.code" placeholder="请输入验证码"></el-input></el-col>
                 <el-button class="post-btn" @click="handleSendCode" :disabled="!!codeTimer" :loading="codeLoading">{{ codeTimer? `剩余${codeTimerSeconds}秒`: '发送验证码' }}</el-button>
            </el-form-item>
            <el-form-item prop="agree">
             <el-checkbox-group v-model="form.agree" class="radio-checkbox">
                <el-checkbox name="type">
                  <p><span>已我阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span></p>
                </el-checkbox>
             </el-checkbox-group>
             </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleLogin" class="btn-login" :loading="loginLoading">登录</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
// import axios from 'axios'
// 引入极检JavaScript SDK文件，通过window.initgeetest
// import '@/vendor/gt.js'
import { setUser } from '@/utils/auth.js'
import initGeetest from '@/utils/init-geetest.js'
const initCodeTimeSeconds = 60
export default {
  data () {
    return {
      form: { mobile: '', code: '', agree: '' },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /\d{11}/, message: '长度为11位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /\d{6}/, message: '长度为6位', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimerSeconds: initCodeTimeSeconds, // 倒计时事件
      loginLoading: false,
      codeLoading: false
    }
  },
  methods: {
    // 判断表单是否都填入信息
    handleLogin (form) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        // 当表单内容都填写完成实现登录功能
        this.handelCheckbox()
      })
    },
    // 登录功能
    async handelCheckbox () {
      try {
        // 登录前开启按钮开关
        this.loginLoading = true
        // 在try中将可能出错的代码放入这里
        const res = await this.$http({
          method: 'POST',
          url: `/authorizations`,
          data: this.form
        })
        const userInfo = res.data.data
        // console.log(res)
        setUser(userInfo)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        // 出现的错误信息会进入这里
        this.$message.error('登录失败，手机号或密码错误')
      }
      this.loginLoading = false
    },
    handleSendCode () {
      // 验证手机号是否正确
      this.$refs['form'].validateField('mobile', errormessage => {
        if (errormessage.trim().length > 0) {
          return
        }
        this.handleGeetest()
      })
    },
    // 进行极验验证
    async handleGeetest () {
      try {
        this.codeLoading = true
        const { mobile } = this.form
        const res = await this.$http({
          method: 'GET',
          url: `/captchas/${mobile}`
        })
        const { data } = res.data
        const captchaObj = await initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        })
        captchaObj.onReady(() => {
          captchaObj.verify()
          this.codeLoading = false
        }).onSuccess(async () => {
          try {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate
            } = captchaObj.getValidate()
            await this.$http({
              method: 'GET',
              url: `/sms/codes/${mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            })
            this.codeCountDown()
          } catch (err) {
            this.$message.error('获取验证码失败')
            this.codeLoading = false
          }
        })
      } catch (err) {
        this.$message.error('获取验证码失败')
        this.codeLoading = false
      }
    },
    // 倒计时计时器
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimerSeconds--
        if (this.codeTimerSeconds <= 0) {
          window.clearInterval(this.codeTimer)
          this.codeTimerSeconds = initCodeTimeSeconds
          this.codeTimer = null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap{
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    background-image: url('./login_bg.jpg');
    .form-head{
        display: flex;
        justify-content: center;
        align-content: center;
        margin-bottom:10px;
    }
    .form-wrap{
    width: 360px;
    height: 300px;
    padding: 30px;
    margin-top:120px;
    background-color: #fff;
        .btn-login{
            width: 100%;
        }
    }
    .post-btn{
        margin-left:52px;
    }
    a{
      color: #409EFF;
    }
}
</style>

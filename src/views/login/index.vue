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
                 <el-button class="post-btn" @click="handleSendCode" :disabled="!!codeTimer">{{ codeTimer? `剩余${codeTimerSeconds}秒`: '发送验证码' }}</el-button>
            </el-form-item>
            <el-form-item prop="agree">
             <el-checkbox-group v-model="form.agree" class="radio-checkbox">
                <el-checkbox name="type">
                  <p><span>已我阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span></p>
                </el-checkbox>
             </el-checkbox-group>
             </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleLogin" class="btn-login">登录</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
// 引入极检JavaScript SDK文件，通过window.initgeetest
import '@/vendor/gt.js'
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
      codeTimerSeconds: initCodeTimeSeconds // 倒计时事件
    }
  },
  methods: {
    handleLogin (form) {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return
        }
        this.handelCheckbox()
      })
    },
    handelCheckbox () {
      axios({
        method: 'POST',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/authorizations`,
        data: this.form
      }).then(res => {
        const userInfo = res.data.data
        console.log(userInfo)
        window.localStorage.setItem('user_info', JSON.stringify(userInfo))
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      })
        .catch((e) => {
          this.$message.error('登录失败，手机号或密码错误')
        })
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
    handleGeetest () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        }, captchaObj => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(() => {
            captchaObj.verify()
          }).onSuccess(() => {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate
            } = captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              // 发送短信，开始倒计时
              this.codeCountDown()
            })
          }).onError(function () {
            // your code
          })
        })
      })
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
    // width: 100%;
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

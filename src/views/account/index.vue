<template>
    <div>
        <el-card>
            <p>账户信息</p>
        </el-card>
        <el-card>
            <el-row>
            <el-col :span="10">
                <el-form>
                <el-form-item label="媒体名称">
                    <el-input v-model="user.name"></el-input>
                </el-form-item>
                <el-form-item label="媒体简介">
                    <el-input v-model="user.intro"></el-input>
                </el-form-item>
                <el-form-item label="头条号ID">
                    <el-input disabled :value="user.id"></el-input>
                </el-form-item>
                <el-form-item label="绑定手机">
                    <el-input disabled :value="user.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="user.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSever">保存更新</el-button>
                </el-form-item>
                </el-form>
            </el-col>
            <el-col :offset="2" :span="10">
                <p>头像上传</p>
                <el-upload
                class="avatar-uploader"
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/photo"
                :show-file-list="false"
                :http-request="handleUpload"
                >
                <img v-if="user.photo" :src="user.photo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
  created () {
    this.handleLoadUser()
  },
  data () {
    return {
      user: {}
    }
  },
  methods: {
    // 获取用户信息
    async handleLoadUser () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/profile'
        })
        // console.log(data)
        this.user = data
      } catch (err) {
        this.$message.error('获取用户信息失败')
      }
    },
    // 提交用户编辑信息
    async handleSever () {
      try {
        const { name, intro, email } = this.user
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/profile',
          data: {
            name,
            intro,
            email
          }
        })
        this.$message({
          type: 'success',
          message: '修改用户信息成功'
        })
        this.$store.commit('changeUser', data)
        console.log(data)
      } catch (err) {
        console.log(err)
        this.$message.error('修改用户信息失败')
      }
    },
    // 上传头像
    async handleUpload (uploadConfig) {
      try {
        //  axios上传文件
        // 将上传文件添加到FormData中
        const formData = new FormData()
        formData.append('photo', uploadConfig.file)
        const data = await this.$http({
          method: 'PATCH',
          url: '/user/photo',
          data: formData
        })
        this.user.photo = data.photo
        this.$store.commit('changeUser', this.user)
        this.$message({
          type: 'success',
          message: '上传头像成功'
        })
      } catch (err) {
        this.$message.error('头像上传失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

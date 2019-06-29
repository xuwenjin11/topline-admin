<template>
    <div id="app-header">
        <div class="app-top">
            <el-row :gutter="20">
                <el-col :span="10">
                    <i class="el-icon-s-fold el-icon-openoff"></i>
                    <span class="app-title">江苏传智播客教育科技股份有限公司</span>
                </el-col>
                <el-col :span="5" :offset="8">
                        <span class="heard-img">
                            <img :src="userInfo.photo" alt="" width="35px">
                        </span>
                    <el-dropdown trigger="click" >
                        <span class="el-dropdown-link">
                            {{ userInfo.name }}<i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>Git地址</el-dropdown-item>
                            <el-dropdown-item @click.native=handleLogout>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getUser, removeUser } from '@/utils/auth.js'
export default {
  data () {
    return { userInfo: {} }
  },
  created () {
    // 获取本地存储
    this.userInfo = getUser()
    // console.log(this.userInfo)
  },
  methods: {
    // 退出功能
    handleLogout () {
      this.$confirm('是否确定退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeUser()
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
      )
    }
  }
}
</script>

<style lang="less" scoped>
#app-header{
    .app-top{
        .el-icon-openoff{
            font-size: 18px;
        }
        .app-title{
            line-height: 60px;
        }
        .heard-img{
            img{
                margin-top: 10px;
            }
        }
    }
}
</style>

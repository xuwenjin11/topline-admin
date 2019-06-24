<template>
    <div id="app-header">
        <div class="app-top">
            <el-row :gutter="20">
                <el-col :span="10">
                    <span class="app-title">江苏传智播客教育科技股份有限公司</span>
                </el-col>
                <el-col :span="5" :offset="5">
                    <img src="userInfo.photo" alt="" width="35px">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>Git地址</el-dropdown-item>
                            <el-dropdown-item>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return { userInfo: {} }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  }
}
</script>

<style lang="less" scoped>
#app-header{
    .app-top{
        .app-title{
            line-height: 60px;
        }
    }
}
</style>

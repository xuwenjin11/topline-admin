<template>
    <div id="app-aside">
        <div class="big-app">
            <div class="aside-img">
                <img src="../../../assets/logo_admin.png" alt="黑马头条">
            </div>
        </div>
        <div class="aside-wrap">
            <el-row class="tac">
                <el-col>
                    <!-- 根据路由进行跳转需要将路由进行属性绑定，与需要导航的页面进行练习 -->
                    <el-menu
                    default-active="2"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#545c64"
                    text-color="#fff"
                    :router="true"
                    active-text-color="#ffd04b">
                     <el-menu-item index="/">
                        <i class="el-icon-s-home"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>内容管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/publish">发布文章</el-menu-item>
                            <el-menu-item index="/article">内容列表</el-menu-item>
                            <el-menu-item index="/comment">评论列表</el-menu-item>
                            <el-menu-item index="/media">素材管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                     <el-submenu index="3">
                        <template slot="title">
                        <i class="el-icon-s-promotion"></i>
                        <span>粉丝管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="3-1">图文数据</el-menu-item>
                            <el-menu-item index="3-2">粉丝概况</el-menu-item>
                            <el-menu-item index="3-3">粉丝画像</el-menu-item>
                            <el-menu-item index="3-4">粉丝列表</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                     <el-menu-item index="/account">
                        <i class="el-icon-setting"></i>
                        <span slot="title">账户信息</span>
                    </el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="less" scoped>
#app-aside{
    .big-app{
        width: 199px;
        background-color: rgb(46,47,50S);
        .aside-img{
            width: 170px;
            height: 60px;
            text-align: center;
            img{
                width: 120px;
                height: 30px;
                margin:15px;
            }
        }
    }
    .aside-wrap{
        width: 100%;
        .el-submenu__title{
            width: 200px!important;
        }
    }
}
</style>

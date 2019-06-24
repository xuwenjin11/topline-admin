<template>
    <div id="frist">
        <el-container>
          <el-aside width="200px">
            <AppAside/>
          </el-aside>
          <el-container>
            <el-header width="50px">
               <AppHeader/>
            </el-header>
            <el-main>
              <router-view />
            </el-main>
          </el-container>
        </el-container>
    </div>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="less" scoped>
  #frist{
    height: 100%;
  }
  .el-container{
    height: 100%;
  }
  .el-header{
    background-color: #fff;
  }
  .el-aside {
    background-color: rgb(50, 55, 69);
  }
  .el-main {
    background-color: rgb(242, 243, 245);
  }
</style>

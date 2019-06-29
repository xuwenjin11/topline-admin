<template>
    <div id="article-card">
        <div class="a-card">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>卡片名称</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
            </div>
            </el-card>
        </div>
        <!-- <div class="b-card"> -->
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>一共有{{ totalCount }}条数据</span>
                  <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                </div>
                <el-table
                    class="article-list"
                    :data="articles"
                    style="width: 100%"
                    v-loading="pagloading">
                    <el-table-column
                    label="封面"
                    width="180">
                    <template slot-scope="scope">
                      <img width="20" v-for="item in scope.row.cover.images" :key="item" :src="item" >
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="title"
                    label="标题"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    label="状态"
                    width="180">
                    <template slot-scope="scope">
                      <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="pubdate"
                    label="发布时间"
                     width="180">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                     width="180">
                    <el-row>
                    <el-button size="mini" type="warning" plain>修改</el-button>
                    <el-button size="mini" type="danger"  @click="handleDelete" plain>删除</el-button>
                    </el-row>
                    </el-table-column>
                </el-table>
            <el-pagination
            class="article-pag"
                background
                layout="prev, pager, next"
                :page-size="perSize"
                :loading="pagloading"
                :disabled="pagloading"
                :total="totalCount"
                @current-change="handleCurrentChange">
            </el-pagination>
            </el-card>
        </div>
    <!-- </div> -->
</template>

<script>
export default {
  created () {
    this.getArticle()
  },
  data () {
    return {
      articles: [],
      pagloading: false,
      page: 1,
      perSize: 10,
      totalCount: 0,
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核成功'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ]
    }
  },
  methods: {
    // 请求开始，加载 loading
    async getArticle (item) {
      this.pagloading = true
      // 除了登录相关接口之后，其它接口都必须在请求头中通过 Authorization 字段提供用户 token
      // 当我们登录成功，服务端会生成一个 token 令牌，放到用户信息中
      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page, // 页码
          per_page: this.perSize// 每页大小
        }
      })
      // 打印获取数据进行操作
      // console.log(data)
      this.articles = data.results
      // console.log(data.data.results)
      this.totalCount = data.total_count
      this.pagloading = false
    },
    handleCurrentChange (page) {
      // console.log(page)
      this.page = page
      this.getArticle()
    }
    // 删除操作
    // async handleDelete () {
    //   try {
    //     await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning' })
    //     await this.$http({
    //       method: 'DELETE',
    //       url: `/articles/${item.id}`
    //     })
    //     this.$message({
    //       type: 'success',
    //       message: '删除成功!'
    //     })
    //   } catch (err) {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
#article-card{
    .b-card{
        margin-top: 20px;
        .article-pag{
            margin-top:20px;
        }
    }
}
</style>

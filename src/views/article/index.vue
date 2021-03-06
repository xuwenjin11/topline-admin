<template>
    <div id="article-card">
        <div class="a-card">
            <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>数据删选</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div class="dataFilter">
               <el-form ref="form" :model="filterParams" label-width="80px">
                 <el-form-item label="状态">
                  <el-radio-group v-model="filterParams.status" label="状态">
                    <el-radio label="">全部</el-radio>
                    <el-radio v-for="(item,index) in statTypes" :key="index" :label="index">{{item.label}}</el-radio>
                  </el-radio-group>
                 </el-form-item>
              <el-form-item label="频道">
                <article-channel v-model="filterParams.channel_id"></article-channel>
              </el-form-item>
              <el-form-item label="时间选择">
                   <el-date-picker
                    value-format="yyyy-MM-dd"
                    v-model="range_date"
                    @change="handleDatechange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFilter" :loading="pagloading">查询</el-button>
              </el-form-item>
               </el-form>
            </div>
            </el-card>
        </div>
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
                      <img width="20" v-for="(item,index) in scope.row.cover.images" :key="index" :src="item" >
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
                     <template slot-scope="scope">
                    <el-row>
                    <el-button
                    size="mini"
                    type="warning"
                    @click="$router.push(`/publish/${scope.row.id}`)"
                    plain>修改</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)" plain>删除</el-button>
                    </el-row>
                    </template>
                    </el-table-column>
                </el-table>
                <!-- current-page 当前高亮的页码，需要和数据保持同步，否则可能会出现数据页码改变，视图页码没变的情况 -->
            <el-pagination
            class="article-pag"
                background
                layout="prev, pager, next"
                :page-size="perSize"
                :current-page="page"
                :loading="pagloading"
                :disabled="pagloading"
                :total="totalCount"
                @current-change="handleCurrentChange">
            </el-pagination>
            </el-card>
        </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
export default {
  components: {
    ArticleChannel
  },
  created () {
    this.getArticle()
  },
  data () {
    return {
      radio: 3,
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
      ],
      filterParams: {
        status: '', // 状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      range_date: ''
    }
  },
  methods: {
    // 请求开始，加载 loading
    async getArticle (item) {
      try {
        this.pagloading = true
        // 除了登录相关接口之后，其它接口都必须在请求头中通过 Authorization 字段提供用户 token
        // 当我们登录成功，服务端会生成一个 token 令牌，放到用户信息中
        // 去除无用数据字段
        const filterData = {}
        for (let key in this.filterParams) {
          const item = this.filterParams[key]
          if (item !== null && item !== undefined && item !== '') {
            filterData[key] = item
          }
        }
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            page: this.page, // 页码
            per_page: this.perSize, // 每页大小
            ...filterData
          }
        })
        // 打印获取数据进行操作
        // console.log(data)
        this.articles = data.results
        // console.log(data.data.results)
        this.totalCount = data.total_count
        this.pagloading = false
      } catch (err) {
        this.$message.error('获取文章失败')
      }
    },
    handleCurrentChange (page) {
      // console.log(page)
      this.page = page
      this.getArticle()
    },
    // 查询文章
    handleFilter () {
      this.page = 1
      this.getArticle()
    },
    // 时间选择
    handleDatechange (value) {
      // console.log(value)
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
    },
    // 删除操作
    async handleDelete (item) {
      // console.log(item)
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
        await this.$http({
          method: 'DELETE',
          url: `/articles/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getArticle()
      } catch (err) {
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败')
      }
    }
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

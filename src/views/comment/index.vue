<template>
    <div>
        <el-card>
         <el-table
        :data="articles"
        stripe
        style="width: 100%">
        <el-table-column
        prop="title"
        label="标题"
        width="180">
        </el-table-column>
        <el-table-column
        label="评论状态"
        width="180">
        <template slot-scope="scope">
        <el-switch
        :disabled="scope.row.disabled"
        v-model="scope.row.comment_status"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="handleChangeStatus(scope.row)">
        </el-switch>
        </template>
        </el-table-column>
        <el-table-column
        prop="total_comment_count"
        label="总评论数">
        </el-table-column>
        <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
        </el-table-column>
        <el-table-column
        label="操作">
            <el-row>
               <el-button
                  size="mini"
                  type="warning"
                  plain>修改</el-button>
               <el-button size="mini" type="danger"  plain>关闭评论</el-button>
            </el-row>
        </el-table-column>
    </el-table>
    </el-card>
    </div>
</template>

<script>
export default {
  created () {
    this.handleComment()
  },
  data () {
    return {
      articles: []
    }
  },
  methods: {
    async handleComment () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/articles',
          params: {
            response_type: 'comment'
          }
        })
        // 手动造一个数据对评论开关按钮进行控制
        data.results.forEach(item => {
          item.disabled = false
        })
        console.log(data.results)
        this.articles = data.results
      } catch (err) {
        this.$message.error('获取评论列表失败')
      }
    },
    async handleChangeStatus (item) {
      try {
        // 禁用开关
        item.disabled = true
        await this.$http({
          method: 'PUT',
          url: '/comments/status',
          params: {
            articles_id: item.id.toString()
          },
          data: {
            allow_comment: item.comment_status
          }
        })
        this.$message({
          type: 'success',
          message: `${item.comment_status ? '启用' : '禁止'}评论状态`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('评论状态修改失败')
        // 当评论状态修改失败时，让评论状态回到原始状态
        item.comment_status = !item.comment_status
      }
      // 关闭禁止开关
      item.disabled = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>

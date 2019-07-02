<template>
    <div class="post-article">
        <el-card>
            <p>发表文章</p>
        </el-card>
        <el-card class="publish-card">
            <el-form ref="form" :model="articleForm" label-width="80px">
            <el-form-item label="标题">
                <el-input v-model="articleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <!-- <el-input type="textarea" v-model="articleForm.content"></el-input> -->
                <quill-editor v-model="articleForm.content"></quill-editor>
            </el-form-item>
            <el-form-item label="封面">
            </el-form-item>
            <el-form-item label="频道">
              <article-channel v-model="articleForm.channel_id"></article-channel>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  @click="handlePublish(false)">发布</el-button>
                <el-button @click="handlePublish(true)">创建草稿</el-button>
            </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
// 引入富文本编辑器的css样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
// import './quill.user.css'
// 引入富文本编辑器
import { quillEditor } from 'vue-quill-editor'

export default {
  /**
   * 监视
   * 可以监视实例中的数据成员
   * 当被监视数据发生变化，就会调用处理函数
   */
  // watch: {
  //   // 监视实例(this)中的 $route，当 $route 发生变化，执行对于的处理函数
  //   '$route' (to, from) {
  //     // console.log(this.$route)
  //     // 对路由变化作出响应...
  //     console.log(to, from)
  //     // 从编辑到发布，由于是一个组件，路由会缓存，不会重新创建
  //     // 所以这里加一个处理：
  //     //  对于当前这个组件来说，如果你是从编辑过来的，则将表单内容清空
  //     if (from.name === 'publish-edit') {
  //       this.articleForm = {
  //         title: '', // 标题
  //         content: '', // 内容
  //         channel_id: '', // 频道
  //         cover: { // 封面
  //           type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
  //           images: []
  //         }
  //       }
  //     }
  //   }
  // },
  created () {
    if (this.$route.name === 'publish-edit') {
      this.loadArticle()
    }
  },
  components: {
    ArticleChannel,
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '',
        content: '',
        channel_id: '',
        cover: {
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        }
      }
      // editorOptions: {}
    }
  },
  methods: {
    async loadArticle () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: `/articles/${this.$route.params.id}`
        })
        this.articleForm = data
      } catch (err) {
        this.$message.error('修改文章失败')
      }
    },
    async handlePublish (draft) {
      try {
        await this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft
          },
          data: this.articleForm
        })
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      } catch (err) {
        this.$message.error('发布失败', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post-article{
    // height: 100%;
  .publish-card{
    // height: 100%;
    .quill-editor{
      height: 450px;
      margin-bottom: 80px;
    }
  }
}

</style>

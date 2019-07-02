<template>
    <div>
        <el-card>
            <div class="pic-header">
                <p>图片管理</p>
            </div>
            <div class="action">
                <el-radio-group v-model="active">
                <el-radio-button label="全部" @click.native="loadImage(false)"></el-radio-button>
                <el-radio-button label="收藏" @click.native="loadImage(true)"></el-radio-button>
                </el-radio-group>
                 <!--
                    这里我们可以直接使用 Upload 上传组件进行图片上传
                    Upload 组件支持自动请求，不用我们自己写代码，只需要配置一下请求接口
                    如果要使用它默认的请求能力，就无法使用我们在 axios 中做的那些配置了，例如 baseURL、请求拦截器。。。
                    1. action 请求地址
                    2. headers 请求头
                    3. name  字段名称
                    一：:on-success="loadImages"
                    将 loadImages 配置为 on-success 的成功调用函数
                    那么当上传成功的时候，Upload 组件就会调用 loadImage(response, file, fileList)
                    我们自己写的 loadImages 函数，期望参数是一个布尔值
                    二：:on-success="loadImages(false)"
                    {{ loadImages(false) }}
                    不行，因为属性绑定中会直接调用这个函数
                    三：定义一个额外的函数，在这个函数中我们手动调用我们自己的 loadImages(false)
                    :on-success="handleUploadSuccess"
                    四：我们可以在模板中使用箭头函数
                    注意：模板中直接定义的箭头函数中使用实例成员需要加 this
                -->
                <el-upload
                class="upload-demo"
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                :headers="{ Authorization: `Bearer ${$store.state.user.token}` }"
                name="image"
                :on-change="() => {this.loadImage(false)}"
                :show-file-list="false">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </div>
            <el-row :gutter="20">
                <el-col :span="4" v-for="(item) in images" :key="item.id" style="margin-bottom: 10px;">
                    <el-card :body-style="{ padding: '0px' }">
                         <img :src="item.url" class="image" width="100%" height="100px">
                         <div style="padding: 10px;">
                            <div class="bottom clearfix">
                            <el-button
                            plain
                            type="primary"
                            :icon="item.is_collected ? 'el-icon-star-on':'el-icon-star-off'"
                            circle
                            @click="handleCollect(item)"
                            ></el-button>
                            <el-button plain type="primary" icon="el-icon-delete" @click="handleDelete(item)" circle></el-button>
                            </div>
                         </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
  created () {
    this.loadImage()
  },
  data () {
    return {
      active: '全部',
      images: []
    }
  },
  methods: {
    async loadImage (collect = false) {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect,
            page: 1,
            per_page: 10
          }
        })
        // console.log(data)
        this.images = data.results
      } catch (err) {
        this.$message.error('获取图片失败')
      }
    },
    // 进行图片收藏判断传值
    async handleCollect (item) {
      // 将判断的值进行传递
      const collect = !item.is_collected
      try {
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        this.is_collected = data.collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}图片成功`
        })
      } catch (err) {
        this.$message.error('收藏图片失败')
      }
    },
    // 删除图片
    async handleDelete (item) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.loadImage()
      } catch (err) {
        if (err === 'cancel') {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        this.$message.error('删除失败')
      }
    },
    handleUploadSuccess () {
      // 上传成功，重新加载所有图片列表
      this.loadImages(false)
    }
  }
}
</script>

<style lang="less" scoped>
.pic-header{
    padding: 15px;
    border-bottom: 1px dashed #ccc;
}
.action{
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
}
.bottom {
  display: flex;
  justify-content: center;
}
</style>

<template>
    <div>
        <el-card>
            <div class="pic-header">
                <p>图片管理</p>
            </div>
            <div class="action">
                <el-radio-group v-model="active">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="收藏"></el-radio-button>
                </el-radio-group>
                <el-button type="primary">上传图片</el-button>
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
                            :icon="item.is_collected?
                            'el-icon-star-on':'el-icon-star-off'"
                            circle
                            @click="handleCollect(item)"
                            ></el-button>
                            <el-button plain type="primary" icon="el-icon-delete" circle></el-button>
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
          message: `${collect ? '' : '取消'}收藏图片成功`
        })
      } catch (err) {
        this.$message.error('收藏图片失败')
      }
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

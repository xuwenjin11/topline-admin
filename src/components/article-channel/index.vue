<template>
    <div>
        <el-select :value="value" @change="$emit('input',$event)" placeholder="请选择活动区域">
          <el-option
          v-for="(item,index) in channels"
          :key="index"
          :label="item.name"
          :value="item.id"
          ></el-option>
        </el-select>
    </div>
</template>

<script>
export default {
  created () {
    this.handleChannels()
  },
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  methods: {
    // 获取文章频道
    async handleChannels () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        // console.log(data)
        this.channels = data.channels
      } catch (err) {
        this.$message.error('获取频道数据失败')
      }
    },
    handleChange (e) {
      this.$emit('input', e)
    }
  }

}
</script>

<style lang="less" scoped>
</style>

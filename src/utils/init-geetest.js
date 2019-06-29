import '@/vendor/gt.js'
// 将极验验证进行导出
export default function (options) {
  return new Promise((resolve, reject) => {
    window.initGeetest(options, captchaObj => {
      resolve(captchaObj)
    })
  })
}

//app.js
App({
  onLaunch: function () {
    console.log('已启动')
    var self = this
    wx.getSystemInfo({
      success: function (res) {
        self.globalData.config = res
      }
    })
  },
  globalData:{
    config: null
  }
})
//index.js
var app = getApp()
Page({
  data: {
    res: [],
    page: 1,
    ismore: false,
    showTip: false,
    cur: ''
  },
  onLoad: function () {
    var self = this
    this.loadData(self.data.page)
  },
  loadData(page, fn, BOOL) {
    var self = this
    wx.showLoading({ title: '正在加载数据' })
    wx.request({
      url: 'https://api.sweetui.com/cnbeta/more?page=' + page,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)    
        wx.hideLoading()
        if (res.data.code == 0) {
          self.setData({
            res: BOOL ? res.data.data : self.data.res.concat(res.data.data)
          })
          if (fn) {
            fn()
          }
        }
      },
      fail: function() {
        wx.hideLoading()
        wx.showModal({
          title: '数据加载失败',
          content: '请检查您的网络',
          showCancel: false,
          confirmText: '点我刷新',
          success: function (res) {
            if (res.confirm) {
              self.loadData(self.data.page)
            }
          }
        })
      }
    })
  },
  loadMore() {
    var self = this
    if (self.data.ismore) {
      return
    }
    self.setData({
      ismore: true,
      page: self.data.page + 1
    })
    self.loadData(self.data.page, function () {
      self.setData({
        ismore: false
      })
    }, false)
  },
  refresh(fn) {
    var self = this
    self.setData({
      page: 1,
    })
    self.loadData(self.data.page, fn, true)
  },
  onPullDownRefresh() {
    var self = this
    this.refresh(function() {
      self.setData({
        showTip: true,
        cur: 'cur'
      })
      setTimeout(function() {
        self.setData({
          showTip: false,
          cur: ''
        })
      }, 1000)
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    this.loadMore()
  },
  todetail(event) {
    var id = event.currentTarget.dataset.id
    var classify = event.currentTarget.dataset.classify
    var query = '?classify=' + classify + '&id=' + id
    wx.navigateTo({
      url: '../detail/detail' + query
    })
  },
})

// pages/detail/detail.js
var app = getApp()
var util = require('../../utils/util')
Page({
  data: {
    wheight: 0,
    res: null,
    query: null,
    comments: null,
    time: [],
    toview: '',
    scrollTop: 0
  },
  onLoad: function (options) {
    this.setData({
      wheight: app.globalData.config.windowHeight,
      query: options
    })
    this.getData()
  },
  getData() {
    var self = this
    wx.showLoading({ title: '正在加载数据' })
    wx.request({
      url: 'https://api.sweetui.com/cnbeta/detail?classify=' + this.data.query.classify + '&id=' + this.data.query.id,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        if (res.data.code == 0) {
          const comments = res.data.data.comments
          const time = comments.map(v => util.timeAgo(v.date))
          self.setData({
            res: res.data.data,
            comments: comments,
            time: time
          })
        }
      }
    })
  },
  toComment() {
    this.setData({
      toview: 'comment'
    })
  },
  totop() {
    this.setData({
      scrollTop: 0
    })
  },
  onShareAppMessage: function () {
    return {
      title: this.data.res.title,
      path: '/pages/detail/detail?classify=' + this.data.query.classify + '&id=' + this.data.query.id
    }
  }
})
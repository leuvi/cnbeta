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
    //this.getData()
    //test
    this.getDate_new()
  },
  getDate_new() {
    var self = this
    wx.showLoading({ title: '正在玩命加载..' })
    wx.request({
      url: 'https://api.sweetui.com/cnbeta/detail_new?classify=' + this.data.query.classify + '&id=' + this.data.query.id,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 0) {
          const comments = res.data.data.comments
          //console.log(comments)
          self.setData({
            res: res.data.data,
            comments: self.getComments(comments)
          })
        }
      }
    })
  },
  getData() {
    var self = this
    wx.showLoading({ title: '正在玩命加载..' })
    wx.request({
      url: 'https://api.sweetui.com/cnbeta/detail?classify=' + this.data.query.classify + '&id=' + this.data.query.id,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
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
  },
  getComments(comments) {
    function isEmpty(o) {
      for(let i in o) {
        return false
      }
      return true
    }
    function getList(tid, comments) {
      const arr = []
      if (!comments[tid]) {
        return arr.concat({ 
          comment: '评论好像被小编吃了~( # ▽ # )',
          name: 'ET',
          host_name: '火星网友'
        })
      }
      if (comments[tid].pid === '0') {
        return arr.concat(comments[tid])
      } else {
        return arr.concat(comments[tid], getList(comments[tid].pid, comments))
      }
    }
	  const newList = []
    if (isEmpty(comments)) {
      return false
    }
    for (let i in comments) {
      if (getList(i, comments)) {
        newList.push(getList(i, comments).reverse())
      } 
    }
    newList.reverse()
    return newList
  }
})
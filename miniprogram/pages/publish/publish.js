let util = require('../../utils.js')
Page({
  data: {
    messageListData: 0,
    message: "",
    getMessage: [],
    focus: false
  },
  onShow: function() {
    this.getUserCount()
    this.getMessage()
  },
  getUserCount: function() {
    const db = wx.cloud.database()
    db.collection('message').count().then(res => {
      this.setData({
        messageListData: res.total
      })
    })
  },
  messageText: function(e) {
    this.setData({
      message: e.detail.value.replace(/\s+/g, '')
    })
  },
  publish: function() {
    const {
      message
    } = this.data;
    let that = this;
    if (!message) {
      this.setData({
        focus: true
      })
      return
    }
    const db = wx.cloud.database({});
    db.collection('message').add({
      data: {
        message: message,
        createTime: util.getLocalTime(util.getUnixTime()),
        avatarUrl: app.globalData.avatarUrl,
        nickName: app.globalData.nickName
      }
    }).then(resp => {
      that.getUserCount()
      wx.showToast({
        title: '发布成功~',
        icon: "none"
      })
      that.getMessage()
      that.setData({
        message: "",
      })
      console.log('res--->' + res)
    })
  },
  getMessage: function() {
    const db = wx.cloud.database()
    db.collection('message').get().then(res => {
      this.setData({
        getMessage: res.data
      })
    })
  }
})
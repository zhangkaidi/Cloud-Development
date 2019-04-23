// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: false,
    circular: true,
    interval: 3000,
    getMessage: [],
    autoplaycon: true,
    indicatorDotscon: false,
    vertical: true,
    duration: 1000,
    navgationText: "首页",
    isAudio: true,
    src: ""
  },
  onReady: function() {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },
  isAudio: function() {
    const {
      isAudio
    } = this.data
    isAudio ? this.audioCtx.pause() : this.audioCtx.play()
    this.setData({
      isAudio: !isAudio
    })
  },
  onShow: function() {
    this.getMessage();
    this.getMusic()
  },
  getMusic: function() {
    const db = wx.cloud.database()
    db.collection('whiteList').get().then(res => {
      this.setData({
        src: res.data[0].music
      })
    })
  },
  formSubmit: function(e) {
    console.log()
    wx.cloud.callFunction({
      name: 'formid',
      data:{
        fid: e.detail.formId
      }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.log('res---->' + res)
    })
  },
  getMessage: function() {
    const db = wx.cloud.database()
    db.collection('message').orderBy('createTime', 'desc').get().then(res => {
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].isTop) {
          var str = res.data.splice(i, 1);
          res.data.unshift(str[0]);
        }
      }
      this.setData({
        getMessage: res.data
      })
    })
  }
})
const utils = require('../../utils/utils.js')
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
    src: "",
    getStarMessage: [],
    fileListUrl: []
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
  onLoad: function() {
    this.getStarMessage()
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
      data: {
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
  },
  getStarMessage: function() {
    let that = this;

    const db = wx.cloud.database()
    db.collection('starpublish').orderBy('createTime', 'desc').get().then(res => {
      for (let i = 0; i < res.data.length; i++) {
        const fileListUrl = [];
        res.data[i].createTime = utils.formatDateTime(res.data[i].createTime)
        console.log(res.data[i].tempFile)
        wx.cloud.getTempFileURL({
          fileList: res.data[i].tempFile
        }).then(resp => {
          for (let j = 0; j < resp.fileList.length; j++) {
            fileListUrl.push(resp.fileList[j].tempFileURL)
          }
          console.log('resp.fileList-->' + JSON.stringify(resp.fileList))
          res.data[i].fileListUrl = fileListUrl
          res.data[i].tempFile = resp.fileList
          that.setData({
            getStarMessage: res.data
          })
        }).catch(error => {
          // handle error
        })
      }
    })
  },
  imgPreView: function(event) {
    console.log('sasasa')
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})
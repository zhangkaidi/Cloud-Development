const utils = require('../../utils/utils.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    getMessage: [],
    autoplaycon: true,
    indicatorDotscon: false,
    vertical: true,
    duration: 1000,
    navgationText: "首页",
    isAudio: true,
    src: "",
    getStarMessage: [],
    fileListUrl: [],
    openid: "",
    imageFlag: false,
    defaultImage: "../../images/user-unlogin.png"
  },
  isAudio: function() {
    const {
      isAudio
    } = this.data
    isAudio ? wx.pauseBackgroundAudio() : wx.playBackgroundAudio()
    this.setData({
      isAudio: !isAudio
    })
  },
  onLoad: function() {
    this.getOpenid()
    this.getMusic()
  },
  onShow: function() {
    if (app.globalData.publishSuccess) {
      this.getStarMessage()
      app.globalData.publishSuccess = false
    }
    this.getMessage()
  },
  getOpenid: function() {
    // 调用云函数
    const that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.setData({
          openid: res.result.openid
        }, () => {
          that.getStarMessage()
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  deleteMessage: function(e) {
    const {
      id
    } = e.currentTarget.dataset;
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条消息吗？',
      success(res) {
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('starpublish').doc(id).remove()
            .then(res => {
              wx.showToast({
                title: '删除成功',
              })
              that.getStarMessage()
            })
            .catch(res => {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
              console.error('[数据库] [删除记录] 失败：', res)
            })
        } else if (res.cancel) {
          console.log('cancel')
        }
      }
    })
  },
  onPullDownRefresh: function() {
    this.getStarMessage();
    wx.stopPullDownRefresh(); //停止当前页面下拉刷新。
  },
  getMusic: function() {
    const db = wx.cloud.database()
    db.collection('whiteList').get().then(res => {
      this.setData({
        src: res.data[0].music
      })
      wx.playBackgroundAudio({
        dataUrl: res.data[0].music,
        title: '1',
        coverImgUrl: '1'
      })
    })
  },
  formSubmit: function(e) {
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
  getStarMessage: function() {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    const db = wx.cloud.database()
    db.collection('starpublish').orderBy('createTime', 'desc').get().then(res => {
      wx.hideLoading()
      for (let i = 0; i < res.data.length; i++) {
        const fileListUrl = [];
        res.data[i].createTime = utils.formatDateTime(res.data[i].createTime)

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
          wx.hideLoading()
        })
      }
    })
  },
  imgPreView: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  loadImage: function(e) {
    console.log(e)
    this.setData({
      imageFlag: true
    })
  },
  getMessage: function() {
    const db = wx.cloud.database()
    db.collection('message').orderBy('createTime', 'desc').limit(10).get().then(res => {
      this.setData({
        getMessage: res.data
      })
    })
  }
})
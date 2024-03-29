// miniprogram/pages/starpublish/starpublish.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "",
    tempFile: "",
    navgationText: "发布",
    nickName: "",
    avatarUrl: "",
    openid: "",
    filePath: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      openid: app.globalData.openid,
      nickName: wx.getStorageSync('nickName'),
      avatarUrl: wx.getStorageSync('avatarUrl')
    })
  },
  conText: function(e) {
    this.setData({
      message: e.detail.value.replace(/\s+/g, '')
    })
  },

  uploadImg: function() {
    let that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const filePath = res.tempFilePaths;
        that.setData({
          filePath: filePath
        })
      }
    })
  },
  publish: function() {
    const {
      message,
      filePath,
      tempFile
    } = this.data
    let that = this;
    if (!message && !filePath) {
      wx.showToast({
        title: '内容不能为空~',
        icon: "none"
      })
      return;
    }
    let resFile = [];
    for (let i = 0; i < filePath.length; i++) {
      const time = new Date().getTime();
      wx.cloud.uploadFile({
        cloudPath: 'star/' + time + filePath[i].match(/\.[^.]+?$/)[0],
        filePath: filePath[i], // 文件路径
      }).then(resp => {
        resFile.push(resp.fileID)
        wx.showLoading({
          title: '发布中~',
        })
        if (filePath.length == resFile.length) {
          that.starpublish(resFile)
        }
      }).catch(error => {
        console.log(error)
      })
    }

  },
  starpublish: function(resFile) {
    const {
      message,
      nickName,
      avatarUrl
    } = this.data;
    const db = wx.cloud.database()
    db.collection('starpublish').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          avatarUrl: avatarUrl,
          nickName: nickName,
          context: message,
          tempFile: resFile,
          createTime: db.serverDate()
        }
      })
      .then(res => {
        console.log('res-->' + JSON.stringify(res))
        this.setData({
          message: '',
          filePath: ""
        })
        app.globalData.publishSuccess = true
        wx.showToast({
          title: '发布成功',
        })
      })
      .catch(console.error)
  },
  imgPreView: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})
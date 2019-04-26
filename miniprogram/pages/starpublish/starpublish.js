// miniprogram/pages/starpublish/starpublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conText: "",
    tempFile: [],
    navgationText: "发布",
    nickName: "",
    avatarUrl: "",
    openid: ""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    this.setData({
      openid: app.global.openid,
      nickName: wx.getStorageSync('nickName'),
      avatarUrl: wx.getStorageSync('avatarUrl')
    })
  },
  conText: function(e) {
    this.setData({
      conText: e.detail.value.replace(/\s+/g, '')
    })
  },

  uploadImg: function() {
    let that = this;
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const filePath = res.tempFilePaths;
        let resFile = [];

        for (let i = 0; i < filePath.length; i++) {
          const time = new Date().getTime();
          wx.cloud.uploadFile({
            cloudPath: 'star/' + time + filePath[i].match(/\.[^.]+?$/)[0],
            filePath: filePath[i], // 文件路径
          }).then(resp => {
            resFile.push(resp.fileID)
            that.setData({
              tempFile: resFile
            })
          }).catch(error => {
            console.log(error)
          })
        }
      }
    })
  },
  publish: function() {
    const {
      tempFile,
      conText,
      nickName,
      avatarUrl
    } = this.data
    const db = wx.cloud.database()
    if (!conText) {
      wx.showToast({
        title: '请输入文字~',
        icon: "none"
      })
      return;
    }
    db.collection('starpublish').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          avatarUrl: avatarUrl,
          nickName: nickName,
          context: conText,
          tempFile: tempFile,
          createTime: db.serverDate()
        }
      })
      .then(res => {
        console.log('res-->' + JSON.stringify(res))
        this.setData({
          conText: null,
          tempFile: null
        })
        wx.showToast({
          title: '发布成功!'
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
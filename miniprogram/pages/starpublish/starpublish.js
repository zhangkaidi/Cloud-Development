// miniprogram/pages/starpublish/starpublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conText: "",
    tempFile: []
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  conText: function(e) {
    this.setData({
      conText: e.detail.value.replace(/\s+/g, '')
    })
  },

  uploadImg: function() {
    let that = this;
    wx.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          tempFile: tempFilePaths
        })
      }
    })
  },
  publish: function() {
    const {
      tempFile,
      conText
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
          avatorUrl: "",
          nickName: "我想拼命呼吸",
          con: '我很喜欢这里',
          tempFile: tempFile,
          data: db.serverDate()
        }
      })
      .then(res => {
        console.log('res-->' + JSON.stringify(res))
      })
      .catch(console.error)

  }
})
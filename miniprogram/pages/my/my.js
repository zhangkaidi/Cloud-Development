// miniprogram/pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555329446844&di=deeab794f3b338e6dbd22296d7ccb2c5&imgtype=0&src=http%3A%2F%2Fimg.mm4000.com%2Ffile%2F4%2Ff8%2F56c9be9031_800.jpg',
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1555329411936&di=d1af1a92e25765d40c4ce94f74669f1f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201509%2F05%2F20150905102425_Cyum8.thumb.1000_0.jpeg"
    ],
    indicatorDots: true,
    autoplay: false,
    circular: true,
    interval: 2000,
    getMessage:[],
    autoplaycon:true,
    indicatorDotscon:false,
    vertical:true,
    duration: 1000,
    src: "http://www.170mv.com/kw/other.web.re01.sycdn.kuwo.cn/resource/n3/60/17/263360325.mp3"
  },
  onReady: function() {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },
  onShow: function() {
    this.getMessage();
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
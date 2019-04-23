const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: cloud.getWXContext().OPENID,
      templateId: 'W4q2emn_pS4uINkfLKwBg3lhB1oeNnI7AwM0l7x0Uy8',
      formId: event.fid,
      emphasisKeyword: '你好啊',
      page: 'index',
      data: {
        keyword1: {
          value: '339208499'
        },
        keyword2: {
          value: '2015年01月05日 12:30'
        },
        keyword3: {
          value: '腾讯微信总部'
        },
        keyword4: {
          value: '广州市海珠区新港中路397号'
        }
      }
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const fileList = ['cloud://fe-keep-905230.6665-fe-keep/bg.png']
  const result = await cloud.getTempFileURL({
    fileList
  })
  return result.fileList
}
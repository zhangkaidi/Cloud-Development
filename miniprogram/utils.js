const getLocalTime = nS => {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}
const getUnixTime = () => {
  return Math.round(new Date().getTime() / 1000)
}
module.exports = {
  getLocalTime: getLocalTime, //格式化时间
  getUnixTime: getUnixTime //时间戳
}
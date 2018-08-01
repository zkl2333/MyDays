//app.js
App({
  onLaunch: function() {
    let that = this
    // 引入 BaaS SDK
    require('./utils/sdk-v1.5.0')
    let clientId = this.globalData.clientId
    // 初始化
    wx.BaaS.init(clientId)
    wx.BaaS.login(false)
  },

  globalData: {
    clientId: '63aead71df87bd8636da', // 从 BaaS 后台获取 ClientID
    imgTableId: 46088,
    tableId: 45613, // 从 https://cloud.minapp.com/dashboard/ 管理后台的数据表中获取
  }
})
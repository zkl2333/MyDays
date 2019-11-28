// pages/images/imgs.js
import utils from '../../utils/util'
let MyFile = new wx.BaaS.File()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    utils.getImgs(wx.BaaS.storage.get('uid'), (res) => {
      this.setData({
        imgs: res.data.objects
      })
    })
  },

  bindUplodImages: function() {
    let _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 设置文件路径
        this.setData({
          filePath: res.tempFilePaths[0]
        })
        utils.uploadImg(MyFile, this.data.filePath, 'SDK', (res) => {
          console.log(res)
          // utils.getImgs(wx.BaaS.storage.get('uid'), (res) => {
          //   this.setData({
          //     imgs: res.data.objects
          //   })
          // })
          let imgs = this.data.imgs
          imgs.push(res.data)
          _this.setData({
            imgs: imgs
          })
        })
      }
    })
  },

  bindChooseImage: function(e) {
    console.log(e)
    this.setData({
      id: e.currentTarget.dataset.id,
      img: e.currentTarget.dataset.img,
      imgId: e.currentTarget.dataset.imgid,
      idx: e.currentTarget.dataset.idx
    })
  },

  setImg: function(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      img: this.data.img,
      imgId: this.data.id
    })
    wx.navigateBack({
      delta: 1,
    })
  },

  delImg: function(e) {
    utils.delImg(MyFile, this.data.id, this.data.imgId)
    let imgs = this.data.imgs
    imgs.splice(this.data.idx, 1)
    this.setData({
      imgs: imgs
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
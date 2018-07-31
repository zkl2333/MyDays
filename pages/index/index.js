// pages/index/index.js
import utils from '../../utils/util'
Page({

  //Day点击事件
  setDay: (e) => {
    wx.navigateTo({
      url: '/pages/set/index?id=' + e.currentTarget.id + '&color=',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    days: [],
    p: 0
  },

  tapAdd: function () {
    wx.navigateTo({
      url: '/pages/set/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  fetchDaysList(page) {
    utils.getDays(wx.BaaS.storage.get('uid'), page, (res) => {
      for (let i = 0; i < res.data.objects.length; i++) {
        let day = parseInt(((new Date).getTime() - Date.parse(res.data.objects[i].date)) / 86400000);
        if (day > 0) {
          res.data.objects[i].text = "已经";
          res.data.objects[i].day = day;
        } else {
          res.data.objects[i].text = "还有";
          res.data.objects[i].day = -day;
        }
      }
      if (res.data.objects.length == 0) {
        wx.showToast({
          title: '没有更多内容了',
          icon: 'none',
          duration: 500
        })
      }
      this.setData({
        days: res.data.objects
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.getStorage({
      key: 'ifx_baas_uid',
      success: (res) => {
        this.fetchDaysList(0)
        wx.hideLoading()
        console.log("已登陆")
      },
      fail: () => {
        console.log("未登陆")    
        //定时器 重试登陆   
        let timer = setInterval(() => {
          console.log("重试")
          wx.getStorage({
            key: 'ifx_baas_uid',
            success: (res) => {
              console.log("已登陆")
              //获取列表
              this.fetchDaysList(0)
              //清除定时器
              clearInterval(timer)
              wx.hideLoading()
            }
          })
        }, 1000)
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.setData({
    //   p: this.data.p + 1
    // })
    // this.fetchDaysList(this.data.p)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/set/index.js
import utils from '../../utils/util'
let MyFile = new wx.BaaS.File()
Page({

  sliderchange(e) {
    if (e.currentTarget.id == 'R') {
      this.setData({
        R: e.detail.value
      })
    } else if (e.currentTarget.id == 'G') {
      this.setData({
        G: e.detail.value
      })
    } else if (e.currentTarget.id == 'B') {
      this.setData({
        B: e.detail.value
      })
    }
    this.setData({
      dayColor: "#" + ((1 << 24) + (this.data.R << 16) + (this.data.G << 8) + this.data.B).toString(16).slice(1)
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindCreateDayNameInput(e) {
    let that = this
    let value = e.detail.value
    this.setData({
      dayName: value
    })
  },

  bindCreateDayColorInput(e) {
    let that = this
    let value = e.detail.value
    this.setData({
      R: parseInt(value.substr(1, 2), 16),
      G: parseInt(value.substr(3, 2), 16),
      B: parseInt(value.substr(5, 2), 16),
      dayColor: value
    })
  },

  bindChooseImage() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // 实例化文件操作对象

        // 设置文件路径
        let fileParams = {
          filePath: res.tempFilePaths[0]
        }
        // 文件分类
        let metaData = {
          categoryName: 'SDK'
        }
        MyFile.upload(fileParams, metaData).then(
          res => {
            console.log(res)
            console.log(this.data)
            if (this.data.imgId) {
              MyFile.delete(this.data.imgId)
            }
            this.setData({
              img: res.data.path,
              imgId: res.data.file.id
            })
            wx.showToast({
              title: '上传成功',
            })
          },
          err => { })
      }
    })
  },

  bindRemoveImage() {
    this.setData({
      img: '',
    })
  },

  setDay() {
    if (this.data.dayName == undefined) {
      wx.showToast({
        title: '请填写标题',
        icon: 'none',
        duration: 1000,
      })
      return false;
    } else if (this.data.dayColor == undefined) {
      wx.showToast({
        title: '请选择颜色',
        icon: 'none',
        duration: 1000,
      })
      return false;
    } else {
      return true;
    }
  },

  delDay() {
    let id = this.data.id
    if (!this.data.img && this.data.imgId) {
      wx.showLoading({
        title: '正在删除图片',
        mask: true,
      })
      MyFile.delete(this.data.imgId).then(res => {
        wx.hideLoading()
      }, err => {
        wx.hideLoading()
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      })
    }
    wx.showModal({
      title: '确认您的操作',
      content: '是否删除这个项目？',
      success: (res) => {
        if (res.confirm) {
          MyFile.delete(this.data.imgId)
          utils.delDay(id, res => {
            wx.navigateBack({
              delta: 2
            })
          })
        }
      }
    })
  },

  saveDay() {
    if (this.setDay()) {
      let data = {
        imgId: this.data.imgId,
        img: this.data.img,
        color: this.data.dayColor,
        name: this.data.dayName,
        date: this.data.date
      }
      utils.addDay(data, res => {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 2
        })
      })
    }
  },

  updataDay() {
    if (this.setDay()) {
      let data = {
        imgId: this.data.imgId,
        img: this.data.img,
        color: this.data.dayColor,
        name: this.data.dayName,
        date: this.data.date
      }
      let id = this.data.id
      utils.updataDay(data, id, res => {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        wx.navigateBack({
          delta: 2
        })
      })
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-01-01',
    R: 255,
    G: 255,
    B: 255,
    dayColor: "#ffffff"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
      utils.getDay(options.id, (res) => {
        this.setData({
          R: parseInt(res.data.color.substr(1, 2), 16),
          G: parseInt(res.data.color.substr(3, 2), 16),
          B: parseInt(res.data.color.substr(5, 2), 16),
          dayColor: res.data.color,
          dayName: res.data.name,
          date: utils.dateParse(res.data.date),
          img: res.data.img,
          imgId: res.data.imgId
        })
      })
      this.setData({
        bindTap: 'updataDay',
        btnText: '更新'
      })
    } else {
      this.setData({
        bindTap: 'saveDay',
        btnText: '添加'
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
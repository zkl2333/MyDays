// pages/set/index.js
import utils from '../../utils/util'
let MyFile = new wx.BaaS.File()
Page({
  //滑条变化事件
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

  // 设置日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 设置标题
  bindCreateDayNameInput(e) {
    let that = this
    let value = e.detail.value
    this.setData({
      dayName: value
    })
  },

  // 选择颜色
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

  // 选择图片，点击事件
  bindChooseImage() {
    wx.navigateTo({
      url: '../images/imgs',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // 移除图片，点击事件
  bindRemoveImage() {
    this.setData({
      img: '',
    })
  },

  // 设置参数
  setDay() {
    if (this.data.dayName == undefined) {
      wx.showToast({
        title: '请填写标题',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    return  {
      imgId: this.data.ImgId,
      img: this.data.img,
      color: this.data.dayColor,
      name: this.data.dayName,
      date: this.data.date
    };
  },

  // 删除Day，点击事件
  delDay() {
    let id = this.data.id;
    wx.showModal({
      title: '确认您的操作',
      content: '是否删除这个项目？',
      success: (res) => {
        if (res.confirm) {
          utils.delDay(id, res => {
            wx.navigateBack({
              delta: 2
            })
          })
        }
      }
    })
  },

  // 保存Day，点击事件
  saveDay() {
    let data = this.setDay()
    if (data) {
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

  // 更新Day，点击事件
  updataDay() {
    let data = this.setDay()
    if (data) {
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
})
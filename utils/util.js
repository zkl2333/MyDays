let dateParse = (date) => {
  if (date) {
    let now = new Date(Date.parse(date))
    let y = now.getFullYear(),
      m = ("0" + (now.getMonth() + 1)).slice(-2),
      d = ("0" + now.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  } else {
    return 0
  }
}

let getDays = (uid, page, cb) => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  let tableId = getApp().globalData.tableId,
    Days = new wx.BaaS.TableObject(tableId),
    query = new wx.BaaS.Query()

  query.compare('created_by', '=', uid)
  Days.setQuery(query)
    .orderBy('date')
    .limit(100)
    .offset(page * 100)
    .find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
  wx.hideLoading()
}

let getImgs = (uid, cb) => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  let tableId = getApp().globalData.imgTableId,
    imgs = new wx.BaaS.TableObject(tableId),
    query = new wx.BaaS.Query()

  query.compare('created_by', '=', uid)
  imgs.setQuery(query)
    .orderBy('created_at')
    .find()
    .then(res => cb(res))
    .catch(err => console.dir(err))
  wx.hideLoading()
}

let getDay = (id, cb) => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  let tableId = getApp().globalData.tableId,
    Days = new wx.BaaS.TableObject(tableId)

  Days.get(id)
    .then(res => cb(res))
    .catch(err => console.dir(err))
  wx.hideLoading()
}

let addDay = (data, cb) => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  let tableId = getApp().globalData.tableId,
    Days = new wx.BaaS.TableObject(tableId),
    Day = Days.create()

  Day.set(data)
    .save()
    .then(res => cb(res))
    .catch(err => console.dir(err))

  wx.hideLoading()
}

let updeteDay = (data, id, cb) => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  let tableId = getApp().globalData.tableId,
    recordId = id

  let Days = new wx.BaaS.TableObject(tableId),
    Day = Days.getWithoutData(recordId)

  Day.set(data)
    .update()
    .then(res => cb(res))
    .catch(err => console.dir(err))
  wx.hideLoading()
}

let delDay = (id, cb) => {
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  let tableId = getApp().globalData.tableId,
    recordId = id

  let day = new wx.BaaS.TableObject(tableId)

  day
    .delete(recordId)
    .then(res => cb(res))
  wx.hideLoading()
}

let delImg = (MyFile, id, imgId) => {
  console.log("删除图片", id)
  wx.showLoading({
    title: '正在删除图片',
    mask: true,
  })
  let tableId = getApp().globalData.imgTableId,
    imgs = new wx.BaaS.TableObject(tableId)
  MyFile.delete(imgId).then(res => {
    wx.hideLoading()
  }, err => {
    wx.hideLoading()
    wx.showToast({
      title: '删除文件失败',
      icon: 'none'
    })
  })
  imgs.delete(id).then(res => {
    wx.hideLoading()
  }, err => {
    wx.hideLoading()
    wx.showToast({
      title: '删除图片失败',
      icon: 'none'
    })
  })


  // imgs.get(id).then(res => {
  //   // success
  //   MyFile.delete(res.data.imgId).then(res => {
  //     wx.hideLoading()
  //   }, err => {
  //     wx.hideLoading()
  //     wx.showToast({
  //       title: '删除文件失败',
  //       icon: 'none'
  //     })
  //   }).then(() => {
  //     imgs.delete(id).then(res => {
  //       // success
  //     }, err => {
  //       // err
  //     })
  //   })
  // }, err => {
  //   // err
  //   wx.hideLoading()
  //   wx.showToast({
  //     title: '获取文件对象失败',
  //     icon: 'none'
  //   })
  // })

}

let uploadImg = (MyFile, filePath, categoryName, cb) => {
  // 文件路径
  let fileParams = {
    filePath: filePath
  }
  // 文件分类
  let metaData = {
    categoryName: categoryName
  }
  MyFile.upload(fileParams, metaData).then(
    (res, ) => {
      // 传入图片数据表
      let tableId = getApp().globalData.imgTableId,
        imgs = new wx.BaaS.TableObject(tableId),
        img = imgs.create()
      img.set({
          imgSrc: res.data.path,
          imgId: res.data.file.id
        })
        .save()
        .catch(err => console.dir(err))
      wx.showToast({
        title: '上传成功'
      })
      cb(res);
    },
    err => {})
}

module.exports = {
  getDays: getDays,
  getDay: getDay,
  addDay: addDay,
  delDay: delDay,
  updataDay: updeteDay,
  dateParse: dateParse,
  delImg: delImg,
  uploadImg: uploadImg,
  getImgs: getImgs
}
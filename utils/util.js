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

module.exports = {
  getDays: getDays,
  getDay: getDay,
  addDay: addDay,
  delDay: delDay,
  updataDay: updeteDay,
  dateParse: dateParse
}
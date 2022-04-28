// pages/lists/manage/location/index.js
const { $Message } = require("../../../../dist/base/index");
const { create, getlocation } = require("../../../../utils/api/manage/location");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    distance: 0,
    desc: "",
    location_temp: 0,
    desc_temp: "",
    uuid: "",
    title: "",
    token: "",
    isexist: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { uuid, title } = options;
    if (!uuid) {
      $Message({ type: "error", content: "未知错误" });
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 500);
      return;
    }
    let token = wx.getStorageSync('_token');
    wx.setNavigationBarTitle({
      title: `${title}-位置管理`,
    })
    this.setData({ token: token, uuid: uuid, title: title })
    this.getData();
  },
  async getData() {
    let { uuid, token } = this.data;
    this.setData({ loading: true })
    let _result = await getlocation(uuid, token);
    this.setData({ loading: false })
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      return;
    }
    if (_result.data.length == 0) {
      $Message({ type: "warning", content: "暂无位置信息" });
      this.setData({ isexist: false })
      return;
    }
    this.setData({
      latitude: _result.data[0].latitude,
      longitude: _result.data[0].longitude,
      distance: _result.data[0].distance,
      desc: _result.data[0].desc,
      isexist: true
    })
  },
  async save() {
    let { location_temp, desc_temp, latitude, longitude, uuid, token } = this.data;
    if (!location_temp || !desc_temp || !latitude || !longitude) {
      $Message({ type: "warning", content: "请填写必要字段" });
      return;
    }
    this.setData({ loading: true })
    let _result = await create({
      distance: location_temp,
      desc: desc_temp,
      latitude,
      longitude,
      uuid
    }, token);
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
    } else {
      $Message({ type: "success", content: "保存成功" });
    }
    time = setTimeout(() => {
      this.setData({ loading: false })
      wx.navigateBack({
        delta: 1,
      })
    }, 500);
  },
  onHide() {
    if (time) clearTimeout(time);
  },
  async location() {
    let { latitude, longitude } = await this.getLocation();
    if (!latitude || !longitude) {
      $Message({ type: "error", content: "获取位置信息失败" });
      this.setData({ loading: false });
      return;
    }
    this.setData({ latitude, longitude })
  },
  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          if (res.errMsg == "getLocation:fail auth deny") {
            resolve({ latitude: "", longitude: "" });
          } else {
            resolve({ latitude, longitude });
          }
        },
        fail(err) {
          resolve({ latitude: "", longitude: "" });
        }
      })
    })
  },
  locationChange(e) {
    this.setData({
      location_temp: e.detail.detail.value
    })
  },
  descChange(e) {
    this.setData({
      desc_temp: e.detail.detail.value
    })
  }
})
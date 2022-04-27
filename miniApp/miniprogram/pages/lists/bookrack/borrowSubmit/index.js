// pages/lists/bookrack/borrowSubmit/index.js
const { $Message } = require("../../../../dist/base/index");
const { getDistance } = require("../../../../utils/utils");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    latitude: 39.89631551,
    longitude: 116.323459711,
    markers: [{
      id: 1,
      latitude: 39.89631551,
      longitude: 116.323459711,
      name: '虎虎春联购'
    }],
    covers: [{
      latitude: 39.89631551,
      longitude: 116.323459711,
      iconPath: '/image/location.png'
    }, {
      latitude: 39.89631551,
      longitude: 116.323459711,
      iconPath: '/image/location.png'
    }],
    brb_id: "",
    bru_id: "",
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { brb_id, bru_id, title } = options;
    wx.setNavigationBarTitle({
      title: `${title}-借出-提交表单`,
    })
    this.setData({ brb_id, bru_id })
  },
  bindDateChange(res) {
    this.setData({ date: res.detail.value })
  },
  async handleClick() {
    let { brb_id, bru_id, date } = this.data;
    this.setData({ loading: true })
    if (!brb_id || !bru_id) {
      $Message({ type: "error", content: "未知错误" });
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 3
        })
      }, 500)
      return;
    }
    if (!date) {
      $Message({ type: "warning", content: "请选择归还时间" });
      this.setData({ loading: false });
      return;
    }
    let { latitude, longitude } = await this.getLocation();
    if (!latitude || !longitude) {
      $Message({ type: "error", content: "获取位置信息失败" });
      this.setData({ loading: false });
      return;
    }
    let markers = this.data.markers;
    let distance = getDistance(latitude, longitude, markers[0].latitude, markers[0].longitude);
    console.log(latitude, longitude, distance);
    wx.navigateBack({
      delta: 3
    })
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
  onHide() {
    if (time) clearTimeout(time);
  }
})
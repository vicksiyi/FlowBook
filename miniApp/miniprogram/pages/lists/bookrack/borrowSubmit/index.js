// pages/lists/bookrack/borrowSubmit/index.js
const { $Message } = require("../../../../dist/base/index");
const { getDistance } = require("../../../../utils/utils");
const { getlocation, borrowbook } = require("../../../../utils/api/bookrack");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "",
    latitude: 0,
    longitude: 0,
    latitudelocal: 0,
    longitudelocal: 0,
    distance: 0,
    brb_id: "",
    bru_id: "",
    uuid: "",
    token: "",
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { brb_id, bru_id, title, uuid } = options;
    let token = wx.getStorageSync('_token');
    wx.setNavigationBarTitle({
      title: `${title}-借出-提交表单`,
    })
    this.setData({ brb_id, bru_id, uuid, token })
    this.getlocation();
  },
  async getlocation() {
    let _this = this;
    let { uuid, token } = this.data;
    this.setData({ loading: true })
    let _result = await getlocation(uuid, token);
    if (_result.code != 200) {
      $Message({ type: "warning", content: _result.msg });
      time = setTimeout(() => {
        _this.setData({ loading: false })
        wx.navigateBack({
          delta: 3
        })
      }, 500)
      return;
    }
    _this.setData({ loading: false })
    if (_result.data.length > 0) {
      this.setData({
        latitude: _result.data[0].latitude,
        longitude: _result.data[0].longitude,
        distance: _result.data[0].distance
      })
    }
  },
  bindDateChange(res) {
    this.setData({ date: res.detail.value })
  },
  async handleClick() {
    let { brb_id, bru_id, date, token, latitude, longitude, distance, latitudelocal, longitudelocal } = this.data;
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
    if (!latitudelocal && !longitudelocal) {
      let _temp = await this.getLocation();
      latitudelocal = _temp.latitude;
      longitudelocal = _temp.longitude;
      this.setData({ latitudelocal: latitudelocal, longitudelocal: longitudelocal })
    }
    if (!latitudelocal && !longitudelocal) {
      $Message({ type: "error", content: "获取位置信息失败" });
      this.setData({ loading: false });
      return;
    }
    let _distance = getDistance(latitude, longitude, latitudelocal, longitudelocal);
    if (!latitude && !longitude) {
      _distance = 0;
    }
    if (_distance <= distance) {
      let _result = await borrowbook({
        end_time: date, bru_id, brb_id
      }, token);
      if (_result.code != 200) {
        $Message({ type: "error", content: _result.msg });
        this.setData({ loading: false });
        return;
      }
      $Message({ type: "success", content: "借书成功" });
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 3
        })
      }, 500)
    } else {
      $Message({ type: "warning", content: "位置不允许借书" });
    }
    this.setData({ loading: false });
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
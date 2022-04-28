// pages/lists/manage/addtype/index.js
const { $Message } = require("../../../../dist/base/index");
const { updatepasswd } = require("../../../../utils/api/manage/passwd");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_passwd: false,
    uuid: "",
    title: "",
    loading: false,
    passwd: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { is_passwd, uuid, title } = options;
    let token = wx.getStorageSync('_token')
    this.setData({
      is_passwd: is_passwd, uuid: uuid, title: title,
      token: token
    })
    wx.setNavigationBarTitle({
      title: `${title}-加入方式管理`,
    })
  },
  async updatepasswd() {
    let _this = this;
    let { passwd, uuid, token } = this.data;
    _this.setData({ loading: true })
    let _result = await updatepasswd({ passwd: passwd, bookrack_id: uuid }, token);
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      _this.setData({ loading: false })
      return;
    }
    $Message({ type: "success", content: "更新成功" });
    time = setTimeout(() => {
      _this.setData({ loading: false })
      wx.navigateBack({
        delta: 2,
      })
    }, 500);
  },
  passwdChange(e) {
    this.setData({
      passwd: e.detail.detail.value
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})
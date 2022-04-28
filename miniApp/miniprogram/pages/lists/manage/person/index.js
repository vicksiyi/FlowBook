// pages/lists/manage/person/index.js
const { $Message } = require("../../../../dist/base/index");
const { getpersons, updateperson } = require("../../../../utils/api/manage/person");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    showRight: false,
    title: "",
    uuid: "",
    page: 1,
    token: "",
    loading: false,
    persons: [],
    islast: false,
    status: 1,
    user_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
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
      title: `${title}-人员管理`,
    })
    this.setData({ uuid: uuid, title: title, token: token })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    this.getData();
  },
  async getData() {
    let _this = this;
    let { page, uuid, token, persons, islast } = this.data;
    if (islast) {
      $Message({ type: "warning", content: "已经最后一页了" })
      return;
    }
    this.setData({ loading: true });
    let _result = await getpersons(uuid, page, token);
    this.setData({ loading: false });
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg })
      return;
    }
    if (_result.data.length != 10) {
      $Message({ type: "warning", content: "最后一页" });
      this.setData({ islast: true })
    } else {
      _this.setData({ page: page + 1 });
    }
    persons.push.apply(persons, _result.data);
    this.setData({ persons: persons })
  },
  manage(e) {
    let { status, user_id } = e.currentTarget.dataset;
    this.setData({ showRight: !this.data.showRight, status: status, user_id: user_id })
  },
  toggleRight() {
    this.setData({ showRight: !this.data.showRight })
  },
  show() {
    wx.navigateTo({
      url: '../history/index',
    })
  },
  async down() {
    let { uuid, user_id, status, token } = this.data;
    if (status == 2) { status = 1 }
    else status = 2;
    this.setData({ loading: true })
    let _result = await updateperson(uuid, user_id, status, token);
    this.setData({ loading: false })
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg })
      return;
    }
    this.setData({ page: 1, persons: [], islast: false, showRight: false })
    this.getData();
  },
  onHide() {
    if (time) clearTimeout(time);
  },
  scrolltolower() {
    this.getData();
  }
})
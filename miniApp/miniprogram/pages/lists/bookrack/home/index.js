// pages/lists/bookrack/home/index.js
const { $Message } = require("../../../../dist/base/index");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: [
      { title: "添", url: "../add/index" },
      { title: "借", url: "../borrowBook/index" },
      { title: "还", url: "../back/index" },
      { title: "退", url: "../exit/index" }],
    selected: false,
    title: '',
    uuid: '',
    id: "",
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { title, uuid, id } = options;
    if (!title || !uuid || !id) {
      $Message({ type: "error", content: "未知错误" });
      this.setData({ loading: true })
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 500);
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({ title: title, uuid: uuid, id: id });
  },
  switchSelect() {
    this.setData({
      selected: !this.data.selected
    })
  },
  nav() {
    wx.navigateTo({
      url: '../detail/index',
    })
  },
  navPage(res) {
    const url = res.currentTarget.dataset.url;
    const { uuid, title, id } = this.data;
    if (!title || !uuid || !id) {
      $Message({ type: "error", content: "未知错误" });
      this.setData({ loading: true })
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 500);
    }
    wx.navigateTo({
      url: `${url}?uuid=${uuid}&title=${title}&id=${id}`,
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})
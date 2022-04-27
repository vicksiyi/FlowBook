// pages/lists/bookrack/borrowBook/index.js
let time = null;
const { $Message } = require("../../../../dist/base/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uuid: "",
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { uuid } = options;
    if (!uuid) {
      $Message({ type: "error", content: "未知错误" });
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 500)
    } else {
      this.setData({ uuid: uuid });
    }
  },
  scan() {
    let _this = this;
    let { uuid } = this.data;
    this.setData({ loading: true })
    wx.scanCode({
      onlyFromCamera: true,
      async success(res) {
        wx.navigateTo({
          url: `../../../lists/bookrack/detail/index?uuid=${uuid}&isbn=${res.result}`,
        })
      },
      complete() {
        _this.setData({ loading: false })
      }
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})
// pages/lists/manage/home/index.js
const { $Message } = require("../../../../dist/base/index");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tools: [{
      logo: '../../../../assets/images/otherIcon/manage/person.png',
      title: '人员管理',
      url: "../person/index"
    }, {
      logo: '../../../../assets/images/otherIcon/manage/bookrack.png',
      title: '书本管理',
      url: "../bookrack/index"
    }, {
      logo: '../../../../assets/images/otherIcon/manage/location.png',
      title: '位置管理',
      url: "../location/index"
    }, {
      logo: '../../../../assets/images/otherIcon/manage/addtype.png',
      title: '加入方式',
      url: "../addtype/index"
    }],
    uuid: "",
    loading: false,
    is_passwd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let { uuid, title, is_passwd } = options;
    if (!uuid) {
      $Message({ type: "error", content: "未知错误" });
      time = setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 500);
      return;
    }
    wx.setNavigationBarTitle({
      title: `${title}-书架管理`,
    })
    this.setData({ uuid: uuid, title: title, is_passwd: is_passwd })
  },
  nav(res) {
    const url = res.currentTarget.dataset.url;
    const { uuid, title, is_passwd } = this.data;
    wx.navigateTo({
      url: `${url}?uuid=${uuid}&title=${title}&is_passwd=${is_passwd}`
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})
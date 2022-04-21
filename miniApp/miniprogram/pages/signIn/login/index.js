const app = getApp();
const { $Message } = require("../../../dist/base/index");
Page({
  data: {
    gender: "",
    number: "",
    password: "",
    current: 'tab1',
    email: "zeroicework@163.com"
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },

  bandleChange(e) {
    let gender = e.detail.value;
    this.setData({
      gender,
    });
  },
  toLogin: async function () {
    console.log("登录")
    wx.navigateTo({
      url: '../../index/home/index',
    })
  },

  navOauth: function () {
    wx.navigateTo({
      url: "../oauth/oauth",
    });
  },

  numberChange: function (e) {
    this.setData({
      number: e.detail.value,
    });
  },

  passwordChange: function (e) {
    this.setData({
      password: e.detail.value,
    });
  },
  navRegister: function () {
    wx.navigateTo({
      url: '../register/index',
    })
  }
});

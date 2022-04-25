// miniprogram/pages/signIn/index/index.js
const { $Message } = require("../../../dist/base/index");
const { authlogin, oauthtoken } = require("../../../utils/api/oauth");
let time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _token = wx.getStorageSync('_token');
    if (_token) {
      let _result = await oauthtoken(_token);
      if (_result) {
        wx.redirectTo({
          url: '../../index/home/index',
        })
      } else {
        $Message({
          content: '请先登录',
          type: 'warning'
        });
      }
    } else {
      $Message({
        content: '请先登录',
        type: 'warning'
      });
    }
  },
  onAccountLogin: function () {
    wx.navigateTo({
      url: "../login/index",
    });
  },
  getUserProfile() {
    let _this = this;
    wx.getUserProfile({
      desc: '使用过程中需要使用',
      success: (res) => {
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(res.userInfo),
          success: async function () {
            _this.auth();
          }
        })
      },
      fail: function (err) {
        $Message({
          content: '用户拒绝',
          type: 'warning'
        });
      }
    })
  },
  async auth() {
    let _this = this;
    this.setData({ loading: true });
    let _reuslt = await authlogin();
    if (_reuslt.code == 301) { // 未注册跳转
      $Message({
        content: '请先注册',
        type: 'warning'
      });
      time = setTimeout(() => {
        wx.navigateTo({
          url: '../register/index',
        })
        _this.setData({ loading: false });
      }, 500)
    } else if (_reuslt.code == 400) {
      $Message({
        content: '未知错误',
        type: 'error'
      });
      _this.setData({ loading: false });
    } else { // 授权成功跳转
      $Message({
        content: '授权成功',
        type: 'success'
      });
      wx.setStorageSync('_token', _reuslt.token);
      time = setTimeout(() => {
        wx.redirectTo({
          url: '../../index/home/index',
        })
        _this.setData({ loading: false });
      }, 500)
    }
  },
  navProtocol() {
    wx.navigateTo({
      url: '../../attention/protocol/index',
    })
  },
  navPrivacy() {
    wx.navigateTo({
      url: '../../attention/privacy/index',
    })
  },
  onHide() {
    if (time) clearTimeout(time);
  }
})
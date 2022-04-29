// pages/index/editemail/index.js
const { $Message } = require("../../../dist/base/index");
const { sendemail, editemail } = require("../../../utils/api/user");
let emailOldTime = null;
let emailNewTime = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldEmail: "",
    oldEmailCode: "",
    oldEmailNum: 60,
    isSendOldEmail: false,
    newEmail: "",
    newEmailCode: "",
    newEmailNum: 60,
    isSendNewEmail: false,
    loading: false,
    token: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('_token');
    let mine = wx.getStorageSync('mine');
    this.setData({ token, oldEmail: JSON.parse(mine).email });
  },
  oldEmailCodeChange: function (e) {
    this.setData({
      oldEmailCode: e.detail.detail.value,
    });
  },
  newEmailCodeChange: function (e) {
    this.setData({
      newEmailCode: e.detail.detail.value,
    });
  },
  newEmailChange(e) {
    this.setData({
      newEmail: e.detail.detail.value,
    });
  },
  async sendOldEmail() {
    let _this = this;
    let { oldEmail, token } = this.data;
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(oldEmail)) {
      $Message({ content: '邮箱格式有问题', type: 'warning' });
      return;
    }
    wx.showLoading({ title: "正在发送", mask: true, });
    let _email = await sendemail({ email: oldEmail }, token);
    if (_email.code != 200) {
      $Message({ content: _email.msg, type: 'error' });
      wx.hideLoading();
      return;
    }
    wx.hideLoading();
    _this.setData({
      isSendOldEmail: true, oldEmailNum: 60,
    });
    emailOldTime = setInterval(() => {
      if (_this.data.oldEmailNum <= 0) {
        clearInterval(emailOldTime);
        _this.setData({
          oldEmailNum: 60,
          isSendOldEmail: false,
        });
      }
      _this.setData({
        oldEmailNum: _this.data.oldEmailNum - 1,
      });
    }, 1000);
    $Message({ content: "邮箱验证码发送成功", type: "success" });
  },
  async sendNewEmail() {
    let _this = this;
    let { newEmail, token } = this.data;
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(newEmail)) {
      $Message({ content: '邮箱格式有问题', type: 'warning' });
      return;
    }
    wx.showLoading({ title: "正在发送", mask: true, });
    let _email = await sendemail({ email: newEmail }, token);
    if (_email.code != 200) {
      $Message({ content: _email.msg, type: 'error' });
      wx.hideLoading();
      return;
    }
    wx.hideLoading();
    _this.setData({
      isSendNewEmail: true, newEmailNum: 60,
    });
    emailNewTime = setInterval(() => {
      if (_this.data.newEmailNum <= 0) {
        clearInterval(emailNewTime);
        _this.setData({
          newEmailNum: 60,
          isSendNewEmail: false,
        });
      }
      _this.setData({
        newEmailNum: _this.data.newEmailNum - 1,
      });
    }, 1000);
    $Message({ content: "邮箱验证码发送成功", type: "success" });
  },
  async editemail() {
    let { oldEmailCode, newEmail, newEmailCode, token } = this.data;
    if (!oldEmailCode || !newEmail || !newEmailCode) {
      $Message({ content: '字段不能为空', type: 'warning' });
      return;
    }
    wx.showLoading({ title: "正在更新", mask: true, });
    let _result = await editemail({
      old_email_code: oldEmailCode, new_email: newEmail, new_email_code: newEmailCode
    }, token);
    if (_result.code != 200) {
      $Message({ content: _result.msg, type: 'error' });
      wx.hideLoading()
      return;
    }
    $Message({ content: "修改成功", type: 'success' });
    this.setData({ oldEmail: newEmail })
    wx.hideLoading()
  }
})
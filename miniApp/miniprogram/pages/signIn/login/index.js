const app = getApp();
const { $Message } = require("../../../dist/base/index");
const { checkEmail } = require("../../../utils/utils");
const md5 = require("../../../utils/md5");
const { accountlogin, sendloginemail, emaillogin } = require("../../../utils/api/oauth");
let time = null;
let emailTime = null;
Page({
  data: {
    password: "",
    current: 'tab1',
    email: "",
    loading: false,
    emailNum: 60,
    isSendEmail: false,
    emailCode: ''
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  // 立即登录
  toLogin: async function () {
    const email = this.data.email;
    const current = this.data.current;
    if (!checkEmail(email)) {
      $Message({ type: "warning", content: "邮箱格式错误" });
      return;
    }
    let password = this.data.password;
    let emailCode = this.data.emailCode;
    let _result = null;
    if (current == 'tab1' && !password) {
      $Message({ type: "warning", content: "请输入密码" });
      return;
    }
    if (current == 'tab2' && !emailCode) {
      $Message({ type: "warning", content: "请输入验证码" });
      return;
    }
    if (current == 'tab1') password = md5(password);
    this.setData({ loading: true });
    // 判断是那个方式登录
    if (current == 'tab1') _result = await accountlogin({ email: email, password: password });
    else _result = await emaillogin({ email: email, emailCode: emailCode });
    this.setData({ loading: false });
    if (_result.code != 200) {
      $Message({ type: "error", content: _result.msg });
      return;
    }
    wx.setStorageSync('_token', _result.token)
    time = setTimeout(() => {
      wx.redirectTo({
        url: '../../index/home/index',
      })
    }, 500)
  },
  emailChange: function (e) {
    this.setData({
      email: e.detail.value,
    });
  },
  emailChange2: function (e) {
    this.setData({
      email: e.detail.detail.value,
    });
  },
  emailCodeChange: function (e) {
    this.setData({
      emailCode: e.detail.detail.value,
    });
  },
  passwordChange: function (e) {
    this.setData({
      password: e.detail.value,
    });
  },
  // 注册
  navRegister: function () {
    wx.navigateTo({
      url: '../register/index',
    })
  },
  onHide() {
    if (time) clearTimeout(time);
    if (emailTime) clearTimeout(emailTime);
  },
  async sendCode() {
    let _this = this;
    let email = this.data.email;
    if (!checkEmail(email)) {
      $Message({ content: '邮箱格式有问题', type: 'warning' });
      return;
    }
    wx.showLoading({ title: "正在发送", mask: true });
    let _email = await sendloginemail(email);
    if (_email.code != 200) {
      $Message({ content: _email.msg, type: 'error' });
      wx.hideLoading();
      return;
    }
    wx.hideLoading();
    _this.setData({
      isSendEmail: true,
      emailNum: 60,
    });
    emailTime = setInterval(() => {
      if (_this.data.emailNum <= 0) {
        clearInterval(emailTime);
        _this.setData({
          emailNum: 60,
          isSendEmail: false,
        });
      }
      _this.setData({
        emailNum: _this.data.emailNum - 1,
      });
    }, 1000);
    $Message({
      content: "邮箱验证码发送成功",
      type: "success",
    });
  }
});

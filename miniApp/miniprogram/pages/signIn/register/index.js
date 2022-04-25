// const get = require("../../../utils/get");
const app = getApp();
var emailTime = null;
let time = null;
const { $Message } = require("../../../dist/base/index");
const getRandomStr = require("../../../utils/utils").getRandomStr;
const { sendemail, register } = require("../../../utils/api/oauth");
const md5 = require('../../../utils/md5');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maxNumber: 100, //可输入最大字数
    number: 0, //已输入字数
    desc: "",
    userInfo: {},
    password: "",
    password2: "",
    email: "",
    emailCode: "",
    isSendEmail: false,
    emailNum: 60,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      _this.setData({
        userInfo: JSON.parse(userInfo)
      })
    }
  },
  inputText: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    if (len > this.data.maxNumber) {
      _this.setData({
        number: this.data.maxNumber,
      });
      return;
    }
    this.setData({
      number: len,
      desc: value,
    });
  },
  submit: async function () {
    let _this = this;
    let { avatarUrl, nickName } = this.data.userInfo;
    let { password, password2, email, emailCode, desc } = this.data;
    if (!avatarUrl || !nickName || !password || !password2 || !email || !emailCode) {
      $Message({ content: '请填写必要字段', type: 'warning' });
      return;
    }
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(email)) {
      $Message({ content: '邮箱格式有问题', type: 'warning' });
      return;
    }
    if (password != password2) {
      $Message({ content: '前后两次密码不一样', type: 'warning' });
      return;
    }
    password = md5(password);
    this.setData({ loading: true });
    let _result = await register({
      avatarUrl: avatarUrl,
      nickName: nickName,
      password: password,
      email: email,
      emailCode: emailCode,
      desc: desc
    });
    if (_result.code != 200) {
      $Message({ content: _result.msg, type: 'error' });
      this.setData({ loading: false });
      return;
    }

    this.setData({ loading: false });
  },
  sendEmail: async function () {
    let _this = this;
    let email = this.data.email;
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!reg.test(email)) {
      $Message({ content: '邮箱格式有问题', type: 'warning' });
      return;
    }
    wx.showLoading({
      title: "正在发送",
      mask: true,
    });
    let _email = await sendemail(email);
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
  },
  emailCodeChange: function (e) {
    this.setData({
      emailCode: e.detail.detail.value,
    });
  },
  nickNameChange: function (e) {
    this.setData({
      [`userInfo.nickName`]: e.detail.detail.value,
    });
  },
  passwordChange: function (e) {
    this.setData({
      password: e.detail.detail.value,
    });
  },
  password2Change: function (e) {
    this.setData({
      password2: e.detail.detail.value,
    });
  },
  emailChange: function (e) {
    this.setData({
      email: e.detail.detail.value,
    });
  },
  modifyAvatar: function () {
    let _this = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      camera: 'back',
      success(res) {
        _this.setData({ loading: true })
        let suffix = '.jpeg'
        let cloudPath = 'images/' + getRandomStr() + suffix;
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: res.tempFiles[0].tempFilePath,
          success: res => {
            console.log(res.fileID);
            _this.setData({ ['userInfo.avatarUrl']: res.fileID });
          },
          complete() {
            _this.setData({ loading: false })
          }
        })
      }
    })
  },
  getUser: function () {
    let _this = this;
    wx.getUserProfile({
      desc: '使用过程中需要使用',
      success: (res) => {
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(res.userInfo),
          success: function () {
            $Message({ content: '授权成功', type: 'success' })
            _this.setData({
              userInfo: res.userInfo
            })
          }
        })
      },
      fail: function (err) {
        $Message({ content: '用户拒绝', type: 'warning' });
      }
    })
  },
  bindgetuserinfo: function (res) {
    console.log(res)
  },
  onHide() {
    clearTimeout(time);
    clearTimeout(emailTime);
  }
});

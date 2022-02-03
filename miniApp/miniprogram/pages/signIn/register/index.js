// const get = require("../../../utils/get");
const app = getApp();
var emailTime = null;
const { $Message } = require("../../../dist/base/index");
// const getRequest = require("../../../utils/requests");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    school: "",
    maxNumber: 100, //可输入最大字数
    number: 0, //已输入字数
    msg: "",
    userInfo: {},
    studentId: "",
    password: "",
    password2: "",
    phone: "",
    email: "1724264854@qq.com",
    phoneCode: "",
    emailCode: "2045",
    isSendPhone: false,
    isSendEmail: false,
    emailNum: 60,
    isOauth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;

  },
  onShow: function () {
    let _this = this;

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
      msg: value,
    });
  },
  submit: function () {
    let _this = this;
    console.log("submit")
  },
  sendEmail: async function () {
    let _this = this;
    wx.showLoading({
      title: "正在发送",
      mask: true,
    });
    // let data = {
    //   url: `http://${app.ip}:${app.port}/oauths/sendEmail`,
    //   method: "post",
    //   item: {
    //     email: _this.data.email,
    //   },
    // };
    // let result = await getRequest.Request(data, () => {
    wx.hideLoading();
    // });
    // if (result.data.type == "success") {
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
    // }
  },
  emailCodeChange: function (e) {
    this.setData({
      emailCode: e.detail.detail.value,
    });
  },
  phoneCodeChange: function (e) {
    this.setData({
      phoneCode: e.detail.detail.value,
    });
  },
  nickNameChange: function (e) {
    this.setData({
      [`userInfo.nickName`]: e.detail.detail.value,
    });
  },
  studentIdChange: function (e) {
    this.setData({
      studentId: e.detail.detail.value,
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
  schoolChange: function (e) {
    this.setData({
      school: e.detail.detail.value,
    });
  },
  phoneChange: function (e) {
    this.setData({
      phone: e.detail.detail.value,
    });
  },
  phoneCodeChange: function (e) {
    this.setData({
      phoneCode: e.detail.detail.value,
    });
  },
  emailChange: function (e) {
    this.setData({
      email: e.detail.detail.value,
    });
  },
  phoneChange: function (e) {
    this.setData({
      phone: e.detail.detail.value,
    });
  },
  onShow: async function () {
    let school = await wx.getStorageSync("schools");
    if (school) {
      (school = JSON.parse(school)),
        this.setData({
          schoolId: school,
          school: school.name,
        });
    }
  },
  modifyAvatar: function () {
    console.log("修改头像")
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
            $Message({
              content: '授权成功',
              type: 'success'
            })
            _this.setData({
              userInfo: res.userInfo,
              isOauth: true
            })
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
  bindgetuserinfo: function (res) {
    console.log(res)
  }
});

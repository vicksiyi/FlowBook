// pages/index/editpasswd/index.js
const { $Message } = require("../../../dist/base/index");
const { editpasswd } = require("../../../utils/api/user");
const md5 = require("../../../utils/md5");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    old_passwd: "",
    new_passwd: "",
    new_passwds: "",
    loading: false,
    token: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('_token');
    this.setData({ token: token })
  },
  oldPasswdChange(e) {
    this.setData({ old_passwd: e.detail.detail.value })
  },
  newPasswdChange(e) {
    this.setData({ new_passwd: e.detail.detail.value })
  },
  newPasswdsChange(e) {
    this.setData({ new_passwds: e.detail.detail.value })
  },
  async edit() {
    let { old_passwd, new_passwd, new_passwds, token } = this.data;
    if (!old_passwd || !new_passwd || !new_passwds) {
      $Message({ content: '字段不可为空', type: 'warning' });
      return;
    }
    if (new_passwd != new_passwds) {
      $Message({ content: '新密码两次不一致', type: 'warning' });
      return;
    }
    this.setData({ loading: true });
    old_passwd = md5(old_passwd);
    new_passwd = md5(new_passwd);
    let _result = await editpasswd({
      old_passwd, new_passwd
    }, token);
    if (_result.code != 200) {
      $Message({ content: _result.msg, type: 'error' });
      this.setData({ loading: false });
      return;
    }
    $Message({ content: "修改成功", type: 'success' });
    this.setData({ old_passwd: "", new_passwd: "", new_passwds: "", loading: false })
  }
})
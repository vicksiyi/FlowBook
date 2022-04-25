
const axios = require("../request");
// 获取loginCode
const getLoginCode = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) resolve(res.code);
        else reject(res.errMsg);
      }
    })
  })
}

exports.authlogin = async () => {
  let code = await getLoginCode(); // 获取登录code
  return new Promise((resolve, reject) => {
    axios.request(`/oauth/authlogin/${code}`, {})
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

exports.register = async (data) => {
  let code = await getLoginCode(); // 获取登录code
  return new Promise((resolve, reject) => {
    axios.request(`/oauth/register`, {
      data: { ...data, code: code },
      method: "POST"
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

exports.sendemail = async (emdil) => {
  return new Promise((resolve, reject) => {
    axios.request(`/oauth/sendemail/${emdil}`, {
      method: "PUT"
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

exports.oauthtoken = (token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/oauth/oauthtoken`, {
      header: {
        Authorization: token
      },
      method:'PUT'
    })
      .then((res) => {
        if (res.data.code == 200) { resolve(true); }
      })
      .catch(err => {
        resolve(false)
      })
  })
}

// 账号密码登录
exports.accountlogin = async (data) => {
  let code = await getLoginCode(); // 获取登录code
  return new Promise((resolve, reject) => {
    axios.request(`/oauth/accountlogin`, {
      data: { ...data, code: code },
      method: "POST"
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

// 验证码登录
exports.emaillogin = async (data) => {
  let code = await getLoginCode(); // 获取登录code
  return new Promise((resolve, reject) => {
    axios.request(`/oauth/emaillogin`, {
      data: { ...data, code: code },
      method: "POST"
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

// 登录验证码
exports.sendloginemail = async (emdil) => {
  return new Promise((resolve, reject) => {
    axios.request(`/oauth/sendloginemail/${emdil}`, {
      method: "PUT"
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}
const axios = require("../request");
// 创建书架
exports.mine = async (token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/user/mine`, {
      header: {
        Authorization: token
      }
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

// 更新用户信息
exports.edit = async (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/user/edit`, {
      data: data,
      header: {
        Authorization: token
      },
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

// 更新密码
exports.editpasswd = async (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/user/editpasswd`, {
      data: data,
      header: {
        Authorization: token
      },
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
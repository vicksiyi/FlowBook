
const axios = require("../request");

// 创建书架
exports.create = async (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/create`, {
      data: data,
      header: {
        Authorization: token
      },
      method: 'POST'
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

// 创建书架
exports.getminebookrack = async (token, page) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getminebookrack/${page}`, {
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
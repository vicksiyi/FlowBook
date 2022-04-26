
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

// 获取我的书架
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

// 搜索书架
exports.search = (keyword, page, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/search?keyword=${keyword}&page=${page}`, {
      header: {
        Authorization: token
      }
    })
      .then((res) => {
        if (res.data) { resolve(res.data); }
      })
      .catch(err => reject(err))
  })
}

// 加入书架
exports.joinbookrack = (id, passwd, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/joinbookrack`, {
      data: { passwd: passwd, id: id },
      header: {
        Authorization: token,
      },
      method: 'POST'
    })
      .then((res) => {
        if (res.data) { resolve(res.data); }
      })
      .catch(err => reject(err))
  })
}

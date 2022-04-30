
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


// 查看书架[我加入的]
exports.getjoinbookrack = (page, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getjoinbookrack?page=${page}`, {
      header: {
        Authorization: token,
      }
    })
      .then((res) => {
        if (res.data) { resolve(res.data); }
      })
      .catch(err => reject(err))
  })
}

// 上架图书
exports.upbook = (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/upbook`, {
      data: data,
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

// 查询书架上面的图书【唯一】
exports.getbookrackbooks = (page, bookrack_id, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getbookrackbooks?page=${page}&bookrack_id=${bookrack_id}`, {
      header: {
        Authorization: token,
      }
    })
      .then((res) => {
        if (res.data) { resolve(res.data); }
      })
      .catch(err => reject(err))
  })
}

// 获取在架情况
exports.getbookupdetail = (page, bookrack_id, isbn, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getbookupdetail?page=${page}&bookrack_id=${bookrack_id}&isbn=${isbn}`, {
      header: {
        Authorization: token,
      }
    })
      .then((res) => {
        if (res.data) { resolve(res.data); }
      })
      .catch(err => reject(err))
  })
}

// 获取书本图片
exports.getimages = (id, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getimages?id=${id}`, {
      header: {
        Authorization: token,
      }
    })
      .then((res) => {
        if (res.data) { resolve(res.data); }
      })
      .catch(err => reject(err))
  })
}

// 获取书本信息
exports.getbookdetail = (isbn, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getbookdetail?isbn=${isbn}`, {
      header: {
        Authorization: token,
      }
    })
      .then((res) => {
        if (res.data) { resolve(res.data); }
      })
      .catch(err => reject(err))
  })
}


// 获取位置
exports.getlocation = async (uuid, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getlocation?bookrack_id=${uuid}`, {
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

// 借书
exports.borrowbook = async (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/borrowbook`, {
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

// 借阅情况
exports.getdetailborrow = async (isbn, bookrack_id, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/getdetailborrow?isbn=${isbn}&bookrack_id=${bookrack_id}`, {
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


// 归还图书
exports.backbook = async (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/bookrack/backbook`, {
      data: data,
      header: {
        Authorization: token
      },
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
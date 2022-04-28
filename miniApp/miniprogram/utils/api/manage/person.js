const axios = require("../../request");
// 获取书架上人数
exports.getpersons = async (uuid, page, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/manage/person/getpersons?bookrack_id=${uuid}&page=${page}`, {
      header: {
        Authorization: token
      },
    })
      .then((res) => {
        if (res.data) {
          resolve(res.data);
        }
      })
      .catch(err => reject(err))
  })
}

// 更新用户状态 
exports.updateperson = async (uuid, user_id, status, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/manage/person/updateperson?bookrack_id=${uuid}&user_id=${user_id}&status=${status}`, {
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
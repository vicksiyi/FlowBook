const axios = require("../../request");
// 添加位置
exports.create = async (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/manage/location/create`, {
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


// 获取位置
exports.getlocation = async (uuid, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/manage/location/getlocation?bookrack_id=${uuid}`, {
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

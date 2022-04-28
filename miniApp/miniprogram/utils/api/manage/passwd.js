const axios = require("../../request");
// 更新密码
exports.updatepasswd = async (data, token) => {
  return new Promise((resolve, reject) => {
    axios.request(`/manage/type/updatepasswd`, {
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
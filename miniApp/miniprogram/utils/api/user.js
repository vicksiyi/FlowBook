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
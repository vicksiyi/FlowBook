
const axios = require("./request");

exports.getBook = async (isbn) => {
  return new Promise((resolve, reject) => {
    axios.request(``, {
      url: `https://jisuisbn.market.alicloudapi.com/isbn/query?isbn=${isbn}`,
      header: { Authorization: `APPCODE be335a0c711c43cfa4af29a024e7b388` }
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch(err => reject(err))
  })
}
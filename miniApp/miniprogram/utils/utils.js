exports.getRandomStr = function () {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = 17; i > 0; --i) {
    randomStr += str[Math.floor(Math.random() * str.length)];
  }
  randomStr += new Date().getTime()
  return randomStr;
}

exports.checkEmail = function (email) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(email);
}
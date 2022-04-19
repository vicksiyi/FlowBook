exports.getRandomStr = function () {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomStr = '';
  for (let i = 17; i > 0; --i) {
    randomStr += str[Math.floor(Math.random() * str.length)];
  }
  randomStr += new Date().getTime()
  return randomStr;
}
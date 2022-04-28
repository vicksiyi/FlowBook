const express = require('express');
const router = express.Router();
const passport = require("passport");
const utils = require('../../utils/utils');
const type = require('../../model/manage/type');

// $routes /manage/passwd/updatepasswd
// @desc 更新密码
// @access private
router.post('/updatepasswd', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { passwd, bookrack_id } = req.body;
    let _result = await type.update_passwd(passwd, bookrack_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200 })
})
module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require("passport");

// $routes /user/mine
// 获取个人信息
// @access private
router.get('/mine', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { avatar, nick_name, desc, email, time } = req.user;
    res.json({
        code: 200,
        data: { avatar, nick_name, desc, email, time }
    })
})

module.exports = router;
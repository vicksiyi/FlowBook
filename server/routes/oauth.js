const express = require('express');
const router = express.Router();
const passport = require("passport");

// $routes /test/test
// @desc 测试
// @access private
router.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({
        msg: '成功'
    })
})
module.exports = router;
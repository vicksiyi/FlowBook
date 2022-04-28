const express = require('express');
const router = express.Router();
const passport = require("passport");
const utils = require('../../utils/utils');
const person = require('../../model/manage/person');

// $routes /manage/person/getpersons?bookrack_id&page
// @desc 获取所有加入的用户
// @access private
router.get('/getpersons', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { bookrack_id, page } = req.query;
    if (page < 1) { res.send({ code: 400, msg: '页码错误' }); return; }
    else page = page - 1;
    let _result = await person.query_persons(bookrack_id, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result = _result.map(value => {
        value.time = utils.formatTimestamp(new Date(value.time).getTime()).split(" ")[0];
        return value;
    })
    res.json({ code: 200, data: _result })
})

// $routes /manage/person/updateperson?bookrack_id&user_id&status
// @desc 更新用户状态
// @access private
router.put('/updateperson', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { bookrack_id, user_id, status } = req.query;
    let _result = await person.update_person(bookrack_id, user_id, status).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200})
})
module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require("passport");
const utils = require('../../utils/utils');
const location = require('../../model/manage/location');

// $routes /manage/location/create
// @desc 添加位置信息
// @access private
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { distance, desc, latitude, longitude, uuid } = req.body;
    let _result = await location.insert_location(longitude, latitude, desc, distance, uuid).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200 })
})

// $routes /manage/location/getlocation?bookrack_id
// @desc 获取位置信息
// @access private
router.get('/getlocation', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { bookrack_id } = req.query;
    let _result = await location.query_location(bookrack_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200, data: _result });
})
module.exports = router;
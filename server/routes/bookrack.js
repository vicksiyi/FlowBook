const express = require('express');
const router = express.Router();
const passport = require("passport");
const keys = require('../config/keys');
const utils = require('../utils/utils');
const bookrack = require('../model/bookrack');

// $routes /bookrack/create
// 创建书架
// @access public
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { open_id } = req.user;
    const { title, desc, passwd, logo } = req.body;
    const author = open_id;
    const manage = 7;
    let _result = await bookrack.create(title, desc, passwd, logo, manage, author).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200 });
})

// $routes /bookrack/getminebookrack
// 获取我的书架
// @access public
router.get('/getminebookrack/:page', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let page = req.params.page;
    if (page < 1) { res.send({ code: 400, msg: '页码错误' }); return; }
    else page = page - 1;
    let { open_id, nick_name } = req.user;
    let _result = await bookrack.query_user(open_id, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result.map((value) => {
        value.nick_name = nick_name;
        value.time = utils.formatTimestamp(new Date(value.time).getTime());
        value.is_passwd = value.passwd != '';
        value.passwd = "";
        return value;
    })
    res.send({ code: 200, data: _result })
})

// $routes /bookrack/search?
// 查询书架
// @access public
router.get('/search', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { page, keyword } = req.query;
    if (page < 1) { res.send({ code: 400, msg: '页码错误' }); return; }
    else page = page - 1;
    let _result = await bookrack.search_title(keyword, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result.map((value) => {
        value.time = utils.formatTimestamp(new Date(value.time).getTime());
        value.is_passwd = value.passwd != '';
        value.passwd = "";
        return value;
    })
    res.send({ code: 200, data: _result })
})

// $routes /bookrack/joinbookrack
// 加入书架
// @access public
router.post('/joinbookrack', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { passwd, id } = req.body;
    let { open_id } = req.user;
    let _result = utils.toJson(await bookrack.query_bookrack_user(id, open_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    }))[0];
    if (_result.num != 0) {
        res.json({ code: 400, msg: '不可重复加入' });
        return;
    }
    _result = await bookrack.query_bookrack(id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length === 0) {
        res.json({ code: 400, msg: '书架不存在' })
        return;
    }
    _result = utils.toJson(_result)[0];
    if (!_result.passwd || _result.passwd == passwd) {
        _result = await bookrack.add_bookrack(id, open_id).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        });
        res.json({ code: 200 })
    } else {
        res.json({ code: 400, msg: '密码错误' });
    }
})

// $routes /bookrack/getjoinbookrack?page
// 查询我加入的书架
// @access public
router.get('/getjoinbookrack', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { page } = req.query;
    let { open_id } = req.user;
    if (page < 1) { res.send({ code: 400, msg: '页码错误' }); return; }
    else page = page - 1;
    let _result = await bookrack.get_join_bookrack(open_id, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length !== 0) {
        _result = utils.toJson(_result);
        _result = _result.map(value=>{
            value.time = utils.formatTimestamp(new Date(value.time).getTime());
            return value;
        })
    }
    res.json({ code: 200, data: _result });
})
module.exports = router;
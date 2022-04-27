const express = require('express');
const router = express.Router();
const passport = require("passport");
const keys = require('../config/keys');
const utils = require('../utils/utils');
const bookrack = require('../model/bookrack');
const transaction = require('../model/transaction');

// $routes /bookrack/create
// 创建书架
// @access private
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
// @access private
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
// @access private
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
// @access private
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
// @access private
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
        _result = _result.map(value => {
            value.time = utils.formatTimestamp(new Date(value.time).getTime());
            return value;
        })
    }
    res.json({ code: 200, data: _result });
})

// $routes /bookrack/upbook
// 上架图书
// @access private
router.post('/upbook', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { isbn, title, desc, author,
        publisher, pubdate, msg, max_time,
        images, uuid, img, id } = req.body;
    let book_id = null;
    if (!id) {
        res.json({ code: 400, msg: "未加入书架" });
        return;
    }
    // 查看书架是否存在 - 不存在则返回
    let _reuslt = await bookrack.query_bookrack(uuid).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_reuslt.length < 1) {
        res.json({ code: 400, msg: '书架不存在' })
        return;
    }
    // 查看作者是否存在 -不存在则添加
    _result = await bookrack.get_author(author).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length < 1) {
        _result = await bookrack.insert_author(author).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        });
        author = utils.toJson(_result).insertId;
    } else {
        author = utils.toJson(_result)[0].id;
    }
    // 查看出版社是否存在 - 不存在则添加
    _result = await bookrack.get_publisher(publisher).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length < 1) {
        _result = await bookrack.insert_publisher(publisher).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        });
        publisher = utils.toJson(_result).insertId;
    } else {
        publisher = utils.toJson(_result)[0].id;
    }
    // 查看书本是否存在 -不存在则添加
    _result = await bookrack.get_book(isbn).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length < 1) {
        pubdate = utils.formatTimestamp(new Date(pubdate).getTime());
        _result = await bookrack.insert_book(isbn, title, desc, author, publisher, pubdate, img).catch(err => {
            res.json({ code: 400, msg: '未知错误' })
            throw new Error(err);
        });
        book_id = utils.toJson(_result).insertId;
    } else {
        book_id = utils.toJson(_result)[0].id;
    }
    // 开启事务
    transaction.start().catch(err => {
        res.json({ code: 400, msg: '未知错误' });
        throw err;
    });
    let sql = `insert into bookrack_rel_book(book_id,msg,max_time,bookrack_rel_user_id)
    values(${book_id},'${msg}','${max_time}',${id})`;
    transaction.query(sql).then((result) => {
        bookrack_rel_book_id = utils.toJson(result).insertId;
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < images.length; ++i) {
                sql = `insert into book_rel_img(url,bookrack_rel_book_id)
                values('${images[i]}',${bookrack_rel_book_id})`;
                let _temp = await (new Promise((resolve, reject) => {
                    transaction.query(sql).then(() => {
                        resolve()
                    }).catch((error) => reject(error));
                })).catch((error) => reject(error));
            }
            resolve();
        })
    }).then(() => {
        // 提交事务
        return new Promise((resolve, reject) => {
            transaction.commit().then(() => {
                res.json({ code: 200 })
            }).catch((error) => reject(error));
        })
    }).catch(err => {
        res.json({ code: 400, msg: '插入失败' })
        transaction.rollback(err);
    });
})
module.exports = router;
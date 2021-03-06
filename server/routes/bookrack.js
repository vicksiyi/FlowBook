const express = require('express');
const router = express.Router();
const passport = require("passport");
const keys = require('../config/keys');
const utils = require('../utils/utils');
const bookrack = require('../model/bookrack');
const location = require('../model/manage/location');
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
    let _result = await bookrack.query_bookrack_user(id, open_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    })
    if (_result.length != 0) {
        _result = utils.toJson(_result)[0];
        if (_result.status == 2) {
            res.json({ code: 400, msg: '已被拉入黑名单' });
        } else if (_result.status == 1) {
            res.json({ code: 400, msg: '不可重复加入' });
        } else {  // 退出，则重新加入
            _result = await bookrack.update_bookrack_user(id, open_id).catch(err => {
                res.json({ code: 400, msg: '未知错误' })
                throw new Error(err);
            });
            res.json({ code: 200 })
        }
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

// $routes /bookrack/getbookrackbooks?page&bookrack_id
// 查询书架上面的图书【唯一】
// @access private
router.get('/getbookrackbooks', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { page, bookrack_id } = req.query;
    if (page < 1) { res.send({ code: 400, msg: '页码错误' }); return; }
    else page = page - 1;
    let _result = await bookrack.get_bookrack_books(bookrack_id, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result = _result.map(value => {
        value.publish_date = utils.formatTimestamp(new Date(value.publish_date).getTime()).split(" ")[0];
        return value;
    })
    res.json({ code: 200, data: _result });
})

// $routes /bookrack/getbookupbookrack?page&bookrack_id&isbn
// 在架情况
// @access private
router.get('/getbookupdetail', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { page, bookrack_id, isbn } = req.query;
    if (page < 1) { res.send({ code: 400, msg: '页码错误' }); return; }
    else page = page - 1;
    let _result = await bookrack.get_book_up_detail(isbn, bookrack_id, page).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result = _result.map(value => {
        value.max_time = utils.formatTimestamp(new Date(value.max_time).getTime()).split(" ")[0];
        value.time = utils.formatTimestamp(new Date(value.time).getTime());
        return value;
    })
    res.json({ code: 200, data: _result });
})

// $routes /bookrack/getimages?id
// 获取书本图片
// @access private
router.get('/getimages', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { id } = req.query;
    let _result = await bookrack.get_images(id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length > 0) _result = utils.toJson(_result);
    res.json({ code: 200, data: _result })
})

// $routes /bookrack/getbookdetail?isbn
// 获取isbn信息
// @access private
router.get('/getbookdetail', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { isbn } = req.query;
    let _result = await bookrack.get_book_detail(isbn).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length > 0) _result = utils.toJson(_result);
    res.json({ code: 200, data: _result })
})

// $routes /bookrack/getlocation
// 获取位置
// @access private
router.get('/getlocation', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { bookrack_id } = req.query;
    let _result = await location.query_location(bookrack_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    res.json({ code: 200, data: _result });
})

// $routes /bookrack/borrowbook
// 借书
// @access private
router.put('/borrowbook', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { open_id } = req.user;
    let { end_time, brb_id, bookrack_id } = req.body;
    // 1、判断最大限期是否超越时间【end_time 与 max_time】
    end_time = new Date(end_time).getTime();
    let _result = await bookrack.get_brb_id_detail(brb_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_result.length === 0) {
        res.json({ code: 400, msg: '书本不存在' })
        return;
    }
    _result = utils.toJson(_result)[0];
    _result.max_time = _result.max_time ? new Date(_result.max_time).getTime() : "";
    if (_result.max_time != "" && _result.max_time < end_time) {
        res.json({ code: 400, msg: '借阅时间超过最大可借阅时间' })
        return;
    }
    // 获取用户ID
    let _user = await bookrack.query_bookrack_user(bookrack_id, open_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_user.length == 0) {
        res.json({ code: 400, msg: '用户未加入书架' })
        return;
    }
    _user = utils.toJson(_user)[0];
    // 3、判断是否已经借出 
    _result = utils.toJson(await bookrack.get_book_isexcit(brb_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    }))[0];
    if (_result.num > 0) {
        res.json({ code: 400, msg: '书本已经被借出' })
        return;
    }
    // 4、修改bookrack_rel_book状态
    // 5、插入book_rel_uer
    // 事务处理4、5
    // 开启事务
    transaction.start().catch(err => {
        res.json({ code: 400, msg: '未知错误' });
        throw err;
    });
    let sql = `update bookrack_rel_book set status = 2 where id = ${brb_id};`;
    transaction.query(sql).then(() => {
        return new Promise(async (resolve, reject) => {
            sql = `insert into book_rel_user(bookrack_rel_book_id,
            bookrack_rel_user_id,end_time) values(${brb_id},${_user.id},
            '${utils.formatTimestamp(end_time)}')`;
            transaction.query(sql).then(() => {
                resolve();
            }).catch((error) => reject(error));
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

// $routes /bookrack/getdetailborrow?isbn&bookrack_id
// 获取当前借阅的情况
// @access private
router.get('/getdetailborrow', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { open_id } = req.user;
    let { isbn, bookrack_id } = req.query;
    // 判断书本是否存在
    let _book = await bookrack.get_book_detail(isbn).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    if (_book.length == 0) {
        res.json({ code: 400, msg: "书本不存在" })
        return;
    }
    _book = _book.map(value => {
        value.publish_date = value.publish_date ? utils.formatTimestamp(new Date(value.publish_date).getTime()).split(" ")[0] : "";
        return value;
    })
    // 查找借阅信息
    let _result = await bookrack.get_book_users(bookrack_id, isbn, open_id).catch(err => {
        res.json({ code: 400, msg: '未知错误' })
        throw new Error(err);
    });
    _result = _result.map(value => {
        value.end_time = value.end_time ? utils.formatTimestamp(new Date(value.end_time).getTime()).split(" ")[0] : "";
        value.return_time = value.return_time ? utils.formatTimestamp(new Date(value.return_time).getTime()).split(" ")[0] : "";
        return value;
    })
    if (_result.length != 0) res.json({ code: 200, data: utils.toJson(_result)[0], book: utils.toJson(_book)[0] });
    else res.json({ code: 200, data: [], book: utils.toJson(_book)[0] });
})

// $routes /bookrack/backbook
// 还书
// @access private
router.post('/backbook', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { bru_id, brrb_id, images } = req.body;
    // 开启事务
    transaction.start().catch(err => {
        res.json({ code: 400, msg: '未知错误' });
        throw err;
    });
    let sql = `update book_rel_user set status = 1 where id = ${bru_id}`;
    transaction.query(sql).then(() => {
        sql = `update bookrack_rel_book set status = 1 where id = ${brrb_id}`;
        return new Promise(async (resolve, reject) => {
            transaction.query(sql).then(() => {
                resolve();
            }).catch(err => { reject(err) })
        })
    }).then(() => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < images.length; ++i) {
                sql = `insert into back_book_img(url,book_rel_user_id)
                values('${images[i]}',${bru_id})`;
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
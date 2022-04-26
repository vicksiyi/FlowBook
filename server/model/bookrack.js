const Handle = require("./handle");
class Bookrack extends Handle {
    constructor() { super(); }
    // 注册
    create(title, desc, passwd, logo, manage, author) {
        const sql = `insert into bookracks(title,\`desc\`,passwd,logo,manage,author)
        values('${title}','${desc}','${passwd}','${logo}',
        ${manage},'${author}')`;
        return super.commit(sql);
    }
    // 获取某个人的书架
    query_user(open_id, page) {
        const sql = `select * from bookracks where author = '${open_id}' 
        order by time desc limit ${page * 10},${10};`;
        return super.commit(sql);
    }
    // 查询通过title
    search_title(keyword, page) {
        const sql = `select b.*,u.nick_name from bookracks b inner join 
        users u on u.open_id = b.author where title like '%${keyword}%'
        order by time desc limit ${page * 10},${10};`;
        return super.commit(sql);
    }
    // 查看是否已经加入
    query_bookrack_user(bookrack_id, user_id) {
        const sql = `select count(1) as num from bookrack_rel_user
        where bookrack_id='${bookrack_id}' and user_id='${user_id}'`;
        return super.commit(sql);
    }
    // 获取书架信息
    query_bookrack(id) {
        const sql = `select * from bookracks where uuid='${id}'`;
        return super.commit(sql);
    }
    // 加入书架
    add_bookrack(bookrack_id, user_id, type = 0) {
        const sql = `insert into bookrack_rel_user(bookrack_id,user_id, type) values('${bookrack_id}','${user_id}',${type})`;
        return super.commit(sql);
    }
}
const bookrack = new Bookrack();
module.exports = bookrack;
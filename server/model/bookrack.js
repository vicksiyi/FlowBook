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
}
const bookrack = new Bookrack();
module.exports = bookrack;
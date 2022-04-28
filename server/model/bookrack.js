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
    // 更新加入状态
    update_bookrack_user(bookrack_id, user_id, status = 1) {
        const sql = `update bookrack_rel_user set status = ${status}
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
    // 获取我目前加入的书架
    get_join_bookrack(user_id, page) {
        const sql = `select bru.id,b.uuid,b.title,b.logo,b.desc,b.time,u.nick_name 
        from bookrack_rel_user bru 
        inner join bookracks b on b.uuid = bru.bookrack_id 
        inner join users u on u.open_id = b.author
        where bru.user_id = '${user_id}' order by b.time desc  
        limit ${page * 10},10;`;
        return super.commit(sql);
    }
    // 查看作者是否存在
    get_author(name) {
        const sql = `select * from authors where name = '${name}'`;
        return super.commit(sql);
    }
    // 插入作者
    insert_author(name) {
        const sql = `insert into authors(name) value("${name}")`;
        return super.commit(sql);
    }
    // 查看出版社是否存在
    get_publisher(name) {
        const sql = `select * from publish_houses where name = '${name}'`;
        return super.commit(sql);
    }
    // 插入作者
    insert_publisher(name) {
        const sql = `insert into publish_houses(name) value("${name}")`;
        return super.commit(sql);
    }
    // 获取书本
    get_book(isbn) {
        const sql = `select * from books where isbn = '${isbn}'`;
        return super.commit(sql);
    }
    // 添加书本
    insert_book(isbn, title, desc, author_id,
        publish_house_id, publish_date, img) {
        const sql = `insert into books(isbn,title,\`desc\`,author_id,
            publish_house_id,publish_date,img)
        values('${isbn}','${title}','${desc}',${author_id},
        ${publish_house_id},'${publish_date}','${img}');`;
        return super.commit(sql);
    }
    // 获取书架上图书[唯一]
    get_bookrack_books(bookrack_id, page) {
        const sql = `select b.id,b.isbn,b.title,b.desc,a.name as author,
        ph.name as publisher,publish_date,b.img from books b 
        inner join (select DISTINCT b.isbn from bookrack_rel_book brb 
        inner join books b on b.id = brb.book_id 
        inner join bookrack_rel_user bru on bru.id = brb.bookrack_rel_user_id
        where brb.status = 1 and bru.bookrack_id = '${bookrack_id}') disb on disb.isbn = b.isbn
        inner join authors a on a.id = b.author_id
        inner join publish_houses ph on ph.id = b.publish_house_id
        limit ${page * 10},10`;
        return super.commit(sql);
    }
    // 上架情况
    get_book_up_detail(isbn, bookrack_id, page) {
        const sql = `select u.avatar,u.nick_name,brb.max_time,
        brb.id,brb.status,brb.msg,brb.time
        from bookrack_rel_book brb
        inner join books b on b.id = brb.book_id
        inner join bookrack_rel_user bru on bru.id = brb.bookrack_rel_user_id
        inner join users u on u.open_id = bru.user_id
        where b.isbn = '${isbn}' and bru.bookrack_id = '${bookrack_id}'
        order by brb.time desc limit ${page * 10},10;`;
        return super.commit(sql);
    }
    // 获取上架图片
    get_images(id){
        const sql = `select * from book_rel_img where bookrack_rel_book_id = ${id}`;
        return super.commit(sql);
    }
    // 获取isbn图书信息
    get_book_detail(isbn){
        const sql = `select b.id,b.title,b.isbn,b.desc,a.name as author,
        ph.name as publisher,b.publish_date,b.img,b.time from books b
        inner join authors a on a.id = b.author_id
        inner join publish_houses ph on ph.id = b.publish_house_id where isbn = '${isbn}'`;
        return super.commit(sql);
    }
}
const bookrack = new Bookrack();
module.exports = bookrack;
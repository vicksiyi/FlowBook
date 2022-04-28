const Handle = require("../handle");
class Person extends Handle {
    constructor() { super(); }
    // 获取书架上所有 目前在和被封号的用户
    query_persons(bookrack_id, page) {
        const sql = `select u.open_id as user_id,u.nick_name,u.avatar,bru.status,bru.time 
        from bookrack_rel_user bru
        inner join users u on u.open_id = bru.user_id
        where bru.status != 0 and bru.bookrack_id = '${bookrack_id}'
        limit ${page * 10},10;`;
        return super.commit(sql);
    }
    // 更新用户状态
    update_person(bookrack_id, user_id, status = 1) {
        const sql = `update bookrack_rel_user set status = ${status}
        where bookrack_id = '${bookrack_id}' and user_id = '${user_id}'`;
        return super.commit(sql);
    }
}
const person = new Person();
module.exports = person;
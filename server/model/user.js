const Handle = require("./handle");
class User extends Handle {
    constructor() { super(); }
    // 判断openId是否已经注册
    query_openid(open_id, email = '') {
        const sql = `select count(1) as num from users where open_id = '${open_id}' or email = '${email}'`;
        return super.commit(sql);
    }
    // 查找用户
    query_user(open_id = '', email = '') {
        const sql = `select * from users where open_id = '${open_id}' or email = '${email}'`;
        return super.commit(sql);
    }
    // 注册
    register(openid, avatarUrl, nickName, desc, email, password) {
        const sql = `insert into users(open_id,avatar,nick_name,\`desc\`,email,passwd)
        values('${openid}', '${avatarUrl}', '${nickName}', '${desc}',
        '${email}', '${password}')`;
        return super.commit(sql);
    }
    // 修改用户信息
    edit_user(avatar, nick_name, desc, open_id) {
        const sql = `update users set avatar='${avatar}',nick_name='${nick_name}',
        \`desc\`='${desc}' where open_id = '${open_id}'`;
        return super.commit(sql);
    }
    // 修改密码
    edit_passwd(open_id, passwd) {
        const sql = `update users set passwd='${passwd}' where open_id = '${open_id}'`;
        return super.commit(sql);
    }
}
const user = new User();
module.exports = user;
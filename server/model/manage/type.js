const Handle = require("../handle");
class Type extends Handle {
    constructor() { super(); }
    update_passwd(passwd, bookrack_id) {
        const sql = `update bookracks set passwd = '${passwd}'
        where uuid = '${bookrack_id}'`;
        return super.commit(sql);
    }
}
const type = new Type();
module.exports = type;
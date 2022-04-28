const Handle = require("../handle");
class Location extends Handle {
    constructor() { super(); }
    insert_location(longitude, latitude, desc, distance, uuid) {
        const sql = `insert into locations(longitude, latitude, \`desc\`, distance,bookrack_id)
        values('${longitude}','${latitude}','${desc}',${distance},'${uuid}')`;
        return super.commit(sql);
    }
    query_location(uuid) {
        const sql = `select *  from locations where bookrack_id = '${uuid}';`;
        return super.commit(sql);
    }
}
const location = new Location();
module.exports = location;
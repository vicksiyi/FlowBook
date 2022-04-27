const db = require('../config/keys').mysqlConfig;
const mysql = require('mysql');
class Transaction {
    constructor(db) {
        // 开始连接
        this.connection = mysql.createConnection(db);
        this.connection.connect();
    }
    // 查询操作
    query(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, function (error, results, fields) {
                if (error) reject(error);
                else resolve(results);
            });
        })
    }
    // 开启事务
    start() {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction(function (err) {
                if (err) reject(err);
                else resolve();
            });
        })
    }
    // 提交事务
    commit() {
        return new Promise((resolve, reject) => {
            this.connection.commit(function (err) {
                if (err) reject(err)
                else resolve();
            });
        })
    }
    // 回滚
    rollback(error) {
        return this.connection.rollback(function () {
            throw error;
        });
    }
}
const transaction = new Transaction(db);
module.exports = transaction;
const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');

const pool = mysql.createPool(database);

pool.getConnection((err,conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('CONNECTION IS LOST');
        }
        else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        else if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
        else{
            console.error('DATABASE CONNECTION IS FAILED');
        }
    } else if(conn) {
        conn.release();
        console.log('DB is Connected!');
    }
})

pool.query = promisify(pool.query);

module.exports = pool;


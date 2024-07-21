const mysql =require("mysql2/promise")


const mysqlPool= mysql.createPool({
    host:"localhost",
    user:"root",
    password:"Sakthi@123",
    database:'movie_database'
})




module.exports = mysqlPool  
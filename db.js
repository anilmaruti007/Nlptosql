const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'nlp2sql.mysql.database.azure.com',
    user: 'anil@nlp2sql',
    database: 'nlptosql',
    password: 'brillio@2019'
});

module.exports = pool.promise();

// var conn = mysql.createConnection({host: "nlp2sql.mysql.database.azure.com", user: "anil@nlp2sql", password: {your_password}, database: {your_database}, port: 3306, ssl:{ca:fs.readFileSync({ca-cert filename})}});
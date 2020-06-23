const mysql 	= require('mysql2');
const database 	= require('../config').mysql;

/**
 * create connection to mysql database
 */
const connection = mysql.createConnection({
	host 				: database.host,
	port				: database.port,
	user 				: database.user,
	password 			: database.password,
	database 			: database.database,
	multipleStatements 	: true
});

connection.connect(err => {
	if(err) return console.log(`${err} mysql error connection`);

	const connect = connection.config;
	return console.log(`mysql database success connect to host ${connect.host} and table ${connect.database}`);
});

module.exports = connection;

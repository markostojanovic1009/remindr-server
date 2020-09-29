
const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
	let Reminder = sequelize.define('Reminder', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.BIGINT,
			autoIncrement: true
		},
		title: DataTypes.STRING,
        description: DataTypes.STRING,
        time: DataTypes.BIGINT
	});
    
	return Reminder;
};

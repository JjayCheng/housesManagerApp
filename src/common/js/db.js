import filterMaps from "./filterMaps";

/** 
 *数据库操作辅助类,定义对象、数据操作方法都在这里定义 
 */
let WEBSQL_DB = {};
const conf = {
	dbName: 'houses',
	/*数据库名*/
	version: '2.0',
	/*数据库版本*/
	dbDesc: '',
	/*数据库描述*/
	dbSize: 500 * 1024,
	/*数据库大小 b*/
	tableName: 'house'
}

function openDB() {
	/*数据库有就打开 没有就创建*/
	let dataBase = openDatabase(conf.dbName, conf.version, conf.dbDesc, conf.dbSize);
	return dataBase
}

/**
 * 新建数据库里面的表单 
 */
function creatTable() {
	var creatTableSQL = 'CREATE TABLE IF NOT EXISTS ' + conf.tableName +
		' (ID INTEGER PRIMARY KEY AUTOINCREMENT, TIME char(20), CONTENT text, CLASSTYPE tinyint, REGTYPE tinyint)';
	WEBSQL_DB.transaction(function(ctx, result) {
		ctx.executeSql(creatTableSQL, [], null);
	});
}

function init() {
	WEBSQL_DB = openDB();
	creatTable();
}

/** 
 * 往表单里面数据 
 */
function getREGTYPE(CONTENT) {
	CONTENT.replace(/\s/g, ''); // 去掉空格 
	const regMap = filterMaps.regTypeMap;
	let return_i = 7;
	regMap.forEach((reg, i) => {
		reg.test(CONTENT) && (return_i = i + 1);
	});
	return return_i;
}
function insterData(CONTENT, CLASSTYPE, TIME, cb, err) {
	TIME = TIME || new Date().getTime().toString();
	var insterTableSQL = 'INSERT INTO ' + conf.tableName + ' (TIME,CONTENT,CLASSTYPE,REGTYPE) VALUES (?,?,?,?)';
	var REGTYPE = getREGTYPE(CONTENT);
	WEBSQL_DB.transaction(function(ctx) {
		ctx.executeSql(insterTableSQL, [TIME, CONTENT, CLASSTYPE, REGTYPE], function(ctx, result) {
				var result = result.rows;
				cb && cb();
			},
			function(tx, error) {
				err && err(error)
			});
	});
}
function insterDataByJson(Json, cb, err) {
	var successNum = 0,
	failNum = 0,
	repeatNum = 0;
	for(let key in Json) {
		let item = Json[key];
		item.CLASSTYPE = item.CLASSTYPE ? item.CLASSTYPE : item.TYPE;
		test(item, (result) => {
			if(result.length === 0) {
				insterData(item.CONTENT, item.CLASSTYPE, item.TIME, () => {
					successNum ++;
					cb && cb(successNum, failNum,repeatNum);
				}, (errRes) => {
					failNum ++
					err && err(errRes);
					cb && cb(successNum, failNum,repeatNum);
				});
			} else {
				repeatNum ++;
				cb && cb(successNum, failNum,repeatNum);
			}
		});
	}
}
/** 
 * 获取数据库一个表单里面的所有数据 
 * 返回数据集合 
 */
function getAllData(cb, err) {
	var selectALLSQL = 'SELECT * FROM ' + conf.tableName;
	WEBSQL_DB.transaction(function(ctx) {
		ctx.executeSql(selectALLSQL, [], function(ctx, result) {
				var result = result.rows;
				cb && cb(result)
			},
			function(tx, error) {
				err && err(error);
			});
	});

}
function getExportOfData(cb, err) {
	var selectALLSQL = 'SELECT CONTENT,TIME,CLASSTYPE FROM ' + conf.tableName;
	WEBSQL_DB.transaction(function(ctx) {
		ctx.executeSql(selectALLSQL, [], function(ctx, result) {
				var result = result.rows;
				cb && cb(result)
			},
			function(tx, error) {
				err && err(error);
			});
	});
}
/** 
 * 获取数据库一个表单里面的部分数据 
 */
function getDataWithKeys(keys, cb, err) {
	var keyVals = [];
	var selectSQL = 'SELECT * FROM ' + conf.tableName + ' WHERE ';
	keys.forEach(key => {
		selectSQL += 'CONTENT LIKE ? AND ';
		keyVals.push('%' + key + '%');
	});
	selectSQL += '1 == 1';
	WEBSQL_DB.transaction(function(ctx) {
		ctx.executeSql(selectSQL, keyVals, function(ctx, result) {
				var result = result.rows;
				cb && cb(result);
			},
			function(tx, error) {
				err && err(error);
			});
	});
}
/** 
 * 根据id查找数据 
 */
function getDataWithID(id, cb, err) {
	var selectSQL = 'SELECT * FROM ' + conf.tableName + ' WHERE ID=?'
	WEBSQL_DB.transaction(function(ctx) {
		ctx.executeSql(selectSQL, [id], function(ctx, result) {
				var result = result.rows;
				cb && cb(result);
			},
			function(tx, error) {
				err && err(error);
			});
	});
}
/** 
 * 验证数据是否存在相同，返回相同数据集
 */
function test(data, cb, err) {
	var selectSQL = 'SELECT * FROM ' + conf.tableName + ' WHERE CONTENT = ? AND CLASSTYPE = ?';
	WEBSQL_DB.transaction(function(ctx) {
		ctx.executeSql(selectSQL, [data.CONTENT, data.CLASSTYPE], function(ctx, result) {
				var result = result.rows;
				cb && cb(result)
			},
			function(tx, error) {
				err && err(error);
			});
	});

}
/** 
 * 根据ID删除数据 
 */
function deleteDateWithID(id, cb, err) {
	var deleteDataSQL = 'DELETE FROM ' + conf.tableName + ' WHERE ID = ?';
	WEBSQL_DB.transaction(function(ctx, result) {
		ctx.executeSql(deleteDataSQL, [id], function(ctx, result) {
			var result = result.rows;
			cb && cb(result);
		}, function(tx, error) {
			err && err(error);
		});
	});
}
/** 
 * 删除所有数据
 */
function deleteAllDate(cb, err) {
	var deleteDataSQL = 'DELETE FROM ' + conf.tableName;
	WEBSQL_DB.transaction(function(ctx, result) {
		ctx.executeSql(deleteDataSQL, [] , function(ctx, result) {
			var result = result.rows;
			cb && cb(result);
		}, function(tx, error) {
			err && err(error);
		});
	});
}
function updateWithID(ID, CONTENT, CLASSTYPE, cb, err) {
	var TIME = new Date().getTime().toString();
	var REGTYPE = getREGTYPE(CONTENT);
	var updateDataSQL = 'UPDATE ' + conf.tableName + ' SET TIME = ?,CONTENT = ?,CLASSTYPE = ?,REGTYPE = ? WHERE ID = ?';
	
	WEBSQL_DB.transaction(function(ctx, result) {
		ctx.executeSql(updateDataSQL, [TIME, CONTENT, CLASSTYPE, REGTYPE, ID], function(ctx, result) {
			cb && cb(result);
		}, function(tx, error) {
			err && err(error);
		});
	});
}


export default {
	init,
	getAllData,
	getExportOfData,
	deleteDateWithID,
	updateWithID,
	getDataWithKeys,
	insterData,
	creatTable,
	getDataWithID,
	insterDataByJson,
	deleteAllDate
}
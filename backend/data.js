import fs from 'fs'
import Database from 'better-sqlite3';

const db = new Database(process.env.DB || 'sqlite3.db');

export function applySchema() {
    // Make sure tables and initial data exist in the database
    db.exec(fs.readFileSync('schema.sql').toString());
};

export function dropAllTables() {
	for(let row of db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all()) {
		db.prepare(`drop table "${row['name']}"`).run();
	}
}

/**
 * 
 * @param {string or null} order When set to "popularity", return results sorted by popularity.
 *                               Otherwise results are sorted by name.
 * @param {object or null} filters An optional object containing the optional keys `category`,
 *                                 `brewery`, `minPercentage` and `maxPercentage` used for filtering
 *                                 which beers Hto return.
 * @returns An array of plain JavaScript objects each representing a beer and its popularity.
 */
export function getBeers(order, filters) {
	order = (order==='popularity') ? 'popularity' : 'name';
	
	// Determine SQL and binding arguments for filtering
	let whereClauses = [];
	let whereArgs = {};
	if (filters) {
		function addWhere(name, comparator = '=', columnName = name) {
			if (filters[name]) {
				whereClauses.push(`${columnName} ${comparator} $${name}`);
				whereArgs[name] = filters[name];
			}
		}
		addWhere('category');
		addWhere('brewery');
		addWhere('minPercentage', '>', 'percentage');
		addWhere('maxPercentage', '<', 'percentage');
	}
	
	// Construct and run the query
	return db.prepare(`
		SELECT *, (
			SELECT count(*)
			FROM likes l
			WHERE l.beerId=b.id
		) popularity
		FROM beers b
		${whereClauses.length ? 'WHERE' : ''} ${whereClauses.join(' AND ')} 
		ORDER BY ${order}
		`).all(whereArgs);
};

export function insertBeer(beer) {
    let result = db.prepare('insert into beers(name,percentage,brewery,category) values($name,$percentage,$brewery,$category)').run(beer);
	beer.id = result.lastInsertRowid;
};

export function deleteBeer(id) {
    let result = db.prepare('delete from beers where id=?').run(id);
	return result.changes;
};

export function getBeer(id) {
    return db.prepare('select * from beers where id=?').get(id);
};

export function insertLike(beerId, userName) {
    let result = db.prepare('insert or ignore into likes(beerId,userName) values(?,?)').run(beerId, userName);
    return result.changes;
};

export function getLikedBeers(userName) {
    return db.prepare('select b.* from beers b, likes l where l.beerId=b.id and l.userName=?').all(userName)
};

export function deleteLike(beerId, userName) {
    let result = db.prepare('delete from likes where beerId=? and userName=?').run(beerId, userName);
	return result.changes;
};

export function insertUser(userName, bcryptPassword, level) {
    let result = db.prepare('insert or ignore into users(name,bcryptPassword,level) values(?,?,?)').run(userName, bcryptPassword, level);
    return result.changes;
};

export function getUser(name) {
    return db.prepare('select * from users where name=?').get(name);
};

export function getUsers() {
    return db.prepare('select * from users').all();
};

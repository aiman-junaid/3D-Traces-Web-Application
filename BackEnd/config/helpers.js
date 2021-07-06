const Mysqli = require('mysqli');

let conn = new Mysqli({
    host: 'eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com', // IP/domain name
    user: 'v3h8yzj0hg6f6hj7', // username
    password: 'yhs3ttd5ffg1ejfn', // password
    db: 'rxoanvfhr8ccetum'
});

let db = conn.emit(false, '');

module.exports = {
    database: db
};
/*mysql://cgjj300cmhpdmfba:pe8hdtjh8taz4o3j@eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/qt6qrdm5owx55dul
*/

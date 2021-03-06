var db = require('./config/conn.js');
var utils = require('./utils.js');
var qs = require('querystring');
var fs = require('fs');
var index = fs.readFileSync(__dirname + '/../views/index.html');
var profile = fs.readFileSync(__dirname + '/../views/profile.html');
module.exports = function(req, res) {
    var client = db.createClient(db.config);
    utils.parseBody(req, function(undefined, body) {
        var b = qs.parse(body);
        var q = `SELECT * FROM info where username='${b.username}' and password='${b.password}' LIMIT 1;`;
        db.selectdata(client, q, function(err, result) {
            if (result) {
                if (result.rows.length > 0) {
                    var b = result.rows[0];
                    res.writeHead(302, {
                      'Location': '/profile',
                        'Set-Cookie': [`firstName=${b.first_name}`, `lastName=${b.last_name}`, `gender=${b.gender}`, `username=${b.username}`, 'login=1']
                    });
                    client.end();
                    res.end(profile);
                } else {
                    res.writeHead(302, {
                        'Location': '/'
                    });
                    res.end(index);
                }
            }

        })
    })
}
function template(tpl, data) {
    Object.keys(data).forEach(function(key) {
        tpl = tpl.replace(
            new RegExp('\\{\\{\\s*' + key + '\\s*\\}\\}', 'g'),
            data[key]
        );
    });
    return tpl;
}

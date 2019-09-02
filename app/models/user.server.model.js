const db = require ( '../../config/db' );
// const fs = require('mv/fs');

const photoDirectory = "./storage/photos/";


var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};

exports . getAll = function (done){
    db . getPool (). query ( 'SELECT * FROM User' , function ( err , rows ) {
        if ( err ) return done ({ "ERROR" : "Error selecting" });
        return done ( rows );
    });
};

exports . insert = function ( username, email, givenName, familyName, password , done ){
    //let hash = bcrypt.hashSync(password, 10);
    let values = [username, email, givenName, familyName, password];

    db . getPool(). query ('INSERT INTO User (username, email, given_name, family_name, password) VALUES (?)', [values],  function ( err ,result ) {

        if ( err ) return done (400);
        done(result)

    });
};




exports.login1 = function (user, done) {
    // let details = [user[1], user[2]];
    db.getPool().query('SELECT user_id from User WHERE email = ? AND password = ?', [user[1], user[2]], function(err, result1) {
        if (err){
            return done(400);
        }
        if (result1[0] === undefined){
            return done(400);
        } else {
            let token1 = token();
            db.getPool().query('UPDATE User SET auth_token = ? where user_id = ?', [[token1],[result1[0].user_id]], function(err, result) {
                return done([result1[0].user_id, token1]);
            });
        }
    });
};

exports.login2 = function (user, done) {
    // let details = [user[0], user[2]];
    db.getPool().query('SELECT user_id from User WHERE username = ? AND password = ?', [user[0], user[2]], function(err, result1) {
        if (err) {
            return done(400);
        }
        if (result1[0] === undefined){
            return done(400);
        } else {
            let token1 = token();
            db.getPool().query('UPDATE User SET auth_token = ? where user_id = ?', [[token1 ],[result1[0].user_id]], function(err, result) {
                return done([result1[0].user_id, token1 ]);
            });
        }
    })
};




exports.logout = function(token, done) {

    db.getPool().query('UPDATE User SET auth_token = Null WHERE auth_token = ?', [token], function(err, result) {
        if (err) {
            return done(401)
        }
        if ( result.affectedRows === 0) {
            return done(401);
        }
        return done(200);
    })

};



exports.alterOne = function (data, type, id, token, done) {

    if(type === 'givenName'){
        db.getPool().query('UPDATE User SET given_name = ? WHERE user_id = ?', [data, id, token], function (err, result) {
       //     console.log(message);
            let string = result.message.split(" ");
            if (string[2] === '0') {
                return done(403);
            }
            if ((err) || result.changedRows === 0) {
                return done(400);
            }

            return done(result);


        })
    }
    if(type === 'familyName'){
        db.getPool().query('UPDATE User SET family_name = ? WHERE user_id = ?', [data, id, token], function (err, result) {
            let string = result.message.split(" ");
            if (string[2] === '0') {
                return done(403);
            }
            if ((err) || result.changedRows === 0) {
                return done(400);
            }

            return done(result);


        })
    }
    if(type === 'password'){
        db.getPool().query('UPDATE User SET password = ? WHERE user_id = ?', [data, id, token], function (err, result) {
            let string = result.message.split(" ");
            if (string[2] === '0') {
                return done(403);
            }
            if ((err) || result.changedRows === 0) {
                return done(400);
            }


            return done(result);


        })
    }

};


exports.alterAll = function (givenName, familyName, password, token, id, done) {
    db.getPool().query('UPDATE User SET given_name = ?, family_name = ?, password = ? WHERE user_id = ? AND auth_token = ?', [givenName, familyName, password, id, token], function (err, result) {
        let string = result.message.split(" ");
        if (string[2] === '0') {
            return done(403);
        }
        if ((err) || result.changedRows === 0) {
            return done(400);
        }

        return done(result);
    })
};

//
exports.getOne1 = function (id, done) {
    db.getPool().query('SELECT username AS username, given_name AS givenName, family_name AS familyName FROM User WHERE (user_id) =  ?', [id], function (err, rows) {

        if (rows[0] == undefined) {
            return done(404);
        }

        return done(rows[0]);
    })
}



exports.getOne = function (used, done) {

    db.getPool().query('SELECT auth_token from User WHERE (user_id) =  ?', used[0], function (err, result){

        if(err){

            return done(404);
        }

        if(result[0].auth_token == used[1]){

            db.getPool().query('SELECT username AS username, email AS email, given_name AS givenName, family_name AS familyName FROM User WHERE (user_id) =  ?', used[0], function (err, rows) {

                if (rows[0] == undefined ) {
                    return done(404);
                }
                return done(rows[0]);
            })
        } else {

            db.getPool().query('SELECT username AS username, given_name AS givenName, family_name AS familyName FROM User WHERE (user_id) =  ?', used[0], function (err, rows) {

                    if (rows[0] == undefined) {
                        return done(404);
                    }

                    return done(rows[0]);
                })
        }
    })
};


exports.addPhoto = function (userId, token, fileName, done) {
    db.getPool().query("SELECT auth_token, profile_photo_filename FROM User WHERE user_id = ? ", [userId], function(err, result){
        //console.log(result);
        if (err )
            return console.log(err);

        if (result.length === 0) {
            return done(404)
        }


        if(result[0].auth_token === token) {

            db.getPool().query("UPDATE User SET profile_photo_filename = ? WHERE user_id = ?", [fileName, userId], function (err, result) {


            });
            if (result[0].profile_photo_filename === null) {
                return done(201)
            }
            else {
                return done(200)
            }
        }


        else {
            return done(403);
        }


    });


};

exports.viewPhoto = function(userId, token, done) {
    db.getPool().query("SELECT auth_token, profile_photo_filename FROM User WHERE user_id = ? ", [userId], function(err, result){



        if (result.length === 0) {
            return done(404)
        }

        if(result[0].profile_photo_filename === null) {
            return done(404)
        }
        return done(result[0].profile_photo_filename)


    })
};

exports.removePhoto = function(id, token, done) {
    db.getPool().query("SELECT auth_token, profile_photo_filename FROM User WHERE user_id = ?", [id], function (err, result) {

        if (err) return console.log(err);
        if (result.length === 0) {
            return done(404)
        }
        let ans = result.pop();
        if (ans.auth_token === token) {
            if(ans.profile_photo_filename === null) {
                return done(404)
            }
            else {
                 db.getPool().query("UPDATE User SET profile_photo_filename = NULL WHERE user_id = ?", [id]);
                 return done(200)
            }

        }
        else {
            return done(403)
        }
    })
}

const User = require ( '../models/user.server.model' );

const fs = require('fs');

const photoDirectory = "storage/photos";

const bcrypt = require('bcrypt');

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};

exports . list = function ( req , res ){
    User . getAll ( function ( result ){
        res . json ( result );
    });
};

function isNumeric(n) {

    return  /^={0,1}\d+$/.test(n)
}


function getRandomFilename(length) {
    return token(length).toString();
};

exports . create = function ( req , res ) {
    try {
        //console.log('get here');
        let username = req.body.username;
        let email = req.body.email;
        let givenName = req.body.givenName;
        let familyName = req.body.familyName;
        let password = req.body.password;

        let hash = bcrypt.hashSync(password, 10);

        if ((validateEmail(email)) == false) {
            return res.status(400).send(400);
        }
        if (password == '' || password == null) {
            return res.status(400).send(400);
        }
            User.insert(username, email, givenName, familyName, hash, function (result) {
                if (result == 400) {
                    res.status(400).send(400);
                } else {
                    res.status(201).json({ "userId" : result.insertId});
                }
            })



    } catch (err) {
        //console.log(err);
        res.status(400).send(400)
    }
}


exports.read = function(req, res) {
    let token = req.header("X-Authorization");

    if(token === '' || token === undefined) {
        let id = req.params.id;

        User.getOne1(id ,function (result) {
            if (result === 404) {
                return res.status(404).send(404)
            }
            else{
                res.status(200).json(result)

            }

        })
    }


    else {
        let id = req.params.id;
        let used = [id, token]
        User.getOne(used, function(result){

            if(result === 404) {


                return res.status(404).send(404)
            }

            else {
                res.status(200).json(result)
            }
        });
    }
};


exports.login = function(req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    let user = [username, email, password];
    if(username == null) {
        User.login1(user, function(result){
            if(result == 400) res.status(400).json();
            // else if(result == 500) res.status(500).json();
            else{res.json({ "userId" : result[0],
                "token" : result[1]});;}
        });
    } else {
        User.login2(user, function(result){
            if(result == 400) res.status(400).json();
            // else if(result == 500) res.status(500).json();
             else{res.json({ "userId" : result[0],
                "token" : result[1]});;}
        });
    }
};

exports.logout =  function(req, res){
    let token = req.get('X-Authorization');

    if(token === '' || token === undefined){
        return res.status(401).send(401);
    }
    User.logout(token, function(result, err){
        if (result === 401) {
            return res.status(401).send(401);
        }
        else {
            return res.status(200).send(200);
        }
    });
};
exports.patch = function(req, res) {
    let id = req.params.id;
    let token = req.header("X-Authorization");

    if (token === '' || token === undefined){
        return res.status(401).send(401);

    }
    var jsonObject = Object(req.body);
    if(Object.keys(jsonObject).length === 0) {
        return res.status(400).send(400);
    }
    if(Object.keys(jsonObject).length === 3) {
        let givenName = req.body.givenName;
        let familyName = req.body.familyName;
        let password = req.body.password.toString();


        if (givenName === '' || familyName === '' || password === '') {
            return res.status(400).send(400);
        }
        if (password.length === 1 && isNumeric(password)) {
            return res.status(400).send(400);
        }
        User.alterAll(givenName, familyName, password, token, id, function (result) {
            if (result === 403) {
                return res.status(403).send(403);
            }
            if (result === 400) {
                return res.status(400).send(400);

            }
            else {
                return res.status(200).send(200);
            }
        })
    }


    if(Object.keys(jsonObject).length === 1) {

        if (req.body.hasOwnProperty('givenName')) {
            User.alterOne(req.body.givenName, 'givenName', id, token, function (result) {
                if (result === 403) {
                    return res.status(403).send(403);
                }
                if (result === 400) {
                    return res.status(400).send(400);
                } else {
                    return res.status(200).send(200);
                }
            })
        }
        if (req.body.hasOwnProperty('familyName')) {
            User.alterOne(req.body.familyName, 'familyName', id, token, function (result) {
                if (result === 403) {
                    return res.status(403).send(403);
                }
                if (result === 400) {
                    return res.status(400).send(400);

                } else {
                    return res.status(200).send(200);
                }
            })
        }
        if (req.body.hasOwnProperty('password')) {

            if (password.length === 1 && isNumeric(password)) {
                return res.status(400).send(400);
            }
            User.alterOne(req.body.password, 'password', id, token, function (result) {
                if (result === 403) {
                    return res.status(403).send(403);
                }
                if (result === 400) {
                    return res.status(400).send(400);

                } else {
                    return res.status(200).send(200);
                }
            })
        }
    }
}

exports.addPhoto = function(req, res){
    let userId = req.params.id;
    let token = req.header('X-Authorization');


    if(token === '' || token === undefined) {
        return res.status(401).send(401);
    }

    let fileName = getRandomFilename(10);


    if (req.header('Content-Type') === 'image/jpeg') {
        fileName = fileName + '.jpeg';


    }
    if (req.header('Content-Type') === 'image/png') {
        fileName = fileName + '.png';

    }

    fs.writeFile(photoDirectory + fileName, req.body, function (err) {
        if (err) console.log(err);

    });


    User.addPhoto(userId, token, fileName, function (result) {
        if (result === 403) {
            return res.status(403).send(403);
        }

        if (result === 201) {
            return res.status(201).send(201);
        }
        if (result === 404) {
            return res.status(404).send(404);
        }


        if (result === 200) {
            return res.status(200).send(200);
        }
    });


}

exports.getPhoto = function(req, res) {
    let userId = req.params.id;
    let token = req.header("X-Authorization");

    User.viewPhoto(userId, token, function (result) {
        //console.log("here", result);


        if (result === 404) {
            return res.status(404).send(404);
        }


        // return res.status(200).send(200);
        let fileName = result;


        fs.readFile(photoDirectory + fileName, function(err, data) {
            if(err) console.log(err);
            else {
                let typePhoto = result.substring(result.length - 3, result.length);
                // console.log(type);
                if (typePhoto === 'png') {
                    res.writeHead(200, {'Content-Type': 'image/png'});
                  //  return res.status(200).send(200);
                } else {
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    //return res.status(200).send(200);
                }
                res.write(data);
                res.end();
            }

        });
    })
};







exports. deletePhoto = function (req, res) {
    let userId = req.params.id;
    let token = req.header("X-Authorization");

    if(token === '' || token === undefined) {
        return res.status(401).send(401);
    }

    User.removePhoto(userId, token, function(result) {
        if(result === 404) {
            return res.status(404).send(404);

        }
        if(result === 403) {
            return res.status(403).send(403);

        }
        if(result === 200) {
            return res.status(200).send(200);
        }
    })
}














// exports.getPhoto = function(req, res){
//     let photo1 = req.params.id;
//     User.viewPhoto(photo1, function (result) {
//         console.log(result[1]);
//         res.status(200).header('Content-Type', "image/png").end(result[1]);
//     });
// };

//
// exports.add = function(req, res){
//     db.get_pool().query("Select count(*) as count from auction where auction_id = ? and auction_userid = (Select user_id " +
//         "from auction_user where user_token = ?)", [req.params.id, req.get("X-Authorization")], function(err, answer) {
//         if (err) {
//             res.sendStatus(500);
//             return;
//         } else if (answer[0].count == 1) {
//
//             let type;
//             if (req.get('Content-Type') === 'image/jpeg') {
//                 type = '.jpeg';
//             } else if (req.get('Content-Type') === 'image/png') {
//                 type = '.png';
//             } else {
//                 res.sendStatus(400); // bad json body
//                 return;
//             }
//
//             Photo.addPhoto(req.params.id, req, type, function (err, result) {
//                 if (err) {
//                     res.sendStatus(400);
//                 } else if (result === "Not Found") {
//                     res.sendStatus(404);
//                 } else if (result != false) {
//                     res.sendStatus(201);
//                 } else {
//                     res.sendStatus(500);
//                 }
//
//             });
//         } else {
//             res.sendStatus(401);
//         }
//     });
// };

// photo.addphoto(photo1, token, function (result) {
//         if(result === 201){
//             req.pipe(fs.createWriteStream("./photos/" + photo1 + '.png'));
//             res.status(201).json(result);
//         }
//         else{
//             res.status(400).json(result);
//         }
//     });
// };

// exports.getphoto = function(req, res){
//     let photo1 = req.params.id;
//     User.getphoto(photo1, function (result) {
//         console.log(result[1]);
//         res.status(200).header('Content-Type', "image/png").end(result[1]);
//     });
// };

// exports.deletephoto = function(req, res){
//     let photo1 = req.params.id;
//     let token = req.header("X-Authorization");
//     User.deletephoto(photo1, token, function (result) {
//         console.log("deleting the photo");
//         res.status(result).end();
//     });
// };
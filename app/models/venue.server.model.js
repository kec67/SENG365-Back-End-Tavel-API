const db = require ( '../../config/db' );

const photoDirectory = "./app/storage/photos/";
const datetime = require('node-datetime');

exports.create = function (info,usedToken, done) {
    db.get_pool().query('SELECT user_id from  auction_user WHERE user_token = ?', [usedToken[0]], function(err, result){
        if(result[0] === undefined) return done(401);
        if(err) return done(500);
        db.get_pool().query('INSERT INTO auction (auction_userid, auction_categoryid, auction_title, auction_description, auction_startingdate, auction_endingdate, auction_reserveprice, auction_startingprice, auction_creationdate) VALUES ?', [[[result[0].user_id, ...info[0][0]]]], function(err, answer){
            if(answer === undefined) return done(400);
            else if(err) return done(500); //change to return 500
            return done(result[0].user_id);
        })
    })
};

exports.insert = function (venueName, categoryId, city, shortDescription, longDescription, address, latitude, longitude, creationTime, usedToken, done) {


    db.getPool().query('SELECT user_id from User WHERE auth_token = ? ', [usedToken], function(err, result){
        if (err)
            return console.log(err);

        if (result.length === 0) {
            return done(401);
        }
        //console.log("meh", result);
        let admin_id = result[0].user_id;



        db.getPool().query('INSERT INTO Venue (admin_id, category_id, venue_name, city, short_description, long_description, date_added, address, latitude, longitude) VALUES (?,?,?,?,?,?,?,?,?,?)', [[admin_id], [categoryId], [venueName], [city], [shortDescription], [longDescription], [creationTime], [address], [latitude], [longitude] ], function(err, answer){

            if(answer === undefined) {
                return done(400);
            }
            if (err)
                return console.log(err);



            return done(201,answer);
        })
    })
};

exports . viewCategories = function (done){
    db . getPool (). query ( 'SELECT category_id AS categoryId, category_name AS categoryName, category_description AS categoryDescription  FROM VenueCategory' , function ( err , rows ) {
        if ( err ) return done (400);
        return done ( rows );
    });
};


exports.alterOne = function (data, type, venueId, token, done) {

    if(type === 'venueName') {

        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {
            if (err || result.length === 0)
                return done(403);

            var userId = result.pop().user_id;
            db.getPool().query('UPDATE Venue SET venue_name = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {

                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);

            })
        })
    }

    if(type === 'categoryId') {

        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

            if (err || result.length === 0)
                return done(403);

            var userId = result.pop().user_id;

            db.getPool().query('UPDATE Venue SET category_id = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {
                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);


            })
        })
    }
    if(type === 'city') {
        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

            if (err || result.length === 0)
                return done(403);

            var userId = result.pop().user_id;

            db.getPool().query('UPDATE Venue SET city = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {

                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);
            })
        })
    }
    if(type === 'shortDescription') {
        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

            if (err || result.length === 0)
                return done(403);

            var userId = result.pop().user_id;

            db.getPool().query('UPDATE Venue SET short_description = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {

                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);

            })
        })
    }
    if(type === 'longDescription') {
        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

            if (err || result.length === 0)
                return done(403);

            var userId = result.pop().user_id;

            db.getPool().query('UPDATE Venue SET long_description = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {
                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);


            })
        })
    }
    if(type === 'address') {
        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

            if (err || result.length === 0)
                return done(403);
            var userId = result.pop().user_id;


            db.getPool().query('UPDATE Venue SET address = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {
                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);

            })
        })
    }
    if(type === 'latitude') {
        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

            if (err || result.length === 0)
                return done(403);

            var userId = result.pop().user_id;

            db.getPool().query('UPDATE Venue SET latitude = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {
                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);
            })
        })
    }
    if(type === 'longitude') {
        db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

            if (err || result.length === 0)
                return done(403);
            var userId = result.pop().user_id;


            db.getPool().query('UPDATE Venue SET longitude = ? WHERE admin_id = ? AND venue_id = ?', [data, userId, venueId], function (err, result) {
                if (err || result.length === 0 || result.changedRows === 0)
                    return done(403);
                return done(result);

            })
        })
    }

};

exports.multiChange = function (listkey, listdata, venueId, token, done) {
    db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

        if (err || result.length === 0)
            return done(403);

        var userId = result.pop().user_id;
        var stringInsert = '';

        for (var i = 0; i < listkey.length; i++) {
            if (i === listkey.length - 1) {
                stringInsert = stringInsert + listkey[i] + ' = ? ';

            } else {
                stringInsert = stringInsert + listkey[i] + ' = ?, ';

            }
        }
        listdata.push(userId);
        listdata.push(venueId);

        var query = 'UPDATE Venue SET ' + stringInsert + ' WHERE admin_id = ? AND venue_id = ?';
        db.getPool().query(query, listdata, function (err, result) {

            if (err || result.length === 0 || result.changedRows === 0)
                return done(403);
            return done(result);
        })
    })

};


exports.addPhoto = function (venueId, token, fileName, description, makePrimary,  done) {
    db.getPool().query('SELECT user_id from User WHERE auth_token = ?', token, function (err, result) {

        if (err)
            return console.log(err);

        if (result.length === 0) {
            return done(401)
        }

        let admin_id = result[0].user_id;

        db.getPool().query('SELECT venue_id from Venue WHERE admin_id = ?', admin_id, function (err, answer) {
            if (answer.length === 0)
                return done(403);
            db.getPool().query('SELECT venue_id from Venue WHERE venue_id = ?', venueId, function (err, answer) {
                if (answer.length === 0)
                    return done(404);
                db.getPool().query("INSERT INTO VenuePhoto (venue_id, photo_filename, photo_description, is_primary) VALUES (?, ?, ?, ?)", [venueId, fileName, description, makePrimary], function (err, result) {
                    //console.log("OOOOO", result);
                    return done(201);
                })
            })
        })


    });

};
exports.addReview = function (venueId, reviewBody, starRating, costRating, timePosted, usedToken, done) {

    db.getPool().query('SELECT user_id from User WHERE auth_token = ? ', [usedToken], function(err, result) {
        if (err)
            return console.log(err);

        if (result.length === 0) {
            return done(401);
        }

        let admin_id = result[0].user_id;


        db.getPool().query('SELECT venue_id from Venue WHERE admin_id = ? AND venue_id = ?', [[admin_id], [venueId]], function (err, result) {
            if (result.length !== 0) {
                return done(403);
            }
            db.getPool().query('SELECT * from Review WHERE reviewed_venue_id = ? AND review_author_id = ?', [[venueId], [admin_id]], function (err, result) {
                if (result.length !== 0) {
                    return done(403);
                }

                db.getPool().query('INSERT INTO Review (reviewed_venue_id, review_author_id, review_body, star_rating, cost_rating, time_posted) VALUES (?, ?, ?, ?, ?, ?)', [[venueId], [admin_id], [reviewBody], [starRating], [costRating], [timePosted]], function (err, result) {

                    if (err)
                        return console.log(err);


                    return done(201, result);
                })
            })
        })
    })
};



exports.getVenue = function(venueId, done) {
    db.getPool().query('SELECT * from Venue WHERE venue_id = ?', venueId, function (err, result) {

        if(err || result.length === 0)
            return done(404);

        let ans = result.pop();

        let venueName = ans.venue_name;
        let admin = ans.admin_id;
        let category = ans.category_id;
        let city =  ans.city;
        let shortDescription = ans.short_description;
        let longDescription = ans.long_description;
        let dateAdded = ans.date_added;
        let address = ans.address;
        let latitude = ans.latitude;
        let longitude = ans.longitude;

        db.getPool().query('SELECT user_id AS userId, username FROM User WHERE user_id = ? ', [admin], function(err, result) {
            //console.log(result);

            if(err|| result.length !== 0 ) {
                admin = result.pop();
            }
            db.getPool().query('SELECT category_id AS categoryId, category_name AS categoryName, category_description AS categoryDescription FROM VenueCategory WHERE category_id = ?', [category], function(err, result) {
                //console.log(result);
                if(err|| result.length !== 0 ) {
                    category = result.pop();
                }

                db.getPool().query('SELECT photo_filename AS profileFilename, photo_description AS photoDescription, is_primary AS isPrimary FROM VenuePhoto WHERE venue_id = ?', [venueId], function(err, result) {
                   // console.log("here", result);
                    for(var i = 0; i < result.length; i++) {
                        if(result[i].isPrimary.toString() === '0') {
                            result[i].isPrimary = false;
                        }
                        if(result[i].isPrimary.toString() === '1') {
                            result[i].isPrimary = true;
                        }
                    }
                    if(result.length === 1 && result[0].isPrimary === false ) {
                        result[0].isPrimary = true;
                    }
                    let photos = result;
                    return done({venueName, admin, category, city, shortDescription, longDescription, dateAdded, address, latitude, longitude, photos});
                })
            })
        })

    })
}

exports.removePhoto = function(venueId, photoFilename, token, done) {
    db.getPool().query('SELECT user_id from User WHERE auth_token = ? ', [token], function(err, result) {

        if(result.length !== 0) {
            let adminId = result.pop().user_id;
            db.getPool().query('SELECT venue_id from Venue WHERE admin_id = ? AND venue_id = ?', [adminId, venueId], function (err, result) {
                if (result.length === 0) {
                    return done(403);
                }
                db.getPool().query('SELECT venue_id FROM VenuePhoto WHERE photo_filename = ?', [photoFilename], function (err, result) {
                    if (err) console.log(err);
                    if (result.length === 0) return done(404);

                    let venue_id = result.pop().venue_id;

                    if (venueId.toString() !== venue_id.toString()) {
                        return done(404);

                    }
                    db.getPool().query('UPDATE VenuePhoto SET photo_filename = NULL WHERE venue_id = ? AND photo_filename = ?', [venueId, photoFilename], function (err, result) {
                        return done(200);
                    })

                })
            })
        }
    })

}
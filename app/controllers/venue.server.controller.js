const Venue = require ( '../models/venue.server.model' );
const datetime = require('node-datetime');

const fs = require('mz/fs');


const photoDirectory = "./app/storage/photos/";

function getSQLname(key){
    switch(key) {
        case "venueName":
            key = 'venue_name';
            break;
        case "categoryId":
            key = 'category_id';
            break;
        case "city":
            key = 'city';
            break;
        case "shortDescription":
            key = 'short_description';
            break;
        case "longDescription":
            key = 'long_description';
            break;

        case "address":
            key = 'address';
            break;

        case "latitude":
            key = 'latitude';
            break;

        case "longitude":
            key = 'longitude';
            break;
    }
    return key;


}

exports . create = function ( req , res ) {
    try {
        //console.log('get here');
        let token = req.header("X-Authorization");
        let venueName = req.body.venueName;
        let categoryId = req.body.categoryId;
        let shortDescription = req.body.shortDescription;
        let city = req.body.city;
        let longDescription = req.body.longDescription;
        let address = req.body.address;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude;
        let creationTime = datetime.create().format('Y-m-d');

       // let used = [token];

        if(req.body.latitude > 90.0 || req.body.latitude < - 90.0) {
            return res.status(400).send(400);
        }

        if( req.body.longitude < -180.0 || req.body.longitude > 180.0) {
            return res.status(400).send(400);
        }

        Venue.insert(venueName, categoryId, city, shortDescription, longDescription, address, latitude, longitude, creationTime, token, function (err, result) {
            //console.log(result);

            if (err === 400) {
                res.status(400).send(400);

            }
            if (err ===  401) {
                res.status(401).send(401);
            }
            if(err === 201) {
                res.status(201).json({"venueId" : result.insertId});

               // res.status(201).json({ "venueId" : result.insertId});
            }
        })



    } catch (err) {
        //console.log(err);
        res.status(400).send(400)
    }
}


exports . viewCategories = function ( req , res ){
    Venue . viewCategories ( function ( result ){
        res . json ( result );
    });
};


exports.patch = function (req, res) {
    let venueId = req.params.id;
    let token = req.header("X-Authorization");

    if (token === '' || token === undefined){
        return res.status(401).send(401);

    }
    var jsonObject = Object(req.body);
    if(Object.keys(jsonObject).length === 0) {
        return res.status(400).send(400);
    }


    if(Object.keys(jsonObject).length === 1) {

        if (req.body.hasOwnProperty('venueName')) {
            Venue.alterOne(req.body.venueName, 'venueName', venueId, token, function (result) {
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
        if (req.body.hasOwnProperty('categoryId')) {
            Venue.alterOne(req.body.categoryId, 'categoryId', venueId, token, function (result) {
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
        if (req.body.hasOwnProperty('city')) {

            Venue.alterOne(req.body.city, 'city', venueId, token, function (result) {
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
        if (req.body.hasOwnProperty('shortDescription')) {
            Venue.alterOne(req.body.shortDescription, 'shortDescription', venueId, token, function (result) {
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
        if (req.body.hasOwnProperty('longDescription')) {
            Venue.alterOne(req.body.longDescription, 'longDescription', venueId, token, function (result) {
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
        if (req.body.hasOwnProperty('address')) {

            Venue.alterOne(req.body.address, 'address', venueId, token, function (result) {
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

        if (req.body.hasOwnProperty('latitude')) {
            Venue.alterOne(req.body.latitude, 'latitude', venueId, token, function (result) {
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
        if (req.body.hasOwnProperty('longitude')) {

            Venue.alterOne(req.body.longitude, 'longitude', venueId, token, function (result) {
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
    else {
        var fail = 0;
        var listkey = [];
        var listdata = [];
        for(var key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                data = jsonObject[key];
                key = getSQLname(key);
                listkey.push(key);
                listdata.push(data);
            }
        }
        Venue.multiChange(listkey, listdata, venueId, token, function (result) {
            if (result === 403) {
                return res.status(403).send(403);
            }
            return res.json(result);
        });
    }

};


exports.addPhoto  = function (req, res) {
    let venueId = req.params.id;
    let token = req.header('X-Authorization');


    if(token === '' || token === undefined) {
        return res.status(401).send(401);
    }

    let photo = req.files.pop();
    let description = req.body.description;
    let makePrimary = req.body.makePrimary;
    // console.log(req.body);
    //
   // console.log(req.body.description === '' || req.body.description === undefined);
    if(req.body.description === undefined) {
        return res.status(400).send(400);
    }
   // console.log(req.body.makePrimary !== 'true' || req.body.makePrimary !== 'false'|| req.body.makePrimary === undefined);
    if(!(req.body.makePrimary === 'true' || req.body.makePrimary === 'false') || req.body.makePrimary === undefined) {
        return res.status(400).send(400);
    }

    if (req.body.makePrimary === 'false') {
        makePrimary = 0
    } else {
        makePrimary = 1
    }




    if(photo === undefined) {
        return res.status(404).send(404);
    }




    let fileName = photo.filename;

    if (photo.mimetype === 'image/jpeg') {
        fileName = fileName + '.jpeg';
     //   console.log(fileName);
    }
    if (photo.mimetype === 'image/png') {
        fileName = fileName + '.png';
    //    console.log(fileName);

    }


    Venue.addPhoto(venueId, token, fileName, description, makePrimary, function (result) {
        if (result === 403) {
            return res.status(403).send(403);
        }

        if (result === 201) {
            return res.status(201).send(201);
        }
        if (result === 404) {
            return res.status(404).send(404);
        }
        if (result === 401) {
            return res.status(401).send(401);
        }
        if (result === 200) {
            return res.status(200).send(200);
        }

    });


}

exports.addReview  = function (req, res) {
    // let venueId = req.params.id;
    // let token = req.header('X-Authorization');
    //
    //
    // if(token === '' || token === undefined) {
    //     return res.status(401).send(401);
    // }

    try {
        //console.log('get here');
        let venueId = req.params.id;
        let token = req.header("X-Authorization");

        if(token === '' || token === undefined) {
            return res.status(401).send(401);
        }
        let reviewBody = req.body.reviewBody;
        let starRating = req.body.starRating;
        let costRating = req.body.costRating;
        let timePosted = datetime.create().format('Y-m-d');

      //  let used = [token];

        if(req.body.starRating === '' ||  req.body.starRating > 5 || req.body.starRating % 1 !== 0  ) {
            return res.status(400).send(400);
        }

        if(req.body.costRating < 0 || req.body.costRating % 1 !== 0  ) {
            return res.status(400).send(400);
        }




        Venue.addReview(venueId, reviewBody, starRating, costRating, timePosted, token,function (result) {


            if (result === 400) {
                return res.status(400).send(400);

            }

            if (result ==  401) {
                return res.status(401).send(401);
            }

            if(result === 403) {
                return res.status(403).send(403);
            }

            if (result === 201) {
                //console.log(result);
               return res.status(201).send(201);
            }
        })



    } catch (err) {
        //console.log(err);
        res.status(400).send(400)
    }


}


exports.getVenue = function (req, res) {

    let venueId = req.params.id;
    Venue.getVenue(venueId, function (result) {
        if (result === 404) {
            return res.status(404).send(404);
        }
        return res.json(result);
    })
}



exports.deletePhoto = function (req, res) {

    let venueId = req.params.id;
    let photoFilename = req.params.photoFilename;

    let token = req.header('X-Autorization');

    if(token === '' || token === undefined) {
        return res.status(401).send(401);
    }

    Venue.removePhoto(venueId, photoFilename, token, function (result) {

            if (result === 404) {
                return res.status(404).send(404);

            }

            if(result === 403) {
                return res.status(403).send(403);
            }

            if (result === 200) {
                console.log(result);
                return res.status(200).send(200);
            }

    })
}
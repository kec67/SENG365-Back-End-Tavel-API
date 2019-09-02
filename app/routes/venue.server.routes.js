const venues = require ( '../controllers/venue.server.controller' );

const multer = require('multer');

var upload = multer({ dest: 'storage/photos/' });


module . exports = function ( app ) {
    app.route(app.rootUrl + '/venues')
        .post(venues.create)
    //    .get(venues.getVenue)

    app.route(app.rootUrl + '/categories')
        .get(venues.viewCategories);

    app. route( app.rootUrl + '/venues/:id' )
        .patch(venues. patch)
        .get(venues.getVenue)


    app. route( app.rootUrl + '/venues/:id/reviews' )
        .post(venues. addReview);

    app.route(app.rootUrl + '/venues/:id/photos/photoFilename')
        .delete(venues.deletePhoto)

    app.route(app.rootUrl + '/venues/:id/photos')
        .post(upload.any(), venues.addPhoto)



};


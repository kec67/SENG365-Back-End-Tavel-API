const users = require ( '../controllers/user.server.controller' );
module . exports = function ( app ) {
    app.route(app.rootUrl + '/users')
        .get(users.list);

    app.route(app.rootUrl + '/users')

        .post(users.create);

    app.route(app.rootUrl + '/users/:id')
        .get(users.read);


    app.route(app.rootUrl + '/users/login')
        .post(users.login);


    app.route(app.rootUrl + '/users/logout')
        .post(users.logout);


    app. route( app.rootUrl + '/users/:id' )
        .patch(users. patch);


    app.route(app.rootUrl + '/users/:id/photo')
        .put(users.addPhoto)
        .delete(users.deletePhoto)
        .get(users.getPhoto);

    //
    // app.route(app.rootUrl + '/users/:id/photo')
    //     .delete(users.deletephoto);






};





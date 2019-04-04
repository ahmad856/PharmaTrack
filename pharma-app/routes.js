//SPDX-License-Identifier: Apache-2.0


var controller  = require('./controller.js');

module.exports = function(app){
    // controller.init_statics(req, res);
    //

    app.get('/sign_in/:id/:password', function (req, res) {
		controller.sign_in(req, res);
	});

    app.get('/get_user/:id', function (req, res) {
		controller.get_user(req, res);
	});

    app.get('/logout', function (req, res) {
		res.redirect('/');
	});

    app.get('/get_all_users', function(req, res){
        controller.get_all_users(req, res);
    });

    app.get('/get_statics', function(req, res){
        controller.get_statics(req, res);
    });

    app.get('/get_all_assets', function(req, res){
        controller.get_all_assets(req, res);
    });

    app.get('/get_asset_history/:id', function(req, res){
        controller.get_history(req, res);
    });

    app.get('/get_asset', function(req, res){
        controller.get_asset(req, res);
    });

    app.post('/add_asset', function(req, res){
        controller.add_asset(req, res);
    });

    app.post('/add_distributor', function(req, res){
        controller.add_distributor(req, res);
    });
    app.post('/add_manufacturer', function(req, res){
        controller.add_manufacturer(req, res);
    });
    app.post('/add_chemist', function(req, res){
        controller.add_chemist(req, res);
    });

    app.post('/change_owner', function(req, res){
        controller.change_owner(req, res);
    });

    app.post('/enroll_distributor', function(req, res){
        controller.enroll_distributor(req, res);
    });

    app.post('/enroll_chemist', function(req, res){
        controller.enroll_chemist(req, res);
    });
}

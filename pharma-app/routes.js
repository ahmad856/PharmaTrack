//SPDX-License-Identifier: Apache-2.0


var controller  = require('./controller.js');

module.exports = function(app){
    // controller.init_statics(req, res);
    //

    app.get('/sign_in/:id/:password', function (req, res) {
		    controller.sign_in(req, res);
    });

    //send fraudulent error
    app.post('/email', function (req, res) {
        controller.email(req, res);
    });

    app.get('/get_user/:id', function (req, res) {
		    controller.get_user(req, res);
    });

    app.get('/get_manufacturer_props/:id', function (req, res) {
		    controller.get_manufacturer_props(req, res);
    });
    app.get('/get_distributor_props/:id', function (req, res) {
		    controller.get_distributor_props(req, res);
    });
    app.get('/get_chemist_props/:id', function (req, res) {
		    controller.get_chemist_props(req, res);
    });

    app.get('/logout', function (req, res) {
		    res.redirect('/');
    });

    app.get('/get_all_users', function(req, res){
        controller.get_all_users(req, res);
    });

    app.get('/get_all_distributors', function(req, res){
        controller.get_all_distributors(req, res);
    });

    app.get('/get_all_chemists', function(req, res){
        controller.get_all_chemists(req, res);
    });

    app.get('/get_statics', function(req, res){
        controller.get_statics(req, res);
    });

    app.get('/get_all_assets', function(req, res){
        controller.get_all_assets(req, res);
    });

    //get history of assets
    app.get('/get_asset_history/:id', function(req, res){
        controller.get_history(req, res);
    });

    app.get('/get_asset', function(req, res){
        controller.get_asset(req, res);
    });

    app.post('/add_asset', function(req, res){
        controller.add_asset(req, res);
    });

    //add new batch of product
    app.post('/add_batch', function(req, res){
        controller.add_batch(req, res);
    });

    //add new product
    app.post('/add_product', function(req, res){
        controller.add_product(req, res);
    });

    //add new distributor
    app.post('/add_distributor', function(req, res){
        controller.add_distributor(req, res);
    });

    //add new manufacturer
    app.post('/add_manufacturer', function(req, res){
        controller.add_manufacturer(req, res);
    });

    //add new chemist
    app.post('/add_chemist', function(req, res){
        controller.add_chemist(req, res);
    });

    //add new admin
    app.post('/add_admin', function(req, res){
        controller.add_admin(req, res);
    });

    //transact asset through supply chain
    app.post('/change_owner', function(req, res){
        controller.change_owner(req, res);
    });

    //return asset to previous owner
    app.post('/return_asset', function(req, res){
        controller.return_asset(req, res);
    });

    //update admin profile
    app.post('/update_admin', function(req, res){
        controller.update_admin(req, res);
    });

    //sell asset to customer
    app.post('/sell_asset', function(req, res){
        controller.sell_asset(req, res);
    });

    //enroll distributor
    app.post('/enroll_distributor', function(req, res){
        controller.enroll_distributor(req, res);
    });

    //enroll chemist
    app.post('/enroll_chemist', function(req, res){
        controller.enroll_chemist(req, res);
    });

    //activate/ suspend user
    app.post('/toggle_status', function(req, res){
        controller.toggle_status(req, res);
    });
}

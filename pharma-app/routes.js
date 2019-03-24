//SPDX-License-Identifier: Apache-2.0


var controller = require('./controller.js');

module.exports = function(app){

  app.get('/get_all_assets', function(req, res){
    controller.get_all_assets(req, res);
    controller.init_statics(req, res);
    controller.get_all_users(req, res);

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

  app.post('/change_owner', function(req, res){
    //controller.change_owner(req, res);
    res.redirect('/login/manufac');
  });
}

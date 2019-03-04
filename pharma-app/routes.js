//SPDX-License-Identifier: Apache-2.0


var medicine = require('./controller.js');

module.exports = function(app){

  app.get('/api/hello', function(req, res){
    medicine.get_all_medicines(req, res);
  });
  app.post('/api/world', function(req, res){
    medicine.add_medicine(req, res);
  });
  app.get('/get_all_medicines', function(req, res){
    //medicine.get_all_medicines(req, res);
  });
  app.get('/change_owner/:owner', function(req, res){
    medicine.change_owner(req, res);
  });
}

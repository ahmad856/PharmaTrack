//SPDX-License-Identifier: Apache-2.0


var medicine = require('./controller.js');

module.exports = function(app){

  app.get('/get_all_medicines', function(req, res){
    //medicine.add_medicineDUMMY(req, res);
    //medicine.get_medicineDUMMY(req, res);
    //medicine.change_ownerDUMMY(req, res);
    //medicine.get_all_medicines(req, res);
    medicine.get_historyDUMMY(req, res);

  });

  app.get('/get_medicine', function(req, res){
    medicine.get_medicine(req, res);
  });

  app.post('/add_medicine', function(req, res){
    medicine.add_medicine(req, res);
  });

  app.get('/change_owner/:owner', function(req, res){
    medicine.change_owner(req, res);
  });
}

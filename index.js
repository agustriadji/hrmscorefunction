/** @format */

const controller    = require('./app/controller');
const path       	= require('path');

module.exports = {
  notifLib: (req, callback)=>{
    controller.test_lab_ctrl(req, message => {
      return message;
    })
  },
  pool_update: (req, callback)=>{
    controller.pool_update(req, message => {
      return message;
    })
  },
  calculation: (req, callback)=>{
    controller.calculation(req, (err, message) => {
      return message;
    })
  },
  check_previllage_request: (req, callback)=>{
    controller.check_previllage_request(req, (err, message) => {
      return message;
    })
  },
}

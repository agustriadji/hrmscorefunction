/** @format */

const controller    = require('./app/controller');
const path       	= require('path');

module.exports = {
  notifLib:{
    Build: (req)=>{
      controller.test_lab_ctrl(req, message => {
          return message;
      });
    },
  },
  poolLib: {
    pool_update: (req)=>{
      controller.test_lab_ctrl(req, message => {
          return message;
      });
    },
  }
}

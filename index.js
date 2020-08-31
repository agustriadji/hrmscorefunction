/** @format */

const controller    = require('./app/controller');
const path       	= require('path');


  // controller.test_lab_ctrl({
  //   type: 6, // 5, 7, 8,9, dsb
  //   name: '2016015', // id emp
  //   local_it: 'local', // memang nilainya harcode kaya gini
  //   user: 'user', // memang nilainya harcode kaya gini
  //   from_type: 'attendance', // memang nilainya harcode kaya gini,
  //   swap: '2017006', // null jika bukan swap
  //   user_login: '2008001'
  // }, message => {
  //   console.log(message);
  // });

module.exports = {
  notifLib: (req, callback)=>{
    return new Promise((resolve, reject) => {
      controller.test_lab_ctrl(req, message => {
        return resolve(message);
      });
    })
  },
  notifLeaveOnly: (req, callback)=>{
    return new Promise((resolve, reject) => {
      controller.notif_leave_only_ctrl(req, message => {
        return resolve(message);
      });
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



/** @format */

const controller    = require('./app/controller');
const path       	= require('path');


  // controller.calculation({
  //   type: 'cutoff', // 5, 7, 8,9, dsb
  //   name: null, // id emp
  //   dates: "2020/02/27-2020/03/08", // memang nilainya harcode kaya gini
  //   job: null, // memang nilainya harcode kaya gini
  //   department: 139, // memang nilainya harcode kaya gini,
  //   localit: null
  // }, (message,dt)=>{
  //   console.log(message, dt,9090);
  // });

  // library.calculation(req.type, req.name, req.dates,req.job,req.department,req.localit,(err, dt)=>{
  //   if(err) return next(err, null)

  //   return next(null, dt)
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
      return callback(message);
    })
  },
  check_previllage_request: (req, callback)=>{
    controller.check_previllage_request(req, (err, message) => {
      return message;
    })
  },
}




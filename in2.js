var ins = require('./index');

return ins.calculation({
    type: 'cutoff', // 5, 7, 8,9, dsb
    name: null, // id emp
    dates: "2020/02/27-2020/03/08", // memang nilainya harcode kaya gini
    job: null, // memang nilainya harcode kaya gini
    department: 139, // memang nilainya harcode kaya gini,
    localit: null
  }, (message)=>{
    console.log(message,9090);
  });
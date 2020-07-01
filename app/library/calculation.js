/** @format */

const async = require('async');
const validator = require('../validator');
const procedure = require('../procedure');
const database = require('../connection/mysql');

const moment = require('moment');
const method = 'store';
const formName = 'Employee Status';
const buildResponse = require('.').response;

function formatDate(date, param) {
    if(param =="toampm"){
        // console.log(date, 'HALOOO')
        var time = moment.unix(date).format("a")
        // console.log(date, date[0], date[1], 'ppppppp')
        // var d = new Date(date);
        // console.log(date, 'DATEEEEE')
        // console.log(moment.unix(date/1000).format("a"), 'BACKKKKK')
        
        return time;
    }else if(param == "toampm2"){
        // var d = new Date(date);
        var time = date.split(':')
            // var hh = d.getHours();
            // var m = d.getMinutes();
            // var s = d.getSeconds();
        // console.log(time[0], 'DATEDATDEDADTATEA')
        var dd = "am";
        var h = time[0];
        if (h >= 12) {
        // h = hh - 12;
        dd = "pm";
        }
        // if (h == 0) {
        // h = 12;
        // }
        // m = m < 10 ? "0" + m : m;
    
        // s = s < 10 ? "0" + s : s;
        
        // console.log(pattern, replacement, 'asffasfafwogwrgwrgw')

        return dd;
    }else if(param == "+1 day"){
        var date1 = moment(date, 'YYYY-MM-DD HH:mm:ss').add(1, 'days')
    // console.log(ttt, 'TTTT')
        var unix = moment(new Date(date1)).format('x');
            
        return unix;
    }else if(param == 'hplusi'){
        var s = date
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        // console.log(secs, 'SECCSSSSS')
        s = (s - secs) / 60;
        // console.log(s, 'SSSSSSSS')
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        // console.log(hrs, 'HRSSSSSS')
        // console.log(mins, 'MINSSSSS')
        mins = mins < 10 ? "0" + mins : mins;
        hrs = hrs<10?"0"+hrs:hrs;
        
        return hrs + ':' + mins;
    }else if(param == 'datetiemtoms'){
        // console.log(date)
        // var datetime = date
        // return console.log(datetime)
        // var match = datetime.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
        // if (match == null) return null
        // return console.log(match)
        // var date1 = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6])
        // ------------------------------------^^^
        // month must be between 0 and 11, not 1 and 12
        // console.log(date);
        // var result = date1.getTime() / 1000
        // console.log(date.getTime() / 1000);
        var momentT = moment(date, "YYYY-MM-DD HH:mm:ss")
        // console.log(momentT, 'MOMENT')
        // var date1 = moment;
        // console.log(date)
        var unix = moment(new Date(momentT)).format('x');
        // console.log(unix, 'UNIXXXX')
        var unixtoms = unix/1000
        // console.log(moment.unix(unix/1000).format("YYYY-MM-DD HH:mm:ss"), 'BACKKKKK')


        return unixtoms
    }else if(param == 'addhours'){
        var date1 = moment(date, 'YYYY-MM-DD HH:mm:ss').add(1, 'h')
    // console.log(ttt, 'TTTT')
        var unix = moment(new Date(date1)).format('x');
            
        return unix;
    }else if(param == 'timetos'){
        var hms = date
        if(hms == null){
            return null
        }
        var a = hms.split(':'); // split it at the colons
        if(a[2] == undefined){
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60; 
        }else{
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        }
        return seconds;
    }else if(param == 'stotime' || param == 'stotimehs'){
        var seconds = date;
        // console.log(seconds, 'secondss')
        var nan = isNaN(seconds)
        if(nan == true){
            return 'NaN'
        }

        // seconds == NaN ? seconds = 00 : seconds;
        var hours = new Date(seconds * 1000).toISOString().substr(11, 8);
        var split = hours.split(':')
        var hrs = hours[0]
        hrs = hrs<10?"0"+hrs:hrs;
        var mins = hours[1]
        mins = mins < 10 ? "0" + mins : mins;

        // return [hrs, mins].join(':');
        return param == 'stotime' ? hours : param == 'stotimehs' ? [hrs, mins].join(':') : null
    }else if(param == 'sectohm'){
        // Hours, minutes and seconds
        var hrs = ~~(date / 3600);
        var mins = ~~((date % 3600) / 60);
        var secs = ~~date % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        // var ret = "";
        // if (hrs > 0) {
        //     ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
        // }
        // ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        // ret += "" + secs;
        hrs = hrs<10?"0"+hrs:hrs;
        mins = mins < 10 ? "0" + mins : mins;
        return [hrs, mins].join(':');
    }
}

const queryatt = (req, next) => {
    console.log(req.rangeDt, '111111111')
    var querys = `SELECT distinct  t2.employee_id as employee_id, date_format(t1.date,'%Y-%m-%d') as date,
    concat(t2.first_name,' ',t2.middle_name,' ',t2.last_name) as Name, 
    t2.first_name as first_name,
    t2.last_name as last_name,
    t3._from as fromx, 
    t3._to as tox,
    t3.shift_code as shift_code,
    t11.job,
    t2.department,
    t2.local_it,

    COALESCE((select concat(date_format(attendance_work_shifts._from,'%H:%i'),'-',date_format(attendance_work_shifts._to,'%H:%i')) from attendance_work_shifts, att_change_shift where att_change_shift.employee_id = (t2.employee_id)  and att_change_shift.date = (select date_format(t1.date,'%Y-%m-%d')) and att_change_shift.status_id = 2 and att_change_shift.new_shift = attendance_work_shifts.shift_id ORDER BY attendance_work_shifts.shift_id DESC limit 1 ),'99:99:99') as value,
    
    COALESCE((select att_change_shift.created_at from attendance_work_shifts, att_change_shift,att_schedule_request where att_change_shift.employee_id = (t2.employee_id) and att_schedule_request.request_id =  att_change_shift.id  and att_change_shift.date = (select date_format(t1.date,'%Y-%m-%d')) and att_schedule_request.status_id = 2 and att_change_shift.new_shift = attendance_work_shifts.shift_id ORDER BY att_change_shift.id DESC limit 1),'99:99:99') as date_changeShift,

    COALESCE((select att_training.start_ from att_schedule_request, att_training where att_training.employee_id = (t2.employee_id) and att_schedule_request.request_id =  att_training.id  and 
        att_training.start_ = (select date_format(t1.date,'%Y-%m-%d')) and att_schedule_request.status_id = 2 ORDER BY att_training.id DESC limit 1),'99:99:99') as start_date_training,
    
    COALESCE((select att_training.end from att_schedule_request, att_training where att_training.employee_id = (t2.employee_id) and att_schedule_request.request_id =  att_training.id  and 
        att_training.start_ = (select date_format(t1.date,'%Y-%m-%d')) and att_schedule_request.status_id = 2 ORDER BY att_training.id DESC limit 1),'99:99:99') as end_date_training,
    
    COALESCE((select att_training.updated_at from att_schedule_request, att_training where att_training.employee_id = (t2.employee_id) and att_schedule_request.request_id =  att_training.id  and 
        att_training.start_ = (select date_format(t1.date,'%Y-%m-%d')) and att_schedule_request.status_id = 2 ORDER BY att_training.id DESC limit 1),'99:99:99') as approve_date_training,

    COALESCE((select att_swap_shift.created_at from att_schedule_request,att_swap_shift,attendance_work_shifts where att_swap_shift.employee_id = (t2.employee_id) and att_swap_shift.employee_id  = att_schedule_request.employee_id and att_swap_shift.date = (select date_format(t1.date,'%Y-%m-%d')) and att_schedule_request.status_id = 2 group by att_swap_shift.created_at ORDER BY att_swap_shift.swap_id DESC limit 1 ),'99:99:99') as date_swapShift,
    
    COALESCE((select concat(time_format(attendance_work_shifts._from,'%H:%i'),'-',time_format(attendance_work_shifts._to,'%H:%i')) from att_schedule_request,att_swap_shift,attendance_work_shifts where att_swap_shift.employee_id = (t2.employee_id) and att_swap_shift.employee_id  = att_schedule_request.employee_id and att_swap_shift.old_shift_id = attendance_work_shifts.shift_id  and att_swap_shift.date = (select date_format(t1.date,'%Y-%m-%d')) and att_schedule_request.status_id = 2 group by att_swap_shift.created_at ORDER BY attendance_work_shifts.shift_id DESC limit 1 ),'99:99:99') as schedule_swapShift,

     date_format(t10.time_in,'%H:%i')as timeIn,date_format(t10.time_out,'%H:%i')as timeOut,
    date_format(t10.date,'%Y-%m-%d') as date_absen, date_format(t10.inquire_date,'%Y-%m-%d') as date_inquire_absen,
          t3.hour_per_day,t5.total_overtime,t5.total_overtime as total_overtimes,t6.total_overtime as OvertimeRestDay, t6.status_id as RestDay_App ,
   
         t1.status,t10.input_ as ApproveStatus, t10.inquire_date as nextdays
         FROM att_schedule t1
         left join emp t2 on t2.employee_id=t1.employee_id 
         left join job_history t11 on  t11.employee_id = t2.employee_id	
         left join attendance_work_shifts t3 on t3.shift_id=t1.shift_id
         left join biometrics_device t10 on t10.employee_id=t1.employee_id and t10.date=t1.date
         left join att_overtime t5 on t5.employee_id=t1.employee_id and t5.date_str=t1.date and t5.status_id=2 and t3.shift_code !='DO'
         left join att_overtime t6 on t6.employee_id=t1.employee_id and t6.date_str=t1.date and t6.status_id=2 and t3.shift_code ='DO'
         left join biometrics_device t7 on t7.employee_id=t1.employee_id and t7.date=t1.date and t3._from !='00:00:00' and t3._to !='00:00:00' and date_format(str_to_date(time_to_sec(timediff(t7.time_out,t7.time_in))/60/60,'%l.%i'),'%i') !='00'
         left join biometrics_device t8 on t8.employee_id=t1.employee_id and t3._from !='00:00:00'  and t8.time_in > t3._from and t8.date=t1.date 
         left join biometrics_device t9 on t9.employee_id=t1.employee_id and t3._to !='00:00:00'and t9.time_out<t3._to  and t9.date=t1.date
         where `;

        if(req.types == 'cut-off'){
            //tidak dipakai
        }else if(req.types == 'cut-off-record'){
            //tidak dipakai
        }else if(req.types == "view-attendance"){
            // console.log('masooookkkkkk')
            querys += `t1.employee_id='${req.rangeDt}' and t1.status = 2 group by t1.date order by t1.date ASC LIMIT 0,30`;
        }else if(req.types == "view-attendance-perday"){
           //tidak dipakai
        }else{
            //tidak dipakai
        }
            //   console.log(querys, 'querys')
        database.query(querys, (err, result)=>{
        // console.log('MASOOOOOKKKKK PA AJI')
            if(err) return next(true, err)

            return next(null, result)
        })
        
}

function calculation_attendance(arr){
    // return console.log(arr.fromx2, arr.tox, 'YYYYYYYYYYYY')
    var value                       = arr.value;
    var fromx2                      = arr.fromx2;
    var tox                         = arr.tox;
    var strtotime_formx             = arr.strtotime_formx;
    var strtotime_tox               = arr.strtotime_tox;
    var timeIn                      = arr.timeIn;
    var timeOuts                    = arr.timeOuts;
    var strtotime_TimeInInquire     = arr.strtotime_TimeInInquire;
    var strtotime_TimeInBiometric   = arr.strtotime_TimeInBiometric;
    var strtotime_TimeOutInquire    = arr.strtotime_TimeOutInquire;
    var strtotime_TimeOutBiometric  = arr.strtotime_TimeOutBiometric;
    var late_fix                    = arr.late_fix;
    var eot_fix2                    = arr.eot_fix2;

    var total_device_workhours      = 0;

    // console.log(fromx2, 'FROMMM')
    // console.log(tox, 'TOXXXX')
    // console.log(Date.parse(fromx2), 'parsefromx')
    // console.log(Date.parse(tox), 'parsetox')
    var am_pm_sch_from 			= formatDate(fromx2, 'toampm2');
	var am_pm_sch_to 			= formatDate(tox, 'toampm2');
    // console.log(am_pm_sch_from, 'ampmfrom')
    // console.log(am_pm_sch_to, 'ampmto')
    // console.log(value, 'ini value')
    // return console.log(value.date_inquire_absen, 'dateinquire')
    var value_date_inquire_absen = value.date_inquire_absen
    // return console.log(value.date_inquire_absen, 'value_date_inquire_absen')
    // console.log(strtotime_TimeInBiometric, 'inbio')
    // console.log(strtotime_TimeOutBiometric, 'inbio')
    // console.log(value_date_inquire_absen[0], 'sfafsafa')
    // if(value.date_inquire_absen){
    //     return console.log('tidak null')
    // }else{
    //     return console.log('null')
    // }
    // console.log(`${value.date}T${tox}`, '`${value.date}T${tox}`')
    // var ttt = moment(`${value.date}T${tox}`, 'YYYY-MM-DD HH:mm:ss').add(5, 'days')
    // // console.log(ttt, 'TTTT')
    // var unixS = moment(new Date(ttt)).format('x');
    // console.log(formatDate(`${value.date}T${tox}`, "+1 day"), '+1111111+')
    // return console.log(unixS, 'TTTT')

    // var mktimes_late_fix    = 1547456400000
    // console.log(mktimes_late_fix, 'mktimes_late_fix')
    // var momentT = moment(mktimes_late_fix, "HH:mm")
    // console.log(momentT, 'MOMENTTTT')
    // var late_fix            = formatDate(mktimes_late_fix, 'hplusi')
    // return console.log(momentT, 'momentT')
    console.log(value_date_inquire_absen, 'value_date_inquire_absen')
    if(value_date_inquire_absen){
        
        var mktimes_late_fix, mktimes_eot_fix2;

        if(am_pm_sch_from == 'pm' && am_pm_sch_to == 'am'){ //SCH 23-12
            // console.log(value.map(a => a.date), 'dateeeeeeeeeeee')
            // console.log(tox, 'toxx')

            // let datetimeparse = Date.parse(`${value.date}T${tox}`)
            // let plus1day = datetimeparse + 86400000
            // strtotime_tox = datetimeparse + 86400000;
            strtotime_tox   = formatDate(`${value.date}T${tox}`, "+1 day")

            var am_pm_bio_in    = formatDate(timeIn, "toampm2")
            var am_pm_bio_out   = formatDate(timeOuts, "toampm2")

            if((am_pm_bio_in == 'am' && am_pm_bio_out == 'am') || (am_pm_bio_in == 'pm' && am_pm_bio_out == 'pm') || (am_pm_bio_in == 'am' && am_pm_bio_out == 'pm')){

                total_device_workhours = strtotime_TimeOutInquire - strtotime_TimeInInquire;

                if(total_device_workhours > 0){
                    if(strtotime_TimeInInquire > strtotime_formx){
                        mktimes_late_fix    = (strtotime_TimeInInquire - strtotime_formx)/60
                        late_fix            = mktimes_late_fix
                    }else{
                        late_fix            = null
                    }
                }else{
                    total_device_workhours = strtotime_TimeOutInquire = strtotime_TimeInBiometric;

                    if(strtotime_TimeInInquire > strtotime_formx){
                        mktimes_late_fix    = (strtotime_TimeInBiometric - strtotime_formx)/60
                        late_fix            = mktimes_late_fix
                    }else{
                        late_fix            = null
                    }
                }
            }else if(am_pm_bio_in == 'pm' && am_pm_bio_out == 'am'){

                total_device_workhours = strtotime_TimeOutInquire - strtotime_TimeInBiometric;

                if(strtotime_TimeInBiometric > strtotime_formx){
                    mktimes_late_fix    = (strtotime_TimeInBiometric - strtotime_formx)/60
                    late_fix            = mktimes_late_fix
                }else{
                    late_fix            = null
                }
            }

            if(strtotime_tox > strtotime_TimeOutInquire){
                if(strtotime_TimeInBiometric > strtotime_formx){
                    mktimes_eot_fix2    = (strtotime_tox - strtotime_TimeOutInquire)/60
                    eot_fix2            = mktimes_eot_fix2
                }else{
                    eot_fix2            = null
                }
            }
        }else{
            var am_pm_bio_in    = moment(timeIn, "toampm2")
            var am_pm_bio_out   = moment(timeOuts, "toampm2")

            if(am_pm_bio_in == 'pm' && am_pm_bio_out == 'am'){
                total_device_workhours = strtotime_TimeOutInquire - strtotime_TimeInBiometric;

                if(strtotime_TimeInBiometric > strtotime_formx){
                    mktimes_late_fix    = (strtotime_tox - strtotime_TimeOutInquire)/60
                    late_fix            = mktimes_late_fix
                }else{
                    late_fix            = null
                }

                if(strtotime_tox > strtotime_TimeOutInquire){
                    mktimes_eot_fix2    = (strtotime_tox - strtotime_TimeOutInquire)/60
                    eot_fix2            = mktimes_eot_fix2
                }else{
                    eot_fix2            = null
                }
            }
        }
    }else{ // tanpa next day bio
        console.log('MASUK ELSE')
        console.log(value.date, 'DATEEE')
        // console.log(am_pm_sch_from, 'from')
        // console.log(am_pm_sch_to, 'to')
        if(am_pm_sch_from == 'pm' && am_pm_sch_to == 'am'){ // SCH 23-12
            console.log('masuk1++++++++++++')
            var mktimes_late_fix, mktimes_eot_fix2;
            // let datetimeparse = Date.parse(`${value.date}T${tox}`)
            // let plus1day = datetimeparse + 86400000
            strtotime_tox   = formatDate(`${value.date}T${tox}`, "+1 day")
            // strtotime_tox = datetimeparse + 86400000

            total_device_workhours = strtotime_TimeOutBiometric - strtotime_TimeInBiometric;
        
            if(strtotime_TimeInBiometric > strtotime_formx){
                mktimes_late_fix    = (strtotime_TimeInBiometric - strtotime_formx)/60
                late_fix            = mktimes_late_fix
            }else{
                late_fix            = null
            }
            // console.log(late_fix, 'LATEEEEE')
            if(strtotime_tox > strtotime_TimeOutBiometric){
                mktimes_eot_fix2    = (strtotime_tox - strtotime_TimeOutBiometric)/60
                eot_fix2            = mktimes_eot_fix2
            }else{
                eot_fix2            = null
            }
            // console.log(eot_fix2, 'eot_fix2')
        }else if((am_pm_sch_from == 'am' && am_pm_sch_to == 'pm') || (am_pm_sch_from == 'pm' && am_pm_sch_to == 'pm')) {
            console.log('masuk2==============')
            // console.log(strtotime_TimeOutBiometric, 'strtotime_TimeOutBiometric')
            // console.log(strtotime_TimeInBiometric, 'strtotime_TimeInBiometric')
            total_device_workhours = strtotime_TimeOutBiometric - strtotime_TimeInBiometric;
            // console.log(total_device_workhours, 'deviceworkhours')
            // console.log(strtotime_TimeOutBiometric, 'timeout')
            // console.log(strtotime_TimeInBiometric, 'timein')
            // console.log(strtotime_formx, 'strtotime_formx')
            if(strtotime_TimeInBiometric > strtotime_formx){
                mktimes_late_fix    = (strtotime_TimeInBiometric - strtotime_formx)/60
                // late_fix            = moment(mktimes_late_fix, 'HH:mm')
                late_fix            = mktimes_late_fix
                // console.log(mktimes_late_fix, 'mktimes_late_fix')
                // console.log(mktimes_late_fix/60, '6000000')
                // console.log(late_fix, 'LATEFIXXX')
            }else{
                late_fix            = null
            }
            // console.log(late_fix, 'LATEEEEE')
            // console.log(strtotime_tox, 'strtotime_tox')
            // console.log(strtotime_TimeOutBiometric, 'strtotime_TimeOutBiometric')
            if(strtotime_tox > strtotime_TimeOutBiometric){
                mktimes_eot_fix2    = (strtotime_tox - strtotime_TimeOutBiometric)/60
                eot_fix2            = mktimes_eot_fix2
            }else{
                eot_fix2            = null
            }
            // console.log(eot_fix2, 'eot_fix2')

        }

        // var d = Date.parse(value.date, tox);
        // console.log(d, 'DDDDDDD')
        // var newDate = new Date(d)
        // console.log(moment(strtotime_tox).valueOf(), 'NDNDNDND')
        // console.log(moment(new Date(value.map(a => a.date), tox)).format('x'), 'moment 111')
        // console.log(moment(d), 'moment')
        // console.log(new Date(Date.parse(value.map(a => a.date), tox)/1000), '11111')
    }

    arr.value                       = value;
    arr.fromx2                      = fromx2;
    arr.tox                         = tox;
    arr.strtotime_formx             = strtotime_formx;
    arr.strtotime_tox               = strtotime_tox;
    arr.strtotime_TimeInInquire     = strtotime_TimeInInquire;
    arr.strtotime_TimeInBiometric   = strtotime_TimeInBiometric;
    arr.strtotime_TimeOutInquire    = strtotime_TimeOutInquire;
    arr.strtotime_TimeOutBiometric  = strtotime_TimeOutBiometric;     
    arr.late_fix                    = late_fix;
    arr.eot_fix2                    = eot_fix2;
    arr.total_device_workhours      = total_device_workhours;
    return arr;
}

module.exports = (types, rangeDt, job, department, localit, paging = null, callback)=> {
    async.waterfall([
        (next)=>{
            // return console.log(types, rangeDt, job, department)
            var querys = `SELECT distinct  t2.employee_id as employee_id, date_format(t1.date,'%Y-%m-%d') as date,
                        concat(t2.first_name,' ',IFNULL(t2.middle_name,''),' ',IFNULL(t2.last_name,'')) as Name,
                        t2.first_name as first_name,
                        t2.last_name as last_name,
                        t3._from as fromx,
                        t3._to as tox,
                        t3.shift_code as shift_code,
                        t11.job,
                        t2.department,
                        depart.name as department_name,
                        t2.local_it,



                        date_format(t10.time_in,'%H:%i')as timeIn,date_format(t10.time_out,'%H:%i')as timeOut,
                        date_format(t10.date,'%Y-%m-%d') as date_absen, date_format(t10.inquire_date,'%Y-%m-%d') as date_inquire_absen,
                        t3.hour_per_day,t5.total_overtime,t5.total_overtime as total_overtimes,t6.total_overtime as OvertimeRestDay, t6.status_id as RestDay_App ,

                        t1.status,t10.input_ as ApproveStatus, t10.inquire_date as nextdays
                        FROM att_schedule t1
                        left join emp t2 on t2.employee_id=t1.employee_id 
                        left join department depart on depart.id = t2.department
                        left join job_history t11 on  t11.employee_id = t2.employee_id
                        left join attendance_work_shifts t3 on t3.shift_id=t1.shift_id
                        left join biometrics_device t10 on t10.employee_id=t1.employee_id and t10.date=t1.date
                        left join att_overtime t5 on t5.employee_id=t1.employee_id and t5.date_str=t1.date and t5.status_id=2 and t3.shift_code !='DO'
                        left join att_overtime t6 on t6.employee_id=t1.employee_id and t6.date_str=t1.date and t6.status_id=2 and t3.shift_code ='DO'
                where `;
        
                if(types == 'cut-off'){
                    //tidak dipakai
                }else if(types == 'cut-off-record'){
                    //tidak dipakai
                }else if(types == "view-attendance"){
                    // console.log('masooookkkkkk')
                    var _date = job.split('-');
                    var att_month = _date[1];
                    var att_year = _date[0];
                    querys += `t1.employee_id='${rangeDt}' and MONTH(t1.date) = ${att_month} and YEAR(t1.date) = ${att_year} and t1.status = 2 group by t1.date order by t1.date ASC`;
                }else if(types == "view-attendance-perday"){
                   //tidak dipakai
                }else{
                    //tidak dipakai
                }
                    //   console.log(querys, 'querys')
                database.query(querys, (err, result)=>{
                // console.log('MASOOOOOKKKKK PA AJI')
                    if(err) return next(true, err)
        
                    return next(null, result)
                })
        },(query, cb1)=>{
            (async function() {
                var sch_date = []
                var training_temp = [];
                if(query != null){
                    var query2 = [];

                    for(var key in query){
                        var value = query[key]

                        if(value.employee_id && value.Name){
                            let variable = {
                                employee_id : query.employee_id,
                                date        : query.date
                            }

                            try {
                                var request = await procedure.values_value(variable)
                                    // return console.log(select_date, 'resulttt')
                                // })
                                // console.log(request, 'REQ')
                            } catch (error) {
                                return cb1(true, error)
                                // console.log(error, 'iniya')
                            }

                            var values_value = request[0]
                            var values_date_changeShift = request[1]
                            var value_train = request[2]
                            var value_swapShift = request[3]

                            // console.log(values_value, values_date_changeShift, value_train, value_swapShift)
                            if(values_value.length > 0){
                                value.value     = values_value[0].value
                            }else{
                                value.value     = '99:99:99'
                            }

                            var tmps = [];
                            var hasil_sort = 0;
                            if(values_date_changeShift.length > 0){
                                tmps.push(values_date_changeShift[0].created_at)
                            }
                            if(value_train.length > 0){
                                tmps.push(value_train[0].created_at)
                            }
                            if(value_swapShift.length > 0){
                                tmps.push(value_swapShift[0].created_at)
                            }

                            if(tmps.length > 0){
                                //BLM DIBUAT

                                tmps = tmps[tmps.length-1];

                                if(typeof values_date_changeShift[0] != undefined){
                                    if(tmps == values_date_changeShift[0].created_at){
                                        var hasil_sort = 1;
                                    }
                                }else if(typeof value_train[0] != undefined){
                                    var hasil_sort = 2;
                                }else if(typeof value_swapShift[0] != undefined){
                                    if(tmps == value_swapShift[0].created_at){
                                        var hasil_sort = 3
                                    }
                                }
                            }

                            if(values_date_changeShift.length > 0 && hasil_sort == 1){
                                value.date_changeShift = values_date_changeShift[0].date_changeShift
                                var emp_modifys = value.employee_id;
                                var date_modifys = value.date
                                
                                let sql = `select new_shift from att_change_shift where employee_id = '${emp_modifys}' and date = '${date_modifys}' and status_id = 2 order by id DESC limit 1`
                                try{
                                    [gives] = await database.promise().query(sql);
                                } catch (e) {
                                    [gives] = null
                                }

                                if(gives.length > 0){
                                    var newid1 = gives.new_shift;
                                    let sql = `select t1.shift_id, t1.shift_code, t1.hour_per_day as duration,concat(date_format(t1._from,'%H:%i'),' - ',date_format(t1._to,'%H:%i')) as Original, t1._from , t1._to from attendance_work_shifts as t1 where t1.shift_id = ${newid1}`
                                    try{
                                        [getsch1] = await database.promise().query(sql);
                                    } catch (e) {
                                        [getsch1] = null
                                    }

                                    if( ['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB'].includes(getsch1.shift_code)){
                                        var schedule = getsch1.shift_code;
                                        value.schedule_changeShift = getsch1.shift_code;
                                    }else{
                                        var schedule = getsch1.Original;
                                        value.schedule_changeShift = getsch1.Original;
                                    }

                                    value.tox = getsch1._to;
                                    value.fromx = getsch1._from;
                                    value.shift_code = getsch1.shift_code;
                                }
                            }else{
                                value.date_changeShift = '99:99:99';
                            }

                            if(value_train > 0 && hasil_sort == 2){
                                value.end_date_training = value_train[0].end_date_training;
                                value.start_date_training = value_train[0].start_date_training;
                            }else{
                                value.end_date_training = "99:99:99";
                                value.start_date_training = "99:99:99";
                            }

                            if(value_swapShift.length > 0 && hasil_sort == 3){

                                if(value_swapShift[0].employee_id == query.employee_id){
                                    
                                    let sql = `select concat(time_format(aws._from,'%H:%i'),'-',time_format(aws._to,'%H:%i')) as schedule_swapShift , aws.shift_code, aws._from as _from, aws._to as _to from attendance_work_shifts aws where aws.shift_id = ".${value_swapShift.new_shift_id}`
                                    try{
                                        [r] = await database.promise().query(sql);
                                    } catch (e) {
                                        [r] = null
                                    }

                                    value.date_swapShift = value_swapShift.date_swapShift;
                                    value.schedule_swapShift = r.schedule_swapShift;
                                    value.shift_code = r.shift_code;
                                    value.tox = r._to;
                                    value.fromx = r._from;
                                    value.value = r._from + "-" +r._to;
                                    var schedule = r._from+"-"+r._to;
                                }else if(value_swapShift[0].swap_with == query.employee_id){
                                    
                                    let sql = `select concat(time_format(aws._from,'%H:%i'),'-',time_format(aws._to,'%H:%i')) as schedule_swapShift , aws.shift_code,  aws._from as _from, aws._to as _to from attendance_work_shifts aws where aws.shift_id = ".${value_swapShift.old_shift_id}`
                                    try{
                                        [r] = await database.promise().query(sql);
                                    } catch (e) {
                                        [r] = null
                                    }

                                    value.date_swapShift = value_swapShift.date_swapShift;
                                    value.schedule_swapShift = r.schedule_swapShift;
                                    value.shift_code = r.shift_code;
                                    value.tox = r._to;
                                    value.fromx = r._from;
                                    value.value = r._from + "-" +r._to;
                                    var schedule = r._from+"-"+r._to;
                                }
                            }else{
                                value.date_swapShift = "99:99:99";
                                value.schedule_swapShift = "99:99:99";
                            }
                            // console.log(query, '124141414112')
                            
                            query2.push(value)
                        }
                    }

                    if(query2.length > 0){query = query2}

                    for(var key in query){
                        var value = query[key]

                        if(value.date_changeShift != undefined){
                            value.date_changeShift = '99:99:99'
                        }
    
                        if(value.date_swapShift != undefined){
                            value.date_swapShift = "99:99:99";
                            value.schedule_swapShift = "99:99:99";
                        }

                        if(value.end_date_training != undefined){
                            value.end_date_training = "99:99:99";
                            value.start_date_training = "99:99:99";
                        }

                        var date_changeShift  =  '';
                    
                        if(value.date_changeShift != '99:99:99'){
                            var employee_q  =  value.employee_id;
                            var date_changeS =  value.date_changeShift;
                            
							var date_check = value.date;
                            let sql = `select asr.id ,concat(substring(aws._from,1,5),'-',substring(aws._to,1,5)) as data from att_schedule_request as asr ,att_change_shift as acs, 	attendance_work_shifts as aws
                                        where asr.date_request = '${date_changeS}'
                                        and asr.request_id = acs.id
                                        and acs.date = '${date_check}'
                                        and acs.new_shift = aws.shift_id
                                        and asr.employee_id  = '${employee_q}'
                                        and  asr.type_id = 5
                                        and asr.status_id =  2 order by asr.id DESC`
                            try{
                                [db] = await database.promise().query(sql);
                            } catch (e) {
                                [db] = null
                            }

                            if(db != null){
                                date_changeShift = db.data;
                            }else{
                                date_changeShift = '99:99:99';
                            }
                        }else{
                            date_changeShift = '99:99:99'
                        }

                        query[key].schedule_changeShift = date_changeShift

                        /** SCHEDULE */
                        var schedule= ''
                        if(query[key].schedule_changeShift != '99:99:99' && query[key].date_changeShift != '99:99:99' ){
                            // console.log('masuk 1')
                            if(query[key].tox == "00:00:00"){
                                schedule   =  query[key].schedule_changeShift;
                            }else{
                                schedule = value.fromx.substr(0,5) + '-' +value.tox.substr(0,5)
                            }
        
                            let exp_sch = schedule.split('-');
        
                            var tox             = exp_sch[1] + ":00";
                            query[key].tox           = tox;
                            var fromx           = exp_sch[0] + ":00";
                            query[key].fromx         = fromx;
                            query[key].allow_changeShift  = true;
                        }else if(value.date_swapShift != '99:99:99' &&  value.schedule_swapShift  !=  '99:99:99'){
                            // console.log('masuk2')
                            // if(query[key].tox = '00:00:00'){
                            //     // console.log('masuk 1')
                            //     schedule = value.schedule_swapShift
                            // }else{
                            //     // console.log('masuk 2')
                            //     schedule = value.fromx.substr(0,5) + '-' +value.tox.substr(0,5)
                            // }
                            schedule = value.schedule_swapShift;

                            let exp_sch  = schedule.split('-');
        
                            var tox             = exp_sch[1] + ":00";
                            query[key].tox      = tox;
                            var fromx           = exp_sch[0] + ":00";
                            query[key].fromx    = fromx;
                            query[key].allow_changeShift  = true;
                        }else{
                            // console.log('masuk3')
                            console.log(value.fromx, 'FROMXXX')
                            console.log(value.tox, 'TOXXXXXX')
                            schedule = value.fromx.substr(0,5) + '-' + value.tox.substr(0,5)
                                        
                            // console.log(res[key].schedule)
                            // cek nilai jadwal true or false
                            if(typeof value.schedule != 'undefined'){
                                // console.log('masuk4')
                                // cek nilai jadwal tidak sama dengan "99:99:99" (default null)
                                if(value.schedule != '99:99:99' && value.schedule == schedule){
                                    let exp_sch = schedule.split('-')
                                // console.log(exp_sch, 'EXPSCH')
                                    var tox         = exp_sch[1] + ":00";
                                    query[key].tox       = tox;
                                    var fromx       = exp_sch[0] + ":00";
                                    query[key].fromx     = fromx;                                        
                                }else{
                                    let exp_sch = value.schedule.split('-')
                                    
                                    var tox = exp_sch[1] + ":00";
                                    query[key].tox = tox;
                                    var fromx = exp_sch[0] + ":00";
                                    query[key].fromx = fromx
                                }
                                // console.log(schedule, 'TEST DOANG')
                            }else{
                                // console.log('masuk5')
                                let exp_sch = schedule.split('-')
                                // console.log(exp_sch, 'EXPSCH')
                                var tox = exp_sch[1] + ":00";
                                query[key].tox = tox;
                                // console.log(tox, 'TOXXXs3')
                                // console.log(query[key].tox)
        
                                var fromx = exp_sch[0] + ":00";
                                query[key].fromx = fromx
                                // console.log(fromx, 'FROMXS3TOXXX')
                                // console.log(query[key].fromx)
                            }
                        }

                        // cek apakah terdapat request training
                        if(value.start_date_training != "99:99:99" || value.shift_code == 'T'){
                            // console.log(res[key].date_swapSift, 'masoookkk')
                            let a = formatDate(query[key].date_swapShift, 'datetiemtoms');
                            // console.log(a, 'INI AAAAA')
                            let allow = true;
        
                            if(query[key].date_changeShift != '99:99:99'){
                                let b = formatDate(query[key].date_changeShift, 'datetiemtoms')
                                if(a < b){
                                    allow = false
                                }
                            }else if(query[key].date_swapSift != '99:99:99'){
                                let b = formatDate(query[key].date_swapSift, 'datetiemtoms')
                                if(a < b){
                                    allow = false
                                }
                            }
        
                            if(value.shift_code == 'T'){
                                training_temp.push(value.date);
                                allow = false;
                            }
        
                            if(allow){
                                /// BELUM LANJOT
        
                                let begin = new Date(query.start_date_training)

                                // console.log(res[key].start_date_training, 'llll')
                                // let begin = new Date(res[key].start_date_training)
                            }
                        }

                        query[key].schedule = schedule

                        // console.log(query.schedule, 'E;FQEQBVQV;QB;CQV')

                        if(['BL','T','TB','OB'].includes(value.shift_code)){
                            value.timeIn    = '-';
                            value.timeOut   = '-';
                        }
        
                        if(training_temp.length > 0){
                            let a = training_temp.indexOf(value.date)
                            if(typeof a == 'integer'){
                                query[key].training_req = training_temp[a]
                            }else{
                                query[key].training_req = false
                            }
                        }else{
                            query[key].training_req = false
                        }
                        
                        // get data and time
                        sch_date.push({
                            'date' : value.date,
                            'time' : {
                                'in'  : fromx,
                                'out' : tox,
                                'timeIn' : value.timeIn,
                                'timeOut' : value.timeOut
                            }
                        });

                        /** workhour */
                        var workhours = null;
                        var timeIn = value.timeIn;

                        var total_menit_workhours = null;
                        var short_fix = null;
                        var late_fix = null;
                        var earlyOut_fix = null;
                        var eot_fix2 = null;
                        var overT_fix = null;
                        console.log('========')
                        // console.log(value.date_inquire_absen, 'value.date_inquire_absen')
                        // console.log(timeIn, 'timeIn')
                        // console.log(`${value.date_absen}T${value.timeOut}:00`, '${value.date_absen}T${value.timeOuts}')
                        // var unixx = formatDate(`${value.date_absen}T${value.timeOut}:00`, 'datetiemtoms')
                        // console.log(unixx, 'formatdate')
                        // console.log(object)
                        // console.log(moment.unix(unixx/1000).format("YYYY-MM-DD HH:mm:ss"), 'BACKKKKK')
                        // console.log(query.timeIn, 'TIMEINNNN')
                        // console.log(query.timeOut, 'TIMEOUTTTTTTTT')
                        if((value.timeIn !== '-' && value.timeOut !==  '-') || (value.timeIn !== null &&  value.timeOut !==  null)){
                            if(value.timeIn !== null &&  value.timeOut !==  null){
                                // console.log('ALASIASHHHBUOSSSS')
                                timeIn                          += ':00';
                                var fromx2                      = fromx;
                                var timeOuts                    = value.timeOut;
                                timeOuts                        += ':00';
                                var date_inquire_absen          = value.date_inquire_absen;
                                var dates                       = value.date;
                                var dates_Biometric             = value.date_absen;
                                var strtotime_TimeInInquire     = formatDate(`${value.date_inquire_absen}T${timeIn}`, 'datetiemtoms');
                                // console.log(value.date_inquire_absen, 'value.date_inquire_absen')
                                // console.log(`${value.date_inquire_absen}T${timeIn}`, '1')
                                // console.log(moment.unix(strtotime_TimeInInquire).format("YYYY-MM-DD HH:mm:ss"), 'strtotime_TimeInInquireBACKKKKK')
                                
                                var strtotime_TimeInBiometric   = formatDate(`${value.date_absen}T${timeIn}`, 'datetiemtoms');
                                // console.log(`${value.date_absen}T${timeIn}`, '2')
                                // console.log(moment.unix(strtotime_TimeInBiometric).format("YYYY-MM-DD HH:mm:ss"), 'strtotime_TimeInBiometricBACKKKKK')
                                var strtotime_formx             = formatDate(`${value.date}T${fromx2}`, 'datetiemtoms');
                                var strtotime_tox               = formatDate(`${value.date}T${tox}`, 'datetiemtoms');
                                // console.log(`${value.date_absen}T${timeOuts}`, '`${value.date_absen}T${timeOuts}`')
                                var strtotime_TimeOutBiometric  = formatDate(`${value.date_absen}T${timeOuts}`, 'datetiemtoms');
                                // console.log(`${value.date_absen}T${timeOuts}`, '3')
                                // console.log(moment.unix(strtotime_TimeOutBiometric).format("YYYY-MM-DD HH:mm:ss"), 'strtotime_TimeOutBiometricBACKKKKK')
                                var strtotime_TimeOutInquire    = formatDate(`${value.date_inquire_absen}T${timeOuts}`, 'datetiemtoms');
                                // console.log(`${query.date_inquire_absen}T${timeOuts}`, '4')
                                // console.log(moment.unix(strtotime_TimeOutInquire).format("YYYY-MM-DD HH:mm:ss"), 'strtotime_TimeOutInquireBACKKKKK')

                                // ######################################################################################
                                
                                var am_pm_form                  = formatDate(strtotime_formx, 'toampm')
                                var am_pm_to                    = formatDate(strtotime_tox, 'toampm')

                                if(value.date_inquire_absen){
                                    var am_pm_deviceFrom 				= formatDate(strtotime_TimeInBiometric,  'toampm');
                                    var am_pm_deviceTo					= formatDate(strtotime_TimeOutInquire,  'toampm');
                                }else{
                                    // console.log(fromx2, 'FROM')
                                    // console.log(tox, 'TOXXX')
                                    // console.log(am_pm_form, 'am_pm_form')
                                    // console.log(am_pm_to, 'am_pm_to')
                                    if(am_pm_form == 'pm' && am_pm_to == 'am'){
                                        // console.log('ULALALALALALA')
                                        var am_pm_bio1                  = formatDate(strtotime_TimeInBiometric, 'toampm');
                                        var am_pm_bio2                  = formatDate(strtotime_TimeOutBiometric, 'toampm');

                                        if(am_pm_bio1 == 'am' && am_pm_bio2 == 'pm'){
                                            var strtotime_tox = formatDate(`${value.date}T${tox}`, 'datetiemtoms');
                                            var strtotime_TimeOutBiometric = formatDate(`${value.date_absen}T${timeOuts}`, 'datetiemtoms');
                                        }else{
                                            var strtotime_tox = formatDate(`${value.date}T${tox}`, "+1 day");
                                            var strtotime_TimeOutBiometric = formatDate(`${value.date_absen}T${timeOuts}`, "+1 day");
                                        }
                                    }
                                    var am_pm_deviceFrom 				= formatDate(strtotime_TimeInBiometric,  'toampm');
                                    var am_pm_deviceTo					= formatDate(strtotime_TimeOutBiometric,  'toampm');
                                }

                                var am_pm_schFrom 			= formatDate(strtotime_formx, 'toampm');
                                var am_pm_schTo				= formatDate(strtotime_tox, 'toampm');
                                var am_pm_sch_from 			= formatDate(fromx2, 'toampm2');
                                var am_pm_sch_to 			= formatDate(tox, 'toampm2');

                                var splitOut_time 		= timeOuts.split(":");
                                var splitOut_time_h 	= splitOut_time[0];
                                var splitOut_time_m 	= splitOut_time[1];

                                var LIB_CALL_ATT = calculation_attendance({
                                    'value'							: value,
                                    'fromx2'						: fromx2,
                                    'tox'							: tox,
                                    'strtotime_formx'				: strtotime_formx,
                                    'strtotime_tox'					: strtotime_tox,
                                    'timeIn' 						: timeIn,
                                    'timeOuts' 						: timeOuts,
                                    'strtotime_TimeInInquire' 		: strtotime_TimeInInquire,
                                    "strtotime_TimeInBiometric" 	: strtotime_TimeInBiometric,
                                    "strtotime_TimeOutInquire" 		: strtotime_TimeOutInquire,
                                    "strtotime_TimeOutBiometric" 	: strtotime_TimeOutBiometric,
                                    "late_fix" 						: late_fix,
                                    "eot_fix2" 						: eot_fix2
                                })

                                // console.log(LIB_CALL_ATT, 'LIB_CALL_ATT')
                                value                           = LIB_CALL_ATT.value;
                                fromx2   						= LIB_CALL_ATT.fromx2;
                                tox      						= LIB_CALL_ATT.tox;
                                strtotime_formx      			= LIB_CALL_ATT.strtotime_formx;
                                strtotime_tox    				= LIB_CALL_ATT.strtotime_tox;
                                strtotime_TimeInInquire      	= LIB_CALL_ATT.strtotime_TimeInInquire;
                                strtotime_TimeInBiometric 		= LIB_CALL_ATT.strtotime_TimeInBiometric;
                                strtotime_TimeOutInquire 		= LIB_CALL_ATT.strtotime_TimeOutInquire;
                                strtotime_TimeOutBiometric 	    = LIB_CALL_ATT.strtotime_TimeOutBiometric;
                                late_fix 						= LIB_CALL_ATT.late_fix;
                                eot_fix2 						= LIB_CALL_ATT.eot_fix2;
                                var total_device_workhours 		= LIB_CALL_ATT.total_device_workhours;
                                
                                // console.log(LIB_CALL_ATT, 'LIBCALL')
                                // console.log(fromx2, 'fromx2')
                                // console.log(tox, 'tox')
                                // console.log(total_device_workhours, 'total_device_workhours')
                                // console.log(strtotime_tox, 'strtotime_tox')
                                // console.log(strtotime_formx, 'strtotime_formx')
                                var total_schedule_workhours    = strtotime_tox - strtotime_formx;
                                // console.log(total_schedule_workhours, 'total_schedule_workhours')
                                // console.log(`${value.date_absen}T${timeIn}`, '0000000000000')
                                // var test = formatDate(moment(`${value.date_absen}T${timeIn}`,"YYYY-MM-DD HH:mm:ss"), 'datetiemtoms')
                                
                                // schedule work
                                var total_schedule_minutes 	= total_schedule_workhours / 60;
                                // console.log(total_schedule_minutes, 'totalscheduleminutes')
                                var split_schedule_hours 	= Math.floor(total_schedule_minutes / 60);
                                // console.log(split_schedule_hours, 'split_schedule_hours')
                                var split_schedule_minutes 	= (total_schedule_minutes % 60);
                                // console.log(value.date, 'DATEEEEE')
                                // console.log(total_device_workhours, 'total_device_workhours')
                                // device work
                                var total_device_minutes    = total_device_workhours / 60;
                                // console.log(total_device_minutes, 'total_device_minutes')
                                var split_device_minutes 	= (total_device_minutes % 60);
                                var split_device_hours 		= Math.floor(total_device_minutes / 60);
                                // console.log(split_device_hours, 'split_device_hours')

                                // console.log(strtotime_TimeOutBiometric, 'strtotime_TimeOutBiometric')
                                // console.log(strtotime_TimeInInquire, 'strtotime_TimeInInquire')
                                // console.log(strtotime_TimeInBiometric, 'strtotime_TimeInBiometric')
                                if(value.date_inquire_absen){
                                    var mktime_do 	= (strtotime_TimeOutBiometric-strtotime_TimeInInquire)/60;
                                    // console.log(mktime_do, 'mktime_do')
                                    // var time_do 	= moment.unix(mktime_do/1000).format("HH:mm")
                                    var time_do     = Math.floor(mktime_do / 60) + ':' + (mktime_do % 60)
                                    // console.log(time_do, 'time_do')
                                    
                                }else{
                                    var mktime_do 	= (strtotime_TimeOutBiometric-strtotime_TimeInBiometric)/60;
                                    // console.log(mktime_do, 'mktime_do')
                                    // var time_do 	= moment.unix(mktime_do/1000).format("HH:mm")
                                    var time_do     = Math.floor(mktime_do / 60) + ':' + (mktime_do % 60)
                                    // console.lg(time_do, 'time_do')
                                }
                                
                                // console.log(mktime_do, 'mktime_do')
                                // console.log(time_do, 'TIMEEEEDOOOOOOO')

                                // OVERTIME

                                var tmp_m = 0;
                                var tmp_h = 0;
                                // console.log(split_schedule_hours, 'split_schedule_hours')
                                // console.log(split_schedule_minutes, 'split_schedule_minutes')
                                // console.log(split_device_hours, 'split_device_hours')
                                // console.log(split_device_minutes, 'split_device_minutes')
                                if(split_schedule_hours < split_device_hours){
                                    // console.log('MASUKKK1111')
                                    if(split_schedule_minutes < split_device_minutes){
                                        tmp_m = split_device_minutes - split_schedule_minutes
                                    }else{
                                        tmp_m = split_schedule_minutes - split_device_minutes
                                    }

                                    tmp_h = split_device_hours - split_schedule_hours
                                    if(tmp_m < 10){ tmp_m = "0" + tmp_m }
                                    if(tmp_h < 10){ tmp_h = "0" + tmp_h }

                                    query[key].total_overtime = `${tmp_h}:${tmp_m}`;
                                    if(`${tmp_h}:${tmp_m}` == "00:00"){
                                        query[key].total_overtime = "-";
                                    }           
                                }else{
                                    // console.log('MASUKKK2222')
                                    // console.log(split_schedule_minutes, 'split_schedule_minutes')
                                    // console.log(split_device_minutes, 'split_device_minutes')
                                    if(split_schedule_minutes < split_device_minutes){
                                        tmp_m = split_device_minutes - split_schedule_minutes
                                    }else{
                                        tmp_m = split_schedule_minutes - split_device_minutes
                                    }

                                    // console.log(tmp_m, 'TMP MMMMMMMMM')

                                    if(tmp_m < 10){ tmp_m = "0" + tmp_m }
                                    if(tmp_h < 10){ tmp_h = "0" + tmp_h }

                                    query[key].total_overtime = `${tmp_h}:${tmp_m}`;
                                    if(`${tmp_h}:${tmp_m}` == "00:00"){
                                        query[key].total_overtime = "-";
                                    }         
                                }

                                // console.log(query.total_overtime, 'query.total_overtime')
                                // console.log(query[key].total_overtime, 'query[key].total_overtime')
                                
                                var time_work = null;
                                // console.log(split_device_hours, 'split_device_hours')
                                // console.log(split_device_minutes, 'split_device_minutes')
                                if(split_device_hours < 10){
                                    time_work = `0${split_device_hours}:`
                                }else{
                                    time_work = `${split_device_hours}:`
                                }

                                if(split_device_minutes < 10){
                                    time_work += `0${split_device_minutes}`
                                }else{
                                    time_work += `${split_device_minutes}`
                                }

                                // console.log(time_work, 'time_work')

                                // console.log(time_work, 'time_work')
                                // CARI TIMEOUT DEVICE FIX INQUERY
                                // console.log('=============')
                                // console.log(strtotime_TimeInBiometric, 'strtotime_TimeInBiometric')
                                // console.log(split_schedule_hours, 'split_schedule_hours')
                                // var unixx = moment(new Date(strtotime_TimeInBiometric)).format('x');
                                // console.log(unixx, 'UNIXXXX')
                                // console.log(moment(strtotime_TimeInBiometric, 'YYYY-MM-DD HH:mm:ss'), '111111')
                                // var qqq = moment.unix(strtotime_TimeInBiometric/1000, 'YYYY-MM-DD HH:mm:ss')
                                // console.log(qqq, 'TANGGAL MOMENT')
                                // var nambah = moment.unix(strtotime_TimeInBiometric/1000, 'YYYY-MM-DD HH:mm:ss').add(split_schedule_hours, 'hours')
                                // console.log(nambah, 'ADDDD')
                                // var status = moment(qqq).add(split_schedule_hours, 'hours').format('YYYY-MM-DD hh:mm:ss');
                                // console.log(status, 'ENDDDD')
                                var timeOut_device_fix0 = moment.unix(strtotime_TimeInBiometric/1000, 'YYYY-MM-DD HH:mm:ss').add(split_schedule_hours, 'hours')
                                // console.log(timeOut_device_fix0, 'timeOut_device_fix0')
                                var timeOut_device_fix = moment(new Date(timeOut_device_fix0)).format('x');
                                // console.log(timeOut_device_fix, 'timeOut_device_fix')
                                // console.log(timeOut_device_fix/1000, '/1000')

                                /*
                                * CARI EARLYOUT
                                * earlyout not working training and dayoff
                                */
                                if(timeOut_device_fix > strtotime_TimeInBiometric){
                                    var mktimes_earlyOut_fix    = timeOut_device_fix - strtotime_TimeOutBiometric;
                                    // console.log(mktimes_earlyOut_fix, 'mktimes_earlyOut_fix')
                                    var earlyOut_fix            = formatDate(mktimes_earlyOut_fix, 'sectohm')
                                    // console.log(earlyOut_fix, 'earlyOut_fix')
                                }else{
                                    // console.log('masuk2')
                                    var earlyOut_fix            = null
                                }

                                // console.log(earlyOut_fix, 'earlyOut_fix')

                                /* CARI SHORT
                                *  short not working dayoff and training 
                                */
                                // console.log('======')
                                // console.log(total_device_workhours, 'total_device_workhours')
                                // console.log(total_schedule_workhours, 'total_schedule_workhours')
                                if(total_device_workhours < total_schedule_workhours){
                                    // console.log('masuk1')
                                    var mktimes_short_fix       = total_schedule_workhours - total_device_workhours;
                                    // console.log(mktimes_short_fix)
                                    var short_fix               = formatDate(mktimes_short_fix, 'sectohm')
                                    // console.log(short_fix, 'short_fix')
                                }else{
                                    // console.log('masuk2')
                                    var short_fix            = null
                                }

                                // console.log(short_fix, 'short_fix')

                                // OVERTIME FIX
                                // console.log(total_schedule_workhours, 'total_schedule_workhours')
                                // console.log(total_device_workhours, 'total_device_workhours')
                                if(total_schedule_workhours < total_device_workhours){
                                    // console.log('masuk1')
                                    // console.log(total_device_workhours, 'total_device_workhours')
                                    // console.log(total_schedule_workhours, 'total_schedule_workhours')
                                    var mktimes_overtime_fix       = (total_device_workhours - total_schedule_workhours);
                                    // console.log(mktimes_overtime_fix, 'mktimes_overtime_fix')
                                    let hours = 3600;
                                    if(mktimes_overtime_fix < hours){
                                        var total_overtime_fix  = null
                                    }else{
                                        var total_overtime_fix         = formatDate(mktimes_overtime_fix, 'sectohm')
                                    }
                                    // var total_overtime_fix         = moment.unix(mktimes_overtime_fix/1000).format("HH:mm")
                                    // var _total_overtime_fix         = moment.duration(mktimes_overtime_fix, 'seconds')
                                    // var total_overtime_fix         = formatDate(mktimes_overtime_fix, 'sectohm')
                                    // console.log(mktimes_overtime_fix, 'mktimes_overtime_fix')
                                    // console.log(total_overtime_fix, 'total_overtime_fix')
                                }else{
                                    // console.log('masuk2')
                                    var total_overtime_fix  = null
                                }

                                query[key].total_overtime = total_overtime_fix;
                                // console.log(query[key].total_overtime, 'query[key].total_overtime')
                                var exp_strtotime_TimeInInquire 	= strtotime_TimeInInquire.toString().split(':');
                                var exp_strtotime_TimeInBiometric 	= strtotime_TimeInBiometric.toString().split(':');
                                var exp_strtotime_formx 			= strtotime_formx.toString().split(':');
                                var exp_strtotime_TimeOutBiometric  = strtotime_TimeOutBiometric.toString().split(':');
                                var exp_timein 					    = timeIn.toString().split(':');
                                var late_time 						= null;

                                // console.log(exp_strtotime_TimeInInquire, 'exp_strtotime_TimeInInquire')
                                // console.log(exp_strtotime_TimeInBiometric, 'exp_strtotime_TimeInBiometric')
                                // console.log(exp_strtotime_formx, 'exp_strtotime_formx')
                                // console.log(exp_strtotime_TimeOutBiometric, 'exp_strtotime_TimeOutBiometric')
                                // console.log(exp_timein, 'exp_timein')

                                // console.log(total_device_workhours, 'total_device_workhours')
                                var mktimes_workhours_device        = total_device_workhours/60;
                                // console.log(mktimes_workhours_device, 'mktimes_workhours_device')
                                workhours                           = time_work;
                                // var workhours1  = workhours += ':00'
                                // console.log(workhours, 'workhours')
                                // var workhourstos = moment(workhours, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') - moment(fromx, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
                                // console.log(workhourstos, 'workhourstos')
                                // var toxminfromx     = moment(tox, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds') - moment(fromx, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
                                // console.log(toxminfromx, 'toxminfromx')
                                // var pppp = moment({}).seconds(toxminfromx).format("HH:mm:ss");
                                // console.log(pppp, 'PPPP')
                                // console.log('=========')
                                var toxminfromx     = formatDate(tox, 'timetos') - formatDate(fromx, 'timetos')
                                // console.log(toxminfromx, 'toxminfromx')
                                var toxminfromxhi   = formatDate(toxminfromx, 'stotime')
                                // console.log(toxminfromxhi, 'toxminfromxhi')
                                // var toxminfromxhi   = formatDate(toxminfromx, 'stotime')
                                // console.log(toxminfromxhi, 'toxminfromxhi')
                                
                                // console.log(formatDate(workhours1, 'timetos'), 'toxminfromxhi')
                                // console.log(formatDate(workhours, 'timetos'), 'ormatDate(toxminfromxhi')

                                if(formatDate(workhours, 'timetos') > formatDate(toxminfromxhi, 'timetos')){
                                    // console.log('masuk sini')
                                    var Eout = 0
                                }else{
                                    // console.log('masuk 0000')
                                    var timeOut = value.timeOut;
                                    timeOut     += ':00'
                                    // console.log(timeOut, 'timeout')
                                    // schedule = res[key].fromx.substr(0,5) + '-' + res[key].tox.substr(0,5)
                                    // console.log(formatDate(timeOut, 'timetos'), 'timetos')
                                    
                                    var time1   = query[key].schedule.substr(6,5) + ':00'
                                    // console.log(time1, 'time1')
                                    // console.log(formatDate(time1, 'timetos'), 'timetosnew')
                                    // console.log(formatDate(timeOut, 'timetos'))
                                    if(formatDate(time1, 'timetos') < formatDate(timeOut, 'timetos')){
                                        Eout    = 0
                                    }else{
                                        var eout1 = formatDate(time1, 'timetos') - formatDate(value.timeOut, 'timetos')
                                        Eout    = formatDate(eout1, 'stotimehs')
                                        // console.log(Eout, 'EOUTTTTTTTT')
                                    }
                                }
                                // var timeOut_device_fix = Date.parse(timeOut_device_fix0)
                                // console.log(moment.unix(test/1000).format("YYYY-MM-DD HH:mm:ss"), '1214141414112')
                                
                                // console.log( moment("2010-10-20 4:30:00","YYYY-MM-DD HH:mm:ss"), 'moment');
                                // console.log( moment("2010-10-20T4:30:00").valueOf(), 'moment2');
                                // console.log(moment("1454521239279", "x").format("DD MMM YYYY hh:mm a"))  
                            }else{
                                var Eout        = '-';
                                var workhours   = null;
                            }       
                        }else{ // Not Found Activity Device
                            // console.log('babibubebo')
                            Eout        = '-';
                            workhours   = null;
                        }

                        query[key].WorkHours = workhours;
                        if(query[key].shift_code == 'DO' && typeof(timeIn != undefined) && typeof(timeOuts != undefined)){
                            if(typeof(time_do != undefined)){
                                workhours = time_do
                            }
        
                            query[key].WorkHours          = workhours;
                            query[key].OvertimeRestDay    = workhours;
                        }
        
                        // console.log(query[key].WorkHours, 'query[key].Workhours')
        
                        query[key].Short  =  short_fix;
                        query[key].schedule_mod = query[key].schedule.substr(0,5) + ':00';
                        // console.log(query.date_changeShift)
                        // console.log(query, '01240112')
                        // console.log(value.date_inquire_absen, 'value.date_inquire_absen')
                        // console.log(value.date_absen, 'DATE ABSENNN')
                        //     console.log(value.timeIn, 'TIMEIN')
                        //     console.log(value.date, 'DATEEEEEEEE')
                        //     console.log(query[key].schedule_mod, 'res[key].schedule_mod')
                        //     console.log('==========')
                        console.log(value.date_inquire_absen, 'ABSENNNN')
                        if(value.date_inquire_absen){
                            console.log('11111111')
                            var jam_schedule        = value.fromx.split(':')
                            var jam_masuk_device    = value.timeIn.split(':');

                            var am_pm               = formatDate(value.timeIn, 'toampm2')

                            if(am_pm == 'am'){      
                                // console.log(`${res[key].date_absen}T${res[key].timeIn}`, '00000000')
                                // console.log(Date.parse(`${res[key].date_absen}T${res[key].timeIn}`), 'PARSEEEEE')
                                // console.log(`${res[key].date}T${res[key].schedule_mod}`, '11111111')
                                // console.log(Date.parse(`${res[key].date}T${res[key].schedule_mod}`), 'PARSEEE2222')
                                // belum
                                var countings =  formatDate(`${value.date_inquire_absen}T${value.timeIn}`, 'datetiemtoms') -  formatDate(`${value.date}T${query[key].schedule_mod}`, 'datetiemtoms')
                            }else{
                                if(formatDate(`${value.date_absen}T${value.timeIn}`, 'datetiemtoms') <= formatDate(`${value.date}T${query[key].schedule_mod}`, 'datetiemtoms')){
                                    var late = null;
                                    countings = null;
                                }else{
                                    countings = formatDate(`${value.date_absen}T${value.timeIn}`, 'datetiemtoms') - formatDate(`${value.date}T${query[key].schedule_mod}`, 'datetiemtoms')
                                }
                            }

                            if(!countings){
                                late = null
                            }else{
                                late = moment(countings, 'HH:mm')
                            }
                        }else{
                            console.log('2222222')
                            console.log(query[key].schedule_mod, 'query[key].schedule_mod')
                            console.log(value.timeIn, 'value.timeIn')
                            console.log(value.timeOut, 'value.timeOut')
                            let a = query[key].schedule_mod.split(':')
                            console.log(a, 'SI AAAA')
                            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
                            console.log(seconds, 'SECONDSSS')
                            console.log(formatDate(query[key].schedule_mod, 'timetos'))
                            // let b = value.timeIn.split(':')
                            // var seconds2 = (+b[0]) * 60 * 60 + (+b[1]) * 60 + (+b[2]); 
                            // console.log(seconds2, 'SECONDSSS2')
                            console.log(formatDate(value.timeIn, 'timetos'))
                            if(formatDate(query[key].schedule_mod, 'timetos') < formatDate(value.timeIn, 'timetos') && value.timeOut != null){
                                late = formatDate((formatDate(value.timeIn, 'timetos') - formatDate(query[key].schedule_mod, 'timetos')), 'stotimehs')
                            }else{
                                late = null
                            }
                        }
                        console.log('==============')
                        console.log(query[key].date, 'DATEEEE')
                        query[key].Late = late_fix
                        console.log(query[key].Late, 'LATESVAVVSAEEE')
                        query[key].EarlyOut = eot_fix2
                        // console.log(query[key].EarlyOut, 'EARLYOUT')
                        console.log('==============')
                        // test.push(query)
                    }
                }
                return cb1(null, query, sch_date)
            })()
        },(querys, sch_date, cb1)=>{
            (async function(){
                // return console.log(querys, 'QUERYSSS')
                var temp =[]

                if(querys != null){
                    var c = querys.length
                    var mod = c % 10;
                    var count = c - mod;
    
                    var j = 0;
                    var last = c - 20;
    
                    var h_formx 	= "";
                    var h_tox 		= "";
    
                    // console.log(c, 'c')
                    // console.log(mod, 'mod')
                    // console.log(count, 'count')
                    // console.log('masukga')
    
                    // console.log(query[j].from, 'query[j].from')
                    // console.log(query[j].tox, 'query[j].tox')
                    if(typeof(querys[j].fromx != undefined) && typeof(querys[j].tox != undefined)){
                        // console.log('masuk sini')
    
                        var h_formx = querys[j].fromx.substr(0,5)
                        var h_tox   = querys[j].tox.substr(0,5)
                        // console.log(h_formx, 'h_formx')
                        // console.log(h_tox, 'h_tox')
                    }
    
                    for(var i=0; i<c;){
                        try{
                            if(i <= 9){
                                var between = `${querys[j].date} <=> ${querys[j+9].date}`
                            }else if(i>=10 && i<=19){ //second period
                                var between2    = `${querys[j+(10-j)].date} <=> ${querys[j+(19-j)].date}`
                                between         = between2
                            }else{ //third period
                                var date = moment().format('DD')
                                var between3 =  `${querys[j+(20-j)].date} <=> ${querys[j+((c-1)-j)].date}`
                                between = between3
                            }
        
        
                            if(i>= count-1){
                                between = `${querys[i].date} <=> ${querys[c-1].date}`
                                var a = mod
                            }else{
                                // between = `${querys[i].date} <=> ${querys[i+9].date}`
                                a = 10
                            }
        
                            for(j=1; j<=a; j++){
                                // console.log(querys[i].WorkHours, 'querys[i].WorkHours')
                                // console.log(querys[i].hour_per_day, 'querys[i].hour_per_day')
                                if(querys[i].WorkHours != null){
                                    // console.log('MASUK1')
                                    // create a mark, yes for workHour < hour_per_day, and no for other
                                    var workStatus;
                                    let a =querys[i].WorkHours.split(':')
                                    var workhourstomin = (+a[0]) * 60 + (+a[1])
                                    var hourperdaytomin = querys[i].hour_per_day*60
                                    // console.log(workhourstomin, 'workhourstomin')
                                    // console.log(hourperdaytomin, 'hourperdaytomin')
                                    if(workhourstomin < hourperdaytomin){
                                        // console.log('LOLOLOLOLOLO')
                                        var emp_over = querys[i].employee_id
                                        var date_str = querys[i].date
        
                                        let sql = `select * from att_overtime as ao,att_schedule_request as asr where ao.employee_id =  '${emp_over}' and ao.date_str  = '${date_str}' and ao.id  = asr.request_id and asr.status_id  = 2`
                                        try{
                                            [check_overtime] = await database.promise().query(sql);
                                        } catch (e) {
                                            check_overtime = null
                                        }
                                        // console.log(check_overtime, 'check_overtime1')
                                        if(check_overtime.length > 0){
                                            workStatus = 'no';
                                        }else{
                                            workStatus = 'yes';
                                        }
                                    }else{
                                        // console.log('popopopopo')
                                        var emp_over = querys[i].employee_id
                                        var date_str = querys[i].date
        
                                        let sql = `select * from att_overtime as ao,att_schedule_request as asr where ao.employee_id =  '${emp_over}' and ao.date_str  = '${date_str}' and ao.id  = asr.request_id and asr.status_id  = 2`
                                        try{
                                            [check_overtime] = await database.promise().query(sql);
                                        }catch(e){
                                            check_overtime = null
                                        }
                                        // console.log(check_overtime, 'CEKOVERTIME')
                                        // console.log(check_overtime, 'check_overtime2')

                                        if(check_overtime.length > 0){
                                            workStatus = 'no';
                                        }else{
                                            workStatus = 'yes';
                                        }
                                    }
                                }else{
                                    // console.log('MASUKK22')
                                    var workStatus = 'no';
                                }
                                //MASIH ADA
                                // console.log(querys, 'QUERYSSSSSS')
                                // console.log(workStatus, 'WORKSTATUS')
                                var noTimeOutStatus = "no";
                                var noTimeInStatus = "no";
                                console.log('=======================')
                                console.log(querys[i].date, 'DATEEEE')
                                // console.log(querys[i].schedule, 'querys[i].schedule')
                                // console.log(querys[i].value, 'querys[i].value')
                                if(querys[i].schedule ==  "00:00-00:00" || querys[i].value != '99:99:99'){
                                    console.log('masuk sini ga')
                                    var date_modify = querys[i].date;
								    var emp_modify = querys[i].employee_id;
                                    
                                    console.log(date_modify, 'date_modify')
                                    console.log(emp_modify, 'emp_modify')
                                    let sql = `select aws.shift_code, concat(date_format(aws._from,'%H:%i'),' - ',date_format(aws._to,'%H:%i')) as Original from att_schedule ash ,attendance_work_shifts aws where ash.employee_id = '${emp_modify}' and ash.date = '${date_modify}' and  ash.shift_id = aws.shift_id`
                                        try{
                                            [give] = await database.promise().query(sql);
                                        }catch(e){
                                            // give = null
                                            console.log(e)
                                        }

                                        // console.log(give, 'GIVEEEEEEE')
                                        console.log(querys[i].date_changeShift, 'querys[i].date_changeShift')
                                        console.log(querys[i].schedule_changeShift, 'querys[i].schedule_changeShift')
                                        console.log(querys[i].status, 'querys[i].status')
                                        console.log(give.length, 'GIVELENGTHHH')
                                        if(querys[i].date_changeShift != '99:99:99' || (querys[i].schedule_changeShift != "99:99:99" && querys[i].status ==  2 && give.length > 0)){
                                            // console.log('alasiabosss')
                                            let sql = `select new_shift from att_change_shift where employee_id = '${emp_modify}' and date = '${date_modify}' and status_id = 2 order by id DESC limit 1`
                                                try{
                                                    [give] = await database.promise().query(sql);
                                                }catch(e){
                                                    // give = null
                                                    console.log(e)
                                                }
                                            
                                            if(give.length > 0){
                                                var newid = give[0].new_shift;
                                                let sql = `select t1.shift_id, t1.shift_code, t1.hour_per_day as duration,concat(date_format(t1._from,'%H:%i'),' - ',date_format(t1._to,'%H:%i')) as Original from attendance_work_shifts as t1 where t1.shift_id = ${newid}`
                                                    try{
                                                        [getsch] = await database.promise().query(sql);
                                                    }catch(e){
                                                        // give = null
                                                        console.log(e)
                                                    }

                                                    if(['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB'].includes(getsch[0].shift_code)){
                                                        schedule = getsch[0].shift_code
                                                    }else{
                                                        schedule = getsch[0].Original
                                                    }
                                                // console.log(getsch, 'GETSCHSSS')
                                            }
                                        }else if(give.length > 0){
                                            console.log('buosssss')
                                            console.log(querys[i].date_swapShift, 'uerys[i].date_swapShift')
                                            if(querys[i].date_swapShift != '99:99:99'){

                                            }else{
                                                console.log(give[0].shift_code, 'give[0].shift_code')
                                                if(['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB'].includes(give[0].shift_code)){
                                                    var schedule = give[0].shift_code
                                                    console.log('MASYUUKKKKK')
                                                }else{
                                                    schedule = give[0].Original
                                                }
                                            }
                                        }
                                        // console.log(querys, 'QUERYSSSSSS')

                                        // console.log(querys[i].timeIn, 'querys[i].timeIn')
                                        // console.log(querys[i].timeOut, 'querys[i].timeOut')
                                        var timeIn, timeOut, noTimeInStatus, noTimeInStatus;
                                        if (querys[i].timeIn == null && querys[i].timeOut == null) {
                                            // console.log('RTRRTRTRTTRTRRTRTRTRT')
                                            timeIn = "-";
                                            timeOut = "-";
                                            noTimeInStatus = "yes";
                                            noTimeInStatus = "yes";
                                        }
                                        else if (querys[i].timeIn == null && querys[i].timeOut != null) {
                                            timeIn = "-";
                                            timeOut = querys[i].timeOut;
                                            noTimeInStatus = "yes";
                                            noTimeInStatus = "no";
                                        }
                                        else if (querys[i].timeIn != null && querys[i].timeOut != null) {
                                            timeIn = querys[i].timeIn;
                                            timeOut = querys[i].timeOut;
                                            noTimeInStatus = "no";
                                            noTimeInStatus = "no";
                                        }
                                        else {
                                            timeIn = querys[i].timeIn;
                                            timeOut = "-";
                                            noTimeInStatus = "no";
                                            noTimeInStatus = "yes";
                                        }
                                    // console.log(timeIn,'1', timeOut,'2', noTimeInStatus,'3', noTimeOutStatus)
                                    //OKE
                                }else{
                                    // console.log('sokkkk')
                                    //OKEEEE
                                    // console.log('0000000000')
                                    var timeIn, noTimeInStatus,timeOut, noTimeOutStatus;
                                    var schedule = querys[i].schedule;

                                    // console.log(querys[i].timeIn, 'querys[i].timeIn')
                                    if (querys[i].timeIn == null) {
                                    	timeIn = "-";
                                    	noTimeInStatus = "yes";
                                    }
                                    else {
                                    	timeIn = querys[i].timeIn;
                                    	noTimeInStatus = "no";
                                    }

                                    // console.log(querys[i].timeOut, 'querys[i].timeOut')
                                    if (querys[i].timeOut == null) {
                                    	timeOut = "-";
                                    	noTimeOutStatus = "yes";
                                    }
                                    else {
                                    	timeOut = querys[i].timeOut;
                                    	noTimeOutStatus = "no";
                                    }
                                    // console.log(timeIn,'1', timeOut,'2', noTimeInStatus,'3', noTimeOutStatus)
                                }
                                // console.log(querys, 'QUERYSSSSSS')

                                console.log(querys[i].total_overtime, 'querys[i].total_overtime')
                                // console.log(querys[i].timeOut, 'querys[i].timeOut')
                                // var makeOver, totalOver;
                                if (querys[i].total_overtime == null) {
                                    console.log('QQQQQQQQQQQQ')
                                    try {
                                        let timeInstomin = querys[i].timeOut.split(':')
                                        var timeIns = (+timeInstomin[0]) * 60 + (+timeInstomin[1])
                                        
                                        var explode = querys[i].schedule.split('-');
            
                                        let arg2tomin = explode[1].split(':')
                                        var arg2    = (+arg2tomin[0]) * 60 + (+arg2tomin[1])
                                        // console.log(timeIns, 'TIMEINSSS')
                                        // console.log(arg2, 'ARG22222')
                                        if(timeIns > arg2){
                                            if(schedule == 'DO'){
                                                totalOver = '-';
                                                
                                                //ini masalahnya   
                                                var mass = "yess";
                                            }else{
                                                if(querys[i].timeOut == "00:00"){
                                                    querys[i].timeOut = "24:00";
                                                }
                                                time1x  =  querys[i].timeOut.split(':');
                                                time2x  =  explode[1].split(':');
            
                                                try {
                                                //code causing exception to be thrown
                                                    time1xr  =   (time1x[0] * 60) + time1x[1];
                                                    time2xr  =   (time2x[0] * 60) + time2x[1];
                                                } catch(e) {
                                                    return 2276;
                                                //exception handling
                                                }
                                                
                                                if(((time1xr - time2xr) % 60).length ==  1){
                                                    m	 = '0' + (($time1xr - $time2xr) % 60);
                                                }else{
                                                    m   = (($time1xr - $time2xr) % 60);
                                                }
                                                totalOver = querys[i].total_overtime;
                                            
                                            }
            
                                            var makeOver =  'yes';
                                        }else{
                                            var makeOver = 'no';
                                            var totalOver = "-";
                                        }
                                    } catch (error) {
                                        // console.log(error, 'ERRORRRRR')
                                        var makeOver = 'no';
                                        var totalOver = "-";
                                    }
                                    
                                }else{
                                    console.log('FFFFFFFFF')
                                    // console.log(querys[i].total_overtime, 'QUERYsOVERTIME')
                                    // var floor = Math.floor(querys[i].total_overtime)
                                    // console.log(floor, 'FLOORRRR')
                                    // var decimal = querys[i].total_overtime - floor;
                                    // console.log(decimal, 'DECIMALLL')
                                    var totalOver = querys[i].total_overtime;
                                    var makeOver  = 'no'
                                }
                                // console.log(querys, 'QUERYSSSSSS')
                                
                                // console.log(makeOver, 'MAKEOPEERERERE')

                                console.log(querys[i].WorkHours, 'querys[i].WorkHoursASAAACACAS')
                                if (querys[i].WorkHours == '00:00:00' || querys[i].WorkHours == '00:00' || querys[i].WorkHours == null || querys[i].WorkHours == undefined){
                                    console.log('11111111')
                                    var workHour = "-"; 
                                    totalOver = "-"; 
                                }else{
                                    // console.log('00000000')
                                    // console.log(querys[i].WorkHours.indexOf('-'), 'querys[i].WorkHours.indexOf('-')')
                                    if(querys[i].WorkHours.indexOf('-') > 0){
                                        console.log('22222222222')
                                        var exp_schedule = querys[i].schedule.split('-')
                                        var exp_schedule1 = exp_schedule[0].split(':')
                                        var exp_schedule2 = exp_schedule[1].split(':')
                                        var ts1 = (+exp_schedule1[0]) * 60 + (+exp_schedule1[1])
                                        var ts2 = (+exp_schedule2[0]) * 60 + (+exp_schedule2[1])
                                        var diff = Math.abs(ts1-ts2)/3600
                                        // console.log(diff, 'DIFFFF')
                                        if(diff.toString().indexOf('.') >= 0){
                                            // console.log('masopp')
                                            var e_menit = diff.toString().split('.')
                                            // console.log(e_menit, 'EMINITEEEE')
                                            var tmp = `0.${e_menit[1]}` // build mneit
                                            var b_menit = Math.round(Math.abs(parseFloat(tmp)*60))*(-1)
                                            // console.log(b_menit, 'BMENITTT')
                                            if(b_menit.length == 2){
                                                workHour    = `${e_menit[0]}:${b_menit}`
                                            }else{
                                                workHour    = `${e_menit[0]}:0${b_menit}`
                                            }
                                            // console.log(workHour, 'WHHHHHH')
                                        }else{
                                            var t = diff/60;
                                            if(t.toString().indexOf('.')>= 0){
                                                diff = diff/2
                                            }
                                            workHour = `${Math.round(Math.abs(diff))*(-1)}:00`
                                        }
                                        // var ts1 = 
                                    }else{
                                        // console.log('33333333')
                                        workHour = querys[i].WorkHours;
                                        // console.log(workHour, 'PPPPPPPPPPPPPP')
                                        explode = workHour.split(':')
                                        var hi  = explode[0];
                                        // console.log(hi, 'HIIII')
                                        // console.log(hi.substr(0,1), 'SUBSTR')
                                        if(hi.substr(0,1) == 0){
                                            // console.log('YYYYYYYYY')
                                            workHour = `${hi.substr(1,1)}:${explode[1]}`
                                        }else{
                                            // console.log('nnnnnnnnnnn')
                                            workHour = `${hi}:${explode[1]}`;
                                        }

                                        // console.log(workHour, 'QWFJQFQBCQJCLQLQBCQ')
                                        
                                    }
                                }
                                
                                // console.log('=======')
                                // // console.log(workHour, 'E3NVJ3VNJEVNRJVVVV3MV ER VV V V V V V V V V ')
                                // console.log(totalOver, 'TOTALOVER')
                                // console.log(schedule, 'SCHEDULEEE')

                                if(totalOver != '-' && schedule == 'yes'){
                                    // console.log('SUKKKKKKKK')
                                    var timeInsSplit = querys[i].timeOut.split(':')
                                    timeIns = (+timeInsSplit[0]) * 60 + (+timeInsSplit[1])
                                    // console.log(timeIns, 'timeIns')
                                    explode = querys[i].schedule.split('-')
                                    var argSplit = explode[1].split(':')
                                    arg2 = (+argSplit[0]) * 60 + (+argSplit[1])
                                    // console.log(arg2, 'ARG222')
                                    var overRest = moment((timeIns-arg2), 'HH:mm')
                                    // console.log(overRest, 'POPOPORESTTT')
                                }else if(querys[i].timeIn && querys[i].timeOut){
        
                                }else{
                                    // console.log('GAAAAAAAAAA')
                                    overRest = '-'
                                }
                                // console.log(querys, 'QUERYSSSSSS')

                                // console.log(querys[i].OvertimeRestDay, 'querys[i].OvertimeRestDay')

                                if(querys[i].OvertimeRestDay == null){
                                    // console.log('HHHHHHHHHHHHHHH')
                                    // console.log(mass, 'MASTOLONGMASSS')
                                    if(typeof(mass != undefined) && mass == 'yess'){
                                        // console.log('H1111111111H')
                                        if(schedule == 'DO'){
                                            // console.log('H333333333HHHH')
                                            var timeInsSplit = querys[i].timeOut.split(':')
                                            var timeInss = (+timeInsSplit[0]) * 60 + (+timeInsSplit[1])
                                            var timeOutsSplit = querys[i].timeIn.split(':')
                                            var timeOuts = (+timeOutsSplit[0]) * 60 + (+timeOutsSplit[1])
                                            var overRest = moment((timeInss-timeOuts), 'HH:mm')

                                            if(timeInss == false && timeOuts == false){
                                                overRest = '-'
                                            }else{
                                                workHour = overRest
                                            }
                                        }
                                    }else{
                                        // console.log('H22222222HHHHH')
                                        overRest = '-'
                                    }
                                }else{
                                    // console.log('GGGGGGGGGGGGGG')
                                    var overRest  = querys[i].OvertimeRestDay;
                                    // console.log(overRest, 'OVERRESTTT')
                                    var explode   = querys[i].OvertimeRestDay.split('.')
                                    // console.log(explode, 'EXPLODEEE')
                                    var floor     = Math.floor(overRest)
                                    var check_floor = overRest - floor

                                    // console.log(check_floor, 'cekfloorrrrrr')
                                    //BELUMM
                                    if(check_floor != 0){
                                        // var overRest_decimal = (60 *)
                                    }
                                }

                                // console.log(querys[i].Short, 'querys[i].Short')
                                if(querys[i].Short == null){
                                    // console.log('555555555')
                                    var short = '-'
                                }else{
                                    // console.log('444444444')
                                    //belum masuk
                                    var time1 = parseInt(querys[i].Short.substr(0,2))
                                    var time2 = parseInt(querys[i].Short.substr(3,2))
                                    var short = (time1 * 60) + time2
                                    if(short == 0){
                                        short = '-'
                                    }else{
                                        short = short
                                    }
                                }
                                // console.log(querys[i], 'QUERYSSSSSS')

                                // console.log(querys[i].ApproveStatus, 'querys[i].ApproveStatus')
                                if(querys[i].ApproveStatus == null || querys[i].ApproveStatus == 0){
                                    var status = 'no'
                                }else if(querys[i].ApproveStatus ==1){
                                    status = 'yes'
                                }else{
                                    status = 'no'
                                }

                                // console.log(querys[i].Late, 'LATEEE')
                                /*
                                *	COLOR_ATT_LATE	########################################################################################
                                */
                                // console.log(querys[i].Late, 'querys[i].Late')
                                if(querys[i].Late == null || querys[i].Late == '0'){
                                    console.log('APAWA MASUK SINI')
                                    var late = '-';
                                    var colorLate = 'black'
                                }else{
                                    //belum masukk
                                    var date_late = querys[i].date;
                                    var name = querys[i].employee_id;
                                    let sql = `select asr.date_request, asr.availment_date, asr.approver, asr.status_id, al.late from att_schedule_request as asr, att_late as al where asr.employee_id  = '${name}' and asr.availment_date = '${date_late}' and asr.type_id  = 7 and al.late_id = asr.request_id order by asr.id desc  limit 1`
                                        try{
                                            [chkLate] = await database.promise().query(sql);
                                        }catch(e){
                                            // give = null
                                            console.log(e)
                                        }

                                        console.log(chkLate, 'CHKLATEEEE')
                                        if(chkLate < 1){
                                            colorLate = 'violet'
                                        }else if(typeof (chkLate != undefined)){
                                            if(chkLate.status_id == 1){
                                                colorLate = 'orange'
                                            }else if(chkLate.status_id == 2){
                                                var split_time_sch  	= query[i].from.split(':');
                                                var split_late			= chkLate.late.split(':');
                                                
                                                var split_late_h = split_late[0];
                                                var split_late_m = split_late[1];
                                                var split_time_sch_h = split_time_sch[0];
                                                var split_time_sch_m = split_time_sch[1];

                                                if(split_late_h == 0){
                                                    var tmp = split_time_sch_m + split_late_m;
                                                    if(tmp > 60){
                                                        split_time_sch_h = split_late_h + 1
                                                        split_time_sch_m = tmp-60
                                                    }else{
                                                        split_time_sch_m = tmp
                                                    }
                                                }else{
                                                    var tmp_h = split_time_sch_h + split_late_h;
                                                    if(tmp_h >= 24){
                                                        split_time_sch_h = tmp_h - 24;
                                                    }else{
                                                        split_time_sch_h = tmp_h
                                                    }

                                                    var tmp = split_time_sch_m + split_late_m;
                                                    if(tmp > 60){
                                                        split_time_sch_h = split_late_h + 1
                                                        split_time_sch_m = tmp-60
                                                    }else{
                                                        split_time_sch_m = tmp
                                                    }

                                                    if(split_time_sch_h < 10){
                                                        var build = `0${split_time_sch_h}:${split_time_sch_m}:00`
                                                    }else{
                                                        var build = `${split_time_sch_h}:${split_time_sch_m}:00`
                                                    }

                                                    var date_com = querys[i].date
                                                    var time_device = querys[i].timeIn

                                                    var com_late = formatDate(`${date_com}T${build}`, 'datetiemtoms');
                                                    var com_device = formatDate(`${date_com}T${time_device}:00`, 'datetiemtoms');

                                                    if(com_device <= com_late && chkLate.status_id == 2){
                                                        colorLate = 'green'
                                                    }else{
                                                        if(chkLate.status_id == 1){
                                                            colorLate = 'orange'
                                                        }else{
                                                            colorLate = 'violet'
                                                        }
                                                    }
                                                }
                                            }else if(chkLate.status_id == 4){
                                                colorLate = 'violet'
                                            }else if(chkLate.status_id == 3){
                                                colorLate = 'red'
                                            }
                                        }else{
                                            colorLate = 'violet'
                                        }
                                        late = querys[i].Late
                                }

                                console.log(late, 'TELATLUBEGOO')
                                // console.log(querys[i].EarlyOut, 'querys[i].EarlyOut')
                                if(querys[i].EarlyOut == null){
                                    var earlyOut = '-'
                                }else{
                                    //belum masukkk
                                    // var explode = querys[i].EarlyOut.toString().split(':')
                                    // var earlyOut = explode[0].length
                                    // if(earlyOut == 2 && earlyOut != '00'){
                                    //     var ho = explode[0]
                                    //     var mi = explode[1]
                                    //     ho = ho * 60
                                    //     earlyOut = ho + mi
                                    // }else if(earlyOut == 2 && earlyOut == '00'){
                                    //     var mi = explode[1]
                                    //     earlyOut = mi
                                    // }else{
                                    //     earlyOut = '-'
                                    // }

                                    // if(earlyOut != '-'){
                                        
                                    // }
                                    var earlyOut = querys[i].EarlyOut
                                }

                                // console.log(schedule, 'SCHDULE')
                                // var h = schedule.substr(6, schedule.indexOf(':'))
                                // var m = schedule.substr(9, schedule.indexOf(10))
                                // console.log(h, 'aaaaaaa')
                                // console.log(m, 'MMMM')
                                // console.log(totalOver, 'TOTALOVERRRRR')
                                if(totalOver != null){
                                    // console.log('MMMMMMMMMMM')
                                    // console.log(makeOver, 'MAKEOVERRRRR')
                                    if(makeOver == 'yes'){
                                        var overStatus = ( overRest == '-' ? 'yes' : 'no')
                                        if(typeof mass != undefined && mass == 'yess'){
                                            overStatus = 'yes'
                                        }
                                    }else if(makeOver == 'no'){
                                        overStatus = 'no'
                                    }
                                }else{
                                    // console.log('NNNNNNNNNNN')
                                    var overStatus = 'no'
                                    if(overRest != null && typeof querys[i].RestDay_App != undefined){
                                        if(querys[i].RestDay_App == 2){
                                            var OTR_color = 'yes'
                                        }else{
                                            OTR_color = 'no'
                                        }
                                    }else{
                                        OTR_color = '-'
                                    }
                                }

					    		// Compare time in and time out between attendance record and request
                                var emp = querys[i].employee_id;
                                var dt = querys[i].date;
                                var _timeIN = querys[i].timeIn + ':00';
                                // console.log(_timeIN, '_timeIN')
                                var _timeOut = querys[i].timeOut + ':00';
                                // console.log(_timeOut, '_timeOut')

                                var sql = {
                                    emp : querys[i].employee_id,
                                    dt  : querys[i].date
                                }
                                    try{
                                        [[tm]] = await database.promise().query(`CALL View_TimeInOut_byDate_employee('${emp}', '${dt}')`);
                                    }catch(e){
                                        // give = null
                                        console.log(e)
                                    }
                                var test = []
                                test.push(dt);
                                    
                                if(tm.length > 0){
                                    // console.log(tm[0], 'TMKE00')
                                    // console.log('jrennlivjerve')
                                    if(tm[0].req_in != _timeIN){
                                        var timeInStatus = 'yes'
                                    }else{
                                        timeInStatus = 'no'
                                    }

                                    if(tm[0].req_out != _timeOut){
                                        var timeOutStatus = 'yes'
                                    }else{
                                        timeOutStatus = 'no'
                                    }
                                }else{
                                    // console.log('hhdghgddfvdvfdvd')
                                    timeInStatus = 'no'
                                    timeOutStatus = 'no'
                                }

                                // console.log(tm, 'TMPPPPPPPPPPPPPPP')
                                // console.log(timeInStatus, 'timeInStatus')
                                // console.log(timeOutStatus, 'timeOutStatus')
                                if(i == c){
                                    var data= [{
                                        'data'      : temp,
                                        'status'    : 200,
                                        'message'   : 'View record data'
                                    }]
                                }else{
                                    console.log(totalOver, 'TOTALOVEFSSVSVSVESV')
                                    console.log(workHour, 'WORKHOURRRRRRR')
                                    if(totalOver != '-'){
                                        if(workHour != '0:00'){
                                            var totalOvers = totalOver
                                        }else{
                                            totalOvers = '-'
                                        }
                                    }else{
                                        totalOvers = '-'
                                    }

                                    if(overRest != '-' && overRest != null && totalOver != null && totalOver != '-'){
                                        short = '-';
                                        late  = '-';
                                        earlyOut = '-'
                                    }

                                    // console.log(short, '1', late, '2', earlyOut, '3')

                                    console.log(schedule, 'evwvwvewvwevwe')
                                    // console.log(querys[i].fromx == '00:00:00', 'querys[i].fromx == ')
                                    if(schedule.length == 2 && querys[i].fromx == '00:00:00'){
                                        short = '-';
                                        late  = '-';
                                        earlyOut = '-'
                                        totalOver = '-'
                                        overRest = '-'
                                    }

                                    var empx = querys[i].employee_id;
                                    var date_request = querys[i].date;
                                    // console.log(empx, 'EMPX')
                                    // console.log(date_request, 'date_request')
                                    // let sql = `select asr.date_request, asr.availment_date, asr.approver, asr.status_id, al.late from att_schedule_request as asr, att_late as al where asr.employee_id  = '${name}' and asr.availment_date = '${date_late}' and asr.type_id  = 7 and al.late_id = asr.request_id order by asr.id desc  limit 1`
                                        try{
                                            [latest_latest] = await database.promise().query(`CALL latest_modified('${empx}', '${date_request}')`);
                                        }catch(e){
                                            // give = null
                                            console.log(e)
                                        }

                                    var latest_modified = latest_latest[0];
                                    var latest_request = latest_latest[1];
                                    var latest_request1 = latest_latest[2];
                                    var terminated = latest_latest[3];
                                    
                                    // var check_ado = [];
                                        // console.log(querys[i].date.indexOf('-'), 'querys[i].date.indexOf('-')')
                                    if(typeof (querys[i].date != undefined) && querys[i].date.indexOf('-')){
                                        // console.log('testeefvewvwevwvwevwevwevwvw')
                                        var date_ado = querys[i].date;
                                        try{
                                            [[check_ado]] = await database.promise().query(`CALL check_ado('${empx}', '${date_ado}')`);
                                        }catch(e){
                                            // give = null
                                            console.log(e)
                                        }
                                        // console.log(check_ado, 'CEK ADOOOO')
                                    }
                                    // console.log(check_ado.length, 'check_ado.length')
                                    // console.log(schedule, 'SCHEDAEUENCAOCLACNE')
                                    if(check_ado.length > 0){
                                        for(var key_ado in check_ado){
                                            var value_ado = check_ado[key_ado]
                                            var sch_ado = value_ado.Schedule.split(':')
                                            var schedule_ado = false;
                                            var shift_ado = false;
                                            
                                            if(sch_ado.length > 0){
                                                schedule_ado = sch_ado[1];
                                                shift_ado = sch_ado[0]
                                            }

                                            if(date_ado == value_ado.date_ado){
                                                schedule = schedule_ado;
                                                querys[i].shift_code = shift_ado;
                                            }
                                        }
                                    }

                                    console.log(latest_request, 'LATESTT REQQQQ')
                                    console.log(latest_request.type_id, 'TYPEIDDDD')
                                    if(typeof latest_request.type_id != undefined){
                                        schedule = 'T';
                                    }
                                    else{
                                        schedule = 'OB'
                                    }

                                    if(latest_modified.length > 0){
                                        var dayoff_between_emp = latest_modified[0].dayoff_between;
                                        for(var key in latest_modified){
                                            var value = latest_modified[key]
                                            
                                            if(value.from_ <= querys[i].date && querys[i].date <= value.to_){
                                                if(querys[i].date_changeShift != "99:99:99"){
                                                    if(value.updated_at > querys[i].date_changeShift){
    
                                                        if(dayoff_between_emp > 0){
                                                            var t = ["DO","BL"];
                                                            if(querys[i].shift_code.includes(t) || querys[i].schedule.includes(t)){
                                                                dayoff_between_emp--;
                                                            }else{
                                                                let schedule =   value.leave_code;
                                                                querys[i].schedule = schedule;
                                                                querys[i].shift_code = schedule;
                                                            }
                                                        }else{
                                                            let schedule =   value.leave_code;
                                                            query[i].schedule = schedule;
                                                            query[i].shift_code = schedule;
                                                        }
    
                                                        // schedule =   value.leave_code;
                                                        // query[i].schedule = schedule;
                                                        // query[i].shift_code = schedule;
                                                        //query[i].date_changeShift = null;
                                                        querys[i].allow_changeShift = false;
                                                    }
                                                }else if(querys[i].date_swapShift != "99:99:99"){
                                                    if(value.updated_at > querys[i].date_swapShift){
    
                                                        if(dayoff_between_emp > 0){
                                                            var t = ["DO","BL"];
                                                            if(querys[i].shift_code.includes(t) || querys[i].schedule.includes(t)){
                                                                dayoff_between_emp--;
                                                            }else{
                                                                schedule =   value.leave_code;
                                                                querys[i].schedule = schedule;
                                                                querys[i].shift_code = schedule;
                                                            }
                                                        }else{
                                                            schedule =   value.leave_code;
                                                            querys[i].schedule = schedule;
                                                            querys[i].shift_code = schedule;
                                                        }
                                                        // schedule =   value.leave_code;
                                                        // querys[i].schedule = schedule;
                                                        // querys[i].shift_code = schedule;
                                                        //querys[i].date_swapShift = null;
                                                        querys[i].allow_swapShift = false;
                                                    }
                                                }else{
												
                                                    if(dayoff_between_emp > 0){
                                                        var t = ["DO","BL"];
                                                        if(querys[i].shift_code.includes(t) || querys[i].schedule.includes(t)){
                                                            dayoff_between_emp--;
                                                        }else{
                                                            let schedule =   value.leave_code;
                                                            querys[i].schedule = schedule;
                                                            querys[i].shift_code = schedule;
                                                        }
                                                    }else{
                                                        let schedule =   value.leave_code;
                                                        querys[i].schedule = schedule;
                                                        querys[i].shift_code = schedule;
                                                    }
                                                    //query[i].date_swapShift = null;
                                                    querys[i].allow_swapShift = false;
                                                    querys[i].allow_changeShift = false;
                                                }
                                            }
                                        }
                                    }

                                    // console.log(querys[i].allow_swapShift, 'querys[i].allow_swapShift')
                                    
                                    // console.log(querys[i].shift_code, 'querys[i].shift_code')
                                    if(querys[i].shift_code == 'DO'){
                                        if(!schedule.includes(['OC','ADO'])){
                                            /*$schedule = "DO";*/
                                            var schedule = "DO";
                                        }
                                    }

                                    // console.log(check_ado.length, 'check_ado.length')
                                    // console.log(latest_modified, 'latest_modified')
                                    if(check_ado.length > 0 && !latest_modified){
                                        console.log('belum masuk')
                                        try {
                                            for(var key_ado in check_ado){
                                                var value = check_ado[key_ado]

                                                var sch_ado = value_ado.Schedule.split(':');

                                                var schedule_ado = false;
                                                var shift_ado = false;

                                                if(sch_ado.length > 0){
                                                    var schedule_ado = sch_ado[1];
                                                    var shift_ado = sch_ado[0];
    
                                                }

                                                if(querys[i].date_changeShift != "99:99:99"){
                                                    if(value_ado.updated_at > querys[i].date_changeShift){
                                                        
                                                        if(date_ado == value_ado.date_ado){
                                                            let schedule = schedule_ado;
                                                            querys[i].shift_code = shift_ado;
                                                            querys[i].schedule = schedule;
                                                            querys[i].value = $schedule;
                                                        }
                                                    }
                                                }else if(querys[i].date_swapShift != "99:99:99"){
                                                    if(value_ado.updated_at > querys[i].date_swapShift){
                                                        if(date_ado == value_ado.date_ado){
                                                            let schedule = schedule_ado;
                                                            querys[i].shift_code = shift_ado;
                                                            querys[i].schedule = schedule;
                                                            querys[i].value = schedule;
                                                        }
                                                    }
                                                }else{
                                                    if(date_ado == value_ado.date_ado){
                                                        schedule = schedule_ado;
                                                        query[i].shift_code = shift_ado;
                                                        query[i].schedule = schedule;
                                                        query[i].value = schedule;
                                                    }
                                                }
                                            }
                                        } catch (e) {
                                            return [{'data' : e}]
                                        }
                                    }else{
                                        // console.log(latest_modified, 'latest_modified')
                                        try {
                                            if(latest_modified[latest_modified.length-1].updated_at > check_ado[(check_ado.length)-1].updated_at ){
                                                check_ado = [];
                                            }
                                        } catch (error) {
                                            // console.log(error, 'ERRORERERERE')
                                        }
                                    }

                                    //HOLIDAY CASE
                                    querys[i].check_holiday = null
                                    try{
                                        [[holiday]] = await database.promise().query(`CALL check_holiday('${date_request}')`);
                                    }catch(e){
                                        // give = null
                                        console.log(e)
                                    }

                                    // console.log(holiday, 'HOLIDAYYYYY')
                                    // console.log(sch_date, 'SCHDATEEE')
                                    if(holiday.length > 0){
                                        // console.log('masuk holiday')
                                        for(var key in holiday){
                                            let value = holiday[key]

                                            var holiday_date = querys[i].date;

                                            for(var keys in sch_date){
                                                let values = sch_date[keys]
                                                if(values['date'] == holiday_date){
                                                    var h_formx = values['time']['in'];
                                                    var h_tox = values['time']['out'];
                                                }
                                            }
                                            // console.log(holiday, 'HOLIDAYYYY2222222')
                                            if(holiday != null){
                                                // console.log(holiday[key].repeat_annually, 'repeat_annually')
                                                if(holiday[key].repeat_annually == 1){
                                                    if(holiday[key].day == null && holiday[key].week == null){
                                                        // console.log('LAHDAHHHHHH')
                                                        if(holiday[key].date == holiday_date && holiday_date == querys[i].date){
                                                            // console.log('DAHLAHHHHHHHHHHH')
                                                            if(holiday[key].type == 1){
                                                                querys[i].check_holiday = '(SH)'
                                                            }else{
                                                                querys[i].check_holiday = '(RH)'
                                                            }
                                                        }
                                                    }else{
                                                        // console.log('DAHLOHIEWVNWIV;WIEVW;')
                                                        var d = new Date();
                                                        var year = d.getFullYear();
                                                        // console.log(holiday[key].date, 'holiday[key].date')
                                                        // var ass_hole = holiday[key].date.toString().split('-')
                                                        // console.log(ass_hole, 'ASSHOLEEEEEE')
                                                        var month_name = moment(holiday[key].date).format('MMMM')
                                                        // console.log(month_name, 'month_name')
                                                        // var month_name = 
                                                        var ass_day = holiday[key].day

                                                        // if(holiday[key].week == 'first'){
                                                        //     var week_day =  '+1';
                                                        // }else if(holiday[key].week == 'second'){
                                                        //     var week_day =  '+2';
                                                        // }else if ( holiday[key].week == 'third'){
                                                        //     var week_day = '+3';
                                                        // }else if(holiday[key].week == 'fourth'){
                                                        //     var week_day = '+4';
                                                        // }else{
                                                        //     var week_day = '+4';
                                                        // }

                                                        // console.log(week_day, 'week_day')
                                                        // console.log(ass_day, 'ass_day')
                                                        // console.log(month_name, 'month_name')
                                                        // console.log(year, 'year')
                                                        // console.log(holiday_date, 'HOLIDAYDATEEE')
                                                        // console.log(querys[i].date, 'QUERYSSIDATEE')
                                                        // console.log(moment(holiday[key].date).format('YYYY-MM-DD'), 'ppppppppp')

                                                        if(moment(holiday[key].date).format('YYYY-MM-DD') == holiday_date && holiday_date == querys[i].date){
                                                            // console.log('CUIHHHHHHH')
                                                            if(holiday[key].type == 1){
                                                                querys[i].check_holiday = '(SH)'
                                                            }else{
                                                                querys[i].check_holiday = '(RH)'
                                                            }
                                                        }
                                                        // if(holiday_date == && holiday_date == querys[i].date)
                                                    }
                                                }else{
                                                    // console.log('ADAYG MASUK NIHHHH')
                                                    //BELUM DILANJUTINNNNNN
                                                    
                                                    // var get_new_ass_hole =

                                                    // console.log(querys[i].date, 'wwwwwwwwwwwwwww')
                                                    // console.log(moment(holiday[key].date).format('YYYY-MM-DD'), 'mmmmmmmmmmm')
                                                    if(moment(holiday[key].date).format('YYYY-MM-DD') == querys[i].date){
                                                        if(holiday[key].type == 1){
                                                            querys[i].check_holiday = '(SH)'
                                                        }else{
                                                            querys[i].check_holiday = '(RH)'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // console.log(querys[i].check_holiday, 'querys[i].check_holiday')
                                    // console.log(terminated.length, 'TERMINATEDDDDDDDD')
                                    if(terminated.length < 0){
                                        var schedule = 'TER'
                                    }

                                    /* BACKUP 25092018 04:52 PM
                                    *if(!isset($colorLate)){
                                    *	$colorLate = 'red';
                                    }*/

                                    // console.log(timeIn, 'timein')
                                    // console.log(timeOut, 'timeout')
                                    // console.log(schedule, 'SCHEDULEEE')
                                    console.log(querys[i].WorkHours, 'SAVNJVASLVAVJLWBJVWVWEVWVWEVEW')
                                    if(schedule  == 'DO'){
                                        if(timeIn == '-' && timeOut == '-'){
                                            var overRest = '-'
                                        }else{
                                            // console.log(timeIn, 'TIMEIINNNNNN')
                                            // console.log(timeOut, 'TIMEOUTTTTT')
                                            var titomin = timeIn.split(':')
                                            var ti =  (+titomin[0]) * 60 + (+titomin[1])
                                            var totomin = timeOut.split(':')
                                            var to =  (+totomin[0]) * 60 + (+totomin[1])

                                            console.log(ti, 'TITITITITIT')
                                            console.log(to, 'TOTOTOTOTOTOTO')
                                            // var overRest  = moment((to-ti), 'HH:mm')
                                            var split = querys[i].WorkHours.split(':')
                                            if(split[0] < 10){
                                                var split1 =`0${split[0]}`
                                            }else{
                                                var split1 = split[0]
                                                var overRest = querys[i].WorkHours
                                            }

                                            if(overRest == '00:00'){
                                                overRest  =   '-';
                                            }
                                        }
                                    }else{
                                        var overRest = '-';
                                    }

                                    console.log(overRest, 'overrestsfafasast')

                                    if(workStatus ==  'no' &&  schedule == 'DO'){
                                        var OTR_color = 'yes';
                                    }else{
                                        var OTR_color = 'no';
                                    }
                                    // console.log(OTR_color, 'OTRCOLORRR')
                                    // var date_c = query[i].date;
                                    // var emp_c  = query[i].employee_id;

                                    /*
                                    * COLOR_ATT_EARLYOUT #####################################################################################################
                                    */
                                    // console.log(earlyOut, 'EARLYOUTTT')
                                    if(earlyOut != null){
                                        var date_c = querys[i].date;
                                        var emp_c  = querys[i].employee_id;

                                        /* BACKUP 25092018 06:13 PM
                                        * select * from  att_late, att_schedule_request where  att_late.type_id = 8 and date  = '$date_c' and att_late.employee_id = '$emp_c' and  att_late.late_id  = att_schedule_request.request_id and att_schedule_request.approver = 2
                                        */
                                        try{
                                            [earlyundertime] = await database.promise().query(`CALL check_early_and_under_time('${date_c}', '${emp_c}')`);
                                        }catch(e){
                                            // give = null
                                            console.log(e)
                                        }

                                        // console.log(earlyundertime, 'earlyundertime')
                                        var early_c = earlyundertime[0]
                                        var check_undertime =  earlyundertime[1]
                                        // console.log(early_c, 'early_c')
                                        // console.log(check_undertime, 'check_undertime')
                                        if(check_undertime.length > 0){
                                            var arr_early = [];
                                            for(var idx1=0; idx1 < check_undertime.length; idx1++){
                                                if(check_undertime[idx1].status_id == 2){
                                                    arr_early.push('green');
                                                    break;
                                                }else if(check_undertime[idx1].status_id == 1){
                                                    arr_early.push('orange');
                                                }else if(check_undertime[idx1].status_id == 4){
                                                    arr_early.push('violet');
                                                }else if(check_undertime[idx1].status_id == 3){
                                                    arr_early.push('red');
                                                }
                                            }

                                            if(arr_early.includes('orange')){
                                                querys[i].early_c = 'orange';
                                            }else{
                                                if(arr_early.length > 0){
                                                    querys[i].early_c = arr_early[0]
                                                }else{
                                                    querys[i].early_c = 'violet'
                                                }
                                            }
                                        }else{
                                            if(early_c.length > 0){
                                                var arr_early = []

                                                for(var idx1=0; idx1 < early_c.length; idx1++){
                                                    // console.log(early_c[idx1].early_out, 'early_c[idx1].early_out')
                                                    let splits = early_c[idx1].early_out.toString().split(':')
                                                    let h = splits[0] * 60
                                                    let total_early = h+splits[1]

                                                    if(earlyOut <= total_early && $early_c[idx1].status_id == 2){
                                                        arr_early.push('green');
                                                        break;
                                                    }else if(earlyOut <= total_early && early_c[idx1].status_id == 1){
                                                        arr_early.push('orange');
                                                    }else if(earlyOut <= total_early && early_c[idx1].status_id == 4){
                                                        arr_early.push('violet');
                                                    }else if(earlyOut <= total_early && early_c[idx1].status_id == 3){
                                                        arr_early.push('red');
                                                    }
                                                }

                                                if(arr_early.includes('orange')){
                                                    querys[i].early_c = 'orange';
                                                }else{
                                                    if(arr_early.length > 0){
                                                        querys[i].early_c = arr_early[0]
                                                    }else{
                                                        querys[i].early_c = 'violet'
                                                    }
                                                }
                                            }else{
                                                var arr_early = ['violet']
                                                querys[i].early_c = 'violet'
                                            }
                                        }
                                    }else{
                                        querys[i].early_c = 'violet'
                                    }

                                    // console.log(schedule, 'SCHEDULELAGIII')
                                    // console.log(schedule.length, 'LENGTHHHHH')
                                    // if(schedule.length > 4){
                                    //     //belummmm
                                    //     let turns = schedule.split('-')
                                    //     if(typeof turns[1] == undefined){
                                    //         var workStatus = 'no'
                                    //     }else{

                                    //     }
                                    // }

                                    // console.log(timeIn, 'TIMEINNNNNN')
                                    if(timeIn == '-'){
                                        var date_timeIn   = querys[i].date;
                                        var date_timeIn_employee  =  querys[i].employee_id;
                                        
                                        try{
                                            [[check_time_orange]] = await database.promise().query(`CALL check_time_orange('${date_timeIn}', '${date_timeIn_employee}')`);
                                        }catch(e){
                                            // give = null
                                            console.log(e)
                                        }

                                        // console.log(check_time_orange, 'check_time_orange')
                                        if(check_time_orange.length > 0){
                                            if(typeof check_time_orange[0] != undefined && check_time_orange[0].status_id  ==  1){
                                                var timeInStatusC = 'orange';
                                                var timeIn = check_time_orange.req_in.substr(0,5)
                                            }else{
                                                var timeInStatusC = 'green'
                                            }
                                        }else{
                                            var timeInStatusC = 'red'
                                        }
                                    }else{
                                        var timeInStatusC = 'green'
                                    }

                                    // console.log(timeOut, 'TIMEOUTTTT')
                                    if(timeOut == '-'){
                                        var date_timeOut   = querys[i].date;
                                        var date_timeOut_employee  =  querys[i].employee_id;
                                        
                                        try{
                                            [[check_time_orange]] = await database.promise().query(`CALL check_time_orange('${date_timeOut}', '${date_timeOut_employee}')`);
                                        }catch(e){
                                            // give = null
                                            console.log(e)
                                        }

                                        // console.log(check_time_orange, 'check_time_orange')
                                        if(check_time_orange.length > 0){
                                            if(typeof check_time_orange[0] != undefined && check_time_orange[0].status_id  ==  1){
                                                var timeOutStatusC = 'orange';
                                                var timeOut = check_time_orange.req_out.substr(0,5)
                                            }else{
                                                var timeOutStatusC = 'green'
                                            }
                                        }else{
                                            var timeOutStatusC = 'red'
                                        }
                                    }else{
                                        var timeOutStatusC = 'green'
                                    }

                                    //check_color_orange
                                    console.log(querys[i].total_overtimes, 'querys[i].total_overtimes')
                                    console.log(totalOvers, 'totalOversdbsbsdbsdbs')
                                    if(querys[i].total_overtimes && totalOvers){
                                        if(querys[i].total_overtimes <= totalOvers){
                                            totalOvers = querys[i].total_overtimes
                                        }
                                    }

                                    console.log(totalOvers, 'totalOvers')
                                    if(totalOvers != null && totalOvers != '-'){
                                        // console.log('MASUKGATUUUUUUHAHAHAHAHAHAHA')
                                        var less_1h = totalOvers.substr(1,1);
                                        // console.log(less_1h, 'LESS1HHHH')
                                        if(parseInt(less_1h) >= 1){
                                            console.log('PASTIMASUKKK LAH')
                                            var date_overtime  =  querys[i].date;
                                            var employee_overtime = querys[i].employee_id;
                                            
                                            try{
                                                [search] = await database.promise().query(`select * from att_overtime as t1, att_schedule_request as t2
                                                                                            where t1.employee_id  =  '${employee_overtime}'
                                                                                            and  t1.date_str =  '${date_overtime}'
                                                                                            and  t1.type_id =  t2.type_id
                                                                                            and  t1.id = t2.request_id
                                                                                            order by t1.id desc limit 1`);
                                            }catch(e){
                                                // give = null
                                                console.log(e)
                                            }

                                            // console.log(search, 'INI SEARCHHHHH')
                                                /*
                                                * BACKUP 25092018 05:25 PM
                                                */
                                                if(search.length > 0){
                                                    if(search.status_id == 1){
                                                        var overtime_non_do = 'orange'
                                                    }else if(search.status_id == 2){
                                                        if(typeof querys[i].total_overtime != undefined){
                                                            if(search.total_overtime <= querys[i].total_overtime){
                                                                var overtime_non_do  =  'green';
                                                                var totalOvers = search.total_overtime;
                                                                var overtime_start_time = search.overtime_str;
                                                                var overtime_end_time = search.overtime_end;
                                                            }else{
                                                                var overtime_non_do = 'violet'
                                                            }
                                                        }else{
                                                            var overtime_non_do = 'violet'
                                                        }
                                                    }else if(search.status_id == 4){
                                                        var overtime_non_do = 'violet'
                                                    }else if(search.status_id == 3){
                                                        var overtime_non_do = 'red'
                                                    }
                                                }else{
                                                    /*
                                                    * BACKUP 25092018 05:25 PM
                                                    * $overtime_non_do =   'red';
                                                    */
                                                    var overtime_non_do =   'violet';
                                                }
                                            
                                        }else{
                                            console.log('masukelsepertamaaa')
                                            overtime_non_do = 'grey'
                                        }
                                    }else{
                                        console.log('masukelseterakhirrrr')
                                        /*
										* BACKUP 25092018 05:25 PM
										* $overtime_non_do =   'red';
										*/
									    var overtime_non_do = 'grey';
                                    }

                                    /*
                                    * COLOR_ATT_OVERTIME_REST
                                    */
                                    var approve_restday = false;
                                    console.log(overRest, 'OVERRESTTTTTT')
                                    if(overRest != null){
                                        var date_overtime  =  querys[i].date;
                                        var employee_overtime = querys[i].employee_id ;
                                        
                                        // console.log(schedule, 'SCHEDULEEEE')
                                        if(schedule == 'DO'){
                                            try{
                                                [search] = await database.promise().query(`select * from att_overtime as t1, att_schedule_request as t2
                                                                                            where t1.employee_id  =  '${employee_overtime}'
                                                                                            and  t1.date_str =  '${date_overtime}'
                                                                                            and  t1.type_id =  t2.type_id
                                                                                            and  t1.id = t2.request_id and
                                                                                            t2.status_id = 2
                                                                                            order by t1.id desc limit 1`);
                                            }catch(e){
                                                // give = null
                                                console.log(e)
                                            }

                                            console.log(search, 'SEARCHHHHHH')
                                            if(search.length > 0){
                                                if(search.status_id == 1){
                                                    var OTR_color = 'orange'
                                                }else if(search.status_id == 2){
                                                    if(search.total_overtime <= overRest){
                                                        var approve_restday = search;
														var OTR_color  =  'green';
														var overtime_start_time = search.overtime_str;
														var overtime_end_time = search.overtime_end;
                                                    }else{
                                                        var OTR_color = 'violet'
                                                    }
                                                }else{
                                                    var OTR_color = 'red'
                                                }
                                            }else{
                                                var OTR_color = 'violet'
                                            }
                                        }else{
                                            var OTR_color = 'violet'
                                        }
                                    }else{
                                        var OTR_color = 'violet';
                                    }

    								// //check  changeshift
                                    // if(typeof querys[i].date != undefined && typeof querys[i].allow_changeShift != undefined){
                                    //     var date_changeshift  =  querys[i].date;
                                    //     var employee_changeshift = querys[i].employee_id;
                                        
                                    //     try{
                                    //         [[check_exist_change_shift]] = await database.promise().query(`CALL check_time_orange('${employee_changeshift}', '${date_changeshift}')`);
                                    //     }catch(e){
                                    //         // give = null
                                    //         console.log(e)
                                    //     }

                                    //     console.log(check_exist_change_shift, 'check_exist_change_shift')
                                    //     if(check_exist_change_shift.length > 0){
                                    //         var list_code = ['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB'];

                                    //         if(check_exist_change_shift.shift_code.includes(list_code)){
                                    //             var schedule =  check_exist_change_shift[0].shift_code;
                                    //             var late = '-';
                                    //             var earlyOut = '-';
                                    //             var short = '-';
                                    //         }else{
                                    //             var schedule = `${check_exist_change_shift[0]._from.substr(0,5)}-${check_exist_change_shift[0]._to.substr(0,5)}`
                                    //         }
                                    //     }
                                    // }
                                    // console.log(querys[i].training_req, 'TRAINING REQQQQQ')
                                    // console.log(querys[i].OvertimeRestDay, 'querys[i].OvertimeRestDay')
                                    try {
                                        if(querys[i].training_req){
                                            if(querys[i].shift_code == "T"){
                                                var schedule = 'T';
                                            }else if(querys[i].shift_code == "OB"){
                                                var schedule = "OB";
                                            }
                                            var late = '-';
                                        }
    
                                        // if(querys[i].OvertimeRestDay != '99:99:99'){
                                        //     var overRest = querys[i].OvertimeRestDay;
                                        // }
                                    } catch (error) {
                                        console.log(error)
                                    }
                                    console.log(overRest, 'ebenneneneenetnnep')

                                    if(schedule.length == 2 && querys[i].fromx == '00:00:00'){
                                        var late = '-';
                                        var earlyOut = '-';
                                        var short = '-'; 
                                    }
                                        console.log(late, 'indexofff')
                                        try {
                                            if(late.indexOf(':') > 0){
                                                // console.log('masamasuk sini sihhh')
                                                var late_split = late.split(':')
                                                var late = (parseInt(late_split[0]) * 60) + parseInt(late_split[1])
                                            }else{
                                                var late ='-';
                                            }
                                        } catch (error) {
                                            // console.log(error)
                                        }
                                        console.log(late, 'TOLOLOOOOEVE3V3V3')

                                        try {
                                            if(short.indexOf(':') > 0){
                                                var short_split = short.split(':')
                                                var short = (parseInt(short_split[0]) * 60) + parseInt(short_split[1])
                                            }
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    
                                    if(approve_restday){
                                        // if()
                                        //belumm
                                    }
                                    
                                    if(!timeIn || timeIn =='-'){
                                        if(querys[i].shift_code.includes(['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB','T'])){
                                            var workHour = '-'
                                        }
                                        var timeIn = '-';
                                        var totalOvers = '-';
                                        var overtime_non_do = '-';
                                        var overRest = '-';
                                        var short = '-';
                                        var late = '-';
                                        var earlyOut = '-';
                                    }

                                    if(!timeOut || timeOut =='-'){
                                        if(querys[i].shift_code.includes(['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB','T'])){
                                            var workHour = '-'
                                        }
                                        var timeIn = '-';
                                        var totalOvers = '-';
                                        var overtime_non_do = '-';
                                        var overRest = '-';
                                        var short = '-';
                                        var late = '-';
                                        var earlyOut = '-';
                                    }
                                    // console.log(late, 'TOLOLOOOO123131')

                                    if(timeInStatusC == 'orange' || timeOutStatusC == 'orange'){
                                        var workHour	= '-';
                                        var totalOvers = '-';
                                        var overtime_non_do = '-';
                                        var overRest = '-';
                                        var short = '-';
                                        var late = '-';
                                        var earlyOut = '-';
                                        /*$timeOut = '-';
                                        $timeIn = '-';*/
                                    }

                                    if(check_ado.length > 0){
                                        for(var key_ado in check_ado){
                                            var value_ado = check_ado[key_ado]
                                            var sch_ado = value_ado.Schedule(':')
                                            var schedule_ado = false
                                            if(sch_ado > 0){
                                                schedule_ado = sch_ado[1]
                                            }

                                                var checked = false;
                                                if(querys[i].date_changeShift != "99:99:99"){
                                                    if(value_ado.updated_at > querys[i].date_changeShift){
                                                        checked = true;
                                                    }
                                                }else if(querys[i].date_swapShift != "99:99:99"){
                                                    if(value_ado.updated_at > querys[i].date_swapShift){
                                                        checked = true;
                                                    }
                                                }else{
                                                    checked = true;
                                                }

                                                if(checked && querys[i].date == value_ado.change_date){
                                                    var schedule = 'ADO';
                                                    querys[i].shift_code = 'ADO';
                                                    var timeOut = '-';
                                                    var workHour	= '-';
                                                    var totalOvers = '-';
                                                    var overtime_non_do = '-';
                                                    var overRest = '-';
                                                    var short = '-';
                                                    var late = '-';
                                                    var earlyOut = '-';
                                                    break;
                                                }
                                        }
                                    }

                                    if(workStatus == 'yes'){
                                        if(timeInStatusC == 'green' && timeOutStatusC == 'green'){
                                            var workStatus = 'no';
                                        }
                                    }

                                    // console.log(querys[i].date_swapShift, 'querys[i].date_swapShift')
                                    if(querys[i].date_swapShift != "99:99:99"){
                                        // console.log(check_ado.length, 'LENGTHHHH')
                                        if(check_ado.length == 0){				
                                            // console.log(schedule, 'schedule')					
                                            if(schedule != querys[i].schedule_swapShift){
                                                if(schedule.length > 5){
                                                        schedule = querys[i].schedule_swapShift;
                                                }else{
                                                    if(querys[i].shift_code.includes(['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB','T'])){
                                                        schedule = querys[i].shift_code;
                                                    }else{
                                                        schedule = querys[i].schedule_swapShift;
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // if(querys[i].shift_code.includes(['DO','ADO','VL','BL','TB','SL','EL','BE','ML','PL','MA','OB','T'])){
                                    //     var totalOvers = '-';
                                    // }

                                    if(OTR_color == 'green' ||overtime_non_do == 'green' ){
                                        overtime_start_time = search.overtime_str;
                                        overtime_end_time = search.overtime_end;
                                    }else{
                                        overtime_start_time = null;
                                        overtime_end_time = null;
                                    }

                                    console.log(overtime_non_do, 'TOLOLOOOO')
                                    // console.log(latest_modified, latest_request, latest_request1, 'LATEST')
                                    temp.push({
                                        'check_holiday': querys[i].check_holiday,
                                        'job': querys[i].job,
                                        'department': querys[i].department,
                                        'department_name': querys[i].department_name,
                                        'local_it': querys[i].local_it,
                                        'early_c' :  querys[i].early_c,
                                        'date' :  querys[i].date,
                                        'nextday': querys[i].nextdays,
                                        'colorLate' :  colorLate,
                                        'employee_id' :  querys[i].employee_id,
                                        'Name' :  querys[i].Name,
                                        'first_name' :  querys[i].first_name,
                                        'last_name' :  querys[i].last_name,
                                        'schedule' :  schedule,
                                        'schedule_shift_code' :  querys[i].shift_code,
                                        'timeIn' :  timeIn,
                                        'timeOut' :  timeOut,
                                        'noTimeIn' :  noTimeInStatus,
                                        'noTimeOut' :  noTimeOutStatus,
                                        'WorkHours' :  /*workHour*/ (workHour == 0 ? workHour = '-' : workHour = workHour  ),
                                        'workStatus' :  workStatus,
                                        'total_overtime' :  /*totalOvers*/ (totalOvers == 0 ? totalOvers = '-' : totalOvers = totalOvers  ),
                                        'new_color_overtime' :  overtime_non_do,
                                        'overStatus' :  overStatus,
                                        'status' :  status,
                                        'OvertimeRestDay' :  /*overRest*/ (overRest == 0 ? overRest = '-' : overRest = overRest  ),
                                        'OvertimeRestDay_Color' :  OTR_color,
                                        'overtime_start_time' :  overtime_start_time,
                                        'overtime_end_time' :  overtime_end_time,
                                        'timeOutStatus' :  timeOutStatus,
                                        'timeInStatus' :  timeInStatus,
                                        'C_TimeIn' :  timeInStatusC,
                                        'C_TimeOut' :  timeOutStatusC,
                                        'Short' :  short /*(short == 0 ? short = '-' : short = short  )*/,
                                        'Late' :  late /*(late == 0 ? late = '-' : late = late  )*/,
                                        'EarlyOut' :   (earlyOut == 0 ? earlyOut = '-' : earlyOut = earlyOut  ),
                                        // 'between' :  between
                                    })
                                    
                                    i++;
                                }
                            }
                        }catch(e){
                            console.log(e)
                        }
                    }

                    var data = {'data': temp, 'status':200, 'message':'View record data'}
                    // return(null, data)
                }else{
                    var data = {'data': null, 'status':200, 'message':'View record data'}
                    // return(null, data)
                }
                return cb1(null, data)
                // console.log(data, 'DATACUYYYY')
            })()
            // console.log(data, 'ppppppp')
        }
        // ,(query, next)=>{
        //     return console.log(query, 'TEMPPPPP')
        // }
    ], (err, result)=>{
        if(err) 
        return callback(true, err)

        return callback(null,result)
    })
}

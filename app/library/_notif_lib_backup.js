const async     = require('async');
const database  = require('../connection/mysql');
const config    = require('../config.js');
const procedure = require('../procedure');


module.exports = async (data, callback) => {

	/**
	 * Algorithm
	 * 0. get hr form db
	 * 1. Check id is int
	 * 2. Check id is available in table
	 */
    return new Promise((resolve, reject) => {
        async.waterfall([
            (next) => {
                //user =  hr /supervisor ? regular employee no needed it
                let val = {
                    hr: [],
                    ...data
                };
                procedure.__notif_get_hr_pro(null, (err, res) => {
                    if(err) return next(true, res);
                    try {
                        if (res[0]) {
                            return next(null, {...val, hr: res[0]});
                        }
                    } catch (error) {
                        return next(true, error);
                    }
                });
                
            },
            (value, next) => {
                
                // set hrx
                let hrx = [];
                value.hr.forEach((el, index) => {
                    hrx.push({
                        [el.employee_id]: 0,
                        sup_stat:  0,
                        sup_date: '0000-00-00',
                        sup_time: '00:00',
                        read_stat: 0,
                    });
                    if (value.hr.length == (index + 1)) {
                        hrx.push({
                            [2014888]: 0,
                            sup_stat:  0,
                            sup_date: '0000-00-00',
                            sup_time: '00:00',
                            read_stat: 0,
                        });
                    }
                })
                return next(null, {...value, hrx: hrx});

            },
            (value, next) => {
                
                // get sub
                procedure.__notif_get_sub_pro(value.employee_id, (err, res) => {
                    if(err) return next(true, res);
                    try {
                        if (res[0]) {
                            return next(null, {...value, sub: res[0]});
                        }
                    } catch (error) {
                        return next(true, error);
                    }
                });

            },
            (value, next) => {

                // set subx
                let subx = [];
                value.sub.forEach((el, index) => {
                    subx.push({
                        [el.subordinate]: 0,
                        swap_stat:  0,
                        swap_date: '0000-00-00',
                        swap_time: '00:00',
                        read_stat: 0,
                    });
                    if (value.sub.length == (index + 1)) {
                        subx.push({
                            [2014888]: 0,
                            swap_stat:  0,
                            swap_date: '0000-00-00',
                            swap_time: '00:00',
                            read_stat: 0,
                        });
                    }
                });

                return next(null, {...value, subx: subx});

            },
            (value, next) => {
                
                // get sup
                procedure.__notif_get_sup_pro(value.employee_id, (err, res) => {
                    if(err) return next(true, res);
                    try {
                        if (res[0]) {
                            return next(null, {...value, sup: res[0]});
                        }
                    } catch (error) {
                        return next(true, error);
                    }
                });

            },
            (value, next) => {
                
                // set supx
                let supx = [];
                value.sup.forEach((el, index) => {
                    supx.push({
                        [el.supervisor]: 0,
                        sup_stat:  0,
                        sup_date: '0000-00-00',
                        sup_time: '00:00',
                        read_stat: 0,
                    });
                    if (value.sup.length == (index + 1)) {
                        supx.push({
                            [2014888]: 0,
                            sup_stat:  0,
                            sup_date: '0000-00-00',
                            sup_time: '00:00',
                            read_stat: 0,
                        });
                    }
                });
                return next(null, {...value, supx: supx});

            },
            (value, next) => {
                
                // get swap
                if (value.swap) {
                    return next(null, {...value, swapx: [value.swap]});
                } else {
                    return next(null, {...value, swapx: []});
                }
                // procedure.__notif_get_swap_pro({emp_id: value.employee_id, ids: value.ids}, (err, res) => {
                //     if(err) return next(true, res);
                // 	try {
                //         if (res[0]) {
                //             return next(null, {...value, swap: res[0]});
                //         }
                // 	} catch (error) {
                // 		return next(true, error);
                // 	}
                // });

            },
            (value, next) => {
                
                // set swap
                let swap = [];
                if (value.swap) {
                    swap = [{
                        [value.swap]: 0,
                        swap_stat:  0,
                        swap_date: '0000-00-00',
                        swap_time: '00:00',
                        read_stat: 0,
                    }];
                }
                return next(null, {...value, swap: swap});

            },
            (value, next) => {

                // section if if if and if

                let master;
                let end;
                let arr;

                if (value.type == 'time') {
                    if (value.local_it == 'local') {
                        master = 'schedule';
                        end = {
                            hr: 1,
                            emp: '0',
                            sup: '0',
                        };
                        arr = {
                            hr: value.hrx,
                            sup: [],
                            emp: [],
                        };
                    } else {
                        master = 'schedule';
                        end = {
                            sup: 1,
                            hr: '0',
                            emp: '0',
                        };
                        arr = {
                            sup: value.supx,
                            hr: [],
                            sup: [],
                        };
                    }
                }

                if (value.from_type == 'attendance') {
                    if (value.type == 'over') {
                        if (value.local_it == 'local') {
                            master = 'schedule';
                            end = {
                                sup: 1,
                                emp: 0,
                                hr: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: [],
                                emp: [],
                            };
                        }
                    }
                    if (value.type == 'under') {
                        if (value.type == 'local') {
                            master = 'schedule';
                            end = {
                                sup: 1,
                                emp: 0,
                                hr: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: [],
                                emp: [],
                            };
                        }
                    }
                    if (value.type == 'late' || value.type == 'early') {
                        if (value.local_it == 'local') {
                            master = 'schedule';
                            end = {
                                sup: 1,
                                hr: 0,
                                emp: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: value.hrx,
                                emp: [],
                            };
                        }
                    }
                    if (value.type == 'ob') {
                        master = 'schedule';
                        end = {
                            sup: 1,
                            hr: 0,
                            emp: 0,
                        };
                        arr = {
                            sup: value.supx,
                            hr: [],
                            emp: [],
                        };
                    }
                    if (value.type == 'train') {
                        master = 'schedule';
                        end = {
                            sup: 1,
                            hr: 0,
                            emp: 0,
                        };
                        arr = {
                            sup: value.supx,
                            hr: [],
                            emp: [],
                        };
                    }
                    if (value.type = 'change') {
                        if (value.user == 'sup') {
                            master = 'schedule';
                            end = {
                                emp: 1,
                                hr: 0,
                                emp: 0,
                            };
                            arr = {
                                emp: value.subx,
                                sup: [],
                                hr: [],
                            };
                        } else {
                            master = 'schedule';
                            end = {
                                sup: 1,
                                hr: 0,
                                emp: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: [],
                                emp: [],
                            };
                        }
                    }
                    if (value.type == 'swap') {
                        if (value.type == 'local') {
                            master = 'schedule';
                            end = {
                                emp: 1,
                                sup: 2,
                                emp: 0,
                            };
                            arr = {
                                emp: value.swapx,
                                sup: value.supx,
                                hr: [],
                            };
                        }
                    }
                } else {

                    // leave request
                    if (value.type == 'vacation') {
                        if (value.local_it) {
                            master = 'leave';
                            end = {
                                hr: 1,
                                sup: 2,
                                emp: 0,
                            };
                            arr = {
                                hr: value.hrx,
                                sup: value.supx,
                                emp: [],
                            };
                        } else {
                            master = 'leave';
                            end = {
                                sup: 1,
                                hr: 0,
                                emp: 0,
                            };
                            arr = {
                                sup: value.supx,
                                emp: [],
                                hr: [],
                            };
                        }
                    }
                    if (value.type == 'ADO') {
                        master = 'leave';
                        end = {
                            hr: 1,
                            sup: 2,
                            emp: 0,
                        };
                        arr = {
                            hr: value.hrx,
                            sup: value.supx,
                            emp: [],
                        };
                    }
                    if (value.type == 'enhance') {
                        if (value.local_it) {
                            master = 'leave';
                            end = {
                                hr: 1,
                                sup: 2,
                                emp: 0,
                            };
                            arr = {
                                hr: value.hrx,
                                sup: value.supx,
                                emp: [],
                            };
                        }
                    }
                    if (value.type == 'birth') {
                        master = 'leave';
                        end = {
                            hr: 1,
                            sup: 0,
                            emp: 0,
                        };
                        arr = {
                            hr: value.hrx,
                            sup: [],
                            emp: [],
                        };
                    }
                    if (value.user = 'hr' && value.type == 'sick' && value.local_it == 'local') {
                        master = 'leave';
                        end = {
                            sup: 1,
                            hr: 0,
                            emp: 0,
                        };
                        arr = {
                            sup: value.supx,
                            hr: [],
                            emp: [],
                        };
                    }
                    if (value.type == 'sick' && value.local_it == 'local') {
                        master = 'leave';
                        end = {
                            hr: 1,
                            sup: 2,
                            emp: 0,
                        };
                        arr = {
                            hr: value.hrx,
                            sup: value.supx,
                            emp: [],
                        };
                    }
                    if (value.type == 'sick' && value.local_it != 'expat') {
                        master = 'leave';
                        end = {
                            sup: 1,
                            emp: 2,
                            hr: 0,
                        };
                        arr = {
                            sup: value.supx,
                            hr: [],
                            emp: [],
                        };
                    }
                    if (value.type == 'maternity') {
                        if (value.user == 'hr') {
                            if (value.local_it == 'local') {
                                master = 'leave';
                                end = {
                                    hr: 1,
                                    emp: 0,
                                    sup: 0,
                                };
                                arr = {
                                    hr: value.hrx,
                                    sup: [],
                                    emp: [],
                                };
                            }
                        } else {
                            if (value.local_it == 'expat') {
                                master = 'leave';
                                end = {
                                    sup: 1,
                                    hr: 0,
                                    emp: 0,
                                };
                                arr = {
                                    sup: value.supx,
                                    hr: [],
                                    emp: [],
                                };
                            }
                        }
                    }
                    if (value.type == 'paternity') {
                        if (value.local_it == 'local') {
                            master = 'leave';
                            end = {
                                sup: 1,
                                hr: 2,
                                emp: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: value.hrx,
                                emp: [],
                            };
                        } else {
                            master = 'leave';
                            end = {
                                sup: 1,
                                hr: 0,
                                emp: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: [],
                                emp: [],
                            };
                        }
                    }
                    if (value.type == 'breavement') {
                        if (value.user == 'hr') {
                            if (value.local_it == 'local') {
                                master = 'leave';
                                end = {
                                    sup: 1,
                                    hr: 0,
                                    emp: 0,
                                };
                                arr = {
                                    sup: value.supx,
                                    hr: [],
                                    emp: [],
                                };
                            }
                        } else {
                            if (value.local_it == 'local') {
                                master = 'leave';
                                end = {
                                    sup: 1,
                                    hr: 2,
                                    emp: 0,
                                };
                                arr = {
                                    sup: value.supx,
                                    hr: value.hrx,
                                    emp: [],
                                };
                            } else {
                                master = 'leave';
                                end = {
                                    sup: 1,
                                    hr: 0,
                                    emp: 0,
                                };
                                arr = {
                                    sup: value.supx,
                                    hr: value.hrx,
                                    emp: [],
                                };
                            }
                        }
                    }
                    if (value.type == 'marriage') {
                        if (value.local_it == 'local') {
                            master = 'leave';
                            end = {
                                sup: 1,
                                hr: 2,
                                emp: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: value.hrx,
                                emp: [],
                            };
                        } else {
                            master = 'leave';
                            end = {
                                sup: 1,
                                hr: 0,
                                emp: 0,
                            };
                            arr = {
                                sup: value.supx,
                                hr: [],
                                emp: [],
                            };
                        }
                    }
                    if (value.type == 'emergency') {
                        if (value.user == 'hr') {
                            if (value.local_it == 'local') {
                                master = 'leave';
                                end = {
                                    sup: 1,
                                    hr: 0,
                                    emp: 0,
                                };
                                arr = {
                                    hr: value.hrx,
                                    sup: [],
                                    emp: [],
                                };
                            }
                        } else {
                            if (value.local_it == 'local') {
                                master = 'leave';
                                end = {
                                    sup: 1,
                                    hr: 2,
                                    emp: 0,
                                };
                                arr = {
                                    hr: value.hrx,
                                    sup: value.supx,
                                    emp: [],
                                };
                            } else {
                                master = 'leave';
                                end = {
                                    sup: 1,
                                    hr: 0,
                                    emp: 0,
                                };
                                arr = {
                                    sup: value.supx,
                                    hr: [],
                                    emp: [],
                                };
                            }
                        }
                    }
                    if (value.type == 'suspension') {
                        if (value.user == 'hr') {
                            if (value.local_it == 'local') {
                                master = 'leave';
                                end = {
                                    sup: 0,
                                    hr: 0,
                                    emp: 0,
                                };
                                arr = {
                                    sup: value.supx,
                                    hr: value.hrx,
                                    emp: [],
                                };
                            }
                        }
                    }
                }

                return next(null, {...value, master, end, arr});
            },
            (value, next) => {

                return next(null, { ...value, chat: [] });
                // if (value.arr) {
                //     procedure.__notif_command_center_pro(value.ids, (err, res) => {
                //         if(err) return next(true, res);
                //         try {
                //             if (res[0]) {
                //                 return next(null, {...value, chat: res[0]});
                //             }
                //         } catch (error) {
                //             return next(true, error);
                //         }
                //     });
                // } else {
                //     return next(true, {data: [], message: 'your not allowed to request.'});
                // }

            },
            (value, next) => {

                
                value.arr.requestor_stat = { [value.employee_id]: 0 };
                value.arr.chat_id = [];
                value.arr.master = value.master;
                value.arr.req_flow = value.end;
                
                console.log(value, '==== OKE SIAPPP LUERRE MUAHHH');
                return;

                // console.log(value.master, json_arr, '==== NOTIFFFFFF');
                // return;

                let chatID = [];

                if (value.chat) {
                    value.chat.map((el, index) => {
                        
                        chatID[index] = { [el.id]: 'u' };
                        if (value.chat.length == (index + 1)) {
                            value.arr.requestor_stat = { [value.employee_id]: 0 };
                            value.arr.chat_id = chatID;
                            value.arr.req_flow = value.end;
                            value.arr.master = value.master;

                            let json_arr = JSON.stringify(value.arr);
                            return next(null, {...value, json_arr});
                        }
                    });
                }
            },
            // (value, next) => {

            //     let val = {
            //         employee_id: value.employee_id,
            //         ids: value.ids,
            //         json_arr: value.json_arr,
            //     }
            //     procedure.__notif_insert_pool_req_pro(val, (err, res) => {
            //         if(err) return next(true, res);
            //         try {
            //             if (res[0][0].status == 'success') {
            //                 return next(null, res[0][0].message);
            //             }
            //         } catch (error) {
            //             return next(true, error);
            //         }
            //     });
            // }
        ],(error, result) => {
            /**
             * handle error
             */
            if (error) {
                return reject(result);
            }
            return resolve(result);
        });
	});
};

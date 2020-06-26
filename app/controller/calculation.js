const async 		= require('async');
const library 		= require('../library');

module.exports = (req, callback) => {
	
	async.waterfall([
		(next) => {
			if(req.date_req){
				var dates = req.date_req;
				library.calculation('view-attendance-perday',req.dates,req.name,null,null,null,(err, dt)=>{
					if(err) return next(err, null)

					return next(null, dt)
				});
			}else{
				library.calculation('view-attendance', req.name, req.dates,null,null,null,(err, dt)=>{
					if(err) return next(err, null)

					return next(null, dt)
				});
			}
		}
	],
	(error, response) => {
		/**
		 * handle error
		 */
		if(error) {
			let data = {
                header: {
                    status: 500,
                    message: error,
                    access: {
                        create: 1,
                        read: 1,
                        update: 1,
                        delete: 1
                    }
                },
                data: error,
			};
			return callback(data, null);
		};


		let data = {
			header: {
				status 	: 200,
				message : 'Success.',
				access:  {
					create	: 1,
					read	: 1,
					update	: 1,
					delete	: 1
				}
			},
			data: response,
		};
		return callback(null, data);
	});
};

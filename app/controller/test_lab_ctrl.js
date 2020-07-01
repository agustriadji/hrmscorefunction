const async 		= require('async');
const validator 	= require('../validator');
const procedure 	= require('../procedure');
const library 		= require('../library');

module.exports = (req, callback) => {
	
	async.waterfall([
		(next) => {
			/**
			 * Validator check params from client 
			 * @callback Requester~requestCallback
			 * @param {string} req
			 * @param {string} err		The callback that handles the response error.
			 * @param {string} value	The callback that handles the response succes.
		 	 */
			// validator.notif_lib_val(req.query, (err, value) => {
			// 	if(err) return next(true, value);

				return next(null, {...req});
			// });
			// return next(null, {});
		},
		(value, next) => {

			// INI LIB NOTIFNYA

			/**
			 * EXAMPLE lib notif | tinggal panggil kayak manggil procedure
			 */
			// let val =  {
			// 	ids: "360",
			// 	type: "time",
			// 	employee_id: "2006001",
			// 	local_it: "local",
			// 	user: "sup",
			// 	from_type: "attendance"
			// };
			let val =  {
				ids: value.ids,
				type: value.type,
				employee_id: value.employee_id,
				local_it: value.local_it,
				user: value.user,
				from_type: value.from_type
			};
			library.notif_lib(val, (err, res) => {
				if (err) return next(true, err);
				return next(null, res);
			});
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
                    message: response,
                    access: {
                        create: 1,
                        read: 1,
                        update: 1,
                        delete: 1
                    }
                },
                data: null,
			};
			return callback(data);
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
		return callback(data);
	});
};

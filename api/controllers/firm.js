var config = require('../../config');
var User = require('../models/User');
var Firm = require('../models/Firm');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var multer = require('multer');
var mkdirp = require('mkdirp');
var userController = require('./users');
var path = require('path');

		
module.exports.logoImage = function(request,response){
	var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, function(err, user){
		if(err){
			console.log(err);
			response.send({
				success:false,
				msg:err
			});
		}
		else if(!user){
			console.log("User not found");
			response.send({
				success:false,
				msg : "User not found"
			});
		}
		else{
			var firm = Firm.findById(mongoose.mongo.ObjectId(user.firm), function(err, firm){
				if(err){
					console.log(err);
					response.send({
						success:false,
						msg:err
					});
				}
				var dirname = __dirname + '../../../public/images/'+firm._id;
                mkdirp(dirname, function(err){
                    if(err){
                        res.send({
                            success : false,
                            msg : "Directory can not be created"
                        })
                    }
                    else{
                        var storage = multer.diskStorage({
                            destination: function(request,file,cb){
                                cb(null,dirname);
                            },
                            filename: function(request, file,cb){
                                firm.LogoURL = dirname+'/'+file.fieldname + '-'+Date.now()+path.extname(file.originalname);
                                cb(null, file.fieldname + '-'+Date.now()+path.extname(file.originalname));
                            }
                        });                            
                        var upload = multer({storage : storage}).single('logoImage');
                        upload(request,response,function(err){
                            if(err){
                                response.send({
                                    success : false,
                                    msg : "error uploading file." + err
                                });
                            }
                            else{
                                firm.save(function(err,doc){
                                    if (err) {
                                        console.log(err);
                                        response.send({
                                            success: false,
                                            msg: err
                                        });
                                    } 
                                    else{
                                        response.send({
                                            success : true,
                                            msg : "File is uploaded."
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
		}
	});
}    

		
module.exports.signature = function(request,response){
	var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, function(err, user){
		if(err){
			console.log(err);
			response.send({
				success:false,
				msg:err
			});
		}
		else if(!user){
			console.log("User not found");
			response.send({
				success:false,
				msg : "User not found"
			});
		}
		else{
			var firm = Firm.findById(mongoose.mongo.ObjectId(user.firm), function(err, firm){
				if(err){
					console.log(err);
					response.send({
						success:false,
						msg:err
					});
				}
				var dirname = __dirname + '../../../public/images/'+firm._id;
                mkdirp(dirname, function(err){
                    if(err){
                        res.send({
                            success : false,
                            msg : "Directory can not be created"
                        })
                    }
                    else{
                        var storage = multer.diskStorage({
                            destination: function(request,file,cb){
                                cb(null,dirname);
                            },
                            filename: function(request, file,cb){
                                firm.SignURL = dirname+'/'+file.fieldname + '-'+Date.now()+path.extname(file.originalname);
                                cb(null, file.fieldname + '-'+Date.now()+path.extname(file.originalname));
                            }
                        });                            
                        var upload = multer({storage : storage}).single('signature');
                        upload(request,response,function(err){
                            if(err){
                                response.send({
                                    success : false,
                                    msg : "error uploading file." + err
                                });
                            }
                            else{
                                firm.save(function(err,doc){
                                    if (err) {
                                        console.log(err);
                                        response.send({
                                            success: false,
                                            msg: err
                                        });
                                    } 
                                    else{
                                        response.send({
                                            success : true,
                                            msg : "File is uploaded."
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
		}
	});
}    



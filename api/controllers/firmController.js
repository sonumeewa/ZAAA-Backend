var User = require('../models/User');
var Firm = require('../models/Firm');
var Plan = require('../models/Plan');
var mongoose = require('mongoose');
var multer = require('multer');
var mkdirp = require('mkdirp');
var userController = require('./userController');
var pdf = require('./pdf');
var path = require('path');
var Razorpay = require("razorpay")

var instance = new Razorpay({
	key_id: 'rzp_test_86QLf2LFy65g2j',
	key_secret: 'xtGWMVp65bw8bGdXg04TEPMg'
})

module.exports.logoImage = function(request,response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	var dirname = __dirname+'../../../public/uploads/'+firm._id;
	mkdirp(dirname, function(err){
		if(err){
			res.send({
				success : false,
				msg : "Directory can not be created"
			});
		}
		else{
			var location;
			var storage = multer.diskStorage({
				destination: function(request,file,cb){
					cb(null,dirname);
				},
				filename: function(request, file,cb){
					location = '/uploads/'+firm._id+'/'+file.fieldname+path.extname(file.originalname);
					cb(null, file.fieldname+path.extname(file.originalname));
				}
			});                            
			var upload = multer({storage: storage}).single('logo');
			upload(request,response,function(err){
				if(err){
					response.send({
						success : false,
						msg : "error uploading file." + err
					});
				}
				else{
					firm.LogoURL = location;
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
								msg : "File is uploaded.",
								photo: location
							});
						}
					});
				}
			});
		}
	});
}    
module.exports.deleteLogoImage = function(request,response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	firm.LogoURL = 'images/logo.png';
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
				msg : "Logo Removed.",
				logo: firm.LogoURL
			});
		}
	});
}	
module.exports.setPlan = async function(request,response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	firm.plan.planID = request.body.planID;
	firm.plan.createdOn = Date.now();
	var plan = await Plan.findById(request.body.planID);
	var today = new Date()
	firm.plan.expiresOn = new Date().setDate(today.getDate() + plan.duration);
	firm.plan.validAgain=false;
	firm.plan.name = plan.name;
	if(request.body.cost != 0){
		firm.FirmName = request.body.firmName;
		firm.plan.paymentID = request.body.paymentID;
		firm.GSTIN = request.body.GSTIN;
		firm.RegisteredAddress = request.body.billingAddress;
		instance.payments.capture(request.body.paymentID, request.body.cost*100).then((data) => {
			console.log(request.body.cost)
			console.log(data);
			var Details={
				email: user.email,
				firmname:firm.FirmName,
				paymentId:firm.plan.paymentID,
				gstin:firm.GSTIN.GSTNo,
				add:firm.RegisteredAddress.address,
				city: firm.RegisteredAddress.city,
				state:firm.RegisteredAddress.state,
				price: data.amount,
				fee: data.fee,
				tax: data.tax,
				date: data.created_at,
				method:data.method
			}					
			pdf.generateInvoice(request,response,Details);
		}).catch((err) => {
			console.error(err + "b")
		})
		firm.plan.validAgain=true;
	}
	firm.save(function(err, doc) {
		if (err) {
			response.send({
				success: false,
				msg: err
			});
		} else {
			response.send({
				success: true,
				msg:doc._id +"   " + doc
			});
		}
	});
};

function savePlanInFirm(firm,plan){
    return new Promise((resolve, reject) => {
		firm.plan = plan;
		firm.save(function(err){
			if(err)
			reject(err);
			else
			resolve(firm);
		})
    })

}
module.exports.setPlan2 = async function(request,response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	firm.plan.name = request.body.plan.name;
	firm.plan.createdOn = request.body.dur.from;
	firm.plan.expiresOn = request.body.dur.upto;
	firm.plan.planID = request.body.plan._id;
	// instance.payments.capture(request.body.paymentID, request.body.plan.cost*100).then((data) => {
	// 	console.log(request.body.plan.cost)
	// 	console.log(data);
	// 	var Details={
	// 		email: user.email,
	// 		firmname:firm.FirmName,
	// 		paymentId:firm.plan.paymentID,
	// 		gstin:firm.GSTIN.GSTNo,
	// 		add:firm.RegisteredAddress.address,
	// 		city: firm.RegisteredAddress.city,
	// 		state:firm.RegisteredAddress.state,
	// 		price: data.amount,
	// 		fee: data.fee,
	// 		tax: data.tax,
	// 		date: data.created_at,
	// 		method:data.method
	// 	}					
	// 	pdf.generateInvoice(request,response,Details);
	// }).catch((err) => {
	// 	console.error(err + "b")
	// })
	firm.save( err => {
		if(err){
			response.send({
				success: false,
				msg: "ERROR:" + err
			})
		}
		else{
			response.send({
				success: true,
				msg: "Done with it"
			})
		}
	})
};
module.exports.setFirmProfile = function(request, response){
	var token = userController.getToken(request.headers);
	var user = response.locals.user;
	var firm = response.locals.firm;
	if(request.body.name)
	firm.FirmName = request.body.name;
	if(request.body.tagline)
	firm.TagLine = request.body.tagline;
	if(request.body.displayName)
	firm.DisplayName = request.body.displayName;
	if(request.body.registeredAddress)
	firm.RegisteredAddress = request.body.registeredAddress;
	if(request.body.incorporationDate)
	firm.IncorporationDate = request.body.incorporationDate;
	if(request.body.officeAddress)
	firm.OfficeAddress = request.body.officeAddress;
	if(request.body.fax)
	firm.Fax = request.body.fax;
	if(request.body.mobile)
	firm.Mobile = request.body.mobile;
	if(request.body.OtherMobile)
	firm.OtherMobile = request.body.OtherMobile;
	if(request.body.email)
	firm.Email = request.body.email;
	if(request.body.landline)
	firm.Landline = request.body.landline;
	if(request.body.stdNo)
	firm.stdNo = request.body.stdNo;
	if(request.body.website)
	firm.Website = request.body.website;
	if(request.body.pan)
	firm.PanNo = request.body.pan;
	if(request.body.GSTIN)
	firm.GSTIN = request.body.GSTIN;
	if(request.body.accountName)
	firm.BankDetails.AccountName = request.body.accountName;
	if(request.body.accountNo)
	firm.BankDetails.AccountNo = request.body.accountNo;
	if(request.body.ifsc)
	firm.BankDetails.IFSC = request.body.ifsc;
	if(request.body.bankName)
	firm.BankDetails.BankName = request.body.bankName;
	if(request.body.bankAddress)
	firm.BankDetails.BranchAddress = request.body.bankAddress;
	if(request.body.accountType)
	firm.BankDetails.AccountType = request.body.accountType;
	if(request.body.fb)
	firm.Socials.fb=request.body.fb;			
	if(request.body.twitter)
	firm.Socials.twitter=request.body.twitter;			
	if(request.body.other)
	firm.Socials.Others=request.body.other;
	firm.ROSerial=0;
	
	firm.save(function(err){
		if(err){
			console.log(err);
			response.send({
				success : false,
				msg : "cannot save firm data"
			})
		}
		else{
			response.send({
				success : true,
				msg : "Firm data updated"
			})
		}
	})
};
module.exports.getFirmProfile = function(request, response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	Plan.findById(mongoose.mongo.ObjectID(firm.plan.planID), function(err,plan){
		if(err){
			response.send({
				success:false,
				msg:"error in finding plan" + err,
				
			})
		}
		if(!plan){
			response.json({
				success:false,
				msg:"plan not found for the firm ",
				firm:firm
			});
		}
		else{
			response.json({
				success:true,
				msg:"firm profile obtained ",
				firm:firm,
				plan:plan
			});
		}
	})
}; 


module.exports.getCurrentFirm=function(request, response){
	
	response.send({
		success:true,
		user:response.locals.user,
		firm:response.locals.firm
	})
};
module.exports.getTemplates = function(request, response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	response.send({
		success:true,
		AllTemplates:['images/ReleaseOrder-1.jpg','images/Invoice-1.jpg','images/PaymentReceipt-1.jpg'],
		ROTemplate:AllTemplates.indexOf(firm.ROTemplate),
		INTemplate:AllTemplates.indexOf(firm.INTemplate),
		PRTemplate:AllTemplates.indexOf(firm.PRTemplate),
	})
};
module.exports.getTermsAndCondition = function(request, response){
	var user = response.locals.user;
	var firm = response.locals.firm;
		response.send({
			success:true,
			Jurisdiction: firm.Jurisdiction,
			ROterms:firm.ROterms,
			INterms:firm.INterms,
			PRterms:firm.PRterms,
			ARterms:firm.ARterms
		});
};

module.exports.setTermsAndCondition = function(request, response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	//Firm.find({ _id: user.firm },function (err, firm) {
		if(request.body.ROterms)
		firm.ROterms = request.body.ROterms;
		if(request.body.INterms)
		firm.INterms = request.body.INterms;
		if(request.body.PRterms)
		firm.PRterms = request.body.PRterms;
		if(request.body.ARterms)
		firm.ARterms = request.body.ARterms;
		if(request.body.Jurisdiction)
		firm.Jurisdiction = request.body.Jurisdiction;

		firm.save(function(err){
			if(err)
			{
				console.log(err)
				response.send({
					success:false,
					msg:"Error in saving Terms and Condition"
				})
			}
			else{
				response.send({
					success:true,
					msg:"Terms And Conditions Updated"
				});
			}
		})
	//});
};

module.exports.getFirmUsers = function(request,response){
	var user = response.locals.user;
	var firm = response.locals.firm;
	User.find({'firm':mongoose.mongo.ObjectId(user.firm)},{ "name": 1,"_id": 1 }).
	
	exec(function(err, users){
		if(err||!users){
			console.log("User not found");
			response.send({
				success:false,
				msg:err
			});
		}
		else{
			response.send({
				success:true,
				users: users
			})
			
		}
	});
}


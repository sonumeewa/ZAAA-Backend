var config = require('../../config');
var RateCard = require('../models/Ratecard');
var userController = require('./userController');
var firmController = require('./firmController');
var User = require('../models/User');
var ReleaseOrder = require('../models/ReleaseOrder');
var jwt = require('jsonwebtoken');
var Firm = require('../models/Firm');
var Plan = require('../models/Plan');
var mongoose = require('mongoose');
var multer = require('multer');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports.createRO = function(request, response){
    var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, function(err, user){
		if(err){
			console.log("error in finding user");
			response.send({
				success:false,
				msg:err+""
			});
        }
        else if(!user)
        {
            console.log("User not found");
            response.send({
                success:false,
                msg:" no user"
        });

        }
		else{
            Firm.findById(user.firm, function(err, firm){
				if(err){
					console.log("err in finding firm");
					response.send({
						success:false,
						msg:err + ""
					});
				}
				else{
                    var date = new Date()
                    var sn = firm.ROSerial+1;
                    var fname = firm.FirmName;
                    var shortname = fname.match(/\b\w/g).join('');
                    var city = firm.OfficeAddress.city;
                    var GSTIN = firm.GSTIN;
                    gstin = GSTIN.GSTNo.substring(0,1);
                    var year = date.getFullYear();
                    var rno = year+'-'+gstin +'-'+shortname + '-'+city +'-'+sn;
                    console.log(rno);

        
                    var releaseOrder = new ReleaseOrder({
                        date: request.body.date,
                        releaseOrderNO: rno,
                        agencyName: firm.FirmName,
                        agencyGSTIN: firm.GSTIN,
                        agencyPerson: user.name,
                        signature: user.signature,
                        clientName:request.body.clientName,
                        clientGSTIN:request.body.clientGSTIN,
                        clientState:request.body.clientState,
                        publicationName:request.body.publicationName,
                        publicationEdition:request.body.publicationEdition,
                        mediaType:request.body.mediaType,
                        publicationState:request.body.publicationState,
                        publicationGSTIN:request.body.publicationGSTIN,
                        adType:request.body.adType,
                        rate:request.body.rate,
                        unit:request.body.unit,
                        adCategory1:request.body.adCategory1,
                        adCategory2:request.body.adCategory2,
                        adCategory3:request.body.adCategory3,
                        adCategory4:request.body.adCategory4,
                        adCategory5:request.body.adCategory5,
                        adCategory6:request.body.adCategory6,
                        adHue:request.body.adHue,
                        adSizeL:request.body.adSizeL,
                        adSizeW:request.body.adSizeW,
                        AdWords:request.body.AdWords,
                        AdWordsMax:request.body.AdWordsMax,
                        adTime:request.body.adTime,
                        AdDuration:request.body.AdDuration,
                        adSizeCustom:request.body.adSizeCustom,
                        adSizeAmount:request.body.adSizeAmount,
                        adTotalSpace:request.body.adTotalSpace,
                        adEdition:request.body.adEdition,
                        adPosition:request.body.adPosition,
                        adSchemePaid:request.body.adSchemePaid,
                        adSchemeFree:request.body.adSchemeFree,
                        adTotal:request.body.adTotal,
                        adGrossAmount:request.body.adGrossAmount,

                        PremiumCustom:request.body.PremiumCustom,
                        PremiumBox:request.body.PremiumBox,
                        PremiumBaseColour:request.body.PremiumBaseColour,
                        PremiumEmailId:request.body.PremiumEmailId,
                        PremiumCheckMark:request.body.PremiumCheckMark,
                        PremiumWebsite:request.body.PremiumWebsite,
                        PremiumExtraWords:request.body.PremiumExtraWords,

                        publicationDiscount:request.body.publicationDiscount,
                        agencyDiscount1:request.body.agencyDiscount1,
                        agencyDiscount2:request.body.agencyDiscount2,
                        taxAmount:request.body.taxAmount,
                        taxIncluded:request.body.taxIncluded,
                        netAmountFigures:request.body.netAmountFigures,
                        netAmountWords:request.body.netAmountWords,
                        caption:request.body.caption,
                        remark:request.body.remark,
                        paymentType:request.body.paymentType,
                        paymentDate:request.body.paymentDate,
                        paymentNo:request.body.paymentNo,
                        paymentAmount:request.body.paymentAmount,
                        paymentBankName:request.body.paymentBankName,
                        
                        executiveName:request.body.executiveName,
                        executiveOrg:request.body.executiveOrg,
                        otherCharges:request.body.otherCharges,
                        otherRemark:request.body.otherRemark,
                        firm:user.firm,
                        insertions:request.body.insertions,
                        // if (taxIncluded){
                        //     FinalAmount = (adGrossAmount/(100+taxAmount))*100;
                        //     FinalTaxAmount = (adGrossAmount/(100+taxAmount))*taxAmount
                        // }
                    });
                    releaseOrder.save(function(err){
                        if(err){
                            console.log(err);
                            response.send({
                                success : false,
                                msg : "cannot save release order data"
                            });
                        }
                        else{
                            firm.ROSerial += 1;
                            firm.save(function(err){
                                if(err){console.log(err)}
                                else{response.send({
                                    success : true,
                                    msg : "release order data saved"
                                });}
                            });
                        }
                    });
                    
				}
			});
		}
	});	
    
};

module.exports.getReleaseOrder = function(request,response){
     
    var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, function(err, user){
		if(err||!user){
			console.log("User not found");
			response.send({
				success:false,
				msg:err+""
			});
		}
		else{
            
            ReleaseOrder.findById(request.params.id,function(err, releaseOrder){
                
                if(err){
                    console.log("here" +err);
                    response.send({
                        success:false,
                        msg: err+"",
                    });
                }
                else{
                    response.send({
                        success : true,
                        releaseOrder : releaseOrder
                    }); 
                }
            });
			
		}
	});	
};
module.exports.getReleaseOrders = function(request, response){
     
    var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, function(err, user){
		if(err||!user){
			console.log(err);
			response.send({
				success:false,
				msg: err +""
			});
		}
		else{
            console.log(user.firm);
            ReleaseOrder.find({firm:user.firm},function(err, releaseOrders){
                if(err){
                    console.log("here");
                    response.send({
                        success:false,
                        msg: err + ""
                    });
                }
                else if(!releaseOrders){
                    console.log("No releaseorder");
                    response.send({
                        success:false,
                        msg:" No release Order"
                    });
                }
                else{
                    console.log(releaseOrders)
                    response.send({
                        success : true,
                        releaseOrders : releaseOrders
                    });
                }
            });
		}
	});	

};


module.exports.queryReleaseOrder = function(request, response){

    var mediahouseID =(request.body.mediahouseID)?(request.body.mediahouseID):null;
    var clientID = (request.body.clientID)?(request.body.clientID):null;
    var executiveID = (request.body.executiveID)?(request.body.executiveID):null;
    var date = (request.body.date)?(request.body.date):null;
    var adCategory1 = request.body.adCategory1;
    var adCategory2 = request.body.adCategory2;
    
    ReleaseOrder.find().or([{date:date},{'adCategory1':{ $ifnull : [{adCategory1, $regex:""}]}},{'adCategory2':{ $ifnull : [{adCategory2, $regex:""}]}}, {$and:[{mediahouseID: {$ifnull : [{mediahouseID, $regex:""}]}}, {clientID: {$ifnull : [{clientID, $regex:""}]}},{executiveID: {$ifnull : [{executiveID, $regex:""}]}}]}])
    .exec(function(err, releaseOrders){
        if(err){
            console.log(err+ "");
            response.send({
                success:false,
                msg: err +""
            });
        }
        else{
            response.send({
                success:true,
                releaseOrders: releaseOrders
            });
        }
    });
    
};

module.exports.deleteReleaseOrder = function(request, response){
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
				msg : "User not found, Please Login"
			});
		}
		else{
            ReleaseOrder.findByIdAndRemove(request.params.id,function(err){
                if(err){
                    console.log(err);
                    response.send({
                        success:false,
                        msg: err + ""
                    });
                }
                else{
                    response.send({
                        success:true,
                        msg: "Release Order deleted"
                    });
                }
                
            })
		}	
	});
};

module.exports.updateReleaseOrder = function(request, response){
	var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, function(err, user){
		if(err){
			console.log(err);
			response.send({
				success:false,
				msg:err + ""
			});
		}
		else if(!user){
			console.log("User not found");
			response.send({
				success:false,
				msg : "User not found, Please Login"
			});
		}
		else{
            ReleaseOrder.findByIdAndUpdate(request.body.id,{$set:request.body},function(err, releaseOrder){
                if(err){
                    console.log(err);
                    response.send({
                        success:false,
                        msg: err + ""
                    });
                }
                else{
                    // if(request.body.OrganizationName){
                    //     client.OrganizationName = request.body.OrganizationName;
                    // }
                    response.send({
                        success:true,
                        msg: "ReleaseOrder Updated"
                    });
                }
                
            })
		}	
	});
};


module.exports.generateROPdf = function(request, response) {
    var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, function(err, user){
		if(err){
			console.log(err);
			response.send({
				success:false,
				msg:err + ""
			});
		}
		else if(!user){
			console.log("User not found");
			response.send({
				success:false,
				msg : "User not found, Please Login"
			});
        }
        else {
            ReleaseOrder.findById(request.body.id, function(err, releaseOrder){
                if(err){
                    console.log(err);
                    response.send({
                        success :false,
                        msg: err 
                    })
                }
                else if(!releaseOrder){
                    response.send({
                        success :false,
                        msg: 'Release order not found' 
                    })
                }
                else{
                    var Details = {
                        publisher :releaseOrder.publicationName,
                        pgstin :releaseOrder.publicationGSTIN.GSTNo,
                        cname :releaseOrder.clientName,
                        cgstin :releaseOrder.clientGSTIN.GSTNo,
                        rno :releaseOrder.releaseOrderNo,
                        date :releaseOrder.date,
                        gstin :releaseOrder.agencyGSTIN,
                        Scheme :releaseOrder.adSchemePaid+'-'+releaseOrder.adSchemeFree,
                        gamount :releaseOrder.adGrossAmount,
                        
                    }
                }
            })
        }
    });
}

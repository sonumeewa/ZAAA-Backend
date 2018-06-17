var config = require('../../config');
var RateCard = require('../models/Ratecard');
var userController = require('./userController');
var firmController = require('./firmController');
var pdf = require('./pdf');
var User = require('../models/User');
var ReleaseOrder = require('../models/ReleaseOrder');
var Ticket = require('../model/Ticket');
var jwt = require('jsonwebtoken');
var Firm = require('../models/Firm');
var Plan = require('../models/Plan');
var MediaHouse = require('../models/MediaHouse');
var MediaHouseInvoice = require('../models/MediaHouseInvoice');
var Executive = require('../models/Executive');
var Client = require('../models/Client');
var mongoose = require('mongoose');
var multer = require('multer');
var mkdirp = require('mkdirp');
var path = require('path');
var perPage=20;

module.exports.createTicket = (request,response) => {
    var ticket = new Ticket({
        subject: request.body.subject,
        details: request.body.details
    });
    ticket.save((err,doc) => {
        if(err){
            response.send({
                success:false,
                msg: 'Cannot save ticket'
            });
        }
        else{
            response.send({
                success: true,
                msg: 'ticket generated with ticket no'+ doc._id
            })
        }
    })
}


function formQuery(mediahouseID, clientID, date, user, request){
    return new Promise((resolve, reject) => {
        var query = {'user':user._id};
        if(request.body.insertionPeriod){
            var to = new Date()
            var from = new Date( to.getFullYear(), to.getMonth, to.getDay - request.body.insertionPeriod);
        }
        resolve(query);    
    })
}


module.exports.queryUserTickets = function(request, response){
    var token = userController.getToken(request.headers);
	var user = userController.getUser(token,request,response, async function(err, user){
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
            var date = (request.body.date)?(request.body.date):null;
            var query = await formQuery(mediahouseID, date, user, request);
            
            
            Ticket
            .aggregate([
                {$match:query},{
                    $group : { 
                        count: {$sum: 1},
                        entries: { 
                            $push:{
                                "_id":"$_id",
                                "subject":"$subject",
                                "details":"$details",
                            } 
                        }
                    } 
                },
                {$limit: perPage},
                {$skip:(perPage * request.body.page) - perPage}
            ])
            .exec(function(err, tickets){
                if(err){
                    console.log(err+ "");
                    response.send({
                        success:false,
                        msg: err +""
                    });
                }
                else{
                    Ticket.count(query, function(err, count){
                        response.send({
                            success:true,
                            tickets: tickets,
                            page: request.body.page,
                            perPage:perPage,
                            pageCount: Math.ceil(count/perPage)
                        });
                    })
                    
                }
            });
        }	
	});
};

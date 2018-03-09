var mongoose = require('mongoose');
var config = require('../../config');
var bcrypt = require('bcrypt');
var authy = require('authy')(config.authyKey);
var twilioClient = require('twilio')(config.accountSid, config.authToken);
var nodemailer = require('nodemailer');



var MediahouseSchema = new mongoose.Schema({
OrganizationName:String,
PublicationName:String,
NickName:String,
MediaType:String,
Edition:String,
Address:String,
OfficeLandline:String,
Scheduling:String,
Person: String,
Designation:String,
MobileNo:String,
DeskExtension:String,
EmailId:String,
AssignAdtype:String,
AssignEdition:String,
Scheduling:[{Person:String,
    Designation:String,
    MobileNo:String,
    DeskExtension:String,
    EmailId:String,
    AssignAdType:String,
    AssignEdition:String
    }]
});
module.exports = mongoose.model('MediaHouse', MediahouseSchema);

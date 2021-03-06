var config =  require('../../config');
var api_key = config.mailgun_api_key;
var DOMAIN = config.DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});

module.exports.mail = function(file, to,subject, text){
    var data = {
        from: 'Excited User <postmaster@adagencymanager.com>',
        to: to.join(),
        subject: subject,
        text: text,
        attachment : file
      };
    
    mailgun.messages().send(data, function (error, body) {
        console.log(error,body);
        if(error){
        res.send({
            success:false,
            msg: error + ""
        });
    }
    else{
        res.send({
            success:true,
            msg: "sent" + body
        });
    }
      });

}
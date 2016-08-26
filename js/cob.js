 var talkWithBot = (function () {
    return {
        
        // Plase set your secretKey
        //compte perso
        // directLineSecret: "rk_GSayRQp0.cwA.xKE.1fGigxiZxDjbleuxgGXxxoxpvD9_79zabyXQNoLE33o",
        //compte cgi lucia
        // directLineSecret : "vvI0ulcpnxc.cwA.xmc.BwQqqFGmupXQIJIXgwSbZ2qh8ti7ej9pfV9lsAgeFno",
        //compte cgi lucia_test
        directLineSecret : "rnOYAni9gfM.cwA.GVc.KKIneGTaKOmR9LVVpj1wXAQw4Arti6RdHi5djGJZTy8",
        convId: null,
        watermark: null,
        nextStep: null,
        firstStep: null,
        watermarkCheck: null,
        
        //Creation ID de conversation
        makeConvId: function () {
            return $.ajax({
                url: "https://directline.botframework.com/api/conversations",
                type: "POST",
                crossDomain: true,
                contentType: "application/json",
                cache: false,
                headers: {
                    Authorization: "Botconnector " + this.directLineSecret
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },
        
        // Envoi de message
        sendMessage: function (convId, msg) {
            
            
            if(document.getElementById('input').value == ''){
                   nextStep = false; 
            }else{
                nextStep = true;
                
                /****************************/
                 document.getElementById("chatlog").innerHTML = (document.getElementById("chatlog").innerHTML + "<hr/><li class=\"self\"><div class=\"avatar\"><img src=\"img/you.png\" /></div><div class=\"messages\"><p>" +
                      msg + "</p></div></li>");
                      
                 /****************************/
                
                $('#input').val("Transmission...");
                var user = "user_" + convId;
                $.ajax({
                    method: "POST",
                    contentType: "application/json",
                    headers: {
                        Authorization: "Botconnector " + this.directLineSecret
                    },
                    url: 'https://directline.botframework.com/api/conversations/' + convId + '/messages',
                    data: JSON.stringify({
                        "text": msg, 
                        "from": user 
                    }),
                    success: function (obj) {
                        // alert("talkWithBot: Message envoyé！");
                        $('#input').val("Réception...");
                    }
                });
            }
        },
        
        //Obtenir le message
        getMessage: function (convId, watermark) {
            var url;
            
            if (watermark) {
                url = 'https://directline.botframework.com/api/conversations/' + convId + '/messages?watermark=' + watermark;
            } else {
                url = 'https://directline.botframework.com/api/conversations/' + convId + '/messages';
            }
            return $.ajax({
                method: "GET",
                contentType: "application/json",
                headers: {
                    Authorization: "Botconnector " + this.directLineSecret
                },
                url: url,
                success: function (obj) {
                    // textarea + resultats

                    talkWithBot.watermark = obj.watermark;

                    if(talkWithBot.watermark % 2 == 0 && talkWithBot.watermark != watermarkCheck){

                        /**************************************/

                        var txt = obj.messages[talkWithBot.watermark-1].text;
                        
                        document.getElementById("chatlog").innerHTML = (document.getElementById("chatlog").innerHTML + "<hr/><li class=\"other\"><div class=\"avatar\"><img src=\"img/robot.png\" /></div><div class=\"messages\"><p>" +
                            txt + "</p></div></li>");
                        
                        $('#input').val("");
                        
                        tts(txt);
                        /*************************************/
                        
                        // $("#textarea").val(txt);
                        
                        // watermark maj
                        // talkWithBot.watermark = obj.watermark;
                        //save dans le cookie 30 min
                        // var date = new Date();
                        // date.setTime(date.getTime() + (30 * 60 * 1000));
                        // $.cookie("watermark", obj.watermark, {
                        //     expires: date
                        // }); 
                        
                    }else{
                        talkWithBot.getMessage( talkWithBot.convId );
                    }
                }
            });
        },
        
        // initiation --> id de conversation
        init: function () {
                //Pour le premier tour
                firstStep = true;
                
                // si il y a un watermark dans le cookie on l'utilise
                if ($.cookie("watermark")) {
                    talkWithBot.watermark = $.cookie("watermark");
                }
                if ($.cookie("conversationId")) {
                    //Si vous avez déjà un ID de conversation dans le cookie, réutiliser ces cookies
                    talkWithBot.convId = $.cookie("conversationId");
                    //Afficher l'ID de conversation
                    $("#convId").text(talkWithBot.convId);
                } else {
                    // Dans le cas contraire, créé par la demande à l'API
                    talkWithBot
                        .makeConvId()
                        .then(function (result) {
                            talkWithBot.convId = result.conversationId;
                            // Afficher l'ID de conversation 
                            $("#convId").text(talkWithBot.convId);
                            
                            //On ne sauve pas l'ID comme ca ca qd l'utilisateur qui le navigateur 
                            // cela change de conv
                            // save le cookie durée 30min
                            // var date = new Date();
                            // date.setTime(date.getTime() + (30 * 60 * 1000));
                            // $.cookie("conversationId", talkWithBot.convId, {
                            //     expires: date
                            // });
                        });
                }
            }
    };
})();

//Quand la page html est lancer, on lance ce qui suit
//On crée l'id de conversation
$(function () {
    talkWithBot.init();
});

//Fonction qui send et get
$(document).ready(function (){
    $('#sendAndGet').click(function (){
       
       talkWithBot.sendMessage( talkWithBot.convId, $('#input').val() );
       watermarkCheck = talkWithBot.watermark;
       
       if(nextStep == true){
                talkWithBot.getMessage( talkWithBot.convId );
       }else{
            alert("Champ vide...");
       }
       
    });
});





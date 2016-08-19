 var talkWithBot = (function () {
    return {
        
        // Plase set your secretKey
        directLineSecret: "rk_GSayRQp0.cwA.xKE.1fGigxiZxDjbleuxgGXxxoxpvD9_79zabyXQNoLE33o",
        convId: null,
        watermark: null,
        nextStep: null,
        firstStep: null,
        
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
                        $('#input').val("");
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
                    
                    console.log("GET !!!!");
                    
                    if(talkWithBot.watermark % 2 != 0){
                        console.log(obj);

                        /**************************************/
                        var txt = obj.messages[talkWithBot.watermark].text;
                        
                        document.getElementById("chatlog").innerHTML = (document.getElementById("chatlog").innerHTML + "<hr/><li class=\"other\"><div class=\"avatar\"><img src=\"img/robot.png\" /></div><div class=\"messages\"><p>" +
                            txt + "</p></div></li>");
                            
                        /*************************************/
                        
                        // $("#textarea").val(txt);
                        
                        // watermark maj
                        talkWithBot.watermark = obj.watermark;
                        //save dans le cookie 30 min
                        // var date = new Date();
                        // date.setTime(date.getTime() + (30 * 60 * 1000));
                        // $.cookie("watermark", obj.watermark, {
                        //     expires: date
                        // }); 
                        
                        // talkWithBot.textToSpeech(txt);
                    }
                    
                    // if(firstStep == false){

                    //   console.log(obj);

                    //     /**************************************/
                    //     var txt = obj;
                        
                    //     document.getElementById("chatlog").innerHTML = ("<hr/><li class=\"other\"><div class=\"avatar\"><img src=\"img/robot.png\" /></div><div class=\"messages\"><p>" +
                    //         JSON.stringify(txt) + "</p></div></li>" + document.getElementById("chatlog").innerHTML);
                            
                    //     /*************************************/
                        
                    //     // $("#textarea").val(txt);
                        
                    //     // watermark maj
                    //     talkWithBot.watermark = obj.watermark;
                    //     //save dans le cookie 30 min
                    //     // var date = new Date();
                    //     // date.setTime(date.getTime() + (30 * 60 * 1000));
                    //     // $.cookie("watermark", obj.watermark, {
                    //     //     expires: date
                    //     // }); 
                    // }
                    
                    
                    // console.log(obj);
                    
                    
                    
                    
                    
                    /**************************************/
                    // var txt = obj;
                    
                    // document.getElementById("chatlog").innerHTML = ("<hr/><li class=\"other\"><div class=\"avatar\"><img src=\"img/robot.png\" /></div><div class=\"messages\"><p>" +
                    //     JSON.stringify(txt) + "</p></div></li>" + document.getElementById("chatlog").innerHTML);
                        
                    /*************************************/
                    
                    // $("#textarea").val(txt);
                    
                    // watermark maj
                    talkWithBot.watermark = obj.watermark;
                    //save dans le cookie 30 min
                //   var date = new Date();
                //     date.setTime(date.getTime() + (30 * 60 * 1000));
                //     $.cookie("watermark", obj.watermark, {
                //         expires: date
                //     });
                
                            console.log(talkWithBot.watermark);
                }
            });
        },
        
        //tts google
        // textToSpeech: function(txt){
        //     var url = "https://translate.google.fr/translate_tts?ie=UTF-8&q=" + txt + "&tl=fr";
        //     $('audio').attr('src', url).get(0).play();
        // },
        
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
       
       if(nextStep == true){
            
            console.log("Reponse de cob");
           
            // talkWithBot.getMessage( talkWithBot.convId );
            
            
            
            // Il faut gerer le temps de rep des serveurs avec les setTimeout();
            setTimeout(function(){
                console.log('SetTimeout');
                 talkWithBot.getMessage( talkWithBot.convId );
            }, 1000);
            
            if(talkWithBot.watermark % 2 == 0 || !talkWithBot.watermark){
                console.log("Second");
                setTimeout(function(){
                console.log('SetTimeout2');
                    talkWithBot.getMessage( talkWithBot.convId );
                }, 5000);
            }
            
       }else{
            alert("Champ vide...");
       }
       
       console.log('je rentre');
    //   firstStep = false;
       console.log(talkWithBot.watermark);
    });
});
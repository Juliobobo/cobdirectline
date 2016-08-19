
 var treatmentText = function(text){
     
    var finalText = text;
    // supp ""
    finalText = finalText.replace(/"/g,'');
    
    
    console.log(finalText);
    return finalText;
     
 }
 
 treatmentText(" \"cob > Quel est votre prénom ?\" ");
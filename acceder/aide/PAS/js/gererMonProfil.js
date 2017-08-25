$(document).ready(function(){
	
	$('#messageModal').on('hidden.bs.modal', function () {
		window.location.href = 'https://'+window.location.host+'/monprofil-webapp/monCompte';
	});
	
    $("#principalForm").submit(function(){
        soummettre=true;
        //Valider l'adresse mail        
       $("#emailerror").html(validateEmail());
       $("#pwderror").html(validatePassword());
       $("#erreurtelephone").html(validatePhone());
       
      return soummettre;
        
    });
    /**Fonction de validation de l'addresse mail**/
   function validateEmail()
    {
        
	   message="";
        emailVal=$("#email").val();
            var isMail=new RegExp("^([a-zA-Z0-9!#\$%&\*\+\/=\?\^_\{\}\-](\.?[a-zA-Z0-9!#\$%&\*\+\/=\?\^_\{\}\-])*)@([a-zA-Z0-9-](\.?[a-zA-Z0-9-])*)+\.[a-zA-Z][a-zA-Z]+$")
            var emailParts=emailVal.split("@");
        if(emailVal!="")
            {
        	 if(!isMail.test(emailVal) || emailVal.length > 121 ||emailParts[0].length>60 || emailParts[1]>60)
                  {
            	         
            	          message=message + "Le format de votre adresse électronique est incorrect. Veuillez le vérifier (par exemple : abcd@fai.fr).<br\>";
        	     }else if(emailVal=="irnet@dgfip.finances.gouv.fr")
        	    	 {
        	    	 	message=message +"Cette adresse électronique n’est pas autorisée.<br\>";
        	    	 }
        	
              if(message!="")
            	  {
            	  		soummettre=false;
            	  		message="<p id=\"emailerror\" class=\"erreur col-md-12\">"+message+"</p>";
            	  		$("#emailerror").remove();
            	  		$(message).insertBefore("#mailform")
            	  		$("#emailerror").css("visibility","visible")
            	  }
            }else//adresse mail non renseignée
                {
            	erreurchampsObligatoire=true;
                }
        return message;
    }
    /**Fonction de validation de mot de passe**/
   function validatePassword()
    {
	   message="";
        password=$("#pwd").val();
        ancienPass=$("#ancienPwd").val();
            //var ispwd=new RegExp("^[a-zA-Z0-9_\!#\$%&\*\+-/=\?\^_\{\|\}]{8,20}$")
          var ispwd=new RegExp("^(?=[a-zA-Z0-9_\!#\$%&\*\+-\/=\?\^_\{\|\}]*[a-zA-Z])(?=[a-zA-Z0-9_\!#\$%&\*\+-\/=\?\^_\{\|\}]*[0-9])[a-zA-Z0-9_\!#\$%&\*\+-\/=\?\^_\{\|\}]{8,20}")
        if(password!="")
            {
        		if(!ispwd.test(ancienPass)){
        			
                    message=message + "Le format de votre mot de passe actuel est incorrect. Votre mot de passe doit être composé d\u2019au moins 8 caractères avec au mois une lettre et un chiffre. Il peut contenir des lettres (minuscules ou majuscules), chiffres et caractères spéciaux suivants: ! # $ % & * + - / = ? ^_ . { | }. <br\>";
           
        		}
              if(!ispwd.test(password))
                  {
            	         soummettre=false;
                         message=message + "Le format de votre nouveau mot de passe est incorrect. Votre mot de passe doit être composé d\u2019au moins 8 caractères avec au mois une lettre et un chiffre. Il peut contenir des lettres (minuscules ou majuscules), chiffres et caractères spéciaux suivants: ! # $ % & * + - / = ? ^_ . { | }. <br\>";
                 }
              if(password!=$("#pwdConfirmation").val())
                     {
            	             soummettre=false;
                            message=message +"Le nouveau mot de passe saisi et sa confirmation ne sont pas identiques. <br\>";
                    }
              if(message!="")
        	  {
            	  soummettre=false;
            	  message="<p id=\"pwderror\" class=\"erreur col-md-12\">"+message+"</p>";
            	  $("#pwderror").remove();
            	  $(message).insertBefore("#pwdform")
        	  }
           }
        return message;
    }
   
   /**Fonction de validation de telephone**/
   function validatePhone()
    {
	   var regexStartZero=new RegExp("^00");
	   
	   var regexFranceMobile=new RegExp("^(0?(6|7)[0-9]{8})?$");
	   var regexStrangeMobile=new RegExp("^([0-9]{5,13})?$");
	   
	   var regexFranceFixe=new RegExp("^(0?(1|2|3|4|5|8|9)[0-9]{8})?$");
	   var regexStrangeFixe=new RegExp("^([0-9]{5,13})?$");
	   message="";
        portable=$("#portable").val();
        fixe=$("#fixe").val();
        indFixe=$("#indFixe").val();
        indPortable=$("#indportable").val();
        
            
        if(portable!="" || fixe!="")
            {
              if(regexStartZero.test(portable) || regexStartZero.test(fixe))
                  {
                         message=message + "Le numéro de téléphone saisi ne peut pas commencer par 00.<br\>";
                 }
              if((indFixe=="(+33)France" && !regexFranceFixe.test(fixe)) || (indFixe!="(+33)France"&& !regexStrangeFixe.test(fixe)) ||
            		  (indPortable=="(+33)France" && !regexFranceMobile.test(portable)) || (indPortable!="(+33)France" && !regexStrangeMobile.test(portable)))
                     {
                            message=message +"Le format du numéro de téléphone est incorrect. Veuillez le vérifier. <br\>";
                    }else{
            	        var portableChar=portable!=""?portable[2]:"0";
            	        var fixeChar=fixe!=""?fixe[2]:"0";
            			var regexNonFiablePortable=new RegExp("^[0-9]{3}("+portableChar+"*)?$");
            			var regexNonFiablefixe=new RegExp("^[0-9]{3}("+fixeChar+"*)?$");
            			if(regexNonFiablePortable.test(portable) ||regexNonFiablefixe.test(fixe)){
            				
            				 message=message +"Le format du numéro de téléphone est incorrect. Veuillez le vérifier. <br\>";
            			}
            		
            }
              $("#erreurtelephone").remove();
              if(message!="")
        	  {
            	  soummettre=false;
            	  message="<p id=\"erreurtelephone\" class=\"erreur col-md-12\">"+message+"</p>";
            	  $(message).insertBefore("#phoneForm")
        	  }
           }
        return message;
    }
  
   $("#portable")
	.keyup(
			function() {
				var regexFrance = new RegExp(
						"^0?(6|7)[0-9]{8}$");
				var regexStrange = new RegExp(
						"^([0-9]{5,13})$");
				var telMobile = $("#portable").val();
				if ((telMobile != null)
						&& (telMobile != "")) {
					if ($("#indportable").val() != "(+33)France"
							&& regexStrange.test($(
									"#portable").val())) {
						$("#sms").removeAttr(
								'disabled');
						return;
					} else {
						if ($("#indportable").val() == "(+33)France"
								&& regexFrance.test($(
										"#portable")
										.val())) {
							$("#sms").removeAttr(
									'disabled');
							return;
						} else {
							$("#sms").attr('disabled',
									'disabled');
						}
					}
				}
			});
});

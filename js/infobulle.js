	/*script qui s'applique aux fichiers comportant des infobulles dont on souhaite l'affichage au passage du curseur et la disparition au retrait du curseur */
	
	/*en remplacement du script suivant (repris sur chaque fichier) :
	document.getElementById("infobulle_num_fiscal_1").style.visibility="hidden";
	document.getElementById("infobulle_num_fiscal_2").style.visibility="hidden";
	document.getElementById("infobulle_num_acces").style.visibility="hidden";
	document.getElementById("infobulle_RFR").style.visibility="hidden";*/
	
	var listeInfoBulle = document.getElementsByClassName("infobulle");
	for(var i=0; i<listeInfoBulle.length; i++)
	{
		listeInfoBulle[i].style.visibility="hidden"
	}
function afficher_infobulle(id_info_bulle)
	{
		document.getElementById(id_info_bulle).style.visibility="visible";
	}
	
	function cacher_infobulle(id_info_bulle)
	{
		document.getElementById(id_info_bulle).style.visibility="hidden";
	}	
	

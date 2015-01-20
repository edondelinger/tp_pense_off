/***************************************************
*	FICHIER CREE LE : 06/01/2015
*	PAR : Eric Dondelinger
*	Objectif : fonctione et code JS pour la gestion des pense bêtes
*	MODIFICATIONS :
*		06/01/2015	-> version 0.1
*	TODO : 
*		Terminer les fonctions javascript ....
****************************************************/
/*
setInterval(function () {
var status = document.getElementById('line-status');
  	status.className = navigator.onLine ? 'online' : 'offline';
  	status.innerHTML = navigator.onLine ? 'Online' : 'Offline';
}, 250);
*/

// On vérifie si un nouveau cache est disponible au chargement de la page
window.addEventListener('load', function(e) {
 
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Là, le navigateur a téléchargé un nouveau cache
      // On change le cache et on recharge la page
      window.applicationCache.swapCache();
      window.location.reload();
    } else {
      // Le cache Manifest n'a pas changé, on ne fait rien
    }
  }, false);
 
}, false);

// déclaration des 2 tableaux nécessaires (les dates et les échéances)
var lesEcheances = new Array();
var lesTaches = new Array();
var lesEffectuees = new Array();

var leFichier = "D:/memos.txt";

/*
PROCEDURE QUI MODIFIE LE TABLEAU HTML POUR Y AFFICHER TOUS LES PENSE BETES CONNUS (issus des tableaux)
*/
function afficherLesPenseBetes(){
	var contenu = "";
	
	// on parcourt tous les pense betes pour construire une chaine qui contiendra le HTML des lignes du tableau
	for (var i = 0; i < lesEcheances.length; i++) {
		var image = "nocheck.png";
		if(lesEffectuees[i] == 1){
			image = "check.png";
		}
		var ligne = '<tr><td>'+lesTaches[i]+'!</td><td>'+lesEcheances[i]+'</td><td id="tache'+i+'"><img src="img/'+image+'" onclick="effectuer_tache('+i+');" width="16" height="16" alt="check"></td></tr>';
		contenu += ligne;
	}
	var laTable = document.getElementById('table_content');
	// on affiche ce contenu sur la page
	laTable.innerHTML = contenu;
}

/*
PROCEDURE POUR AJOUTER UN NOUVEAU PENSE BETE
*/
function ajouterNote(){
	// on va chercher la zone du tableau HTML (dont l'id est table_content)
	var laTable = document.getElementById('table_content');
	// on récupère la taille du tableau des échéances (pour savoir combien il y en a)
	var tacheNumero = lesEcheances.length;
	// on ajoute les infos dans les tableaux
	lesEcheances.push(document.forms['frm_ajout_pb'].echeance.value);
	lesTaches.push(document.forms['frm_ajout_pb'].libelle.value);
	lesEffectuees.push(0);
	// on met à jour l'affichage dans la page HTML
	// on fait attention à gérer le clic sur la case de la tâche afin de pouvoir la valider par la suite avec son bon numéro (qui est sa position dans le tableau)
	laTable.innerHTML += '<tr><td>'+document.forms['frm_ajout_pb'].libelle.value+'</td><td>'+document.forms['frm_ajout_pb'].echeance.value+'</td><td id="tache'+tacheNumero+'"><img src="img/nocheck.png" onclick="effectuer_tache('+tacheNumero+');" width="16" height="16" alt="check"></td></tr>';
	
	enregistrerLesPenseBetes();
}

/*
PROCEDURE QUI VALIDERA LA BONNE REALISATION D'UNE TACHE A PARTIR DE SON NUMERO
*/
function effectuer_tache(numero){
	// on va chercher la cellule du tableau qui a le numéro de la tâche cliquée (tacheXX)
	var element = document.getElementById('tache'+numero);
	lesEffectuees[numero] = 1;
	// mise à jour de l'affichage pour mettre la coche verte en face de la tâche
	element.innerHTML = '<img src="img/check.png" onclick="effectuer_tache('+numero+');" width="16" height="16" alt="check">';
	enregistrerLesPenseBetes();
}

/*
PROCEDURE qui enregistre dans un fichier texte tous les pense bêtes contenus dans les tableaux
*/
function enregistrerLesPenseBetes(){
	localStorage.clear();
	localStorage.setItem("nombre", lesEcheances.length);

	for (var i = 0; i < lesEcheances.length; i++) {
		localStorage.setItem("tache"+i, lesEcheances[i] + '|'+ lesTaches[i]+'|'+ lesEffectuees[i]);
	}
}
/*
PROCEDURE QUI MODIFIE LE TABLEAU HTML POUR Y AFFICHER TOUS LES PENSE BETES CONNUS (issus des tableaux)
*/
function chargerLesPenseBetes(){
	// Détection du support
	if(typeof localStorage!='undefined') {
	  if('nombre' in localStorage) {
		var nb = localStorage.getItem("nombre");
		for (var i=0; i<nb; i++){
			info = localStorage.getItem("tache"+i).split("|");
			lesEcheances.push(info[0]);
			lesTaches.push(info[1]);
			lesEffectuees.push(info[2]);
		}
		afficherLesPenseBetes();
	  }
	} else {
	  alert("localStorage n'est pas supporté");
	}
}
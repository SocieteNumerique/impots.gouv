/*global $:false, jQuery:false, angular:false, window:false, document:false */

'use strict';

var pas = angular.module('pas', ['ngAnimate', 'ui.bootstrap']);

pas.controller('MainCtrl', ['$scope', '$timeout', function($scope, $timeout) {

    $scope.IsVisible = false;
    $scope.ShowHide = function() {
        //If DIV is visible it will be hidden and vice versa.
        $scope.IsVisible = $scope.IsVisible ? false : true;
    };
    var deroulement;

    // Initialisation des données
    $scope.sensModul = true; // Choix du sens de la modulation
    $scope.contentEditable = false; // Demande GF : passage de l'IHM en mode "édition"

    $scope.pap = [];
    $scope.historique = {
        2017: {
            sitfam: "marié",
            residence: "en métropole",
            nbPac: 1,
            nbPacRa: 0,
            codesSitPart: {
                "0bt": false,
            },
            codesSitFoyer: {
                "0cf": 1
            },
            codesSitRev: [
                ["1AJ", "Traitement et salaires - Monsieur MARTIN", 36201],
                ["4BA", "Revenus fonciers", 12000],
                ["1BJ", "Traitement et salaires - Madame MARTIN", 43724]
            ],
            prerens: {
                "Micro foncier - Monsieur Martin": 8500,
                "Micro foncier - Madame Martin": 9000
            },
            rfr: 39160
        },
        2018: {
            sitfam: "marié",
            residence: "en métropole",
            nbPac: 1,
            nbPacRa: 0,
            codesSitPart: {
                "0bt": false,
            },
            codesSitFoyer: {
                "0cf": 1
            },
            codesSitRev: [
                ["1AJ", "Traitement et salaires - Monsieur MARTIN", null],
                ["4BA", "Revenus fonciers", null],
                ["1BJ", "Traitement et salaires - Madame MARTIN", null]
            ],
            rfr: null
        },
        2019: {
            sitfam: "marié",
            residence: "en métropole",
            nbPac: 1,
            nbPacRa: 0,
            codesSitPart: {
                "0at": false,
            },
            codesSitFoyer: {
                "0cf": 1
            },
            codesSitRev: [
                ["1AJ", "Traitement et salaires - Monsieur MARTIN", null],
                ["4BA", "Revenus fonciers", null],
                ["1BJ", "Traitement et salaires - Madame MARTIN", null] // Attention, apparait quelquesoit la situation de famille
            ],
            rfr: null,
            taux: "9,5 %",
            tauxIndivMonsieur: "9,1 %",
            tauxIndivMadame: "9,9 %",
            acompte: "119 €"
        }

    };

    // Initialisation des scenarii
    $scope.initScenario = function initScenario(scenario) {

        $scope.scenario = scenario;
        $scope.ss_scenario = false;
        $scope.stepCourant = 0;
        $scope.afficherSubform = false;
        $scope.data = angular.copy($scope.historique);


        // Aiguillage des scenarii
        switch (scenario) {

            case "accueil":
                $scope.titre = "Gérer mon prélèvement à la source";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["accueil", 2019, true]
                ];
                $('[data-toggle="popover"]').popover();
                break;

            case "chgt_sit":
                $scope.titre = "Déclarer un changement de situation de famille";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["chgt_sit", 2019, true] // Les étapes suivantes dépendent de la nature de l'événement
                ];
                $scope.data[2019].taux = "9,3 %";
                $scope.data[2019].tauxIndivMonsieur = "8,9 %";
                $scope.data[2019].tauxIndivMadame = "9,8 %";
                $scope.data[2019].acompte = "107 €";
                break;

            case "modul_tx":
                $scope.titre = "Moduler mon prélèvement à la source";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["sitfoyer", 2019, true],
                    ["revenus", 2019, false],
                    ["taux", 2019, true],
                    ["acompte", 2019, true]
                ];
                $scope.data[2019].taux = "9,7 %";
                $scope.data[2019].tauxIndivMonsieur = "9,2 %";
                $scope.data[2019].tauxIndivMadame = "10,1 %";
                $scope.data[2019].acompte = "107 €";
                break;

            case "modul_acpt":
                $scope.titre = "Gérer mes acomptes";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["", 2019, true]
                ];
                break;

            case "chgt_banq":
                $scope.titre = "Mettre à jour mes coordonnées bancaires";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["", 2019, true]
                ];
                break;

            case "historiquePaiements":
                $scope.titre = "Retenues et acomptes - 2019";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["", 2019, true]
                ];
                $scope.anneeHisto = 2019;
                break;

            case "historiqueModifs":
                $scope.titre = "Historique de mes actions - 2019";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["", 2019, true]
                ];
                $scope.anneeHisto = 2019;
                break;

            case "fin_scenario":
                $scope.titre = "Modification enregistrée";
                deroulement = [
                    // etape, annee, avancer dans le pas à pas au début de l'étape
                    ["fin", 2019, false]
                ];
                break;
        }

        $scope.etape = deroulement[0][0];
        $scope.anneeSaisie = deroulement[0][1];
        $scope.saisie = angular.copy($scope.data[deroulement[0][1]]);

        // Constitution du pas à pas
        $scope.pap = constituerPap(deroulement);

        return initScenario;
    }("accueil");

    // individualisation
    $scope.optionIndiv = false;
    $scope.opterIndiv = function() {
        $scope.optionIndiv = !$scope.optionIndiv;
    };


    // Choix d'une nature de changement de situation
    $scope.choixChgtSit = function(evenement) {
        switch (evenement) {
            case "mariage":
                $scope.data[2019].sitfam = "marié";
                deroulement = [
                    ["chgt_sit", 2019, true],
                    ["sitfoyer", 2017, true],
                    ["revenus", 2017, false],
                    ["sitfoyer", 2018, true],
                    ["revenus", 2018, false],
                    //["sitfoyer", 2019, true],
                    ["taux", 2019, true],
                    //["acompte", 2019, true]
                ];
                break;
            case "pacs":
                $scope.data[2019].sitfam = "pacsé";
                deroulement = [
                    ["chgt_sit", 2019, true],
                    ["sitfoyer", 2017, true],
                    ["revenus", 2017, false],
                    ["sitfoyer", 2018, true],
                    ["revenus", 2018, false],
                    //["sitfoyer", 2019, true],
                    ["taux", 2019, true],
                    //["acompte", 2019, true]
                ];
                break;
            case "separation":
                $scope.data[2019].sitfam = "divorcé ou séparé";
                deroulement = [
                    ["chgt_sit", 2019, true],
                    ["sitfoyer", 2019, true],
                    ["revenus", 2019, false],
                    ["taux", 2019, true],
                    //["acompte", 2019, true]
                ];
                break;
            case "deces":
                $scope.data[2019].sitfam = "veuf";
                deroulement = [
                    ["chgt_sit", 2019, true],
                    ["taux", 2019, true],
                    //["acompte", 2019, true]
                ];
                break;
        }
        $scope.afficherSubform = true;
        $scope.pap = constituerPap(deroulement);
    };

    // <-- INSERER le ss_scenario modulation baisse depassant la limite : on calcule un taux dans la limite? On envoie un message comme quoi on peut pas modul?
    // Progression dans le scénario
    $scope.progresser = function(sens) {
        // Cas particulier: ajout d'une étape en cas de modulation à la baisse
        if ($scope.scenario == "modul_tx" && $scope.etape == "revenus" && $scope.anneeSaisie == 2019 && $scope.sensModul) {

            deroulement.splice(2, 0, ["sitfoyer", 2018, true]);
            deroulement.splice(3, 0, ["revenus", 2018, false]);
            $scope.data[2019].taux = "7 %";
            $scope.data[2019].tauxIndivMonsieur = "6,6 %";
            $scope.data[2019].tauxIndivMadame = "7,4 %";
            $scope.data[2019].acompte = "107 €";
            $scope.pap = constituerPap(deroulement);
        }

        // Progression normale

        // Actualisation de l'affichage
        var index = nestedIndexOf(deroulement, [$scope.etape, $scope.anneeSaisie]) + sens;

        $scope.etape = deroulement[index][0];
        $scope.anneeSaisie = deroulement[index][1];
        $scope.saisie = $scope.data[deroulement[index][1]];

        $scope.afficherSubform = false;

        // Mise à jour du pas à pas
        if (deroulement[index][2]) {
            $scope.stepCourant += sens;
        }

        $('[data-toggle="popover"]').popover();
    };


    // Fin des scenarii
    $scope.finScenario = function() {
        $scope.historique = angular.copy($scope.data);
        if ($scope.scenario == "chgt_sit") {
            $scope.historique[2019].sitfam = $scope.data[2019].sitfam;

            if ($scope.data[2019].sitfam == "célibataire" || $scope.data[2019].sitfam == "divorcé ou séparé" || $scope.data[2019].sitfam == "veuf") {
                $scope.optionIndiv = false;
            }
        }

        $scope.initScenario("fin_scenario");

        $timeout(function() {
            $scope.initScenario("accueil");
        }, 2000);
    };


    // Constitution du pas à pas
    function constituerPap(deroulement) {
        var p = [];
        deroulement.forEach(function(val, key) {
            if (val[2]) {

                switch (val[0]) {
                    case "chgt_sit":
                        p.push("Événement");
                        break;
                    case "sitfoyer":
                    case "revenus":
                        p.push("Situation " + val[1]);
                        break;
                    case "taux":
                        p.push("Nouveau taux, nouveaux acomptes");
                        break;
                }
            }
        });
        return p;
    }

    // Ajout d'un code dans la liste
    $scope.addCodeRev = function(code) {
        $scope.saisie.codesSitRev.push(code);
        $scope.nouvCodeRev = null;
    };

    // Option pour l'acompte de confidentialité
    $scope.optionConfid = false;
    $scope.calculConfid = false;
    $scope.calculConfidAcheve = false;
    $scope.opterConfid = function() {
        if (!$scope.optionConfid) {
            $("#confid").modal();
        }
    };
    $scope.annulerConfid = function() {
        $scope.optionConfid = false;
    };

    $scope.suiteIndiv = false;

    $scope.historiquePaiements = [{
        type: 'tiers',
        date: new Date("2018-01-28"),
        evenement: 0,
        detail: {
            montant: 215.25,
            taux: '9,90 %',
            base: 2174.24,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-02-26"),
        evenement: 0,
        detail: {
            montant: 213.21,
            taux: '9,90 %',
            base: 2153.64,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-03-28"),
        evenement: 0,
        detail: {
            montant: 217.08,
            taux: '9,90 %',
            base: 2192.73,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-04-27"),
        evenement: 0,
        detail: {
            montant: 209.35,
            taux: '9,90 %',
            base: 2114.65,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-05-28"),
        evenement: 0,
        detail: {
            montant: 188.46,
            taux: '9,70 %',
            base: 1942.89,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-06-27"),
        evenement: 0,
        detail: {
            montant: 241.42,
            taux: '9,70 %',
            base: 2488.87,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-07-28"),
        evenement: 0,
        detail: {
            montant: 180.03,
            taux: '9,70 %',
            base: 1855.98,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-08-28"),
        evenement: 0,
        detail: {
            montant: 187.39,
            taux: '9,70 %',
            base: 1931.86,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-09-27"),
        evenement: 0,
        detail: {
            montant: 151.63,
            taux: '9,50 %',
            base: 1596.11,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-10-28"),
        evenement: 0,
        detail: {
            montant: 157.41,
            taux: '9,50 %',
            base: 1656.95,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-11-26"),
        evenement: 0,
        detail: {
            montant: 149.43,
            taux: '9,50 %',
            base: 1572.95,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-12-22"),
        evenement: 0,
        detail: {
            montant: 165.37,
            taux: '9,50 %',
            base: 1740.74,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2019-01-27"),
        evenement: 0,
        detail: {
            montant: 168.28,
            taux: '9,50 %',
            base: 1771.37,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2019-02-25"),
        evenement: 0,
        detail: {
            montant: 147.57,
            taux: '9,50 %',
            base: 1553.37,
            tauxDefaut: false,
            tiers: {
                nom: 'SARL DUGOMMIER',
                adresse: '14 rue des Chênes 75012 PARIS',
                siren: '123456789'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-05-21"),
        evenement: 0,
        detail: {
            montant: 16.79,
            taux: '2,00 %',
            base: 839.5,
            tauxDefaut: true,
            tiers: {
                nom: 'SA PLOUMPLOUM INTERIM',
                adresse: '21 rue des Cèdres 75020 PARIS',
                siren: '987654321'
            }
        }
    }, {
        type: 'tiers',
        date: new Date("2018-04-22"),
        evenement: 0,
        detail: {
            montant: 56.32,
            taux: '4,00 %',
            base: 1408,
            tauxDefaut: true,
            tiers: {
                nom: 'SA PLOUMPLOUM INTERIM',
                adresse: '21 rue des Cèdres 75020 PARIS',
                siren: '987654321'
            }
        }
    }, {
        type: 'acompte',
        date: new Date("2018-01-15"),
        evenement: 1,
        detail: {
            montant: 115,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 51
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 30
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 34
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-02-15"),
        evenement: 1,
        detail: {
            montant: 115,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 51
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 30
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 34
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-03-15"),
        evenement: 1,
        detail: {
            montant: 115,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 51
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 30
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 34
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-04-15"),
        evenement: 1,
        detail: {
            montant: 115,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 51
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 30
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 34
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-05-15"),
        evenement: 1,
        detail: {
            montant: 108,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 44
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 30
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 34
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-06-15"),
        evenement: 1,
        detail: {
            montant: 108,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 44
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 30
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 34
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-07-15"),
        evenement: 1,
        detail: {
            montant: 108,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 44
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 30
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 34
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-08-15"),
        evenement: 1,
        detail: {
            montant: 119,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 43
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 31
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 45
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-09-15"),
        evenement: 1,
        detail: {
            montant: 119,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 43
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 31
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 45
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-10-15"),
        evenement: 1,
        detail: {
            montant: 119,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 43
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 31
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 45
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-11-15"),
        evenement: 1,
        detail: {
            montant: 119,
            rejete: true,
            dateRejet: new Date("2018-11-20"),
            motifRejet: "provision insuffisante",
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 43
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 31
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 45
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2018-12-15"),
        evenement: 1,
        detail: {
            montant: 119,
            rejete: false,
            dateRejet: new Date("2018-12-18"),
            motifRejet: "compte inexistant",
            dateRegul: new Date("2019-01-04"),
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 43
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 31
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 45
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2019-01-15"),
        evenement: 1,
        detail: {
            montant: 119,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 43
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 31
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 45
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'acompte',
        date: new Date("2019-02-15T02:00:00"),
        evenement: 1,
        detail: {
            montant: 119,
            rejete: false,
            acomptes: [{
                revenu: "Revenus fonciers",
                montant: 43
            }, {
                revenu: "BIC - Monsieur Michel MARTIN",
                montant: 31
            }, {
                revenu: "BNC - Madame Jocelyne MARTIN",
                montant: 45
            }],
            rib: 'FR0000 0000000000000000 0000'
        }
    }, {
        type: 'modification',
        date: new Date("2018-04-17T15:24:00"),
        evenement: 4,
        impactFoyer: true,
        detail: {
            horodate: new Date("2018-04-17T15:24:00"),
            origine: 'Madame Jocelyne MARTIN',
            taux: '10,60 %'
        }
    }, {
        type: 'modification',
        date: new Date("2018-04-17T16:02:00"),
        evenement: 8,
        impactFoyer: true,
        detail: {
            horodate: new Date("2018-04-17T16:02:00"),
            origine: 'Madame Jocelyne MARTIN',
            taux: '9,70 %'
        }
    }, {
        type: 'modification',
        date: new Date("2019-01-01T00:00:00"),
        evenement: 11,
        impactFoyer: true,
        detail: {
            horodate: new Date("2019-01-01T00:00:00"),
            origine: 'la Direction Générale des Finances Publiques',
            taux: '9,50 %'
        }
    }, {
        type: 'modification',
        date: new Date("2018-09-30T21:31:00"),
        evenement: 3,
        impactFoyer: true,
        detail: {
            horodate: new Date("2018-09-30T21:31:00"),
            origine: 'Monsieur Michel MARTIN',
            taux: '8,70 %'
        }
    }, {
        type: 'modification',
        date: new Date("2019-01-14T19:57:00"),
        evenement: 9,
        impactFoyer: true,
        detail: {
            horodate: new Date("2016-01-14T19:57:00"),
            origine: 'Monsieur Michel MARTIN',
            taux: '9,50 %'
        }
    }, {
        type: 'modification',
        date: new Date("2018-01-01T00:00:00"),
        evenement: 2,
        impactFoyer: true,
        detail: {
            horodate: new Date("2018-01-01T00:00:00"),
            origine: 'la Direction Générale des Finances Publiques',
            taux: '9,90 %'
        }
    }, {
        type: 'modification',
        date: new Date("2018-05-24T20:23:00"),
        evenement: 10,
        impactFoyer: false,
        detail: {
            horodate: new Date("2018-05-24T20:23:00"),
            origine: 'Madame Jocelyne MARTIN',
            taux: 'false'
        }
    }];

    // Natures d'événements
    $scope.naturesEvenements = [
        'Prélèvement', // 0
        'Acompte', // 1
        'Actualisation du taux de prélèvement suite à la déclaration des revenus perçus en 2016', // 2
        'Modulation du taux de prélèvement', // 3
        'Changement de situation de famille - Mariage', // 4
        'Changement de situation de famille - PACS', // 5
        'Changement de situation de famille - Séparation', // 6
        'Changement de situation de famille - Décès', // 7
        'Individualisation du taux', // 8
        'Option pour le prélèvement au taux par défaut', // 9
        'Report de l\'acompte de juin - Bénéfice non commercial', // 10
        'Actualisation du taux de prélèvement suite à la déclaration des revenus perçus en 2017', // 11
    ];

    $scope.mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    $scope.acomptesPrevus = [
        {
            nature : 'Bénéfice industriel ou commercial - Déclarant 1',
            acomptes: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15]
        },
        {
            nature : 'Bénéfice non commercial - Déclarant 2',
            acomptes: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45]
        },
        {
            nature : 'Revenus fonciers',
            acomptes: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40]
        }
    ];

    $scope.getTotalAcomptes = function(index) {
        var total = 0;
        angular.forEach($scope.acomptesPrevus, function(revenu) {
            total += revenu.acomptes[index];
        });
        return total;
    };

    $scope.filtre = {
        tiers: true,
        acompte: true,
        modification: true
    };

    $scope.activerFiltre = function(type) {
        $scope.filtre[type] = !$scope.filtre[type];
    };

    $scope.anneeHisto = 2019;
    $scope.filtrePaiements = function() {
        return function(val) {
            return ((val.type == 'tiers') && $scope.filtre.tiers || (val.type == 'acompte') && $scope.filtre.acompte) && $scope.anneeHisto==val.date.getFullYear();
        };
    };
    $scope.filtreModifs = function() {
        return function(val) {
            return ((val.type == 'modification')) && $scope.anneeHisto==val.date.getFullYear();
        };
    };

    $scope.ligneActive = null;
    $scope.activerLigne = function(ligne) {
        $scope.ligneActive = $scope.ligneActive == ligne ? null : ligne;
    };

    $scope.totalMontants = function(historique) {
        var total = 0;
        angular.forEach(historique, function(ligne) {
            if (angular.isDefined(ligne.detail.montant)) {
                total += ligne.detail.montant;
            }
        });
        return total;
    };

    $scope.dateDesc = true;
    $scope.toggleDate = function() {
        $scope.dateDesc = !$scope.dateDesc;
    };

    // Catégories de codes revenus
    $scope.catRevenus = [
        [1, "Traitements, salaires, pensions"],
        [2, "Revenus de capitaux mobiliers"],
        [3, "Plus-values et gains divers"],
        [4, "Revenus fonciers"],
        [5, "Revenus des professions non salariées"]
    ];

    // Liste des codes revenus pour le typeahead
    $scope.codesRev = [
        ["1AC", "Salaires exonérés étrangers - Monsieur MARTIN", null],
        ["1AE", "Frais réels sur salaires étrangers - Monsieur MARTIN", null],
        ["1AH", "Pensions exonérées étrangères - Monsieur MARTIN", null],
        ["1AI", "Case à cocher : Demandeur d'emploi - Monsieur MARTIN", null],
        ["1AJ", "Salaires - Monsieur MARTIN", null],
        ["1AK", "Frais réels - Monsieur MARTIN", null],
        ["1AO", "Pensions alimentaires perçues - Monsieur MARTIN", null],
        ["1AP", "Revenus de remplacement - Monsieur MARTIN", null],
        ["1AQ", "Agent d'assurance - TS - rev. exonérés - Monsieur MARTIN", null],
        ["1AS", "Pensions, retraites, rentes - Monsieur MARTIN", null],
        ["1AT", "Pensions en capital taxables à 7,5 % - Monsieur MARTIN", null],
        ["1AW", "Rentes viagères : moins de 50 ans", null],
        ["1AZ", "Pensions d'invalidité - Monsieur MARTIN", null],
        ["1BC", "Salaires exonérés étrangers - Madame MARTIN", null],
        ["1BE", "Frais réels sur salaires étrangers - Madame MARTIN", null],
        ["1BH", "Pensions exonérées étrangères - Madame MARTIN", null],
        ["1BI", "Case à cocher : demandeur d'emploi - Madame MARTIN", null],
        ["1BJ", "Salaires - Madame MARTIN", null],
        ["1BK", "Frais réels - Madame MARTIN ", null],
        ["1BO", "Pensions alimentaires perçues - Madame MARTIN", null],
        ["1BP", "Revenus de remplacement - Madame MARTIN", null],
        ["1BQ", "Agent d'assurance - TS - rev. exonérés - Madame MARTIN", null],
        ["1BS", "Pensions, retraites, rentes - Madame MARTIN", null],
        ["1BT", "Pensions en capital taxables à 7,5 % - Madame MARTIN", null],
        ["1BW", "Rentes viagères : de 50 à 59 ans", null],
        ["1BZ", "Pensions d'invalidité - Madame MARTIN", null],
        ["1CC", "Salaires exonérés étrangers - PAC 1", null],
        ["1CE", "Frais réels sur salaires étrangers - PAC 1", null],
        ["1CH", "Pensions exonérées étrangères - PAC 1", null],
        ["1CI", "Case à cocher : demandeur  d'emploi - PAC 1", null],
        ["1CJ", "Salaires - PAC 1", null],
        ["1CK", "Frais réels - PAC 1", null],
        ["1CO", "Pensions alimentaires - PAC 1", null],
        ["1CP", "Revenus de remplacement - PAC 1", null],
        ["1CS", "Pensions, retraites, rentes - PAC 1", null],
        ["1CW", "Rentes viagères : de 60 à 69 ans", null],
        ["1CZ", "Pensions d'invalidité - PAC 1", null],
        ["1DC", "Salaires exonérés étrangers - PAC 2", null],
        ["1DE", "Frais réels sur salaires étrangers - PAC 2", null],
        ["1DH", "Pensions exonérées étrangères - PAC 2", null],
        ["1DI", "Case à cocher : Demandeur d'emploi - PAC 2", null],
        ["1DJ", "Salaires - PAC 2", null],
        ["1DK", "Frais réels - PAC 2", null],
        ["1DN", "Sommes exo. d'un CET versées sur PERCO - Madame MARTIN", null],
        ["1DO", "Pensions alimentaires perçues - PAC 2", null],
        ["1DP", "Revenus de remplacement - PAC 2", null],
        ["1DS", "Pensions, retraites, rentes - PAC 2", null],
        ["1DW", "Rentes viagères : à partir de 70 ans", null],
        ["1DY", "Rev. exonérés salariés impatriés - Monsieur MARTIN", null],
        ["1DZ", "Pensions d'invalidité - PAC 2", null],
        ["1EC", "Salaires exonérés étrangers - PAC 3", null],
        ["1EE", "Frais réels sur salaires étrangers - PAC 3", null],
        ["1EH", "Pensions exonérées étrangères - PAC 3", null],
        ["1EI", "Case à cocher : Demandeur d'emploi - PAC 3", null],
        ["1EJ", "Salaires - PAC 3", null],
        ["1EK", "Frais réels - PAC 3", null],
        ["1EO", "Pensions alimentaires perçues - PAC 3", null],
        ["1EP", "Revenus de remplacement - PAC 3", null],
        ["1ES", "Pensions, retraites, rentes - PAC 3", null],
        ["1EY", "Rev. exonérés salariés impatriés - Madame MARTIN", null],
        ["1EZ", "Pensions d'invalidité - PAC 3", null],
        ["1FC", "Salaires exonérés étrangers - PAC 4", null],
        ["1FE", "Frais réels sur salaires étrangers - PAC 4", null],
        ["1FH", "Pensions exonérées étrangères - PAC 4", null],
        ["1FI", "Case à cocher : Demandeur d'emploi - PAC 4", null],
        ["1FJ", "Salaires, retraites, rentes - PAC 4", null],
        ["1FK", "Frais réels - PAC 4", null],
        ["1FO", "Pensions alimentaires perçues - PAC 4", null],
        ["1FP", "Revenus de remplacement - PAC 4", null],
        ["1FS", "Pensions, retraites, rentes - PAC 4", null],
        ["1FZ", "Pensions d'invalidité - PAC 4", null],
        ["1NY", "Gains soumis à contrib. salariale de 30 % - Monsieur MARTIN", null],
        ["1OY", "Gains soumis à contrib. salariale de 30 % - Madame MARTIN", null],
        ["1SM", "Sommes exo. d'un CET versées sur PERCO - Monsieur MARTIN", null],
        ["1TT", "Gains de levée d'option à c/ du 28/09/2012 - Monsieur MARTIN", null],
        ["1TV", "Gains de levée d'option - entre 1 et 2 ans - Monsieur MARTIN", null],
        ["1TW", "Gains de levée d'option - entre 2 et 3 ans - Monsieur MARTIN", null],
        ["1TX", "Gains de levée d'option - entre 3 et 4 ans - Monsieur MARTIN", null],
        ["1TZ", "Gain d'acquisition d'actions gratuites à compter du 08/08/2015", null],
        ["1UT", "Gains de levée d'option à c/ du 28/09/2012 - Madame MARTIN", null],
        ["1UV", "Gains de levée d'option - entre 1 et 2 ans - Madame MARTIN ", null],
        ["1UW", "Gains de levée d'option - entre 2 et 3 ans - Madame MARTIN", null],
        ["1UX", "Gains de levée d'option - entre 3 et 4 ans - Madame MARTIN", null],
        ["2AA", "Report déficit RCM 2009", null],
        ["2AB", "Crédits d'impôt sur valeurs étrangères", null],
        ["2AL", "Report déficit RCM 2010", null],
        ["2AM", "Report déficit RCM 2011", null],
        ["2AN", "Report déficit RCM 2011", null],
        ["2AN", "Report déficit RCM 2012", null],
        ["2AQ", "Report déficit RCM 2013", null],
        ["2AR", "Report déficit RCM 2014", null],
        ["2BG", "Crédit d'impôt 'directive épargne' et autres crédits restituables", null],
        ["2BH", "Revenus 2TR déjà soumis aux prélèv. soc. avec CSG déductible", null],
        ["2CA", "RCM - Frais à déduire", null],
        ["2CG", "RCM déjà soumis aux prélèv. sociaux sans CSG déductible", null],
        ["2CH", "Produits des contrats d'assurance-vie et de capitalisation ", null],
        ["2CK", "Crédit d'impôt prélèvement forfait. déjà versé", null],
        ["2DC", "Dividendes ouvrant droit à abattement ", null],
        ["2DH", "Produits contrats d'assurance-vie soumis au prélèv. lib. 7,5 % ", null],
        ["2DM", "Impatriés : RCM perçus à l'étranger exonérés (50 %)", null],
        ["2EE", "Produits placement soumis aux prélèvements libératoires  ", null],
        ["2FA", "Produits de placement à revenu fixe < 2 000 €", null],
        ["2FU", "Rev. des titres non cotés détenus dans un PEA ", null],
        ["2GO", "Rev. structures à régime fiscal privilégié sans abattement ", null],
        ["2TR", "Produits de placement à revenu fixe sans abattement ", null],
        ["2TS", "Produits de contrat d'assurance vie < 8 ans sans abattement ", null],
        ["3SB", "Plus-values avec report expiré en 2015 taxables au barème", null],
        ["3SC", "Plus-values avec report expiré en 2015 à l'issue du délai de réinvestissement", null],
        ["3SE", "Plus-value de cession de valeurs mobilières non résidents", null],
        ["3SG", "Abattement pour durée de détention - Plus-value", null],
        ["3SJ", "Gains de cessions bons créateur entrep. taxables à 19 %", null],
        ["3SK", "Gains de cessions bons créateur entrep. taxables à 30 %", null],
        ["3SL", "Abat. majoré pour durée de détention - Plus-value", null],
        ["3UA", "Plus-value après abattement dirigeant PME", null],
        ["3UB", "Plus-value après abattement dirigeant PME (2e plus-value)", null],
        ["3UO", "Plus-value après abattement dirigeant PME (3e plus-value)", null],
        ["3UP", "Plus-value après abattement dirigeant PME (4e plus-value)", null],
        ["3UV", "Distr SCR avec demande de remb. de l'excédent du prèlèv. de 30 %", null],
        ["3UY", "Plus-value après abattement dirigeant PME ", null],
        ["3VA", "Abatt.pour durée de détention dirigeant - Plus-value", null],
        ["3VB", "Abatt.pour durée de détention dirigeant - Plus-value (2e plus-value)", null],
        ["3VC", "Gains exonerés de structures de capital risque ", null],
        ["3VD", "Gains de cession taxables à 18 %", null],
        ["3VE", "P.V avec demande de remb. de l'excédent du prèlèv. de 45 %", null],
        ["3VF", "Gains de cession taxables à 41 %  ", null],
        ["3VG", "Gains de cessions de valeurs mobilières taxables au barème ", null],
        ["3VH", "Pertes de cessions de valeurs mobilières  ", null],
        ["3VI", "Gains de cession taxables à 30 % ", null],
        ["3VJ", "Gains de cession d'options imposables en TS - Monsieur MARTIN", null],
        ["3VK", "Gains de cession d'options imposables en TS - Madame MARTIN", null],
        ["3VM", "Gains PEA taxables à 22,5 % ", null],
        ["3VN", "Gains soumis à contrib. salariale de 10 % ", null],
        ["3VO", "Abattement pour durée de détention dirigeant - Plus-value (3e plus-value)", null],
        ["3VP", "Abattement pour durée de détention dirigeant - Plus-value (4e plus-value)", null],
        ["3VQ", "Plus-values exonérées (50 %) des impatriés", null],
        ["3VR", "Moins-values non imputables (50 %) des impatriés", null],
        ["3VT", "Gains PEA taxables à 19 %", null],
        ["3VW", "Plus-values exonérées résidence secondaire", null],
        ["3VX", "Code X - Plus-value en report d'imposition : montant > 8 chiffres", null],
        ["3VY", "Abattement pour durée de détention dirigeant - Plus-value", null],
        ["3VZ", "Plus-values immobilières", null],
        ["3WA", "P.V et créances en sursis de paiement", null],
        ["3WB", "P.V et créances sans sursis de paiement taxables au barème ", null],
        ["3WD", "Base aux prélèvements sociaux en cas de paiement immédiat", null],
        ["3WE", "Complément de prix perçu en 2015", null],
        ["3WH", "P.V en report d'imposition (art.150-0B ter du CGI)", null],
        ["3WM", "Base aux prélèvements sociaux en cas de sursis de paiement", null],
        ["3WY", "P.V exit tax (sursis ou non): montant > 8 chiffres", null],
        ["4BA", "Revenus fonciers ", null],
        ["4BB", "Déficit foncier imputable sur rev. fonciers ", null],
        ["4BC", "Déficit foncier imputable sur revenu global ", null],
        ["4BD", "Déficits fonciers antérieurs non encore imputés ", null],
        ["4BE", "Régime Micro-foncier - Recettes brutes ", null],
        ["4BF", "Primes d'assurances loyers impayés ", null],
        ["4BH", "Taxe sur loyers élevés", null],
        ["4BY", "Amortissement Robien ou Borloo déduit des revenus fonciers", null],
        ["4BZ", "Case à cocher : dépôt d'une déclaration 2044-SPE", null],
        ["4TQ", "Loyers du 1.1 au 30.9.98 imposés à T. add./ D. bail (cess. location) ", null],
        ["5GA", "Locations meublées non professionnelles - Déficit de 2005", null],
        ["5GB", "Locations meublées non professionnelles - Déficit de 2006", null],
        ["5GC", "Locations meublées non professionnelles - Déficit de 2007", null],
        ["5GD", "Locations meublées non professionnelles - Déficit de 2008", null],
        ["5GE", "Locations meublées non professionnelles - Déficit de 2009", null],
        ["5GF", "Locations meublées non professionnelles - Déficit de 2010", null],
        ["5GG", "Locations meublées non professionnelles - Déficit de 2011", null],
        ["5GH", "Locations meublées non professionnelles - Déficit de 2012", null],
        ["5GI", "Locations meublées non professionnelles - Déficit de 2013", null],
        ["5GJ", "Locations meublées non professionnelles - Déficit de 2014", null],
        ["5HA", "Revenus locations meublées profess. sous CGA - Monsieur MARTIN", null],
        ["5HB", "BA sous CGA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5HC", "BA sous CGA - Régime géné. ou moyenne trien. - Monsieur MARTIN ", null],
        ["5HD", "Revenus exploitants forestiers - Monsieur MARTIN", null],
        ["5HE", "BA - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5HF", "BA sous CGA - Déficits - Monsieur MARTIN ", null],
        ["5HG", "Plus-values exonérées à imposer aux contrib. sociales - Monsieur MARTIN", null],
        ["5HH", "BA hors CGA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5HI", "BA hors CGA - Rev. régime géné. ou moyenne trien. - Monsieur MARTIN ", null],
        ["5HK", "BNC non prof. sous AA - Revenus exonérés - Monsieur MARTIN", null],
        ["5HL", "BA hors CGA - Déficits - Monsieur MARTIN", null],
        ["5HM", "Jeunes agriculteurs - CGA - Abatt. 50% ou 100% - Monsieur MARTIN", null],
        ["5HN", "BA - Forfait - Revenus exonérés - Monsieur MARTIN ", null],
        ["5HO", "BA - Forfait - Revenus imposables - Monsieur MARTIN ", null],
        ["5HP", "BNC prof. régime micro - Revenus exonérés - Monsieur MARTIN ", null],
        ["5HQ", "BNC prof. régime micro - Revenus imposables - Monsieur MARTIN ", null],
        ["5HR", "BNC prof. régime micro - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5HS", "BNC prof. régime micro - Moins-values à long terme - Monsieur MARTIN ", null],
        ["5HT", "BNC non professionnels - Déficit de 2009 ", null],
        ["5HV", "BNC prof. régime micro - Plus-values à court terme - Monsieur MARTIN ", null],
        ["5HW", "BA - Forfait - Plus-values à court terme - Monsieur MARTIN ", null],
        ["5HX", "BA - Forfait - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5HY", "Revenus à imposer aux contrib. soc. - Monsieur MARTIN ", null],
        ["5HZ", "Jeunes agriculteurs - hors CGA - Abatt. 50% ou 100% - Monsieur MARTIN", null],
        ["5IA", "Revenus locations meublées profess. sous CGA - Madame MARTIN", null],
        ["5IB", "BA sous CGA - Revenus exonérés - Madame MARTIN ", null],
        ["5IC", "BA sous CGA - Revenus régime géné. ou moy. trien. - Madame MARTIN ", null],
        ["5ID", "Revenus exploitants forestiers - Madame MARTIN", null],
        ["5IE", "BA - Plus-values à 16 % - Madame MARTIN ", null],
        ["5IF", "BA sous CGA - Déficits - Madame MARTIN ", null],
        ["5IG", "Plus-values exo. à imposer aux contributions sociales - Madame MARTIN", null],
        ["5IH", "BA hors CGA  - Revenus exonérés - Madame MARTIN ", null],
        ["5II", "BA hors CGA - Revenus régime géné. ou moy. trien. - Madame MARTIN ", null],
        ["5IK", "BNC non prof. hors AA - Revenus exonérés - Monsieur MARTIN", null],
        ["5IL", "BA hors CGA - Déficits - Madame MARTIN ", null],
        ["5IM", "Jeunes agriculteurs - CGA - Abatt. 50 % ou 100 % - Madame MARTIN", null],
        ["5IN", "BA - Forfait - Revenus exonérés - Madame MARTIN ", null],
        ["5IO", "BA - Forfait - Revenus imposables - Madame MARTIN ", null],
        ["5IP", "BNC prof. régime micro - Revenus exonérés - Madame MARTIN ", null],
        ["5IQ", "BNC prof. régime micro - Revenus imposables - Madame MARTIN ", null],
        ["5IR", "BNC prof. régime micro - Plus-values à 16 % - Madame MARTIN ", null],
        ["5IS", "BNC prof. régime micro - Moins-values à long terme - Madame MARTIN ", null],
        ["5IT", "BNC non professionnels - Déficit de 2010", null],
        ["5IU", "BIC non prof. régime micro - Moins-values à court terme ", null],
        ["5IV", "BNC prof. régime micro - Plus-values à court terme - Madame MARTIN ", null],
        ["5IW", "BA - Forfait - Plus-values à court terme - Madame MARTIN ", null],
        ["5IX", "BA - Forfait - Plus-values à 16 % - Madame MARTIN ", null],
        ["5IY", "Revenus à imposer aux contrib. soc. - Madame MARTIN ", null],
        ["5IZ", "Jeunes agriculteurs - hors CGA - Abatt. 50% ou 100% - Madame MARTIN", null],
        ["5JA", "Revenus locations meublées profess. sous CGA - PAC", null],
        ["5JB", "BA sous CGA - Revenus exonérés - PAC ", null],
        ["5JC", "BA sous CGA - Revenus régime géné. ou moyenne trien. - PAC ", null],
        ["5JD", "Revenus exploitants forestiers - PAC", null],
        ["5JE", "BA - Plus-values à 16 % - PAC ", null],
        ["5JF", "BA sous CGA - Déficits - PAC ", null],
        ["5JG", "BNC non prof.sous AA - Bénéfices - Monsieur MARTIN", null],
        ["5JH", "BA hors CGA - Revenus exonérés - PAC ", null],
        ["5JI", "BA hors CGA - Revenus régime génér. ou moyenne trien. - PAC ", null],
        ["5JJ", "BNC non prof. sous AA - Déficit - Monsieur MARTIN", null],
        ["5JK", "BNC non prof. sous AA - Revenus exonérés - Madame MARTIN", null],
        ["5JL", "BA hors CGA - Déficits - PAC ", null],
        ["5JM", "Jeunes agriculteurs - CGA - Abatt. 50 % ou 100 % - PAC", null],
        ["5JN", "BA - Forfait - Revenus exonérés - PAC ", null],
        ["5JO", "BA - Forfait - Revenus imposables - PAC ", null],
        ["5JP", "BNC prof. régime micro - Revenus exonérés - PAC ", null],
        ["5JQ", "BNC prof. régime micro - Revenus imposables - PAC ", null],
        ["5JR", "BNC prof. régime micro - Plus-values à 16 % - PAC ", null],
        ["5JS", "BNC prof. régime micro - Moins-values à long terme - PAC ", null],
        ["5JT", "BNC non professionnels - Déficit de 2011", null],
        ["5JU", "BNC non prof. régime micro - Moins-values à court terme ", null],
        ["5JV", "BNC prof. régime micro - Plus-values à court terme - PAC ", null],
        ["5JW", "BA - Forfait - Plus-values à court terme - PAC ", null],
        ["5JX", "BA - Forfait - Plus-values à 16 % - PAC ", null],
        ["5JY", "Revenus à imposer aux contrib. soc. - PAC ", null],
        ["5JZ", "Jeunes agriculteurs - hors CGA - Abatt. 50% ou 100% - PAC", null],
        ["5KA", "Revenus locations meublées profess. hors CGA - Monsieur MARTIN", null],
        ["5KB", "BIC prof. sous CGA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5KC", "BIC prof. sous CGA - Régime normal - Bénéfices - Monsieur MARTIN ", null],
        ["5KE", "BIC professionnels - Plus-values à 16 %  - Monsieur MARTIN ", null],
        ["5KF", "BIC prof. sous CGA - Régime normal - Déficits - Monsieur MARTIN ", null],
        ["5KH", "BIC prof. hors CGA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5KI", "BIC prof. hors CGA - Régime normal - Monsieur MARTIN ", null],
        ["5KJ", "BIC prof. régime micro - Moins-values à court terme - Monsieur MARTIN ", null],
        ["5KK", "BNC non prof. hors AA - Revenus exonérés - Madame MARTIN", null],
        ["5KL", "BIC prof. hors CGA - Régime normal - Déficits - Monsieur MARTIN ", null],
        ["5KM", "Loc. gîtes ruraux hors CGA déjà taxées aux prél. Soc. - Monsieur MARTIN", null],
        ["5KN", "BIC prof. régime micro - Revenus exonérés - Monsieur MARTIN ", null],
        ["5KO", "BIC prof. régime micro - Activités ventes - Monsieur MARTIN ", null],
        ["5KP", "BIC prof. régime micro - Activités prestations - Monsieur MARTIN ", null],
        ["5KQ", "BIC prof. régime micro - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5KR", "BIC prof. régime micro - Moins-values à long terme - Monsieur MARTIN ", null],
        ["5KS", "Artisans pêcheurs - Abatt. 50 % - Monsieur MARTIN ", null],
        ["5KT", "BNC non professionnels - Déficit de 2012", null],
        ["5KU", "BNC non prof. régime micro - Revenus imposables - Monsieur MARTIN ", null],
        ["5KV", "BNC non prof. régime micro - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5KW", "BNC non prof. régime micro - Moins-values à long terme - Monsieur MARTIN ", null],
        ["5KX", "BIC prof. régime micro - Plus-values à court terme - Monsieur MARTIN ", null],
        ["5KY", "BNC non prof. régime micro - Plus-values à court terme - Monsieur MARTIN ", null],
        ["5KZ", "BNC prof. régime micro - Moins-values à court terme - Monsieur MARTIN ", null],
        ["5LA", "Revenus locations meublées profess. hors CGA - Madame MARTIN", null],
        ["5LB", "BIC prof. sous CGA - Revenus exonérés - Madame MARTIN ", null],
        ["5LC", "BIC prof. sous CGA - Régime normal - Bénéfices - Madame MARTIN ", null],
        ["5LE", "BIC professionnels - Plus-values à 16 %  - Madame MARTIN ", null],
        ["5LF", "BIC prof. sous CGA - Régime normal - Déficits - Madame MARTIN ", null],
        ["5LH", "BIC prof. hors CGA - Revenus exonérés - Madame MARTIN ", null],
        ["5LI", "BIC prof. hors CGA - Régime normal - Madame MARTIN ", null],
        ["5LJ", "BIC prof. régime micro - Moins-values à court terme - Madame MARTIN ", null],
        ["5LK", "BNC non prof. sous AA - Revenus exonérés - PAC", null],
        ["5LL", "BIC prof. hors CGA - Régime normal - Déficits - Madame MARTIN ", null],
        ["5LM", "Loc. gîtes ruraux hors CGA déjà taxées aux prél. Soc. - Madame MARTIN", null],
        ["5LN", "BIC prof. régime micro - Revenus exonérés - Madame MARTIN ", null],
        ["5LO", "BIC prof. régime micro - Activités ventes - Madame MARTIN ", null],
        ["5LP", "BIC prof. régime micro - Activites prestations - Madame MARTIN ", null],
        ["5LQ", "BIC prof. régime micro - Plus-values à 16 % - Madame MARTIN ", null],
        ["5LR", "BIC prof. régime micro - Moins-values à long terme - Madame MARTIN ", null],
        ["5LS", "Artisans pêcheurs - abatt. 50 % - Madame MARTIN ", null],
        ["5LT", "BNC non professionnels - Déficit de 2013", null],
        ["5LU", "BNC non prof. régime micro - Revenus imposables - Madame MARTIN ", null],
        ["5LV", "BNC non prof. régime micro - Plus-values à 16 % - Madame MARTIN ", null],
        ["5LW", "BNC non prof. régime micro - Moins-values à long terme - Madame MARTIN ", null],
        ["5LX", "BIC prof. régime micro - Plus-values à court terme - Madame MARTIN ", null],
        ["5LY", "BNC non prof. régime micro - Plus-values à court terme - Madame MARTIN ", null],
        ["5LZ", "BNC prof. régime micro - Moins-values à court terme - Madame MARTIN ", null],
        ["5MA", "Revenus locations meublées profess. hors CGA - PAC", null],
        ["5MB", "BIC prof. sous CGA - Revenus exonérés - PAC ", null],
        ["5MC", "BIC prof. sous CGA - Régime normal - Bénéfices - PAC ", null],
        ["5ME", "BIC professionnels - Plus-values à 16 % - PAC ", null],
        ["5MF", "BIC prof. sous CGA - Régime normal - Déficits - PAC ", null],
        ["5MH", "BIC prof. hors CGA - Revenus exonérés - PAC ", null],
        ["5MI", "BIC prof. hors CGA - Régime normal - PAC ", null],
        ["5MJ", "BIC prof. régime micro - Moins-values à court terme - PAC ", null],
        ["5MK", "BNC non prof.hors AA - Revenus exonérés - PAC", null],
        ["5ML", "BIC prof. hors CGA - Régime normal - Déficits - PAC ", null],
        ["5MM", "Loc. gîtes ruraux hors CGA déjà taxées aux prél. sociaux - PAC", null],
        ["5MN", "BIC prof. régime micro - Revenus exonérés - PAC ", null],
        ["5MO", "BIC prof. régime micro - Activités ventes - PAC ", null],
        ["5MP", "BIC prof. régime micro - Activités prestations - PAC ", null],
        ["5MQ", "BIC prof. régime micro - Plus-values à 16 % - PAC ", null],
        ["5MR", "BIC prof. régime micro - Moins-values à long terme - PAC ", null],
        ["5MS", "Artisans pêcheurs - Abatt. 50 % - PAC ", null],
        ["5MT", "BNC non professionnels - Déficit de 2014", null],
        ["5MU", "BNC non prof. Régime micro - Revenus imposables - PAC ", null],
        ["5MV", "BNC non prof. régime micro - Plus-values à 16 % - PAC ", null],
        ["5MW", "BNC non prof. régime micro - Moins-values à long terme - PAC ", null],
        ["5MX", "BIC prof. régime micro - Plus-values à court terme - PAC ", null],
        ["5MY", "BNC non prof. régime micro - Plus-values à court terme - PAC ", null],
        ["5MZ", "BNC prof. régime micro - Moins-values à court terme - PAC ", null],
        ["5NA", "Revenus locations meublées non profess. sous CGA - Monsieur MARTIN", null],
        ["5NB", "BIC non prof. sous CGA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5NC", "BIC non prof. sous CGA - Régime normal - Bénéfice - Monsieur MARTIN ", null],
        ["5ND", "BIC non prof. régime micro - Locations meublées - Monsieur MARTIN", null],
        ["5NE", "BIC non professionnels - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5NF", "BIC non prof. sous CGA - Régime normal - Déficit - Monsieur MARTIN ", null],
        ["5NG", "BIC non prof. régime micro - Gîtes, meublés tourisme - Monsieur MARTIN", null],
        ["5NH", "BIC non prof. hors CGA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5NI", "BIC non prof. hors CGA - Régime normal - Monsieur MARTIN ", null],
        ["5NJ", "Locations gîtes ruraux déjà taxées aux prélèv. sociaux - Monsieur MARTIN", null],
        ["5NK", "Revenus locations meublées non profess. hors CGA - Monsieur MARTIN", null],
        ["5NL", "BIC non prof. hors CGA - Régime normal - Déficits - Monsieur MARTIN ", null],
        ["5NM", "Loc. gîtes ruraux sous CGA déjà taxées aux prél. soc. - Monsieur MARTIN", null],
        ["5NN", "BIC non prof. régime micro - Revenus exonérés - Monsieur MARTIN ", null],
        ["5NO", "BIC non prof. régime micro - Activités ventes - Monsieur MARTIN ", null],
        ["5NP", "BIC non prof. régime micro - Activités prestations - Monsieur MARTIN ", null],
        ["5NQ", "BIC non prof. régime micro - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5NR", "BIC non prof. régime micro - Moins-values à long terme - Monsieur MARTIN ", null],
        ["5NS", "BNC non prof. hors AA - Bénéfices - Madame MARTIN ", null],
        ["5NT", "BNC non prof. - Plus-values à 16 % - Madame MARTIN ", null],
        ["5NU", "BNC non prof. hors AA -  Déficits - Madame MARTIN", null],
        ["5NX", "BIC non prof. régime micro - Plus-values à court terme - Monsieur MARTIN ", null],
        ["5NY", "Locations meublées non profess. sous CGA - Déficit - Monsieur MARTIN", null],
        ["5NZ", "Locations meublées non profess. hors CGA - Déficit - Monsieur MARTIN", null],
        ["5OA", "Revenus locations meublées non profess. sous CGA - Madame MARTIN", null],
        ["5OB", "BIC non prof. sous CGA - Revenus exonérés - Madame MARTIN ", null],
        ["5OC", "BIC non prof. sous CGA - Régime normal - Bénéfice - Madame MARTIN ", null],
        ["5OD", "BIC non prof. régime micro - Locations meublées - Madame MARTIN", null],
        ["5OE", "BIC non professionnels - Plus-values à 16 % - Madame MARTIN ", null],
        ["5OF", "BIC non prof. sous CGA - Régime normal - Déficit - Madame MARTIN ", null],
        ["5OG", "BIC non prof. régime micro - Gîtes, meublés tourisme - Madame MARTIN", null],
        ["5OH", "BIC non prof. hors CGA - Revenus exonérés - Madame MARTIN ", null],
        ["5OI", "BIC non prof. hors CGA -  Régime normal - Madame MARTIN ", null],
        ["5OJ", "Locations gîtes ruraux déjà taxées aux prélèv. sociaux - Madame MARTIN", null],
        ["5OK", "Revenus locations meublées non profess. hors CGA - Madame MARTIN", null],
        ["5OL", "BIC non prof. hors CGA - Régime normal - Déficits - Madame MARTIN ", null],
        ["5OM", "Loc. gîtes ruraux sous CGA déjà taxées aux prél. soc. - Madame MARTIN", null],
        ["5ON", "BIC non prof. régime micro - Revenus exonérés - Madame MARTIN ", null],
        ["5OO", "BIC non prof. régime micro - Activités ventes - Madame MARTIN ", null],
        ["5OP", "BIC non prof. régime micro - Activites prestations - Madame MARTIN ", null],
        ["5OQ", "BIC non prof. régime micro - Plus-values à 16 % - Madame MARTIN ", null],
        ["5OR", "BIC non prof. régime micro - Moins-values à long terme - Madame MARTIN ", null],
        ["5OS", "BNC non prof. hors AA - Bénéfices - PAC ", null],
        ["5OT", "BNC non professionnels. Plus-values à 16 % - PAC", null],
        ["5OU", "BNC non prof. hors AA - Déficit - PAC ", null],
        ["5OX", "BIC non prof. régime micro - Plus-values à court terme - Madame MARTIN ", null],
        ["5OY", "Locations meublées non profess. sous CGA - Déficit - Madame MARTIN", null],
        ["5OZ", "Locations meublées non profess. hors CGA - Déficit - Madame MARTIN", null],
        ["5PA", "Revenus locations meublées non profess. sous CGA - PAC", null],
        ["5PB", "BIC non prof. sous CGA - Revenus exonérés - PAC ", null],
        ["5PC", "BIC non prof. sous CGA - Régime normal - Bénéfices - PAC ", null],
        ["5PD", "BIC non prof. régime micro - Locations meublées - PAC", null],
        ["5PE", "BIC non professionnels - Plus-values à 16 % - PAC ", null],
        ["5PF", "BIC non prof. sous CGA - Régime normal - Déficit - PAC ", null],
        ["5PG", "BIC non prof. régime micro - Gîtes, meublés tourisme - PAC", null],
        ["5PH", "BIC non prof. hors CGA - Revenus exonérés - PAC ", null],
        ["5PI", "BIC non prof. hors CGA - Régime normal - PAC ", null],
        ["5PJ", "Locations gîtes ruraux déjà taxées aux prélèv. sociaux - PAC", null],
        ["5PK", "Revenus locations meublées non profess. hors CGA - PAC", null],
        ["5PL", "BIC non prof. hors CGA - Régime normal - Déficit - PAC ", null],
        ["5PM", "Loc. gîtes ruraux sous CGA déjà taxées aux prél. sociaux - PAC", null],
        ["5PN", "BIC non prof. régime micro - Revenus exonérés - PAC ", null],
        ["5PO", "BIC non prof. régime micro - Activités ventes - PAC ", null],
        ["5PP", "BIC non prof. régime micro - Activités prestations - PAC ", null],
        ["5PQ", "BIC non prof. régime micro - Plus-values à 16 % - PAC ", null],
        ["5PR", "BIC non prof. régime micro - Moins-values à long terme - PAC ", null],
        ["5PX", "BIC non prof. régime micro - Plus-values à court terme - PAC ", null],
        ["5PY", "Locations meublées non profess. sous CGA - Déficit - PAC", null],
        ["5PZ", "Locations meublées non profess. hors CGA - Déficit - PAC", null],
        ["5QA", "Locations meublées profess. sous CGA - Déficit - Monsieur MARTIN", null],
        ["5QB", "BNC prof. sous AA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5QC", "BNC prof. sous AA - Bénéfices - Monsieur MARTIN ", null],
        ["5QD", "BNC professionnels - Plus-values à 16 % - Monsieur MARTIN ", null],
        ["5QE", "BNC prof. sous AA - Déficits - Monsieur MARTIN ", null],
        ["5QF", "Déficit agricole de 2009", null],
        ["5QG", "Déficit agricole de 2009", null],
        ["5QH", "BNC prof. hors CGA - Revenus exonérés - Monsieur MARTIN ", null],
        ["5QI", "BNC prof. hors CGA - Bénéfices - Monsieur MARTIN ", null],
        ["5QJ", "Locations meublées profess. hors CGA - Déficit - Monsieur MARTIN", null],
        ["5QK", "BNC prof. hors CGA - Déficits - Monsieur MARTIN ", null],
        ["5QL", "Jeunes créateurs BNC prof. - Abatt. 50 % - Monsieur MARTIN ", null],
        ["5QM", "Indemnité cess. agent d'assurance - Monsieur MARTIN", null],
        ["5QN", "Déficit agricole de 2011", null],
        ["5QO", "Déficit agricole de 2012", null],
        ["5QP", "Déficit agricole de 2013", null],
        ["5QQ", "Déficit agricole de 2014", null],
        ["5RA", "Locations meublées profess. sous CGA - Déficit - Madame MARTIN", null],
        ["5RB", "BNC prof. sous AA - Revenus exonérés - Madame MARTIN ", null],
        ["5RC", "BNC prof. sous AA - Bénéfices - Madame MARTIN ", null],
        ["5RD", "BNC professionnels - Plus-values à 16 % - Madame MARTIN ", null],
        ["5RE", "BNC prof. sous AA - Déficits - Madame MARTIN ", null],
        ["5RF", "BNC non prof. sous AA - Bénéfices - Madame MARTIN ", null],
        ["5RG", "BNC non prof. sous AA - Déficits - Madame MARTIN ", null],
        ["5RH", "BNC prof. hors CGA - Revenus exonérés - Madame MARTIN ", null],
        ["5RI", "BNC prof. hors CGA - Bénéfices - Madame MARTIN ", null],
        ["5RJ", "Locations meublées profess. hors CGA - Déficit - Madame MARTIN", null],
        ["5RK", "BNC prof. hors CGA - Déficits - Madame MARTIN ", null],
        ["5RL", "Jeunes créateurs BNC prof. - Abatt. 50 % - Madame MARTIN", null],
        ["5RM", "Indemnité cess. agent d'assurance - Madame MARTIN", null],
        ["5RN", "BIC non professionnel - Déficit de 2009", null],
        ["5RO", "BIC non professionnel - Déficit de 2010", null],
        ["5RP", "BIC non professionnel - Déficit de 2011", null],
        ["5RQ", "BIC non professionnel - Déficit de 2012", null],
        ["5RR", "BIC non professionnel - Déficit de 2013", null],
        ["5RW", "BIC non professionnel - Déficit de 2014", null],
        ["5SA", "Locations meublées profess. sous CGA - Déficit - PAC", null],
        ["5SB", "BNC prof. sous AA - Revenus exonérés - PAC ", null],
        ["5SC", "BNC prof. sous AA - Bénéfices - PAC ", null],
        ["5SD", "BNC professionnels - Plus-values à 16 % - PAC ", null],
        ["5SE", "BNC prof. sous AA - Déficits - PAC ", null],
        ["5SF", "BNC non prof. sous AA - Bénéfices - PAC", null],
        ["5SG", "BNC non prof. sous AA - Déficits - PAC", null],
        ["5SH", "BNC prof. hors CGA - Revenus exonérés - PAC ", null],
        ["5SI", "BNC prof. hors CGA - Bénéfices - PAC ", null],
        ["5SJ", "Locations meublées profess. hors CGA - Déficit - PAC", null],
        ["5SK", "BNC prof. hors CGA - Déficits - PAC ", null],
        ["5SL", "Jeunes créateurs BNC prof. - Abatt. 50 % - PAC", null],
        ["5SN", "BNC non prof. hors AA. - Bénéfices - Monsieur MARTIN", null],
        ["5SO", "BNC non prof. - Plus-values à 16 % - Monsieur MARTIN", null],
        ["5SP", "BNC non prof. hors AA - Déficits - Monsieur MARTIN", null],
        ["5SV", "Jeunes créateurs - BNC non prof. - Abatt. 50 % - Monsieur MARTIN", null],
        ["5SW", "Jeunes créateurs - BNC non prof. - Abatt. 50 % - Madame MARTIN", null],
        ["5SX", "Jeunes créateurs - BNC non prof. - Abatt. 50 % - PAC", null],
        ["5TA", "Auto-entrepreneur - BIC prof. - Activité de ventes - Monsieur MARTIN", null],
        ["5TB", "Auto-entrepreneur - BIC prof. - Prestations de services - Monsieur MARTIN", null],
        ["5TC", "Inventeurs : produits taxables à 16 % - Monsieur MARTIN", null],
        ["5TE", "Auto-entrepreneur - BNC prof. - Recettes brutes - Monsieur MARTIN", null],
        ["5TF", "Honoraires prospection commerc. sous AA exonérés - Monsieur MARTIN", null],
        ["5TH", "BNC non prof. régime micro - Revenus exonérés - Monsieur MARTIN ", null],
        ["5TI", "Honoraires prospection commerc. Hors AA exonérés - Monsieur MARTIN", null],
        ["5UA", "Auto-entrepreneur - BIC prof. - Activité de ventes - Madame MARTIN", null],
        ["5UB", "Auto-entrepreneur - BIC prof. - Prestations de services - Madame MARTIN", null],
        ["5UC", "Inventeurs : produits taxables à 16 % - Madame MARTIN", null],
        ["5UE", "Auto-entrepreneur - BNC prof. - Recettes brutes - Madame MARTIN", null],
        ["5UF", "Honoraires prospection commerc. Sous AA exonérés - Madame MARTIN", null],
        ["5UH", "BNC non prof. régime micro - Revenus exonérés - Madame MARTIN ", null],
        ["5UI", "Honoraires prospection commerc. hors AA exonérés - Madame MARTIN", null],
        ["5VA", "Auto-entrepreneur - BIC prof. - Activité de ventes - PAC ", null],
        ["5VB", "Auto-entrepreneur - BIC prof. - Prestations de services - PAC", null],
        ["5VC", "Inventeurs : produits taxables à 16 % - PAC", null],
        ["5VE", "Auto-entrepreneur - BNC prof. - Recettes brutes - PAC", null],
        ["5VF", "Honoraires prospection commerciale sous AA exonérés - PAC", null],
        ["5VH", "BNC non prof. régime micro - Revenus exonérés - PAC ", null],
        ["5VI", "Honoraires prospection commerciale hors AA exonérés - PAC", null],
        ["5XT", "BA au taux marginal sous CGA - Monsieur MARTIN", null],
        ["5XU", "BA au taux marginal sous CGA - Madame MARTIN", null],
        ["5XV", "BA au taux marginal hors CGA - Monsieur MARTIN", null],
        ["5XW", "BA au taux marginal hors CGA - Madame MARTIN", null]
    ];


    // Utilitaire: indexOf sur tableaux imbriqués
    function nestedIndexOf(arr, element) {
        for (var i = 0; i < arr.length; i++) {
            // This if statement depends on the format of your array
            if (arr[i][0] == element[0] && arr[i][1] == element[1]) {
                return i;
            }
        }
        return -1;
    }
}]);

// JQUERY
jQuery(document).ready(function() {
    var trimestr = 0; //desactivé par défault

    // ###  TABLEAU ACOMPTE REDUIT  ###
    // tableau gestion acomptes : masquage des mois du milieu pour lisibilité lorsque - de 1520px et que le tableau est mensuel
    function checkWidth() {
        if (trimestr === 0) {
            if (jQuery(window).width() < 2800) {
                jQuery("#acomptes td:nth-child(2),#acomptes td:nth-child(3),#acomptes td:nth-child(4),#acomptes td:nth-child(5),#acomptes td:nth-child(6),#acomptes td:nth-child(7),#acomptes th:nth-child(2),#acomptes th:nth-child(3),#acomptes th:nth-child(4),#acomptes th:nth-child(5),#acomptes th:nth-child(6),#acomptes th:nth-child(7)").addClass("separateur");
                if (jQuery("#plusColonnes").length === 0) {
                    jQuery("#btnAcomptes").prepend('<button id="plusColonnes" class="btn btn-default pull-left">Afficher plus de mois</button>');
                    initDeploy();
                }
            }
        }
    }
    // Execute on load
    checkWidth();
    // Bind event listener
    jQuery(window).resize(checkWidth);

    //click pour deployer les 12 mois
    function initDeploy() {
        jQuery("#plusColonnes, .separateur").on('click', function() {
            jQuery(".separateur").removeClass("separateur");
            jQuery("#plusColonnes").remove();
        });
    }
    initDeploy();

    // ###  COLORATION MOIS PASSÉS  ###
    function colorMois(nbMois) {
        var i = 1;
        for (i = 1; i <= nbMois; ++i) {
            jQuery("#acomptes td:nth-child(" + (i + 1) + "),#acomptes th:nth-child(" + (i + 1) + ")").addClass("hist");
        }
        jQuery(".hist:nth-child(" + i + ")").css({
            "border-right-color": "crimson"
        }); //coloration avec js en remplacement de la regle css nth-last-child
    }

    colorMois(2);

    // ###  TRIMESTRIALISATION  ###
    //activation de la trimestrialisation
    jQuery("#validTrim").click(function() {
        trimestr = 1;
        //modif du tableau a faire
        var total = $(total_acomptes_men).find('td:nth-last-child(2)').text();

        jQuery("#acomptes thead tr").replaceWith('<tr><th scope="col">Catégorie d\'acompte</th><th scope="col" title="Trimestre 1">Trimestre 1</th><th scope="col" title="Trimestre 2">Trimestre 2</th><th scope="col" title="Trimestre 3">Trimestre 3</th><th scope="col" title="Trimestre 4">Trimestre 4</th><th scope="col">Actions</th></tr>');
        jQuery('#acomptes > tbody  > tr').each(function() {
            var typAcompte = $(this).find('td:nth-child(1)').text();
            var actions = $(this).find('td:nth-last-child(1)').html();
            var valTrim = parseInt(total) / 4;

            jQuery(this).replaceWith('<tr><td>' + typAcompte + '</td><td>' + valTrim + '</td><td>' + valTrim + '</td><td>' + valTrim + '</td><td>' + valTrim + '</td><td>' + actions + '</td></tr>');

        });
        jQuery("#acomptes tbody tr:last-child").replaceWith('<tr><td>Total trimestriel</td><td>' + total + '</td><td>' + total + '</td><td>' + total + '</td><td>' + total + '</td><td></td></tr>');

        //retirer les masque colonnes pour les trimestres
        jQuery(".separateur").removeClass("separateur");
        jQuery("#plusColonnes").remove();
        //desactive le bouton
        jQuery('#trimestrialisation').attr('disabled', 'disabled');
        //colorie les trimestres passés
        colorMois(1);
        //ferme la modale
        jQuery("#optTrim").modal('hide');
    });
    //quitter la modale de trimestr
    $('#optTrim').on('hidden.bs.modal', function() {
        if (trimestr === 0) {
            //decoche
            jQuery('#trimestrialisation').attr('checked', false);
        }
    });


    // ###  REPORT ACOMPTE  ###
    //verif que le nombre de report maximal d'acompte n'est pas dépassé
    $("input[name='acpt_report']").change(function() {
        var maxAllowed;
        if (trimestr === 0) {
            maxAllowed = 3;
        } else {
            maxAllowed = 1;
        }
        var cnt = $("input[name='acpt_report']:checked").length;
        if (cnt > maxAllowed) {
            $(this).prop("checked", "");
            alert('Le maximum de reports possibles est de ' + maxAllowed + '.');
        }
    });
});

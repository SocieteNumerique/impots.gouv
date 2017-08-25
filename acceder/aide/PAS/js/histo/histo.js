
	$(function() {

		// series
		
			var modTaux =  [ 
			{ label: "Modification du taux", data: [
			[1496463600000, 15.71, "vous"], 
			[1506463600000, 16.45, "l'administration", "%"], 
			[1506563600000, 15.86, "vous", "%"], 
			[1506663600000, 14.93, "vous", "%"], 
			[1512063600000, 11.19, "l'administration", "%"], 
			[1516863600000, 11.67, "vous", "%"], 
			[1516963600000, 12.58, "vous", "%"], 
			[1525063600000, 11.47, "l'administration", "%"], 
			[1527163600000, 14.65, "vous", "%"], 
			[1527263600000, 17.71, "vous", "%"]
			], points: { symbol: "triangle" } }
			];

			var versEmploy =  [ 
			{ label: "Employeur 1", data: [
			[1500463600000, 334, "", "€"], 
			[1510563600000, 358, "", "€"], 
			[1520663600000, 358, "", "€"], 
			[1530863600000, 358, "", "€"], 
			],bars: { show: true },points:{show:false},lines:{show:false} },
			{ label: "Employeur 2", data: [
			[1500464600000, 104, "", "€"], 
			[1510564600000, 104, "", "€"], 
			[1520664600000, 205, "", "€"], 
			[1530864600000, 205, "", "€"], 
			],bars: { show: true },points:{show:false},lines:{show:false} }
			];
			
			var modacomptes =  [ 
			{ label: "Modification du montant d'un acompte", data: [
			[1496463600000, 1271, "vous", "€"], 
			[1506463600000, 1645, "l'administration", "€"], 
			[1506563600000, 1586, "vous", "€"], 
			[1506663600000, 1393, "vous", "€"], 
			[1512063600000, 1119, "l'administration", "€"], 
			[1516863600000, 1167, "vous", "€"], 
			[1516963600000, 1258, "vous", "€"], 
			[1525063600000, 1047, "l'administration", "€"], 
			[1527163600000, 1465, "vous", "€"], 
			], points: { symbol: "diamond"}, lines:{show:true}},
			{ label: "Prélévements des acomptes", data: [
			[1500463600000, 164, "", "€"], 
			[1510563600000, 158, "", "€"], 
			[1520663600000, 139, "", "€"], 
			[1530863600000, 116, "", "€"], 
			],bars: { show: true },points:{show:false},lines:{show:false} },
			{ label: "Incidents de prélevements", data: [
			[1496563600000, 127, "", "€"], 
			[1512033600000, 111, "", "€"], 
			[1525063600000, 104, "", "€"], 
			[1527263600000, 177, "", "€"]
			], points: { symbol: "cross" },lines:{show:false} }
			];
		
	var serieChoix = modTaux;
	var typeValeur = " %";
	
  //fx pour changer couleurs points --> ajouter des regles pour d'autres styles de points
  function raw(plot, ctx) {
    var data = plot.getData();
    var axes = plot.getAxes();
    var offset = plot.getPlotOffset();
    for (var i = 0; i < data.length; i++) {
        var series = data[i];
		var f = [];
        for (var j = 0; j < series.data.length; j++) {
            var d = (series.data[j]);
			if (d[2] == "vous"){
				f.push(d)
			};  
        };   
		
    }
	for (var u = 0; u < f.length; u++){
		var k = f[u];
		var x = offset.left + axes.xaxis.p2c(k[0]);
            var y = offset.top + axes.yaxis.p2c(k[1]);
            var r = 7;     //radius           
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x,y,r,0,Math.PI*2,true);
            ctx.closePath();            
            ctx.fillStyle = "#cc4444";
            ctx.fill();
		}
  }; 

	function euroFormatter(v, axis) {
		return v.toFixed(axis.tickDecimals) + typeValeur;
	}
  
		//definition des options du plot
		var options = {
			legend: {
				show: true
			},
			series: {
				bars: {
				 show: false,
				 barWidth: 86400000, // 1 jour en millisecondes
				 align: 'center'
				},
				lines: {
					show: true
				},
				points: {
					show: true,
					radius: 3
				}
			},
			colors: ["#0B5BC2","#70FF70","#FF7070"],
			grid: {
				hoverable: true
			},
			xaxis: {
				zoomRange: [null,null],
				mode: "time"
			},
			yaxis: {
				zoomRange: [0.1,3600000000],
				panRange: [0, null],
				tickFormatter: euroFormatter
			},
			zoom: {
				interactive: true
			},
			selection: {
				mode: "xy"
			},
			hooks: { draw  : [raw] } 
		};

		// init du plot a l'ouverture de la modale
		
		$('#histo').on('shown.bs.modal', function (e) {
		  var plot = $.plot("#placeholder", serieChoix, options);
		})		
		

		// fx de zoom 
		$("#placeholder").bind("plotselected", function (event, ranges) {
			// clamp the zooming to prevent eternal zoom
			if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
				ranges.xaxis.to = ranges.xaxis.from + 0.00001;
			}

			if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
				ranges.yaxis.to = ranges.yaxis.from + 0.00001;
			}

			// do the zooming
			plot = $.plot("#placeholder", serieChoix,
				$.extend(true, {}, options, {
					xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
					yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
				})
			);
		 var axes = plot.getAxes();
		 var min = axes.xaxis.min;
		});
	

	//convertir un timestamp unix en date
	function timeConverter(UNIX_timestamp){
	  var a = new Date(UNIX_timestamp);
	  var months = ['janvier','février','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','décembre'];
	  var year = a.getFullYear();
	  var month = months[a.getMonth()];
	  var date = a.getDate();
	  var hour = a.getHours();
	  var min = a.getMinutes();
	  var sec = a.getSeconds();
	  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
	  return time;
	}


	
	//Tooltip  							--> a revoir pour modale <--
    $("#placeholder").bind("plothover", function (event, pos, item) {
        $("#tooltip").remove();
        if (item) {
            var tooltip = "Valeur définie à : " + item.series.data[item.dataIndex][1] + " " + item.series.data[item.dataIndex][3] + "<br>par " + item.series.data[item.dataIndex][2] + "<br> le " + timeConverter(item.series.data[item.dataIndex][0]);
            
            $('<div id="tooltip">' + tooltip + '</div>')
                .css({
                    position: 'absolute',
                    display: 'none',
                    top: item.pageY + 5,
                    left: item.pageX + 5,
                    border: '1px solid #fdd',
                    padding: '2px',
                    'background-color': '#fee',
                    opacity: 0.80 })
                .appendTo("body").fadeIn(200);

            showTooltip(item.pageX, item.pageY, tooltip);
        }
    });
	
	//BOUTON
	
	//chx histo taux
	$("#taux").click(function () {
		serieChoix = modTaux;
		typeValeur = "%";
		$.plot("#placeholder", serieChoix, options);
	});

	//chx vers employeur
	$("#versEmploy").click(function () {
		serieChoix = versEmploy;
		typeValeur = " €";
		$.plot("#placeholder", serieChoix, options);
	});	
	
	//chx histo acomptes
	$("#acompte").click(function () {
		serieChoix = modacomptes;
		typeValeur = " €";
		$.plot("#placeholder", serieChoix, options);
	});	
	
	});
;(function () {
	
	'use strict';

	$(function(){

		L.mapbox.accessToken = 'pk.eyJ1IjoiaGFpbmdvNjM5NCIsImEiOiJjaXJlZWU3aWIwMDNoZzVua2M5ZW1scjVkIn0.uHPNq72hOdL6D1OpeGlQow';
		var info = document.getElementById('info');
		var listAparment = $("div#listApartment").data('apartment');
		var listFeature = [];
		$.each(listAparment, function (i, val) {
			var obj = JSON.parse(val);
            var feature = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [obj.location[1], obj.location[0]]
				},
				properties: {
					title: obj.name,
					description: obj.description,
                    image: obj.images,
                    owner: obj.owner.name,
                    price: obj.price,
                    id: obj.id,
					'marker-color': '#548cba',
                    'marker-size': 'large',
                    'marker-symbol': 'warehouse'
				}
			};
			listFeature.push(feature);
		});
        var map = L.mapbox.map('map', 'mapbox.streets');
        var myLayer = L.mapbox.featureLayer().addTo(map);
        map.setView([listFeature[0].geometry.coordinates[1],listFeature[0].geometry.coordinates[0]], 12);
        map.addControl(L.mapbox.geocoderControl('mapbox.places', {
            autocomplete: true
        }));
		var geoJson = {
			type: 'FeatureCollection',
			features: listFeature
		};

		myLayer.setGeoJSON(geoJson);

// Listen for individual marker clicks.
		myLayer.on('click',function(e) {
			// Force the popup closed.
			// e.layer.closePopup();
            map.panTo(e.layer.getLatLng());


			var feature = e.layer.feature;
            var slideshowContent = '';
            for(var i = 0; i < feature.properties.image.length; i++) {
                var img = '/upload/'+feature.properties.image[i];

                slideshowContent += '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                    '<img src="'+ img + '" style="width: 250px"/>' +
                    '</div>';
            }
			var content = '<div class="thumbnail popup" id="' + feature.properties.id + '">'+
                '<div class="slideshow">' +
                    slideshowContent +
                '</div>' +
                '<div class="caption">'+
                '<h3 class="lobster-font " style="color: #FBB448;">'+ feature.properties.title +'</h3>'+
                // '<p style="color: #0b0b0b">'+feature.properties.description+'</p>'+
                '<p class="cursive-font" style="color: #FBB448;">'+'$'+feature.properties.price+'</p>'+
                '<a href="/apartment/'+feature.properties.id+'" class="btn btn-primary white" role="button">Detail</a></p>'+
                '</div>'+
                '<div class="cycle">' +
                '<a href="#" class="prev">&laquo; Previous</a>' +
                '<a href="#" class="next">Next &raquo;</a>' +
                '</div>'+
                '</div>';

			info.innerHTML = content;
		});

        $('#map').on('click', '.popup .cycle a', function() {
            var $slideshow = $('.slideshow'),
                $newSlide;

            if ($(this).hasClass('prev')) {
                $newSlide = $slideshow.find('.active').prev();
                if ($newSlide.index() < 0) {
                    $newSlide = $('.image').last();
                }
            } else {
                $newSlide = $slideshow.find('.active').next();
                if ($newSlide.index() < 0) {
                    $newSlide = $('.image').first();
                }
            }

            $slideshow.find('.active').removeClass('active').hide();
            $newSlide.addClass('active').show();
            return false;
        });

// Clear the tooltip when map is clicked.
		map.on('move', empty);

// Trigger empty contents when the script
// has loaded on the page.
		empty();

		function empty() {
			info.innerHTML = '<div><strong>Click a marker</strong></div>';
		}
	});


}());
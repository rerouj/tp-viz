// Code de la cartographie : Cartographie des lieux recensés dans le corpus numérique des émissions de Temps Présent. 
// Cette cartographie est écrit en D3.js et avec l'API Mapboxgl. 
// Les résultats sont commentés dans le mémoire sous le chapitre 5.1.


mapboxgl.accessToken = 'pk.eyJ1IjoicmVyb3VqIiwiYSI6ImNrOWNqZDVneTA1ZnMzbm5rbTc3YXYwb28ifQ.zBj42crqv1VAq50SAs6buQ'

d3.json('http://localhost:3000/location/geo_json')
    .then((data)=>{

        country_data = data.filter((doc)=>{
            return doc.properties.type == 'country'
        })
        locality_data = data.filter((doc)=>{
            return doc.properties.type != 'country'
        })
        js = {
            "type": "FeatureCollection",
            "features": locality_data
        }
        country_js = {
            "type": "FeatureCollection",
            "features": country_data
        }

        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [8.227511999999999, 46.818188],
            zoom: 0.5
            });

        map.on('load', function() {

            map.addSource('points', {
            'type': 'geojson',
            'data': js
            });

            map.addLayer({
                'id': 'coordinates',
                'type': 'circle',
                'source': 'points',
                'layout': {
                    'visibility': 'none'
                },
                'paint':{
                    "circle-color": "#0080FF",
                    "circle-radius": 2,
                    "circle-opacity": 0.5
                }
            });

            map.on('zoom', 'coordinates', (e)=>{
                var treshold = 4;
                var zl = map.getZoom()
                if(zl >= treshold){
                    map.setPaintProperty('coordinates', 'circle-radius', zl/1.4)
                }else if(zl < treshold ){
                    map.setPaintProperty('coordinates', 'circle-radius', 2)
                }
            })

            map.on('click', 'coordinates', function(e) {

                //use jquery for adding the gallery
                var name = e.features[0].properties.name;
                var alias = e.features[0].properties.alias;
                var wiki = e.features[0].properties.wiki;
                var show_infos = JSON.parse(e.features[0].properties.show_infos);

                var show_list = document.createElement("ul")
                show_infos.forEach((item, index)=>{
                    var show_list_el = document.createElement("li");
                    var el_link = document.createElement("a");
                    el_link.setAttribute("href", item.mediaURL);
                    el_link.setAttribute("target", "_blank");
                    el_link.innerText = item.title;
                    show_list_el.appendChild(el_link);
                    show_list.appendChild(show_list_el);
                })

                var box = document.createElement("div");
                var place_name = document.createElement("h1");
                var wiki_paraph = document.createElement("p");
                var liste_title = document.createElement("p");
                var list_container = document.createElement("div");
                
                list_container.setAttribute("class", "list-container");
                list_container.appendChild(show_list);

                liste_title.innerText = "Liste des documentaires :"
                wiki_paraph.innerHTML = wiki.length > 500 ? `${wiki.slice(0, 500)}...` : wiki
                place_name.innerHTML = alias == name ? name : `${name} (${alias})`;
                place_name.setAttribute("class", "gallery-place-name")
                box.setAttribute("class", "gallery");
                box.appendChild(place_name);
                box.appendChild(wiki_paraph);
                box.appendChild(liste_title);
                box.appendChild(list_container);
                $("#map").prepend(box);
                $(".gallery").on("click", ()=>{
                    $(".gallery").remove()
                })
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'coordinates', function() {
                map.getCanvas().style.cursor = 'pointer';
                });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'coordinates', function() {
                map.getCanvas().style.cursor = '';
                });

            map.addSource('countrys', {
                'type': 'geojson',
                'data': country_js
            })

            map.addLayer({
                'id': 'country_coordinates',
                'type': 'circle',
                'source': 'countrys',
                'layout': {
                    'visibility': 'visible'
                },
                'paint':{
                    "circle-color": "#CC00CC",
                    "circle-radius": 4,
                    "circle-opacity": 0.5
                }
            });

            map.on('zoom', 'country_coordinates', (e)=>{
                var treshold = 4;
                var zl = map.getZoom()
                if(zl >= treshold){
                    map.setPaintProperty('country_coordinates', 'circle-radius', 5+zl)
                }else if(zl < treshold ){
                    map.setPaintProperty('country_coordinates', 'circle-radius', 4)
                }
            })

            map.on('click', 'country_coordinates', function(e) {

                //use jquery for adding the gallery
                var name = e.features[0].properties.name;
                var alias = e.features[0].properties.alias;
                var wiki = e.features[0].properties.wiki;
                var show_infos = JSON.parse(e.features[0].properties.show_infos);

                var show_list = document.createElement("ul")
                show_infos.forEach((item, index)=>{
                    var show_list_el = document.createElement("li");
                    var el_link = document.createElement("a");
                    el_link.setAttribute("href", item.mediaURL);
                    el_link.setAttribute("target", "_blank");
                    el_link.innerText = item.title;
                    show_list_el.appendChild(el_link);
                    show_list.appendChild(show_list_el);
                })

                var box = document.createElement("div");
                var place_name = document.createElement("h1");
                var wiki_paraph = document.createElement("p");
                var liste_title = document.createElement("p");
                var list_container = document.createElement("div");
                
                list_container.setAttribute("class", "list-container");
                list_container.appendChild(show_list);

                liste_title.innerText = "Liste des documentaires :"
                wiki_paraph.innerHTML = wiki.length > 500 ? `${wiki.slice(0, 500)}...` : wiki
                place_name.innerHTML = alias == name ? name : `${name} (${alias})`;
                place_name.setAttribute("class", "gallery-place-name")
                box.setAttribute("class", "gallery");
                box.appendChild(place_name);
                box.appendChild(wiki_paraph);
                box.appendChild(liste_title);
                box.appendChild(list_container);
                $("#map").prepend(box);
                $(".gallery").on("click", ()=>{
                    $(".gallery").remove()
                })
            });
            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'country_coordinates', function() {
                map.getCanvas().style.cursor = 'pointer';
                });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'country_coordinates', function() {
                map.getCanvas().style.cursor = '';
                });
            })
            
            var checkboxes_form = document.createElement("form");
            checkboxes_form.setAttribute("class", 'checkboxes_form');

            var country_button = document.createElement("input");
            country_button.setAttribute("type", 'checkbox');
            country_button.setAttribute("id", "country_button");

            var locality_button = document.createElement("input");
            locality_button.setAttribute("type", 'checkbox');
            locality_button.setAttribute("id", "locality_button");

            var label_a = document.createElement("label");
            label_a.setAttribute("class", "label_a")
            label_a.setAttribute("for", 'country_button');
            label_a.innerText = "pays";

            var label_b = document.createElement("label");
            label_b.setAttribute("class", "label_b")
            label_b.setAttribute("for", 'locality_button');
            label_b.innerText = "autres";
            buttons = [locality_button, country_button]
            buttons.forEach((b)=>{
                b.id == 'country_button' ? b.defaultChecked = true : b.defaultChecked = false
                b.onclick = ()=>{
                    if (b.checked){
                        b.id == 'country_button' ? map.setLayoutProperty('country_coordinates', 'visibility', 'visible') : map.setLayoutProperty('coordinates', 'visibility', 'visible')
                    } else {
                        b.id == 'country_button' ? map.setLayoutProperty('country_coordinates', 'visibility', 'none') : map.setLayoutProperty('coordinates', 'visibility', 'none')
                    }
                }
            })

            checkboxes_form.appendChild(country_button);
            checkboxes_form.appendChild(label_a);
            checkboxes_form.appendChild(locality_button)
            checkboxes_form.appendChild(label_b);

            $("#map").prepend(checkboxes_form);
        })

//map initialization
const map = L.map('map',{
	zoomControl: true,
	maxZoom:14,
				});

map.setView([50.2, 19.93],8);		
//map.setMaxBounds(map.getBounds());
let layerGeojson;

const gminyUrl="gminyTiles/{z}/{x}/{y}.png";
const gminyTiles= L.tileLayer(`${gminyUrl}`,{maxNativeZoom:12,maxZoom:15,minZoom:8,transparent:true}).addTo(map);

const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
	maxZoom: 20,
	subdomains:['mt0','mt1','mt2','mt3'],
	attribution: '&copy; <a href="https://www.google.com/intl/pl_pl/help/terms_maps/">Dane mapy Google 2024</a>'
	});			
const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
	maxZoom: 22,
	subdomains:['mt0','mt1','mt2','mt3'],
	attribution: '&copy; <a href="https://www.google.com/intl/pl_pl/help/terms_maps/">Dane mapy Google 2024</a>'
	});
	
const openStreet=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const bezTla = L.tileLayer('',{maxZoom: 20});	

const tmceIcon = L.icon({
	iconUrl: 'css/images/logoTMCE min.png',
	iconSize: [20, 40],
	iconAnchor: [10, 10],
	popupAnchor: [0, 0],
   	});
		
const tmceMarker = L.marker([50.02658, 19.929859], {
		icon: tmceIcon}).addTo(map).bindPopup("<h3 style='margin:8px 0px'>Nie ma tutaj projektów niewykonalnych:)</h3> <center><img src='./css/images/tmce_budynek.jpg'/><center>")
	
const baseLayers = {
	"Google zdjęcia": googleHybrid,
	"Google mapa": googleStreets,
	"OpenStreet": openStreet,
	"Brak": bezTla};
const overlayMaps= {
	"Pinezka TMCE": tmceMarker,
	"<span style=' font-size:14px'>Granica gmin</span><br><img src='css/images/gminy_TMCE.png' align=top style='margin: 3px 3px 3px 20px'>TMCE</img><br><img src='css/images/gminy_pozostale.png'  align=top style='margin: 3px 3px 3px 20px'>Pozostałe</img>":gminyTiles
	};
	
const layerControl = L.control.layers(baseLayers, overlayMaps, {collapsed : false}).addTo(map);

//komponenty skali mapy
L.control.scale({
  imperial: false,
	}).addTo(map);

// kontroler warstw on/off
const buttonPokaz=document.querySelector(".pokaz");
const zawartoscMapy=document.querySelector(".leaflet-control-layers");
buttonPokaz.addEventListener("click", ()=>{
	(layerGeojson) ? layerGeojson.remove():null;
	buttonPokaz.classList.toggle("ukryjLayers");
	zawartoscMapy.classList.toggle("ukryj-leaflet-control");
	if(buttonPokaz.classList.contains("ukryjLayers")){
		buttonPokaz.style.backgroundColor="salmon";
	}else{
		buttonPokaz.style.backgroundColor="#009578";
	};
});

//Popup for gminy GeoJson
let layerGeojsonGminy;
async function renderGminyGeoJson() {
  const url = 'GeoJsonData/gminy.geojson';
  const response = await fetch(url);
  const gminy = await response.json();
	const gminyAtributtes = gminy.features.map(feature => feature.properties);
  layerGeojsonGminy=L.geoJson(gminy,{
		onEachFeature: function(feature,layer){
			layer.bindPopup(`<b>Powiat:</b> ${feature.properties.POW}<br><b>Gmina: </b>${feature.properties.JPT_NAZWA_}<br><b>Ilość lamp: </b><span style="color:red"><b>${feature.properties.ILOSC}</span>`)
		},	
		style: {color:"transparent",opacity:0}
}).addTo(map);} 
renderGminyGeoJson();

//Obsługa układów współrzędnych
map.on("mousemove", function (e) {
	const markerPlaceWGS84 = document.querySelector(".wgs84");
	const markerPlacePozostale = document.querySelector(".pozostaleWSP");
	const crs1992proj = "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
	let crs1992 = proj4(crs1992proj, [e.latlng.lng, e.latlng.lat]);
	const crs2000s6proj = "+proj=tmerc +lat_0=0 +lon_0=18 +k=0.999923 +x_0=6500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
	let crs2000s6 = proj4(crs2000s6proj, [e.latlng.lng, e.latlng.lat]);
	const crs2000s7proj = "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.999923 +x_0=7500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
	let crs2000s7 = proj4(crs2000s7proj, [e.latlng.lng, e.latlng.lat]);
	const crs1965s1proj = "+proj=sterea +lat_0=50.625 +lon_0=21.08333333333333 +k=0.9998 +x_0=4637000 +y_0=5467000 +ellps=krass +towgs84=33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84 +units=m +no_defs";
	let crs1965s1 = proj4(crs1965s1proj, [e.latlng.lng, e.latlng.lat]);
	let x = e.latlng.lat;
	let y = e.latlng.lng;
	let selectedUkladEl = document.querySelector(".js-wybierzUklad").value;
	if (selectedUkladEl == 'PUWG1992') {
		markerPlacePozostale.innerHTML = crs1992[0].toFixed(2) + ', ' + crs1992[1].toFixed(2)
	}
	else if (selectedUkladEl == '2000s6') {
		markerPlacePozostale.innerHTML = crs2000s6[0].toFixed(2) + ',  ' + crs2000s6[1].toFixed(2)
	}
	else if (selectedUkladEl == '2000s7') {
		markerPlacePozostale.innerHTML = crs2000s7[0].toFixed(2) + ',  ' + crs2000s7[1].toFixed(2)
	}
	else if (selectedUkladEl == '1965s1') {
		markerPlacePozostale.innerHTML = crs1965s1[0].toFixed(2) + ',  ' + crs1965s1[1].toFixed(2)
	}
	markerPlaceWGS84.innerHTML = '<span style="font-weight:700">WGS 84	</span>' + '<span style="font-weight:700">X: </span>' + x.toFixed(6) + '<span style="font-weight:700"> Y: </span>' + y.toFixed(6)
/*'<span style="font-weight:700">PUWG1992: </span>'+crs1992[0].toFixed(2)+',   '+crs1992[1].toFixed(2);*/	
});

// Stop "click" na mapie dla contenerów:
const headerEl=document.getElementById("header");
const leftpanelEl=document.getElementById("leftpanel");
const szukajBtnEl=document.getElementById("szukaj");
const coordinatesEl=document.querySelector(".js-marker-position");
console.log(coordinatesEl);


L.DomEvent.disableScrollPropagation(zawartoscMapy); 
L.DomEvent.disableClickPropagation(headerEl);
L.DomEvent.disableClickPropagation(leftpanelEl);
L.DomEvent.on(leftpanelEl, 'click', function (ev) {
    L.DomEvent.stopPropagation(ev);
});
L.DomEvent.disableClickPropagation(szukajBtnEl);
L.DomEvent.disableClickPropagation(coordinatesEl);

//Panel "Szukaj"- szukaj pwoiat/gmine
const szukajEl=document.querySelector(".js-szukaj");
szukajEl.addEventListener("click",()=>{
	(layerGeojson) ? layerGeojson.remove():null;
	if(leftpanelEl.classList.contains("ukryj")){
	leftpanelEl.classList.remove("ukryj")
	szukajEl.classList.add("on")}
	else {leftpanelEl.classList.add("ukryj")
			szukajEl.classList.remove("on")}
});

//PRG wyszukiwarka w oparciu o GeoJson
const akceptujGminaEl=document.querySelector("div.gmina > button.akceptuj");
const akceptujObrebEl=document.querySelector("div.obreb > button.akceptuj");
//akceptujGminaEl.addEventListener("click", fitSelectedGmina);
//akceptujObrebEl.addEventListener("click", fitSelectedObreb);
const selectElGmina=document.querySelector("#js-gmina");
const selectELPowiat=document.querySelector("#js-powiat");

selectELPowiat.addEventListener("change", ()=>{
	(layerGeojson) ? layerGeojson.remove():null;
	selectElGmina.removeAttribute("disabled");
	generateGminaOptionsHtml();

})

async function generatePowiatOptionsHtml(){
	let urlGeoJson='GeoJsonData/powiaty_etykiety.geojson'
	const response= await fetch(urlGeoJson);
	const data= await response.json();
	const powiatyGeoJson=data.features.map((feature)=>feature.properties);
	console.log(powiatyGeoJson);
	let powiatOptionsHtml='<option>Wybierz powiat</option>';
	const selectELPowiat= document.querySelector("#js-powiat");
	for(const item of powiatyGeoJson){
		item.TMCE==='TAK'?powiatOptionsHtml+=`<option value="${item.KOD_POW}">${item.KOD_POW} ${item.JPT_NAZWA_}</option>`:null;
	};
	selectELPowiat.innerHTML=powiatOptionsHtml;
	};

	async function generateGminaOptionsHtml(){
		const selectedPowiat=document.querySelector('#js-powiat').value;
		console.log(selectedPowiat);
		
		const selectELGmina= document.querySelector('#js-gmina');
		let gminyOptionsHtml='<option>Wybierz gminę TMCE</option>';
		const urlGeoJsonGmina='GeoJsonData/gminy_etykiety.geojson';
		const response= await fetch(urlGeoJsonGmina);
		const data= await response.json();
		console.log(data);
		const gminyGeoJson=data.features.map((feature)=>feature.properties);
		console.log(gminyGeoJson);
		
		for(const item of gminyGeoJson){
			item.KOD_POW==selectedPowiat?gminyOptionsHtml+=`<option value="${item.JPT_KOD_JE}">${item.JPT_NAZWA_}</option>`:null;
		};
				selectELGmina.innerHTML=gminyOptionsHtml;
					}






	generatePowiatOptionsHtml();



// -----------------modul OPISOWKA------------------------
const btnModulOpisowkaOn=document.getElementById("opisowka");
const btnModulMapaOn=document.getElementById("powrot");
const modulMapa=document.getElementById("map");
const modulOpisowka=document.getElementById("grid");
btnModulOpisowkaOn.addEventListener("click",modulOpisowkaOn);
btnModulMapaOn.addEventListener("click",modulOpisowkaOf)

function modulOpisowkaOn(){
	(layerGeojson) ? layerGeojson.remove():null;
	modulMapa.style.visibility="hidden";
	modulOpisowka.style.display="block";
	//zabijTabeleProstokat();
}
function modulOpisowkaOf(){
	modulMapa.style.visibility="visible";
	modulOpisowka.style.display="none";
}

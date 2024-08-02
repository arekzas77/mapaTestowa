//map initialization
const map = L.map('map',{
	zoomControl: true,
	maxZoom:14
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

/*async function testGeojson(){
	const response=await fetch("GeoJsonData/wojewodztwa.geojson");
	console.log(response);
	const data=await response.json();
	const layerGeoJson=L.geoJson(data,{style:{color:"gold"}}).addTo(map);
	console.log(data);
	map.fitBounds(layerGeoJson.getBounds())
}*/

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

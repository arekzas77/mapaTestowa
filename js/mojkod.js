//map initialization
const map = L.map('map',{
	zoomControl: true,
	maxZoom:12
				});

map.setView([50.2, 19.93],8);		
map.setMaxBounds(map.getBounds());

const gminyUrl="gminyTiles/{z}/{x}/{y}.png";

const gminyTiles= L.tileLayer(`${gminyUrl}`,{maxZoom:12,minZoom:8,transparent:true}).addTo(map);

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
		icon: tmceIcon}).addTo(map).bindPopup("<h3>Już za niedługo to będzie najlepszy portal mapowy na świecie;)</h3> <center><img src='./css/images/champions2.jpg'/><center>")
	
const baseLayers = {
	"Google zdjęcia": googleHybrid,
	"Google mapa": googleStreets,
	"OpenStreet": openStreet,
	"Brak": bezTla};
const overlayMaps= {
	"Pinezka TMCE": tmceMarker,
	"Granica gmin": gminyTiles
	};
	
const layerControl = L.control.layers(baseLayers, overlayMaps, {collapsed : false}).addTo(map);


// kontroler warstw on/off
const buttonPokaz=document.querySelector(".pokaz");
const zawartoscMapy=document.querySelector(".leaflet-control-layers");
buttonPokaz.addEventListener("click", ()=>{
	buttonPokaz.classList.toggle("ukryjLayers");
	zawartoscMapy.classList.toggle("ukryj-leaflet-control");
	if(buttonPokaz.classList.contains("ukryjLayers")){
		buttonPokaz.style.backgroundColor="salmon";
	}else{
		buttonPokaz.style.backgroundColor="#009578";
	};
});

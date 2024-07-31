//map initialization
const map = L.map('map',{
	zoomControl: true,
	maxZoom:19
				});

map.setView([50.2, 19.93],8);		
map.setMaxBounds(map.getBounds());

const gminyUrl="gminyTiles/{z}/{x}/{y}.png";

const gminyTiles= L.tileLayer(`${gminyUrl}`,{maxZoom:12,minZoom:8,transparent:true, opacity:0.8}).addTo(map);

const openStreet=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 20,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const bezTla = L.tileLayer('',{maxZoom: 20});	

const tmceIcon = L.icon({
	iconUrl: 'css/images/logoTMCE min.png',
	iconSize: [50, 50],
	iconAnchor: [22, 94],
	popupAnchor: [0, -94],
   	});
		
const tmceMarker = L.marker([50.02658, 19.929859], {
		icon: tmceIcon}).addTo(map).bindPopup("<h3>Już za niedługo to będzie najlepszy portal mapowy na świecie;)</h3> <center><img src='./css/images/champions2.jpg'/><center>")
	
const baseLayers = {
		"OpenStreet": openStreet,
		"Brak": bezTla};
const overlayMaps= {
	"Pinezka TMCE": tmceMarker,
	"Granica gmin": gminyTiles
	};
	
const layerControl = L.control.layers(baseLayers, overlayMaps, {collapsed : false}).addTo(map);

const selectedEl=document.getElementById("wybierz-warstwe-opisowka");
const buttonRaportEl=document.querySelector(".raport");
const buttonZblizEl=document.getElementById("zbliz-do");
selectedEl.addEventListener("change",generujRaport);
buttonZblizEl.addEventListener("click", GetSelectedData);

function generujRaport(){
  console.log(selectedEl.value);
if(selectedEl.value=='wojewodztwa'){
      renderWojewodztwa();}
else if(selectedEl.value=='powiaty'){
      renderPowiaty();}
else if(selectedEl.value=='gminy'){
  console.log(selectedEl.value);
      renderGminy();}  
};


//define data array
const tabledata = [
  {id:1, JPT_KOD_JE:"12",  JPT_NAZWA_:"małopolskie"},
  {id:2, JPT_KOD_JE:"24",  JPT_NAZWA_:"śląskie"},  
];

const table = new Tabulator("#example-table", {
  data:tabledata,           //load row data from array
  layout:"fitColumns",      //fit columns to width of table
  responsiveLayout:"hide",  //hide columns that don't fit on the table
  downloadRowRange:"all",
  addRowPos:"top",          //when adding a new row, add it to the top of the table
  history:true,             //allow undo and redo actions on the table
  pagination:"true",       //paginate the data
  locale:"pl",
  langs:{
      "pl":{
          "pagination":{
            "page_size":"Rozmiar:", //label for the page size select element
              "page_title":"Show Page",//tooltip text for the numeric page button, appears in front of the page number (eg. "Show Page" will result in a tool tip of "Show Page 1" on the page 1 button)
              "first":"Pierwszy", //text for the first page button
              "first_title":"Pierwsza strona", //tooltip text for the first page button
              "last":"Ostatni",
              "last_title":"Ostatnia strona",
              "prev":"Poprzedni",
              "prev_title":"Poprzednia strona",
              "next":"Następny",
              "next_title":"Następna strona",
              "all":"All",
              "counter":{
                  "showing": "Wyświetlono",
                  "of": "z",
                  "rows": "wierszy",
                  "pages": "pages",
              }
          },           
          }   
  },
  
  paginationSize:15,
  paginationSizeSelector:[15, 25,50, 75, 100],         //allow 7 rows per page of data
  paginationCounter:"rows", //display count of paginated rows in footer
  movableColumns:true,      //allow column order to be changed
  selectable:true,
  initialSort:[             //set the initial sort order of the data
      {column:"name", dir:"asc"},
  ],
  columnDefaults:{
      tooltip:true,         //show tool tips on cells
  },
  columns:[                 //define the table columns
      {title:"TERYT", field:"JPT_KOD_JE", headerFilter:"input"},
      {title:"WOJEWÓDZTWO", field:"JPT_NAZWA_",  headerFilter:"input"},
     
  ],
});

function renderWojewodztwa(){
  columnsWojewodztwa=[{title:"TERYT", field:"JPT_KOD_JE", headerFilter:"input"},
  {title:"WOJEWÓDZTWO", field:"JPT_NAZWA_",  headerFilter:"input"},
  ];
  table.setColumns(columnsWojewodztwa);
  table.setData(tabledata)
}
async function renderPowiaty(){
  preloader.style.zIndex= "12010";
  const url='GeoJsonData/powiaty_etykiety.geojson';
  const response=await fetch(url);
  const powiaty=await response.json();
  console.log(powiaty);
  let powiatyGeoserver=powiaty.features.map(feature=>feature.properties);
  console.log(powiatyGeoserver);
  const columnsPowiaty=[
      {title:"TERYT", field:"KOD_POW",headerFilter:"input"},
      {title:"POWIAT", field:"JPT_NAZWA_",headerFilter:"input"},
      {title:"KOD_WOJ", field:"KOD_WOJ",headerFilter:"input"},
      {title:"WOJEWÓDZTWO", field:"WOJ",headerFilter:"input"},    
      {title:"TMCE", field:"TMCE",headerFilter:"input"}
          ];
  preloader.style.zIndex= "-2";
  table.setColumns(columnsPowiaty);
  table.setData(powiatyGeoserver);
  table.setLocale("pl");
};

async function renderGminy() {
  preloader.style.zIndex = "12010";
  const filter='TAK'
  const url = 'GeoJsonData/gminy_etykiety.geojson';
  const response = await fetch(url);
  const gminy = await response.json();
  const gminyGeoJson = gminy.features.map(feature => feature.properties);
  const gminyTmce=gminyGeoJson.filter((item)=>item.TMCE=='TAK');
  const columnsGminy = [
      { title: "TERYT", field: "JPT_KOD_JE", headerFilter: "input" },
      { title: "GMINA", field: "JPT_NAZWA_", headerFilter: "input" },
      { title: "POWIAT", field: "POW", headerFilter: "input" },
      { title: "WOJEWODZTWO", field: "WOJ", headerFilter: "input" },
      { title: "TMCE", field: "TMCE", headerFilter: "input" },
      { title: "ILOŚĆ", field: "ILOSC", headerFilter: "input" }    
  ];
  preloader.style.zIndex = "-2";
  table.setColumns(columnsGminy);
  table.setData(gminyTmce);
};

function GetSelectedData(){ 
  let selectedLayerGrid=document.getElementById("wybierz-warstwe-opisowka").value;
  console.log(selectedLayerGrid);
  let cqlFilter='';
  let selectedData = table.getSelectedData();
  preloader.style.zIndex= "12010";
  console.log(preloader);
  console.log(selectedData);
  let str='';
  for (const element of selectedData){
      if(selectedLayerGrid==='wojewodztwa'){
          str+=`${element.JPT_KOD_JE},`;
      }
      else if(selectedLayerGrid==='powiaty'){
          str+=`${element.KOD_POW},`;
       } 
      else if(selectedLayerGrid==='gminy'){
          str+=`${element.JPT_KOD_JE},`;
       } 
      else {
       str+=`${element.TERYT},`;
       }       
  } 
  let idSelected=str.slice(0,-1);
  console.log(idSelected);
  if(selectedLayerGrid==='wojewodztwa'){
      cqlFilter=`JPT_KOD_JE%20in%20${idSelected}`
  }
  else if(selectedLayerGrid==='powiaty'){
      cqlFilter=`KOD_POW%20in%20${idSelected}`
  }
  else if(selectedLayerGrid==='gminy'){
      cqlFilter=`JPT_KOD_JE%20in%20${idSelected}`
  }

  let urlGeoJson=`GeoJsonData/${selectedLayerGrid}.geojson`;
  $.getJSON(urlGeoJson,idSelected).then((res)=>{
      preloader.style.zIndex= "-2";
      console.log(idSelected);
      console.log(res);
      let data;
      for(const item of res.features){
        console.log(item.properties.JPT_KOD_JE);
        if(item.properties.JPT_KOD_JE==idSelected){
          data=item;
          console.log(data)}
        }
      
      console.log(res.features[0].properties.JPT_KOD_JE);
      console.log(data);
      
      layerGeojson=L.geoJson(data,{
          style: {color: "gold"}
      }).bindPopup(`<h4>${data.properties.JPT_NAZWA_}<h4><center><center>`).addTo(map);})
      .then(()=>{
          map.fitBounds(layerGeojson.getBounds());
          modulOpisowkaOf()})};

table.on("rowSelectionChanged", function(data, rows, selected, deselected){
  console.log(rows.length);
  if(rows.length>0){
      console.log("jest");
      buttonZblizEl.removeAttribute("disabled", "true");
  buttonZblizEl.classList.remove("inactive");
  }
  else{ buttonZblizEl.setAttribute("disabled", "true");
  buttonZblizEl.classList.add("inactive");
  }
});


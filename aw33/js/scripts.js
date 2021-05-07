/*
Javascript components developed by Aud Kristin Samuelsen
If you use any of this, please reference me.
*/

/*Global Varaibales Start*/

var openBoxId = "";
var openBoxImg = "";
var openMenuId = "";
var openMenuClass = "";
var openMenuSource = "";
var showClass = "";
var oldOpenMenuClass = "";
var openMenuProtect = "dummy";
var pathName = "";
var storeInnerHtml = "";
var tempInnerHtml = "";
const apodBaseurl = "https://api.nasa.gov/planetary/apod/";
const nasaApikey = "api_key=AeYR7Zhnyd52Vcv92DlLSXM6z3S4UJLySw7pgafb";
var launchModal = document.getElementById("launchmodal");

/*Global Varaibales End*/

function displayMessage(messageClass,message) {
  /*returns html combined by messageClass and message
  Useful for displaying error messages or a simple progress bar
  usage example : someObject.innerHTML = displayMessage("wait","Please\xa0wait");*/

  return `<div class="${messageClass}">${message}</div>`;
}

function InsertModule(moduleId,fileName) {
  /*Inserts html file into existing inner html.
  Used to load templates for header, footer, banner i.e.
  usage example:  InsertModule("header-template","header.html");*/

  fetch(fileName)
  .then(data => data.text())
  .then(html => document.getElementById(moduleId).innerHTML = html);
}

function menuClick(menuId,newMenuClass,menuClass,menuSource) {
  /*Either show or hide (menu) object when menu clicked
  menuId : unike id for object to toggle
  newMenuClass : class to add to object
  menuClass : class that identifies the object
  menuSource: class that identifies the menu clicked
  usage example : <span onclick="menuClick('hammenu','showmenu','navmenu','hamburger')" class="menuicon hamburger"></span>
  */
  if ((menuId != openMenuId) && (openMenuId !="")) {
    /* check if other meny is open, then close it*/
    if (document.getElementById(openMenuId).classList.contains(showClass)) {
      document.getElementById(openMenuId).classList.remove(showClass);
    }
  }
  
  /*Toggle objekt on/off */
  document.getElementById(menuId).classList.toggle(newMenuClass);

  /*store values for later use to clean up menues */
  oldOpenMenuClass = openMenuClass;
  openMenuId = menuId;
  openMenuClass = menuClass;
  openMenuSource = menuSource;
  showClass = newMenuClass;
  
}

function removeMenu () {
  /* function to remove menu when clicket outside menu*/
  window.onclick = function(event) {
    if (openMenuId != "") {
      if (!(event.target.matches('.'+openMenuClass) || event.target.matches('.'+openMenuSource) || event.target.matches('.'+openMenuProtect) ) ) {
        if (document.getElementById(openMenuId).classList.contains(showClass)) {
          document.getElementById(openMenuId).classList.remove(showClass);
        }
      } 
    }
    if (openBoxId != "") {
      if (!(event.target.matches('img.'+openBoxImg))) {
        document.getElementById(openBoxId).style = "none";
        openBoxId = "";
      }
    }
  }
}


/*Function to show object with ID = formid. 
If coordinates (x,y) and img are sent in it will be used to modify form content and placement */
function formPopUp(formId,x,y,img) {
  var wWidth = document.documentElement.clientWidth;
  var wHeigth = document.documentElement.clientHeight;
  
  if (typeof img != "undefined") {
    if (tempInnerHtml!="") {
      document.getElementById(formId).innerHTML = tempInnerHtml;
    }
    tempInnerHtml = document.getElementById(formId).innerHTML;
    document.getElementById(formId).innerHTML = `<img class="img_button" src="${img}" alt="picture of week offer"></img>${tempInnerHtml}`;
  }

  document.getElementById(formId).style.display = "block";
  var yOfset = document.getElementById(formId).offsetHeight;
  var xOfset = document.getElementById(formId).offsetWidth/2;
  var xx = 0;

  if (wWidth > 1024 ) {
      xx=(wWidth-1024)/2;
  }
  if (x + xOfset >= wWidth) {
        x = wWidth - (2 * xOfset) - 5;
  }
  else if (x - xOfset <= 0) {
    x = 5;
  }
  else {
     x = x - xOfset;
  }

  x=x-xx;

  y = y- (yOfset);

  document.getElementById(formId).style.left = x+"px";
  document.getElementById(formId).style.top = y+"px";
}

/*function to close element with ID=formid*/
function formClose(formId) {
  document.getElementById(formId).style.display = "none";
}

/*function to close on submit */
function submitClose(formId) {
  document.getElementById(formId).innerHTML = storeInnerHtml;
  document.getElementById(formId).style.display = "none";
}

function checkEmailFormat (email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
}


/* function to check subscribe form on submit.
If email adress OK then replace innerhtml with success message*/
function subscribeSubmit() {
  var formOk = true;

  if  (!checkEmailFormat (document.forms["submitForm"]["email"].value)) {
    document.getElementById("emailError").style.display = "block";
    formOk = false;
  }
  else {
      document.getElementById("emailError").style.display = "none";
      storeInnerHtml = document.getElementById("subscribe").innerHTML;
      var email = document.forms["submitForm"]["email"].value;
      document.getElementById("subscribe").innerHTML = 
      `<div class="subscribe_text">Thank you for subscribing. An email with discount code was sent to</div>
      <div class="subscribe_text">${email}</div>
      <button type="button" class="close_button" onclick="submitClose('subscribe')">Close</button>`
  }
    return formOk;
}

/*function to use in BuyNow buttons*/
function buyNow(formId,event,img) {
  var x = event.clientX;
  var y = event.clientY;
  formPopUp(formId,x,y,img);
}

/*Function to check input in checkout form */
function checkForm() {
  var formOk = true;
  
  if (document.forms["contactForm"]["Name"].value.length < 1) {
      formOk = false;
  }  

  if  (!checkEmailFormat (document.forms["contactForm"]["Email"].value)) {
      formOk = false;
  }

  if (document.forms["contactForm"]["request"].value.length < 10) {
     formOk = false;
  }

  if (formOk===true) {
      document.getElementById("requestError").style.display = "none";
      document.getElementById("FormOk").style.display = "block";
      return true; 
  }
  else {
      document.getElementById("requestError").style.display = "block";
      document.getElementById("FormOk").style.display = "none";
      return false; 
  }
}


function launchRocket() {
  var launchElement = document.getElementById("launch");
  var LaunchElementStyle = window.getComputedStyle(launchElement,null);
  origTop = launchElement.offsetTop;
  function moveElement(x){
     launchElement.style.top = Number(x) + "px";
  }
  for (i=0; i < 100; i++) {
    setTimeout(moveElement(-i),1000);
  }
}





async function apodPicture(id,idclass) {
    const apiResult = document.getElementById(id);
    apiResult.innerHTML = displayMessage("wait","Please\xa0wait");
    const url = apodBaseurl + "?" + nasaApikey;

    var isVideo = false;
    var tempApiResult = "";
    
    try {
        const apiResponse = await fetch(url);
        const apodResult = await apiResponse.json();

        if (idclass==="apod_img") {
          var tempApiResult = `<a href="${apodResult.hdurl}" target="_blank">
          `;
        }
        else
        {
          var tempApiResult = `<a class="button_link" href="apod.html">
          `;
        }

        if (apodResult.media_type=="video") {
          isVideo = true;
          tempApiResult = tempApiResult + `
            <iframe width="100%" src="${apodResult.url}" 
            frameborder="0" allowfullscreen></iframe>
          </a>
          `;
        }
        else {     
          tempApiResult = tempApiResult + `
            <img src="${apodResult.url}" alt="${apodResult.title}" class="${idclass}"> 
          </a>  
          `;
        }

        if (idclass==="apod_img") {          
          tempApiResult = tempApiResult + `
          <div class="apod_txt">
            <h3>${apodResult.title}</h3>
            <div class="apod_copy">Copyright:${apodResult.copyright}</div>
            <div class="apod_copy">Date: ${apodResult.date}</div>
            <div class="apod_scroll">${apodResult.explanation}
          
          `
          if (isVideo===true){
            tempApiResult = tempApiResult + `
            </div>
            `   
          }
          else
          {
            tempApiResult = tempApiResult + `
            <a href="${apodResult.hdurl}" target="_blank">Click here to show picture i full resolution</a>
            </div>
            ` 
          }  

        }
        
        apiResult.innerHTML=tempApiResult;
    }
    catch (error) {
        apiResult.innerHTML=displayMessage("apierror","An error occured: <br>"+error);
    } 

}

let map;
      function initMap(latitude,longitude) {
        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: latitude, lng: longitude },
          zoom: 2,
          streetViewControl: false,
          controlSize: 20
        });
        const markerImgage = "img/astronaut-helmet-map.png";
        new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          icon: markerImgage,
        });
      }

async function issLocation(id,idclass) {
  var location = { lat: 40, lng: 20 };

  const apiResult = document.getElementById(id);
  apiResult.innerHTML = displayMessage("wait","Please\xa0wait");
  const url = "http://api.open-notify.org/iss-now.json";
  var tempApiResult = "";
  
  try {
      const apiResponse = await fetch(url);
      const issResult = await apiResponse.json();
      console.log(issResult);
      location.lat = parseInt(issResult.iss_position.latitude);
      location.lng = parseInt(issResult.iss_position.longitude);
      console.log (location);
      
      var tempApiResult = `
      <div class="iss_map_txt">
         <div>Latitude:${issResult.iss_position.latitude} Longitude: ${issResult.iss_position.longitude}</div>
         <div>The map shows the current location of the Intrnational space station.</div>
      </div>
      `;
      
      apiResult.innerHTML=tempApiResult; 
      initMap(location.lat,location.lng);     
  }
  catch (error) {
      apiResult.innerHTML=displayMessage("apierror","An error occured: <br>"+error);
  } 

  

}


async function getAstronauts(id){
  const url = "http://api.open-notify.org/astros.json";
  
  const apiResult = document.getElementById(id);
  var tempApiResult = "";
  try {
    const apiResponse = await fetch(url);
    const astronautResult = await apiResponse.json();
    console.log(astronautResult);
    tempApiResult=`
    <div>Currently there is ${astronautResult.number} astronauts in space</div>
    `
    for (i=0; i<astronautResult.number; i++){
      tempApiResult=tempApiResult + `<div>Craft: ${astronautResult.people[i].craft} Name: ${astronautResult.people[i].name}</div>`

    }
    apiResult.innerHTML=tempApiResult;
    
  }
  catch (error) {
    apiResult.innerHTML=displayMessage("apierror","An error occured: <br>"+error);
  }  
}

function showAstronauts(id,showClass){
  const element = document.getElementById(id);
  if (element.style.display !== "block") {
    element.style.display = "block";
    openBoxId = id;
    openBoxImg = showClass;
  } 
  else {
    element.style.display = "none";
    openBoxId = "";
    openBoxImg = "";
  }
}

function closeModal() {
  var launchModal = document.getElementById("launchmodal");
  launchModal.style.display = "none";
}

async function launches(id,launchId) {
  console.log("Inside function launches");
  console.log(launchId);
  var url = "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/";
  if (launchId != undefined) {
    url = url + launchId +"/";
  }
  console.log("ID = "+id);
  const apiResult = document.getElementById(id);
  apiResult.innerHTML = displayMessage("wait","Please\xa0wait");
  console.log(apiResult);
  var tempApiResult = "";
  try {
    const apiResponse = await fetch(url);
    const launchResult = await apiResponse.json();
    console.log(launchResult);

    if (id==="launchlist") {
      tempApiResult=`<div class="footer_section1">`
      for (var i=0; i<launchResult.results.length; i++) {
        if (i===0){
          tempApiResult=tempApiResult+`<span class="footerbox firstfooterbox"`;
        }
        else {
          tempApiResult=tempApiResult+`<span class="footerbox"`;
        }
        tempApiResult=tempApiResult+` onclick=showLaunch("${launchResult.results[i].id}")>${launchResult.results[i].name} : ${launchResult.results[i].net}</span>`;
      }      
      tempApiResult=tempApiResult+`</div>`;      
    }
    else if (id==="launchmodal") {
      console.log("Inside launchmodal")
      tempApiResult=tempApiResult+`
      <div class="launch-modal-content">
        <button onclick="closeModal()">Close</button>
        <h2>${launchResult.name}</h2> 
        <img src="${launchResult.image}" alt="${launchResult.name}" class="modalImg">
        <div class="modaldiv">
          <h3 class="modalH3">Mission:</h3>
          <p class="modalTxt">${launchResult.mission.name}</p>
          <p class="modalTxt">date:</p> 
          <p class="modalTxt">${launchResult.net}</p>
          <h3 class="modalH3">Launch provider:</h3>
          <p class="modalTxt">${launchResult.launch_service_provider.abbrev} | ${launchResult.launch_service_provider.country_code}</p>
          <h3 class="modalH3">Launch pad:</h3>
          <p class="modalTxt">${launchResult.pad.name}</p>
        </div>
      </div>`;
    }
    else {}
    apiResult.innerHTML=tempApiResult;
  }
  catch (error) {
    apiResult.innerHTML=`
    <div class="apierror">
      <p>An error occured while reading information from another site.</p>
      <p>We apologize for this and encourage you to try again</p>
      <button onclick="closeModal()">Close</button>
      </div>
    </div>`;
  }  
}

function showLaunch(LaunchId) {
  launches("launchmodal",LaunchId); 
  var launchModal = document.getElementById("launchmodal");
  launchModal.style.display = "block";
}

/* When new page opened, remove menu if open*/
removeMenu();



function createUI() {
    var body = document.getElementsByTagName("body")[0];
    body.innerHTML = ` 
    <div id='container'>
   <div id="left">
      <input type="file" id="fileinput" style="display: none;"  onchange="loadFile();"/>
      <ul class="Menu -horizontal">
         <li class="-hasSubmenu -noChevron">
            <a href="#" data-icon="dehaze"></a>
            <ul>
               <li class="-hasSubmenu">
                  <a href="#">New</a>
                  <ul>
                     <li><a href="#" onclick="openSceneForm()">New Dashboard</a></li>
                  </ul>
               </li>
               <li class="-hasSubmenu">
                  <a href="#">Edit</a>
                  <ul>
                     <li><a href="#" onclick="myApp.deleteActiveScene()">Delete Dashboard</a></li>
                  </ul>
               </li>
               <li><a href="#" onclick="myApp.save()">Save</a></li>
               <li class="-hasSubmenu">
                  <a href="#">File</a>
                  <ul>
                     <li><a href="#" onclick="document.getElementById('fileinput').click();">Import</a></li>
                     <li><a href="#" onclick="myApp.export()">Export</a></li>
                  </ul>
               </li>
               <li><a href="#" onclick="myApp.logout()">Logout</a></li>
               <li><a href="#" onclick="openSettingsForm()">Settings</a></li>
            </ul>
         </li>
      </ul>
   </div>
   <div id='center'>
      <p>Tipee</p>
   </div>
   <div id='right'class="selectdiv ">
        <div id = 'centerOpenBt'><i id='centerOpenIcon' class="fas fa-comment-alt"></i>
        </div>
      <label>
         <select id="sceneSelect" name="sceneSelect" onchange="myApp.changeScene()">
            <option value="default">Select Dashboard</option>
            <option value="new">New</option>
      </label>
      </select>
   </div>
</div>
<menu class="context-menu">
   <a href="javascript:;" class="bold" id="menuTitle">Menu</a>
   <hr>
   <a href="javascript:;" data="edit" onClick='updateTileMenuAction(this.parentElement.id)'>Edit</a>
   <a href="javascript:;" data="lock" onClick='lockTile(this.parentElement.id)'>Lock</a>
   <a href="javascript:;" data="duplicate" onClick='myApp.getActiveScene().duplicateTileById(this.parentElement.id)'>Duplicate</a>
   <a href="javascript:;" data="delete" onClick='myApp.getActiveScene().deleteTileById(this.parentElement.id)'>Delete</a>
</menu>
<div class"scene" id='scene'>
<div class="tileShadow" id='shadow'></div>
</div>
<div id="backgroundScreen"></div>
<div id="splashScreen">
   <p class='splashScreenTitle'>Tipee</p>
   <div class='splashScreenText'>
      <p>Creates dashboards easily with Tipee</p>
      <p>Signin to your dashboards! Don't have an account yet? Just signup!</p>
   </div>
   <div class="form-popup-3" id="signinSignupForm"></div>
</div>
<div class="form-popup-2" id="sceneForm"></div>
<div class="form-popup" id="tileForm"></div>
<button id='addTile' class="open-button" onclick="openTileForm(null)">Add tile</button>
<div id="info"> Math </div>`;
}

function openSceneForm() {
    document.getElementById("sceneForm").style.display = "flex";
    document.getElementById("backgroundScreen").classList.add("backgroundScreen");
 }
 
 function closeSceneForm() {
    myApp.reloadActiveScene();
    document.getElementById("sceneForm").style.display = "none";
    document.getElementById("sceneName").value = "";
    document.getElementById("backgroundScreen").classList.remove("backgroundScreen");
    document.getElementById("sceneForm_errorloc").style.display = "none";
 }
 
 function openSigninSignupForm() {
    document.getElementById("signinSignupForm").style.display = "block";
    document.getElementById("splashScreen").classList.add("splashScreen");
 }
 
 function closeSigninSignupForm() {
    document.getElementById("signinSignupForm").style.display = "none";
    document.getElementById("splashScreen").classList.remove("splashScreen");
    document.getElementById("signinSignupForm_errorloc").style.display = "none";
 }
 
 function updateSigninSignupForm(action, form) {
 
    if(form==null)
       form = myApp.loginForm;
       
    if (action == "signin") {
       document.getElementById("passwordTd").colSpan = "2";
       document.getElementById("btvalLogTd").colSpan = "2";
       document.getElementById("sign").value = "signup";
       document.getElementById("sign").innerText = "Sign Up";
 
       form.validation.desactivateField("repassword");
       form.validation.desactivateField("lastname");
       form.validation.desactivateField("firstname");
       form.validation.desactivateField("email");
 
       document.getElementById("repassword").style.display = "none";
       document.getElementById("lastname").style.display = "none";
       document.getElementById("firstname").style.display = "none";
       document.getElementById("emailTr").style.display = "none";
       document.getElementById("forgot").style.display = "block";
    }
    else {
       form.validation.activateField("repassword");
       form.validation.activateField("lastname");
       form.validation.activateField("firstname");
       form.validation.activateField("email");
       document.getElementById("passwordTd").colSpan = "1";
       document.getElementById("btvalLogTd").colSpan = "2";
       document.getElementById("sign").value = "signin";
       document.getElementById("sign").innerText = "Sign In";
       document.getElementById("repassword").style.display = "block";
       document.getElementById("lastname").style.display = "block";
       document.getElementById("firstname").style.display = "block";
       document.getElementById("emailTr").style.display = "table-row";
       document.getElementById("forgot").style.display = "none";
    }
 }
 
 function openTileForm(tpTile) {
    if(tpTile != null){
      var form = myApp.demoScene.getTilesByType(tpTile.type)[0].form;
       myApp.tileForm.fields = form.fields;
       myApp.tileForm.formId = form.formId;
       myApp.tileForm.validation = form.validation;
       myApp.tileForm.buildForm();
       tpTile.fillForm();
       tpTile.updateForm();
    }
    else{
       var tileText = myApp.demoScene.getTilesByType("text")[0];
 
       myApp.tileForm.fields = tileText.form.fields;
       myApp.tileForm.formId = tileText.form.formId;
       myApp.tileForm.validation = tileText.form.validation;
       myApp.tileForm.buildForm();
    }
 
    document.getElementById("tileForm").style.display = "flex";
    document.getElementById("backgroundScreen").classList.add("backgroundScreen");
    document.getElementById('tileForm_errorloc').style.display = "none";
 }
 
 function closeTileForm() {
    document.getElementById("tileForm").style.display = "none";
    document.getElementById("idTile").value = "";
    document.getElementById("backgroundScreen").classList.remove("backgroundScreen");
    document.getElementById("tileForm_errorUL").innerHTML = "";
 }
 
 function updateType(elm){
    document.getElementById("type").value = elm.value;
 
    var tile;
    if(elm.value == "note"){
       tile = myApp.demoScene.getTilesByType(elm.value)[0];
    }
    else if(elm.value == "todo"){
       tile = myApp.demoScene.getTilesByType(elm.value)[0];
    }
    else if(elm.value == "toggles"){      
       tile = myApp.demoScene.getTilesByType(elm.value)[0];
    }
    else if(elm.value == "text"){
       tile = myApp.demoScene.getTilesByType(elm.value)[0];
    }
    else if(elm.value == "image"){
       tile = myApp.demoScene.getTilesByType(elm.value)[0];
    }
    myApp.tileForm.fields = tile.form.fields;
    myApp.tileForm.formId = tile.form.formId;
    myApp.tileForm.validation = tile.form.validation;
    tile.idTile = "demo";
    myApp.tileForm.buildForm();
    tile.updateForm();
 }
 
 function updateTileForm() {
    var idTile = document.getElementById("idTile");
    var type = document.getElementById("type");
    //var deletebtn = document.getElementById("deleteElem");
    
    if (idTile.value != '') {
       //deletebtn.style.display = "block";
       var tileToUpadateForm;
         for (var j = 0; j < myApp.activeScene.tiles.length; j++) {
             var tile = myApp.activeScene.tiles[j];
             if (tile.idTile == idTile.value) {
                tileToUpadateForm = tile;
             }
         }
         tileToUpadateForm.updateForm();
    }
       else {
          //deletebtn.style.display = "none";
          myApp.demoScene.getTilesByType(type.value)[0].updateForm();
 
          for(var i = 0; i < document.getElementsByName("test").length; i++)
             document.getElementsByName("test")[i].disabled = false;
       }
 }

function request(urlRequest, crossOrigine, requestType, data, responseType, responseField, operation, callback) {
    const Http1 = new XMLHttpRequest();
    if (crossOrigine)
        Http1.open(requestType, "https://cors-anywhere.herokuapp.com/" + urlRequest, true);
    else
        Http1.open(requestType, urlRequest, true);

    Http1.overrideMimeType('text/xml');
    Http1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    Http1.setRequestHeader('Access-Control-Allow-Headers', '*');
    Http1.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    Http1.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

    if (requestType != "GET" && data != "")
        Http1.send(JSON.stringify(data));
    else
        Http1.send();

    var requestResult = '';

    Http1.onreadystatechange = (e) => {
        if (Http1.readyState === 4 && Http1.status === 200) {
            if (requestType == "GET" && responseType == "JSON") {
                if (Http1.responseText != "") {
                    var json = JSON.parse(Http1.responseText);
                    var fields = responseField.split('.');
      var i = 0;
                    if (json.length > 0) {
                        for (i = 0; i < fields.length; i++)
                            json = json[0][fields[i]];
                        if (operation == 'kelvinToCelcius')
                            requestResult = kelvinToCelcius(json);
                        else
                            requestResult = json;
                        callback.apply(this, [requestResult]);
                    }
                    else {
                        for (i = 0; i < fields.length; i++)
                            json = json[fields[i]];
                        if (operation == 'kelvinToCelcius')
                            requestResult = kelvinToCelcius(json);
                        else
                            requestResult = json;
                        callback.apply(this, [requestResult]);
                    }
                }
            }
            else if (requestType == "GET" && responseType == "XML") {
                if (Http1.responseText != "") {
                    var xml = Http1.responseXML;
                    var xmlResult;
                    if (xml != null) {
                        var arr = responseField.split(";");
                        if (arr.length > 1 && arr[1] != "")
                            xmlResult = xml.getElementsByTagName(arr[0])[parseInt(arr[1])].childNodes[0].textContent;
                        else
                            xmlResult = xml.getElementsByTagName(arr[0])[0].textContent;
                        if (operation == 'kelvinToCelcius')
                            requestResult = kelvinToCelcius(xmlResult);
                        else
                            requestResult = xmlResult;
                        callback.apply(this, [requestResult]);
                    }
                }
            }
            else {
                requestResult = 1;
                callback.apply(this, [requestResult]);
            }
        }
        else if (Http1.readyState === 4 && Http1.status === 210) {
            requestResult = 2;
            callback.apply(this, [requestResult]);
        }
        else if (Http1.readyState === 4 && Http1.status === 211) {
            requestResult = 3;
            callback.apply(this, [requestResult]);
        }
        else if (Http1.readyState === 4 && Http1.status === 204) {
            requestResult = 2;
            callback.apply(this, [requestResult]);
        }
        else if (Http1.readyState === 4 && Http1.status === 206) {
            requestResult = 3;
            callback.apply(this, [requestResult]);
        }
        else if (Http1.readyState === 4 && Http1.status === 207) {
            requestResult = "207";
            callback.apply(this, [requestResult]);
        }
    };

    Http1.onerror = function () {
        console.log("** An error occurred during the transaction");
        alert("I am an alert box!");
    };

    Http1.onloadend = function () {
        if (Http1.status == 404)
            // throw new Error(url + ' replied 404');
            console.log("404 Error");
        else if (Http1.status == 403)
            // throw new Error(url + ' replied 404');
            console.log("403 Error");
    };

}

function kelvinToCelcius(valueKelvin) {
    var valueCelcius = parseFloat(valueKelvin) - 273.15;
    valueCelcius = roundDecimal(valueCelcius, 1);
    return valueCelcius;
}

function roundDecimal(nb, precision) {
    var tmp = Math.pow(10, precision || 2);
    return Math.round(nb * tmp) / tmp;
}

function createScene(){
    myApp.createSceneSubmit();
}

function signin(){
    myApp.signinSignupSubmit();
}

function createOrUpdateTpTile(){
    myApp.createOrUpdateTpTile();
}
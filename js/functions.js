class ValidationForm {
    constructor(form) {
       this.form = form;
       this.formobj = document.forms[form]
       this.fields = [];
    }

    clearAllValidations(){
        this.fields = [];
    }

    addValidation(field, rule, errorMessage) {

       var exists = false;
       var r = new Rule(rule, errorMessage);
       for(var i=0; i<this.fields.length; i++){
          if(this.fields[i].name == field){
             this.fields[i].rules.push(r);
             exists = true;
          }
       }

       if(!exists){
          var f = new Field(field);
          f.rules.push(r)
          this.fields.push(f);
       }
    }

    checkFields() {
       var errors = document.getElementById(this.form + "_errorUL");
       for (var i = 0; i < this.fields.length; i++) {
          for (var j = 0; j < this.fields[i].rules.length; j++) {
             var result = this.fields[i].rules[j].validate(this.fields[i].name)
             if (result != null) {
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(result));
                errors.appendChild(li);
                break;
             }
          }
       }
    }
 }

 class Field {
    constructor(field) {
       this.name = field;
       this.rules = [];
    }
 }

 class Rule {
    constructor(rule, message) {
       this.rule = rule;
       this.message = message;
    }

    validate(field) {
       var value = document.getElementById(field).value;
       if (this.rule == 'req') {
          if (value != '')
             return null;
          else
             return this.message;
       }
       else if(this.rule.startsWith("same")){
        var sameAs = this.rule.split("=")[1];
        if(value == document.getElementById(sameAs).value)
           return null;
        else
           return this.message;
     }
       if (this.rule == 'email') {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
           return null;
        else
           return this.message;
     }
       else if(this.rule.startsWith("minlen")){
          var minlength = this.rule.split("=")[1];
          if(value.length >= minlength)
             return null;
          else
             return this.message;
       }
       else if(this.rule.startsWith("maxlen")){
          var maxlength = this.rule.split("=")[1];
          if(value.length < maxlength)
             return null;
          else
             return this.message;
       }
       else if(this.rule == "num"){
           if(value.match(/^[\-\+]?[\d\,]*\.?[\d]*$/))
                return null;
            else
                return this.message;
       }
       else if(this.rule.startsWith("greater")){
           var than = this.rule.split("=")[1];
           if(parseFloat(value) > parseFloat(than))
               return null
           else
                return this.message;
       }

    }
 }

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
                     <li><a href="#">New Project</a></li>
                     <li><a href="#">New Dashboard</a></li>
                  </ul>
               </li>
               <li class="-hasSubmenu">
                  <a href="#">Edit</a>
                  <ul>
                     <li><a href="#">Delete Dashboard</a></li>
                  </ul>
               </li>
               <li><a href="#">Save</a></li>
               <li class="-hasSubmenu">
                  <a href="#">File</a>
                  <ul>
                     <li><a href="#" onclick="document.getElementById('fileinput').click();">Import</a></li>
                     <li><a href="#" onclick="myApp.export()">Export</a></li>
                  </ul>
               </li>
               <li><a href="#" onclick="myApp.logout()">Logout</a></li>
            </ul>
         </li>
      </ul>
   </div>
   <div id='center'>
      <p>Tipee</p>
   </div>
   <div id='right'class="selectdiv ">
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
   <a href="javascript:;" data="duplicate" onClick='myApp.activeScene.duplicateTileById(this.parentElement.id)'>Duplicate</a>
   <a href="javascript:;" data="delete" onClick='myApp.activeScene.deleteTileById(this.parentElement.id)'>Delete</a>
</menu>
<div class"scene" id='scene'>
<div class="mydivShadow" id='shadow'></div>
</div>
<div id="error_wrapper"></div>
<div id="splashScreen">
   <p class='splashScreenTitle'>Tipee</p>
   <div class='splashScreenText'>
      <p>Creates dashboards easily with Tipee</p>
      <p>Signin to your dashboards! Don't have an account yet? Just signup!</p>
   </div>
   <div class="form-popup-2" id="signinSignupFormDiv"></div>
</div>
<div class="form-popup-2" id="sceneFormDiv"></div>
<div class="form-popup" id="tileFormDiv"></div>
<button id='addTile' class="open-button" onclick="openTileForm(null)">Add tile</button>
<div id="info"> Math </div>`;
}

//requestPOST("http://172.21.1.10:8000/macros/turnOffLights");
function requestPOST(urlRequest) {
    const Http = new XMLHttpRequest();
    Http.open("POST", urlRequest);
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText);
    }

    Http.onerror = function () {
        console.log("** An error occurred during the transaction");
        alert("I am an alert box!");
    };

    Http.onloadend = function () {
        if (Http.status == 404)
            // throw new Error(url + ' replied 404');
            console.log("404 Error");
    }
}

function request(urlRequest, reqType, responseType, responseField, operation, callback) {
    const Http1 = new XMLHttpRequest();
    const url1 = "https://cors-anywhere.herokuapp.com/" + urlRequest;
    if(reqType == "GET")
    Http1.open("GET", url1);
    else if(reqType == "POST")
    Http1.open("POST", url1);
    Http1.overrideMimeType('text/xml');
    Http1.setRequestHeader('Access-Control-Allow-Headers', '*');
    Http1.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    Http1.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    Http1.send();

    var requestResult = '';

    Http1.onreadystatechange = (e) => {
        if (Http1.readyState === 4 && Http1.status === 200) {
            if (responseType == "XML") {
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
            else if (responseType == "JSON") {
                if (Http1.responseText != "") {
                    var json = JSON.parse(Http1.responseText);
                    if(responseField!=""){
                    var fields = responseField.split('.')
                    var requestResult = '';
                    
                        for(var i = 0; i<fields.length; i++)
                            json = json[fields[i]];
                        }



                        if (operation == 'kelvinToCelcius')
                            requestResult = kelvinToCelcius(json);
                        else
                            requestResult = json;
                        callback.apply(this, [requestResult]);
                   
                }
            }
        }
    }
}



    function requestLogin(urlRequest, password, callback) {
        const Http1 = new XMLHttpRequest();
        Http1.open("POST", urlRequest);
        Http1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        Http1.send(JSON.stringify({ "password": password }));

        var requestResult;

        Http1.onreadystatechange = (e) => {
            if (Http1.readyState === 4 && Http1.status === 200) {
                requestResult = 1;
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
        }
    }

    function requestGET(urlRequest, responseType, responseField, operation, callback) {
        const Http1 = new XMLHttpRequest();
        Http1.open("GET", urlRequest);
        Http1.overrideMimeType('text/xml');
        Http1.send();

        var requestResult = '';

        Http1.onreadystatechange = (e) => {
            if (Http1.readyState === 4 && Http1.status === 200) {
                if (responseType == "XML") {
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
                else if (responseType == "JSON") {
                    if (Http1.responseText != "") {
                        var json = JSON.parse(Http1.responseText);
                        var fields = responseField.split('.')
                        var requestResult = '';
                        if (json.length > 0) {
                            json = json[0][fields[0]];

                            if (operation == 'kelvinToCelcius')
                                requestResult = kelvinToCelcius(json);
                            else
                                requestResult = json;
                            callback.apply(this, [requestResult]);
                        }
                        else {
                            callback.apply(this, [requestResult]);
                        }
                    }
                }
            }
            else if (Http1.readyState === 4 && Http1.status === 207) {
                callback.apply(this, ["207"]);
            }
        }
    }

    function requestCreateDashboard(urlRequest, data, callback) {
        const Http1 = new XMLHttpRequest();
        Http1.open("POST", urlRequest, true);
        Http1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        Http1.send(JSON.stringify({ "data": data }));

        var requestResult = '';

        Http1.onreadystatechange = (e) => {
            if (Http1.readyState === 4 && Http1.status === 200) {
                requestResult = "Create done";
                callback.apply(this, [requestResult]);
            }
        }
    }

    function requestCreateUser(urlRequest, data, callback) {
        const Http1 = new XMLHttpRequest();
        Http1.open("POST", urlRequest, true);
        Http1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        Http1.send(JSON.stringify(data));

        var requestResult = '';

        Http1.onreadystatechange = (e) => {
            if (Http1.readyState === 4 && Http1.status === 200) {
                requestResult = 1;
                callback.apply(this, [requestResult]);
            }
            else if (Http1.readyState === 4 && Http1.status === 210) {
                requestResult = 2;
                callback.apply(this, [requestResult]);
            }
            else if (Http1.readyState === 4 && Http1.status === 211) {
                requestResult = 3;
                callback.apply(this, [requestResult]);
            }
        }
    }

    function requestUpdateDashboard(urlRequest, data, callback) {
        const Http1 = new XMLHttpRequest();
        Http1.open("PUT", urlRequest, true);
        Http1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        Http1.send(JSON.stringify({ "data": data }));

        var requestResult = '';

        Http1.onreadystatechange = (e) => {
            if (Http1.readyState === 4 && Http1.status === 200) {
                requestResult = "Save done";
                callback.apply(this, [requestResult]);
            }
        }
    }

    function kelvinToCelcius(valueKelvin) {
        var valueCelcius = parseFloat(valueKelvin) - 273.15;
        valueCelcius = roundDecimal(valueCelcius, 1);
        return valueCelcius;
    }

    function roundDecimal(nb, precision) {
        var precision = precision || 2;
        var tmp = Math.pow(10, precision);
        return Math.round(nb * tmp) / tmp;
    }
    
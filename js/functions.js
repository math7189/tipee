

class Form {
    constructor(form) {
        if (form != null)
            this.formId = form.formId;
        this.fields = form
        if (form != null)
            this.validation = new ValidationForm(this.formId);
        this.init = 0;
    }

    merge(out, in1, in2) {
        var a = Object.keys(in1)
        var b = Object.keys(in2)

        for (var i = 0; i < a.length; i++) {
            if (b.includes(a[i])) {
                var c = Object.prototype.toString.call(in1[a[i]])
                var d = Object.prototype.toString.call(in2[a[i]])
                if (Object.prototype.toString.call(in1[a[i]]) == "[object Object]" && Object.prototype.toString.call(in1[a[i]]) == "[object Object]") {
                    out[a[i]] = {}
                    this.merge(out[a[i]], in1[a[i]], in2[a[i]])
                }
                else if (Object.prototype.toString.call(in1[a[i]]) == "[object Array]" && Object.prototype.toString.call(in1[a[i]]) == "[object Array]") {
                    out[a[i]] = []
                    out[a[i]] = out[a[i]].concat(in1[a[i]], in2[a[i]]);
                }
                else {
                    out[a[i]] = [in1[a[i]], in2[a[i]]]
                }
            }
            else {
                out[a[i]] = in1[a[i]]
            }
        }

        for (var i = 0; i < b.length; i++) {
            if (!a.includes(b[i])) {
                out[b[i]] = in2[b[i]]
            }
        }
    }

    buildForm() {
        var json = this.fields;
        var initArray = [];
        var formDiv = document.getElementById(this.formId);
        formDiv.innerHTML = "";
        var content = `<p class="formTitle">` + json.formTitle + `</p>`

        var nbTabs = json.formTabs.length;
        if (nbTabs > 1) {
            content = this.createTabList(content, json)
            content += `<div class="tabcontents">`
            content += `<form id='` + json.formId + `' action="javascript:void(0);" class="form-container">`

            for (var i = 0; i < nbTabs; i++) {
                content += `<div class="tabcontent" id="tab_div` + i + `" style="display: block;">`
                content += `<table style="width: 100%;">`

                var tab = json.formTabs[i]
                var tabFieldsLines = json.formFields[tab];

                for (var j = 0; j < tabFieldsLines.length; j++) {
                    content = this.createLine(initArray, content, tabFieldsLines[j])
                }

                content += `</table>`
                content += `</div>`
            }
        }
        else {
            content += `<div class="contents">`
            content += `<form id='` + json.formId + `' action="javascript:void(0);" class="form-container">`

            content += `<table style="width: 100%;">`

            var tab = json.formTabs[0]
            var tabFieldsLines = json.formFields[tab];

            for (var j = 0; j < tabFieldsLines.length; j++) {
                content = this.createLine(initArray, content, tabFieldsLines[j])
            }

            content += `</table>`
        }

        content += `<div id="` + json.error.id + `" class="` + json.error.class + `"><ul id= "` + json.formId + `_errorUL"></ul></div>`

        var content1 = `<table style="
            `+ json.buttonStyle + `">
            <tr>`

        for (var i = 0; i < json.buttons.length; i++) {

            content1 += `<td style="` + json.buttons[i].tdstyle + `"><button type="` + json.buttons[i].type + `" class="` + json.buttons[i].class + `" onclick="` + json.buttons[i].onclick + `">` + json.buttons[i].name + `</button>`
        }
        content1 += `</form>
        </div>`

        formDiv.innerHTML = content + content1;

        for (var i = 0; i < json.buttons.length; i++) {
            if (json.buttons[i].type == "submit")
                this.submit(json.buttons[i].submit)
        }

        for (var m = 0; m < initArray.length; m++) {
            try {
                eval(initArray[m])
            } catch (error) {

            }
        }

        if (nbTabs > 1)
            showActiveTab(document.getElementById("tabli_div0"))
    }

    submit(f) {
        var that = this;
        var form = document.getElementById(that.formId);

        if (this.init == 0) {
            form.addEventListener('submit', submitForm, true)
            this.init++
        }

        function submitForm() {
            var errors = document.getElementById(that.formId + '_errorUL');
            errors.innerHTML = "";
            that.validation.checkFields();

            if (errors.children.length == 0) {
                eval(f)
                document.getElementById(that.formId + '_errorloc').style.display = "none";
            }
            else {
                document.getElementById(that.formId + '_errorloc').style.display = "block";
            }
            return false;
        }
    }

    createLine(initArray, form, line) {

        var k = 0;
        if (line[0].ligne != null) {
            form += `<tr><td colspan="3" class="` + line[0].class + `">` + line[0].ligne + `</td></tr>`
            k = 1;
        }

        if (line[0].trid != null) {
            form += `<tr id="` + line[0].trid + `">`
            k = 1;
        }
        else
            form += ` <tr>`

        for (k; k < line.length; k++) {
            var fieldParam = line[k]
            var type = fieldParam.type
            var init = fieldParam.init

            if (init != null) {
                if (init == "initSelectFontInput")
                    initArray.push(init + '("' + fieldParam.id + '")')
                else if (init.startsWith("initSelectNumberInput")) {
                    var params = init.split("initSelectNumberInput")[1].split(",");
                    initArray.push('initSelectNumberInput("' + fieldParam.id + '",' + params[1] + "," + params[2] + "," + params[3] + ")")
                }
                else if (init == "picker") {
                    initArray.push("var " +fieldParam.id +" = new Picker( '" + fieldParam.id + "', 150, 120);")
                }
            }

            if (type == "table") {
                form += `<table id="` + fieldParam.id + `">`

                for (var m = 0; m < fieldParam.fields.length; m++)
                    form = this.createLine(initArray, form, fieldParam.fields[m]);

                form += "</table>"
            }
            else {
                form = this.createField(form, fieldParam);
            }
        }
        form += `</tr>`
        return form;
    }

    createField(form, field) {
        if (field.validation != null) {
            for (var i = 0; i < field.validation.length; i++) {
                if (field.validation[i].rule != null && field.validation[i].error != null)
                    this.validation.addValidation(field.id, field.validation[i].rule, field.validation[i].error);
            }
        }

        if (field.colspan != null) {
            form += `<td colspan="` + field.colspan + `">`
        }
        else {
            form += `<td>`
        }

        if (field.label != null && field.id != null && field.style != "display:none" && field.type != "label")
            form += `<label for="` + field.id + `" id="` + field.id + `Label"><b>` + field.label + `</b></label>`

        if (field.type == "label") {
            form += `<label for="` + field.id + `"><b>` + field.label + `</b></label>`
        }

        else if (field.type == "select") {
            form += `<select`

            if (field.description != null) {
                form += ` placeholder="` + field.description + `"`
            }

            if (field.onchange != null) {
                form += ` onchange="` + field.onchange + `"`
            }

            if (field.id != null) {
                form += ` id = "` + field.id + `"`
            }

            if (field.name != null) {
                form += ` name="` + field.name + `"`
            }

            if (field.style != null) {
                form += ` style="` + field.style + `"`
            }

            form += `>`

            var options = field.options
            if (options != null) {
                for (var opt = 0; opt < options.length; opt++)
                    form += `<option value="` + options[opt].value + `">` + options[opt].name + ` </option>`
            }
            form += `</td>`
        }
        else if (field.type == "radio") {
            var options = field.options
            if (options != null) {
                for (var opt = 0; opt < options.length; opt++) {

                    var f = options[opt]
                    form += `<label><input type="radio" `

                    if (opt == 0)
                        form += " checked "

                    if (f.onclick != null) {
                        form += ` onclick="` + f.onclick + `"`
                    }

                    if (f.id != null) {
                        form += ` id = "` + f.id + `"`
                    }

                    if (f.value != null) {
                        form += ` value = "` + f.value + `"`
                    }

                    if (f.name != null) {
                        form += ` name="` + f.name + `"`
                    }

                    form += `>`

                    if (f.img != null) {
                        form += ` <img src="` + f.img + `"`
                    }

                    if (f.style != null) {
                        form += ` style="` + f.style + `"`
                    }

                    form += `></label>`

                }
            }
            form += `</td>`
        }
        else if (field.type == "color") {
            form += `<input type="text" class="myColorP" `

            if (field.readonly != null) {
                form += field.readonly
            }

            if (field.id != null) {
                form += ` id = "` + field.id + `"`
            }

            if (field.val != null) {
                form += ` value="` + field.val + `"`
            }

            form += `></td>`
        }
        else {
            form += `<input type="` + field.type + `"`

            if (field.readonly != null) {
                form += field.readonly
            }

            if (field.style != null) {
                form += ` style="` + field.style + `"`
            }

            if (field.description != null) {
                form += ` placeholder="` + field.description + `"`
            }

            if (field.onchange != null) {
                form += ` onchange="` + field.onchange + `"`
            }

            if (field.id != null) {
                form += ` id = "` + field.id + `"`
            }

            if (field.name != null) {
                form += ` name="` + field.name + `"`
            }

            if (field.class != null) {
                form += ` class = "` + field.class + `"`
            }

            if (field.value != null) {
                form += ` value="` + field.value + `"`
            }

            form += `></td>`
        }
        return form;

    }

    createTabList(form, json) {
        var nbTabs = json.formTabs.length;
        if (nbTabs > 0) {
            form += `<ul id="tab_ul" class="tabs">`
            for (var i = 0; i < nbTabs; i++) {
                if (i == 0) {
                    form += '<li class="selected"><a id="tabli_div' + i + '" rel="tab_div' + i + '" href="#" onclick="javascript:showActiveTab(this);">' + json.formTabs[i] + '</a></li>';
                }
                else
                    form += '<li class=""><a id="tabli_div' + i + '" rel="tab_div' + i + '" href="#" onclick="javascript:showActiveTab(this);">' + json.formTabs[i] + '</a></li>';
            }

            form += `</ul>`
        }
        return form;
    }
}

class ValidationForm {
    constructor(form) {
        this.form = form;
        this.formobj = document.forms[form]
        this.fields = [];
    }

    clearAllValidations() {
        this.fields = [];
    }

    addValidation(field, rule, errorMessage) {

        var exists = false;
        var r = new Rule(rule, errorMessage);
        for (var i = 0; i < this.fields.length; i++) {
            if (this.fields[i].name == field) {
                this.fields[i].rules.push(r);
                exists = true;
            }
        }

        if (!exists) {
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
        else if (this.rule.startsWith("same")) {
            var sameAs = this.rule.split("=")[1];
            if (value == document.getElementById(sameAs).value)
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
        else if (this.rule.startsWith("minlen")) {
            var minlength = this.rule.split("=")[1];
            if (value.length >= minlength)
                return null;
            else
                return this.message;
        }
        else if (this.rule.startsWith("maxlen")) {
            var maxlength = this.rule.split("=")[1];
            if (value.length < maxlength)
                return null;
            else
                return this.message;
        }
        else if (this.rule == "num") {
            if (value.match(/^[\-\+]?[\d\,]*\.?[\d]*$/))
                return null;
            else
                return this.message;
        }
        else if (this.rule.startsWith("greater")) {
            var than = this.rule.split("=")[1];
            if (parseFloat(value) > parseFloat(than))
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
<div class="form-popup-2" id="sceneForm"></div>
<div class="form-popup" id="tileForm"></div>
<button id='addTile' class="open-button" onclick="openTileForm(null)">Add tile</button>
<div id="info"> Math </div>`;
}

function request(urlRequest, reqType, responseType, responseField, operation, callback) {
    const Http1 = new XMLHttpRequest();
    const url1 = "https://cors-anywhere.herokuapp.com/" + urlRequest;
    if (reqType == "GET")
        Http1.open("GET", url1);
    else if (reqType == "POST")
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
                    if (responseField != "") {
                        var fields = responseField.split('.')
                        var requestResult = '';

                        for (var i = 0; i < fields.length; i++)
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

/*function requestGET(urlRequest, responseType, responseField, operation, callback) {
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
}*/

function myNewRequest(urlRequest, requestType, data, responseType, responseField, operation, callback){
    const Http1 = new XMLHttpRequest();
    Http1.open(requestType, urlRequest, true);
    Http1.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    if(requestType != "GET" && data != "")
        Http1.send(data);
    else
        Http1.send();

    var requestResult = '';

    Http1.onreadystatechange = (e) => {
        if (Http1.readyState === 4 && Http1.status === 200) {
            if (requestType == "GET" && responseType == "JSON") {
                if (Http1.responseText != "" && responseType == "JSON") {
                    var json = JSON.parse(Http1.responseText);
                    var fields = responseField.split('.')
                    if (json.length > 0) {
                        json = json[0][fields[0]];
                        requestResult = json;
                        callback.apply(this, [requestResult]);
                    }
                    else {
                        callback.apply(this, [requestResult]);
                    }
                }
            }
            else{
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
    }

    Http1.onerror = function () {
        console.log("** An error occurred during the transaction");
        alert("I am an alert box!");
    };

    Http1.onloadend = function () {
        if (Http1.status == 404)
            // throw new Error(url + ' replied 404');
            console.log("404 Error");
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
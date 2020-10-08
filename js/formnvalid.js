class Form{
    constructor(form) {
            if (form != null)
                this.formId = form.formId;
            this.fields = form;
            if (this.formId != null)
                this.validation = new ValidationForm(this.formId);
            this.init = 0;
        }
    
        buildForm() {
            var json = this.fields;
            var initArray = [];
            var formDiv = document.getElementById(this.formId);
            var content = '';
    
            var defaultErrorClass = "test";
            var defaultbuttonStyle = "test";
            var defaultTitleStyle = "formTitle";
    
            if (formDiv != null) {
                if (json.formTabs == null || json.formId == null || json.formFields == null || json.buttons == null)
                    alert("Cannot create form, missing mendatory data");
                else {
                    formDiv.innerHTML = "";
    
                    if (json.formTitle != null) {
                        content += '<p';
                        if (json.formTitleClass != null)
                            content += ' class="' + json.formTitleClass + '">';
                        else
                            content += ' class="' + defaultTitleStyle + '">';
                        content += json.formTitle + '</p>';
                    }
    
                    var nbTabs = json.formTabs.length;
                      var tab = '';
                  var tabFieldsLines = '';
                  var i = 0;
                  var j = 0;
                    if (nbTabs > 1) {
                        content = this.createTabList(content, json.formTabs);
                        content += '<div class="tabcontents">';
                        content += '<form id="' + json.formId + '" action="javascript:void(0);" class="form-container">';
    
                        for (i = 0; i < nbTabs; i++) {
                            content += '<div class="tabcontent" id="tab_div' + i + '" style="display: block;">';
                            content += '<table style="width: 100%;">';
    
                            tab = json.formTabs[i];
                            tabFieldsLines = json.formFields[tab];
    
                            if (tabFieldsLines != null) {
                                for (j = 0; j < tabFieldsLines.length; j++) {
                                    content = this.createLine(initArray, content, tabFieldsLines[j]);
                                }
                            }
                            else
                                alert('Cannot find tab: ' + tab + ' in fields');
    
                            content += '</table>';
                            content += '</div>';
                        }
                    }
                    else if (nbTabs == 1) {
                        content += '<div class="contents">';
                        content += '<form id="' + json.formId + '" action="javascript:void(0);" class="form-container">';
                        content += '<table style="width: 100%;">';
    
                        tab = json.formTabs[0];
                        tabFieldsLines = json.formFields[tab];
    
                        if (tabFieldsLines != null) {
    
                            for (j = 0; j < tabFieldsLines.length; j++) {
                                content = this.createLine(initArray, content, tabFieldsLines[j]);
                            }
                        }
    
                        content += '</table>';
                    }
                    else
                        alert('At least a default tab is required');
    
                    if (json.error != null) {
                        if (json.error.id != null) {
                            content += '<div id="' + json.error.id + '"';
                            if (json.error.class != null)
                                content += 'class="' + json.error.class + '">';
                            else
                                content += 'class="' + defaultErrorClass + '">';
                            content += '<ul id="' + json.formId + '_errorUL"></ul></div>';
                        }
                    }
    
                    if (json.buttonStyle != null)
                        content += '<table style="' + json.buttonStyle + '">';
                    else
                        content += '<table style="' + defaultbuttonStyle + '">';
    
                    content += '<tr>';
    
                    for (i = 0; i < json.buttons.length; i++) {
                        content += '<td';
                        if (json.buttons[i].tdId != null)
                            content += ' id= "' + json.buttons[i].tdId + '"';
                        if (json.buttons[i].tdstyle != null)
                            content += ' style="' + json.buttons[i].tdstyle + '"';
                        content += '>';
                        content += '<button';
                        if (json.buttons[i].id != null)
                            content += ' id= "' + json.buttons[i].id + '"';
                        if (json.buttons[i].type != null)
                            content += ' type="' + json.buttons[i].type + '"';
                        if (json.buttons[i].class != null)
                            content += ' class="' + json.buttons[i].class + '"';
                        if (json.buttons[i].onclick != null)
                            content += ' onclick="' + json.buttons[i].onclick + '"';
                        content += '>';
                        if (json.buttons[i].name != null)
                            content += json.buttons[i].name;
                        content += '</button></td>';
                    }
                    content += '</tr></form>';
                    content += '</div>';
    
                    formDiv.innerHTML = content;
    
                    for (i = 0; i < json.buttons.length; i++) {
                        if (json.buttons[i].type == "submit" && json.buttons[i].submit != null)
                            this.submit(json.buttons[i].submit);
                    }
    
                    for (i = 0; i < initArray.length; i++) {
                        try {
                            eval(initArray[i]);
                        } catch (error) {
    
                        }
                    }
    
                    if (nbTabs > 1) {
                        var firstTab = document.getElementById("tabli_div0");
                        if (firstTab != null)
                            showActiveTab(firstTab);
                    }
                }
            }
        }
    
        submit(f) {
            var that = this;
            var form = document.getElementById(that.formId);
    
            if (form != null) {
                if (this.init == 0) {
                    form.addEventListener('submit', submitForm, true);
                    this.init++;
                }
    
                function submitForm() {
                    var errors = document.getElementById(that.formId + '_errorUL');
                    if (errors != null) {
                        errors.innerHTML = "";
                        that.validation.checkFields();
    
                        if (errors.children.length == 0) {
                            window[f]();
                            if (errors.children.length == 0)
                                document.getElementById(that.formId + '_errorloc').style.display = "none";
                            else
                                document.getElementById(that.formId + '_errorloc').style.display = "block";
                        }
                        else {
                            document.getElementById(that.formId + '_errorloc').style.display = "block";
                        }
                        return false;
                    }
                }
            }
        }
    
        createLine(initArray, form, line) {
    
            var k = 0;
            if (line[0].ligne != null) {
                form += '<tr><td colspan="3"';
                if (line[0].class != null)
                    form += ' class="' + line[0].class + '"';
                form += '>' + line[0].ligne + '</td></tr>';
                k = 1;
            }
    
            if (line[0].trid != null) {
                form += '<tr id="' + line[0].trid + '">';
                k = 1;
            }
            else
                form += '<tr>';
    
            for (k; k < line.length; k++) {
                var fieldParam = line[k];
                var type = fieldParam.type;
                var init = fieldParam.init;
    
                //TO DO
                if (init != null) {
                    if (init == 'initSelectFontInput')
                        initArray.push(init + '("' + fieldParam.id + '")');
                    else if (init.startsWith("initSelectNumberInput")) {
                        var params = init.split("initSelectNumberInput")[1].split(",");
                        initArray.push('initSelectNumberInput("' + fieldParam.id + '",' + params[1] + "," + params[2] + "," + params[3] + ")");
                    }
                    else if (init == "picker") {
                        initArray.push("var" + fieldParam.id + " = new Picker( '" + fieldParam.id + "', 150, 120);");
                    }
                }
    
                if (type == 'table') {
                    form += '<table';
                    if (fieldParam.id != null)
                        form += ' id="' + fieldParam.id + '"';
                    form += '>';
    
                    if (fieldParam.fields != null) {
                        for (var m = 0; m < fieldParam.fields.length; m++)
                            form = this.createLine(initArray, form, fieldParam.fields[m]);
                    }
    
                    form += '</table>';
                }
                else {
                    form = this.createField(form, fieldParam);
                }
            }
            form += '</tr>';
            return form;
        }
    
        createField(form, field) {
            if (field.id != null || field.type != null) {
                if (field.validation != null) {
                    for (var i = 0; i < field.validation.length; i++) {
                        if (field.validation[i].rule != null && field.validation[i].error != null)
                            this.validation.addValidation(field.id, field.validation[i].rule, field.validation[i].error);
                        else
                            alert('Cannot add validation for field: ' + field.id);
                    }
                }
    
                form += '<td';
                if (field.colspan != null)
                    form += ' colspan="' + field.colspan + '"';
                if (field.tdId != null)
                    form += ' id ="' + field.tdId + '"';
                form += '>';
    
                if (field.label != null && field.style != "display:none" && field.type != "label")
                    form += '<label for="' + field.id + '" id="' + field.id + 'Label"><b>' + field.label + '</b></label>';
    
                if (field.type == "label" && field.label != null) {
                    form += '<label for="' + field.id + '"><b>' + field.label + '</b></label>';
                }
    
                else if (field.type == "link") {
                    form += '<a id="' + field.id + '" href="#"';
                    if (field.onclick != null)
                        form += 'onclick="' + field.onclick + '">';
                    if (field.description != null)
                        form += field.description;
                    form += '</a>';
                }
    
                else if (field.type == 'select') {
                    form += '<select id="' + field.id + '"';
    
                    if (field.onchange != null) {
                        form += ' onchange="' + field.onchange + '"';
                    }
    
                    if (field.name != null) {
                        form += ' name="' + field.name + '"';
                    }
    
                    if (field.style != null) {
                        form += ' style="' + field.style + '"';
                    }
    
                    form += '>';
    
                    var selectOptions = field.options;
                    if (selectOptions != null) {
                        for (var selectOption = 0; selectOption < selectOptions.length; selectOption++)
                            form += '<option value="' + selectOptions[selectOption].value + '">' + selectOptions[selectOption].name + ' </option>';
                    }
                    form += '</td>';
                }
                else if (field.type == 'radio') {
                    var radioOptions = field.options;
                    if (radioOptions != null) {
                        for (var radioOption = 0; radioOption < radioOptions.length; radioOption++) {
    
                            var f = radioOptions[radioOption];
                            form += '<label><input type="radio"';
    
                            if (radioOption == 0)
                                form += ' checked ';
    
                            if (f.onclick != null) {
                                form += ' onclick="' + f.onclick + '"';
                            }
    
                            if (f.id != null) {
                                form += ' id = "' + f.id + '"';
                            }
    
                            if (f.value != null) {
                                form += ' value = "' + f.value + '"';
                            }
    
                            if (f.name != null) {
                                form += ' name="' + f.name + '"';
                            }
    
                            form += '>';
    
                            if (f.img != null) {
                                form += ' <img src="' + f.img + '"';
                            }
    
                            if (f.style != null) {
                                form += ' style="' + f.style + '"';
                            }
    
                            form += '></label>';
                        }
                    }
                    form += '</td>';
                }
                else if (field.type == 'color') {
                    form += '<input id = "' + field.id + '" type="text" class="myColorP" ';
    
                    if (field.readonly != null) {
                        form += field.readonly;
                    }
    
                    if (field.value != null) {
                        form += ' value="' + field.value + '"';
                    }
    
                    form += '></td>';
                }
                else if (field.type == 'text') {
                    form += '<input id = "' + field.id + '" type="' + field.type + '"';
    
                    if (field.readonly != null) {
                        form += field.readonly;
                    }
    
                    if (field.style != null) {
                        form += ' style="' + field.style + '"';
                    }
    
                    if (field.description != null) {
                        form += ' placeholder="' + field.description + '"';
                    }
    
                    if (field.onchange != null) {
                        form += ' onchange="' + field.onchange + '"';
                    }
    
                    if (field.name != null) {
                        form += ' name="' + field.name + '"';
                    }
    
                    if (field.class != null) {
                        form += ' class = "' + field.class + '"';
                    }
    
                    if (field.value != null) {
                        form += ' value="' + field.value + '"';
                    }
    
                    form += '></td>';
                }
                else if (field.type == 'password') {
                    form += '<input id = "' + field.id + '" type="' + field.type + '"';
    
                    if (field.readonly != null) {
                        form += field.readonly;
                    }
    
                    if (field.style != null) {
                        form += ' style="' + field.style + '"';
                    }
    
                    if (field.description != null) {
                        form += ' placeholder="' + field.description + '"';
                    }
    
                    if (field.onchange != null) {
                        form += ' onchange="' + field.onchange + '"';
                    }
    
                    if (field.name != null) {
                        form += ' name="' + field.name + '"';
                    }
    
                    if (field.class != null) {
                        form += ' class = "' + field.class + '"';
                    }
    
                    if (field.value != null) {
                        form += ' value="' + field.value + '"';
                    }
    
                    form += '></td>';
                }
                return form;
    
            }
            else
                alert('Missing mendatory data for field');
        }
    
        createTabList(form, formTabs) {
            var nbTabs = formTabs.length;
            if (nbTabs > 1) {
                form += '<ul id="tab_ul" class="tabs">';
                for (var i = 0; i < nbTabs; i++) {
                    if (i == 0) {
                        form += '<li class="selected"><a id="tabli_div' + i + '" rel="tab_div' + i + '" href="#" onclick="javascript:showActiveTab(this);">' + formTabs[i] + '</a></li>';
                    }
                    else
                        form += '<li class=""><a id="tabli_div' + i + '" rel="tab_div' + i + '" href="#" onclick="javascript:showActiveTab(this);">' + formTabs[i] + '</a></li>';
                }
                form += '</ul>';
            }
            return form;
        }
    }

    function initSelectNumberInput(inputId, min, max, deflt) {

        var selectInput = document.getElementById(inputId);
     
        for (var i = min; i <= max; i++) {
           var option = document.createElement("option");
           selectInput.options.add(option);
           option.text = i;
           option.value = i;
        }
     
        for (var i, j = 0; i = selectInput.options[j]; j++) {
           if (i.value == deflt) {
              selectInput.selectedIndex = j;
              break;
           }
        }
     }
     
     function setValueSectectInput(inputId, value) {
        var selectInput = document.getElementById(inputId);
     
        for (var i, j = 0; i = selectInput.options[j]; j++) {
           if (i.value == value) {
              selectInput.selectedIndex = j;
              break;
           }
        }
     }
     
     function initSelectFontInput(inputId) {
        var fonts = ["Montez", "Lobster", "Josefin Sans", "Shadows Into Light", "Pacifico",
           "Amatic SC", "Orbitron", "Rokkitt", "Righteous", "Dancing Script", "Bangers", "Chewy",
           "Sigmar One", "Architects Daughter", "Abril Fatface", "Covered By Your Grace",
           "Kaushan Script", "Gloria Hallelujah", "Satisfy", "Lobster Two", "Comfortaa", "Cinzel",
           "Courgette"];
        var selectInput = document.getElementById(inputId);
        for (var a = 0; a < fonts.length; a++) {
           var opt = document.createElement('option');
           opt.value = opt.innerHTML = fonts[a];
           opt.style.fontFamily = fonts[a];
           selectInput.add(opt);
        }
        applyFontInput(inputId);
     }
     
     function applyFontInput(inputId) {
        var x = document.getElementById(inputId).selectedIndex;
        var y = document.getElementById(inputId).options;
        document.body.insertAdjacentHTML("beforeend", "<style> #text{ font-family:'" +
           y[x].text + "';}" + "#" + inputId + "{font-family:'" + y[x].text + "';</style>");
     }

    function showActiveTab(elem) {
        var elements = document.getElementsByTagName('div');
     
        for (var i = 0; i < elements.length; i++)
           if (elements[i].className == 'tabcontent')
              elements[i].style.display = 'none';
     
        document.getElementById(elem.rel).style.display = 'block';
     
        var ul_el = document.getElementById('tab_ul');
        var li_el = ul_el.getElementsByTagName('li');
     
        for (var i = 0; i < li_el.length; i++)
           li_el[i].className = "";
        elem.parentNode.className = "selected";
     }
    
    function merge(out, in1, in2) {
        var a = Object.keys(in1);
        var b = Object.keys(in2);
        var i = 0;
    
        for (i = 0; i < a.length; i++) {
            if (b.includes(a[i])) {
                if (Object.prototype.toString.call(in1[a[i]]) == "[object Object]" && Object.prototype.toString.call(in1[a[i]]) == "[object Object]") {
                    out[a[i]] = {};
                    this.merge(out[a[i]], in1[a[i]], in2[a[i]]);
                }
                else if (Object.prototype.toString.call(in1[a[i]]) == "[object Array]" && Object.prototype.toString.call(in1[a[i]]) == "[object Array]") {
                    out[a[i]] = [];
                    out[a[i]] = out[a[i]].concat(in1[a[i]], in2[a[i]]);
                }
                else {
                    out[a[i]] = [in1[a[i]], in2[a[i]]];
                }
            }
            else {
                out[a[i]] = in1[a[i]];
            }
        }
    
        for (i = 0; i < b.length; i++) {
            if (!a.includes(b[i])) {
                out[b[i]] = in2[b[i]];
            }
        }
    }
    
    class ValidationForm {
        constructor(form) {
            this.form = form;
            this.fields = [];
        }
    
        clearAllValidations() {
            this.fields = [];
        }
    
        addValidation(field, rule, errorMessage) {
    
            var exists = false;
            var r = new Rule(rule, errorMessage);
          var i = 0;
            for (i = 0; i < this.fields.length; i++) {
                if (this.fields[i].name == field) {
                    this.fields[i].rules.push(r);
                    exists = true;
                }
            }
    
            if (!exists) {
                var f = new Field(field);
                f.rules.push(r);
                this.fields.push(f);
            }
        }
    
        removeValidation(field) {
          var i = 0;
            for (i; i < this.field.length; i++) {
                if (this.fields[i].name == field)
                    this.fields.splice(i, 1);
            }
        }
    
        desactivateField(field) {
          var i = 0;  
          for (i; i < this.fields.length; i++) {
                if (this.fields[i].name == field)
                    this.fields[i].isActive = false;
            }
        }
    
        activateField(field) {
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields[i].name == field)
                    this.fields[i].isActive = true;
            }
        }
    
        checkFields() {
            var errors = document.getElementById(this.form + "_errorUL");
            if (errors != null) {
                for (var i = 0; i < this.fields.length; i++) {
                    if (this.fields[i].isActive) {
                        for (var j = 0; j < this.fields[i].rules.length; j++) {
                            var result = this.fields[i].rules[j].validate(this.fields[i].name);
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
        }
    }
    
    class Field {
        constructor(field) {
            this.name = field;
            this.rules = [];
            this.isActive = true;
        }
    }
    
    class Rule {
        constructor(rule, message) {
            this.rule = rule;
            this.message = message;
        }
    
        validate(field) {
            var fieldFromForm = document.getElementById(field);
            if (fieldFromForm != null) {
                var value = document.getElementById(field).value;
                if (this.rule == 'req') {
                    if (value != '')
                        return null;
                    else
                        return this.message;
                }
                else if (this.rule.startsWith("same")) {
                    var sameAs = this.rule.split("=")[1];
                    var fieldElem = document.getElementById(sameAs);
                    if (fieldElem != null) {
                        if (value === fieldElem.value)
                            return null;
                        else
                            return this.message;
                    }
                }
                if (this.rule == 'email') {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
                        return null;
                    else
                        return this.message;
                }
                else if (this.rule == "url") {
                    var expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[^\s][a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/\S*)?$/;
                    if (value.match(expression))
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
                        return null;
                    else
                        return this.message;
                }
            }
        }
    }
class Form {
    constructor(form) {
        if (form != null)
            this.formId = form.formId;
        this.fields = form;
        if (this.formId != null)
            this.validation = new ValidationForm(this.formId);
        this.init = 0;
    }

    build() {
        const json = this.fields;
        let initArray = [];
        const formDiv = document.getElementById(this.formId);
        let htmlContent = '';

        const defaultErrorClass = 'test';
        const defaultbuttonStyle = 'test';
        const defaultTitleStyle = 'formTitle';

        if (formDiv != null) {
            if (json.formTabs == null || json.formId == null || json.formFields == null || json.buttons == null)
                alert('Cannot create form, missing mendatory data');
            else {
                formDiv.innerHTML = '';

                if (json.formTitle != null) {
                    htmlContent += '<p';
                    if (json.formTitleClass != null)
                        htmlContent += ' class="' + json.formTitleClass + '">';
                    else
                        htmlContent += ' class="' + defaultTitleStyle + '">';
                    htmlContent += json.formTitle + '</p>';
                }

                const nbTabs = json.formTabs.length;
                let tab = '';
                let tabFieldsLines = '';
                let i = 0, j = 0;

                if (nbTabs > 1) {
                    htmlContent = this.createTabList(htmlContent, json.formTabs);
                    htmlContent += '<div class="tabcontents">';
                    htmlContent += '<form id="' + json.formId + '" action="javascript:void(0);" class="form-container">';

                    for (i; i < nbTabs; i+=1) {
                        htmlContent += '<div class="tabcontent" id="tab_div' + i + '" style="display: block;">';
                        htmlContent += '<table style="width: 100%;">';

                        tab = json.formTabs[i];
                        tabFieldsLines = json.formFields[tab];

                        if (tabFieldsLines != null) {
                            for (j=0; j < tabFieldsLines.length; j+=1) {
                                htmlContent = this.createLine(initArray, htmlContent, tabFieldsLines[j]);
                            }
                        }
                        else
                            alert('Cannot find tab: ' + tab + ' in fields');

                        htmlContent += '</table>';
                        htmlContent += '</div>';
                    }
                }
                else if (nbTabs == 1) {
                    htmlContent += '<div class="contents">';
                    htmlContent += '<form id="' + json.formId + '" action="javascript:void(0);" class="form-container">';
                    htmlContent += '<table style="width: 100%;">';

                    tab = json.formTabs[0];
                    tabFieldsLines = json.formFields[tab];

                    if (tabFieldsLines != null) {

                        for (j = 0; j < tabFieldsLines.length; j+=1) {
                            htmlContent = this.createLine(initArray, htmlContent, tabFieldsLines[j]);
                        }
                    }

                    htmlContent += '</table>';
                }
                else
                    alert('At least a default tab is required');

                if (json.error != null) {
                    if (json.error.id != null) {
                        htmlContent += '<div id="' + json.error.id + '"';
                        if (json.error.class != null)
                            htmlContent += 'class="' + json.error.class + '">';
                        else
                            htmlContent += 'class="' + defaultErrorClass + '">';
                        htmlContent += '<ul id="' + json.formId + '_errorUL"></ul></div>';
                    }
                }

                if (json.buttonStyle != null)
                    htmlContent += '<table style="' + json.buttonStyle + '">';
                else
                    htmlContent += '<table style="' + defaultbuttonStyle + '">';

                htmlContent += '<tr>';

                for (i = 0; i < json.buttons.length; i+=1) {
                    htmlContent += '<td';
                    if (json.buttons[i].tdId != null)
                        htmlContent += ' id= "' + json.buttons[i].tdId + '"';
                    if (json.buttons[i].tdstyle != null)
                        htmlContent += ' style="' + json.buttons[i].tdstyle + '"';
                    htmlContent += '>';
                    htmlContent += '<button';
                    if (json.buttons[i].id != null)
                        htmlContent += ' id= "' + json.buttons[i].id + '"';
                    if (json.buttons[i].type != null)
                        htmlContent += ' type="' + json.buttons[i].type + '"';
                    if (json.buttons[i].class != null)
                        htmlContent += ' class="' + json.buttons[i].class + '"';
                    if (json.buttons[i].onclick != null)
                        htmlContent += ' onclick="' + json.buttons[i].onclick + '"';
                    htmlContent += '>';
                    if (json.buttons[i].name != null)
                        htmlContent += json.buttons[i].name;
                    htmlContent += '</button></td>';
                }
                htmlContent += '</tr></form>';
                htmlContent += '</div>';

                formDiv.innerHTML = htmlContent;

                for (i = 0; i < json.buttons.length; i+=1) {
                    if (json.buttons[i].type == 'submit' && json.buttons[i].submit != null)
                        this.submit(json.buttons[i].submit);
                }

                for (i = 0; i < initArray.length; i+=1) {
                    try {
                        eval(initArray[i]);
                    } catch (error) {

                    }
                }

                if (nbTabs > 1) {
                    const firstTab = document.getElementById('tabli_div0');
                    if (firstTab != null)
                        showActiveTab(firstTab);
                }
            }
        }
    }

    submit(f) {
        const that = this;
        const form = document.getElementById(that.formId);

        if (form != null) {
            if (this.init == 0) {
                form.addEventListener('submit', submitForm, true);
                this.init+=1;
            }

            function submitForm() {
                const errors = document.getElementById(that.formId + '_errorUL');
                if (errors != null) {
                    errors.innerHTML = '';
                    that.validation.checkFields();

                    if (errors.children.length == 0) {
                        window[f]();
                        if (errors.children.length == 0)
                            document.getElementById(that.formId + '_errorloc').style.display = 'none';
                        else
                            document.getElementById(that.formId + '_errorloc').style.display = 'block';
                    }
                    else {
                        document.getElementById(that.formId + '_errorloc').style.display = 'block';
                    }
                    return false;
                }
            }
        }
    }

    createLine(initArray, form, line) {
        let i = 0;
        if (line[0].ligne != null) {
            form += '<tr><td colspan="3"';
            if (line[0].class != null)
                form += ' class="' + line[0].class + '"';
            form += '>' + line[0].ligne + '</td></tr>';
            i = 1;
        }

        if (line[0].trid != null) {
            form += '<tr id="' + line[0].trid + '">';
            i = 1;
        }
        else
            form += '<tr>';

        for (i; i < line.length; i+=1) {
            const fieldParam = line[i];

            //TO DO
            if (fieldParam.init != null) {
                if (fieldParam.init == 'initSelectFontInput')
                    initArray.push(fieldParam.init + '("' + fieldParam.id + '")');
                else if (fieldParam.init.startsWith("initSelectNumberInput")) {
                    var params = fieldParam.init.split("initSelectNumberInput")[1].split(",");
                    initArray.push('initSelectNumberInput("' + fieldParam.id + '",' + params[1] + "," + params[2] + "," + params[3] + ")");
                }
                else if (fieldParam.init == "picker") {
                    initArray.push("var" + fieldParam.id + " = new Picker( '" + fieldParam.id + "', 150, 120);");
                }
            }

            if (fieldParam.type == 'table') {
                form += '<table';
                if (fieldParam.id != null)
                    form += ' id="' + fieldParam.id + '"';
                form += '>';

                if (fieldParam.fields != null) {
                    for (var m = 0; m < fieldParam.fields.length; m+=1)
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
                let i = 0;
                for (i; i < field.validation.length; i+=1) {
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

                const selectOptions = field.options;
                if (selectOptions != null) {
                    let selectOption = 0;
                    for (selectOption; selectOption < selectOptions.length; selectOption+=1)
                        form += '<option value="' + selectOptions[selectOption].value + '">' + selectOptions[selectOption].name + ' </option>';
                }
                form += '</td>';
            }
            else if (field.type == 'radio') {
                const radioOptions = field.options;
                if (radioOptions != null) {
                    let radioOption = 0;
                    for (radioOption; radioOption < radioOptions.length; radioOption+=1) {

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
        if (formTabs.length > 1) {
            let i = 0;
            form += '<ul id="tab_ul" class="tabs">';
            for (i; i < formTabs.length; i+=1) {
                if (i === 0) {
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

    const selectInput = document.getElementById(inputId);
    let i = 0, j = 0;

    for (i = min; i <= max; i+=1) {
        const option = document.createElement("option");
        selectInput.options.add(option);
        option.text = i;
        option.value = i;
    }

    for (i, j = 0; i = selectInput.options[j]; j+=1) {
        if (i.value == deflt) {
            selectInput.selectedIndex = j;
            break;
        }
    }
}

function setValueSectectInput(inputId, value) {
    const selectInput = document.getElementById(inputId);
    let i = 0, j = 0;
    for (i, j = 0; i = selectInput.options[j]; j+=1) {
        if (i.value == value) {
            selectInput.selectedIndex = j;
            break;
        }
    }
}

function initSelectFontInput(inputId) {
    const fonts = ["Montez", "Lobster", "Josefin Sans", "Shadows Into Light", "Pacifico",
        "Amatic SC", "Orbitron", "Rokkitt", "Righteous", "Dancing Script", "Bangers", "Chewy",
        "Sigmar One", "Architects Daughter", "Abril Fatface", "Covered By Your Grace",
        "Kaushan Script", "Gloria Hallelujah", "Satisfy", "Lobster Two", "Comfortaa", "Cinzel",
        "Courgette"];
    const selectInput = document.getElementById(inputId);
    let i = 0;
    for (i; i < fonts.length; i+=1) {
        const opt = document.createElement('option');
        opt.value = opt.innerHTML = fonts[i];
        opt.style.fontFamily = fonts[i];
        selectInput.add(opt);
    }
    applyFontInput(inputId);
}

function applyFontInput(inputId) {
    const x = document.getElementById(inputId).selectedIndex;
    const y = document.getElementById(inputId).options;
    document.body.insertAdjacentHTML("beforeend", "<style> #text{ font-family:'" +
        y[x].text + "';}" + "#" + inputId + "{font-family:'" + y[x].text + "';</style>");
}

function showActiveTab(elem) {
    const elements = document.getElementsByTagName('div');
    let i = 0;

    for (i; i < elements.length; i+=1)
        if (elements[i].className == 'tabcontent')
            elements[i].style.display = 'none';

    document.getElementById(elem.rel).style.display = 'block';

    const ul_el = document.getElementById('tab_ul');
    const li_el = ul_el.getElementsByTagName('li');

    for (i = 0; i < li_el.length; i+=1)
        li_el[i].className = "";
    elem.parentNode.className = "selected";
}

function merge(out, in1, in2) {
    const a = Object.keys(in1);
    const b = Object.keys(in2);
    let i = 0;

    for (i = 0; i < a.length; i+=1) {
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

    for (i = 0; i < b.length; i+=1) {
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
        for (i = 0; i < this.fields.length; i+=1) {
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
        for (i; i < this.field.length; i+=1) {
            if (this.fields[i].name == field)
                this.fields.splice(i, 1);
        }
    }

    desactivateField(field) {
        var i = 0;
        for (i; i < this.fields.length; i+=1) {
            if (this.fields[i].name == field)
                this.fields[i].isActive = false;
        }
    }

    activateField(field) {
        for (var i = 0; i < this.fields.length; i+=1) {
            if (this.fields[i].name == field)
                this.fields[i].isActive = true;
        }
    }

    checkFields() {
        var errors = document.getElementById(this.form + "_errorUL");
        if (errors != null) {
            for (var i = 0; i < this.fields.length; i+=1) {
                if (this.fields[i].isActive) {
                    for (var j = 0; j < this.fields[i].rules.length; j+=1) {
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
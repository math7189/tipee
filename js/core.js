class TipeeApp {
    constructor() {
        this.scenes = [];
        this.activeScene;
        this.formTileValidator;
        this.formNewSCeneValidator;
        this.formLoginValidator;
        this.login;
        this.mode = "prod";
        this.demoScene = new TipeeScene("demo");
        this.tileForm = new Form();
        this.sceneForm = new Form(sceneFormTemplate);
        this.init();
    }

    init() {
        var that = this;

        createUI();
        this.sceneForm.buildForm();
        createSigninSignupForm();
        openSigninSignupForm();
        updateSigninSignupForm('signin');

        this.formTileValidator = new ValidationForm('tileForm');
        //this.createTileFormValidator();
        //this.formNewSCeneValidator = new ValidationForm('sceneForm');
        //this.createSceneFormValidator();

        if (sessionStorage.length > 0) {
            var sessionLogin = JSON.parse(sessionStorage.user);
            if (sessionLogin != null) {
                that.login = sessionLogin;
            }

            var getUserDashboardCallback = function (returned_data) {
                if (returned_data != '207')
                    loadJSON(JSON.parse(returned_data));
                if (myApp.activeScene == null) {
                    openSceneForm()
                    myApp.changeScene()
                }
            };

            closeSigninSignupForm();

            if (that.mode != "dev")
                requestGET('/nodejs/dashboard/' + that.login, 'JSON', 'data', '', getUserDashboardCallback)
            document.getElementById('splashScreen').classList.add('splashScreenTranslate');
        }

        var loginForm = document.getElementById('signinSignupForm');
        loginForm.addEventListener('submit', function (event) {
            var errors = document.getElementById('signinSignupForm_errorUL');
            errors.innerHTML = "";

            var action;
            if (document.getElementById('signin').style.display == 'none')
                action = "signin"
            else
                action = "signup"
            that.createSigninSignupFormValidator(action)

            that.formLoginValidator.checkFields();
            if (errors.children.length == 0) {
                document.getElementById('signinSignupForm_errorloc').style.display = "none";
                if (document.getElementById('signin').style.display == 'none') {
                    var login = document.getElementById('login').value;
                    var password = document.getElementById('password').value;
                    that.login = login;

                    var loginCallback = function (returned_data) {
                        if (returned_data == 1) {
                            sessionStorage.setItem('user', JSON.stringify(login));
                            var getUserDashboardCallback = function (returned_data) {
                                if (returned_data != '207')
                                    loadJSON(JSON.parse(returned_data));
                                if (myApp.activeScene == null) {
                                    openSceneForm()
                                    myApp.changeScene()
                                }
                            };
                            document.getElementById('signinSignupForm_errorloc').style.display = "none";
                            if (that.mode != "dev")
                                requestGET('/nodejs/dashboard/' + login, 'JSON', 'data', '', getUserDashboardCallback);
                            document.getElementById('splashScreen').classList.add('splashScreenTranslate');
                        }
                        else if (returned_data == 2) {
                            document.getElementById('signinSignupForm_errorloc').style.display = "block";
                            var li = document.createElement("li");
                            li.appendChild(document.createTextNode("Login and password not match"));
                            errors.appendChild(li);
                        }
                        else if (returned_data == 3) {
                            document.getElementById('signinSignupForm_errorloc').style.display = "block";
                            var li = document.createElement("li");
                            li.appendChild(document.createTextNode('Login does not exists'));
                            errors.appendChild(li);
                        }
                    };
                    if (that.mode != "dev")
                        requestLogin('/nodejs/user/' + login, password, loginCallback);
                    else
                        loginCallback(1)
                }
                else {
                    var login = document.getElementById('login').value;
                    var password = document.getElementById('password').value;
                    var repassword = document.getElementById('repassword').value;
                    var email = document.getElementById('email').value;
                    var firstname = document.getElementById('firstname').value;
                    var lastname = document.getElementById('lastname').value;

                    if (password == repassword) {
                        var formData = {};
                        formData['login'] = login;
                        formData['password'] = password;
                        formData['email'] = email;
                        formData['firstname'] = firstname;
                        formData['lastname'] = lastname;

                        var createUserCallback = function (return_value) {
                            if (return_value == 1) {
                                var getUserDashboardCallback = function (returned_data) {
                                    console.log(returned_data);
                                    if (returned_data != '207')
                                        loadJSON(JSON.parse(returned_data));
                                    if (myApp.activeScene == null) {
                                        openSceneForm();
                                        myApp.changeScene();
                                    }
                                };

                                if (that.mode != "dev")
                                    requestGET('/nodejs/dashboard/' + login, 'JSON', 'data', '', getUserDashboardCallback);
                                document.getElementById('splashScreen').classList.add('splashScreenTranslate');
                            }
                            else if (return_value == 2) {
                                document.getElementById('signinSignupForm_errorloc').style.display = "block";
                                var li = document.createElement("li");
                                li.appendChild(document.createTextNode('Login already exists'));
                                errors.appendChild(li);

                            }
                            else if (return_value == 3) {
                                document.getElementById('signinSignupForm_errorloc').style.display = "block";
                                var li = document.createElement("li");
                                li.appendChild(document.createTextNode('Email already exists'));
                                errors.appendChild(li);
                            }
                        }
                        if (that.mode != "dev")
                            requestCreateUser('/nodejs/users/', formData, createUserCallback);
                    }
                    else {
                        document.getElementById('signinSignupForm_errorloc').style.display = "block";
                        var li = document.createElement("li");
                        li.appendChild(document.createTextNode("Password does not match"));
                        errors.appendChild(li);
                    }
                }
            }
            else {
                document.getElementById('signinSignupForm_errorloc').style.display = "block";
            }
        }, false);
    }

    logout() {
        this.login = ""
        sessionStorage.clear();
        document.location.reload(true);
    }

    loadSession() {
        if (sessionStorage.length > 0) {
            if (sessionStorage.scenes != null) {
                var sessionScenes = JSON.parse(sessionStorage.scenes);
                if (sessionScenes != null) {
                    loadJSON(sessionScenes);
                }
            }
        }
    }

    createSceneSubmit(){
        var isCreated = this.createScene();
        if (!isCreated) {
            var errors = document.getElementById('sceneForm_errorUL');
            document.getElementById('sceneForm_errorloc').style.display = "block";
            var li = document.createElement("li");
            li.appendChild(document.createTextNode("Scene already exists"));
            errors.appendChild(li);
        }
        else
            document.getElementById('sceneForm_errorloc').style.display = "none";
    }

    createOrUpdateTpTile() {
        var type = document.getElementById('type').value;
        var idTile = document.getElementById('idTile').value;

        var tileToBeUpdtated;
        if (idTile != '') {
            for (var i = 0; i < myApp.activeScene.tiles.length; i++) {

                if (myApp.activeScene.tiles[i].idTile == idTile) {
                    tileToBeUpdtated = myApp.activeScene.tiles[i];
                    tileToBeUpdtated.update();
                    tileToBeUpdtated.redraw();
                }
            };
        }
        else {
            if (type == 'note') {
                var newTile = new TipeeTileNote(myApp.activeScene);
                newTile.findAvailablePos(this.activeScene.tiles)
                newTile.update();
                newTile.draw();
            }

            if (type == 'todo') {
                var newTile = new TipeeTileTodo(myApp.activeScene);
                newTile.findAvailablePos(this.activeScene.tiles)
                newTile.update();
                newTile.draw();
            }
            if (type == 'text') {
                var newTile = new TipeeTileText(myApp.activeScene);
                var test = newTile.findAvailablePos(this.activeScene.tiles);
                var tour = 0
                while (!test) {
                    if (tour == this.activeScene.tiles.length - 1)
                        tour = 0
                    this.activeScene.tiles[tour].autoResize()
                    var list = [];
                    for (i = 0; i < this.activeScene.tiles.length; i++) {
                        if (this.activeScene.tiles[i] != this) {
                            list.push(this.activeScene.tiles[i])
                            this.activeScene.tiles[i].findAvailablePos(list)
                        }
                    }
                    tour += 1
                    test = newTile.findAvailablePos(this.activeScene.tiles)
                }
                newTile.update();
                newTile.draw();
            }
            else if (type == 'image') {
                var newTile = new TipeeTileImage(myApp.activeScene);
                var test = newTile.findAvailablePos(this.activeScene.tiles);
                var tour = 0
                while (!test) {
                    if (tour == this.activeScene.tiles.length - 1)
                        tour = 0
                    this.activeScene.tiles[tour].autoResize()
                    var list = [];
                    for (i = 0; i < this.activeScene.tiles.length; i++) {
                        if (this.activeScene.tiles[i] != this) {
                            list.push(this.activeScene.tiles[i])
                            this.activeScene.tiles[i].findAvailablePos(list)
                        }
                    }
                    tour += 1
                    test = newTile.findAvailablePos(this.activeScene.tiles)
                }
                newTile.update()
                newTile.draw();
                newTile.refreshEvery();
            }
            else if (type == 'toggles') {
                var newTile = new TipeeTileToggles(myApp.activeScene);
                newTile.findAvailablePos(this.activeScene.tiles)
                newTile.update()
                newTile.draw();
            }
        }

        closeTileForm();
    }

    demo() {
        var demoscene = new TipeeScene()
        demoscene.sceneName = "demo"
        demoscene.sceneId = "demo"
        demoscene.scene = document.getElementById('demo');
        var texTile = new TipeeTileText(demoscene, 0, 0, 150, 150, true, "FFFFF", "black", "", "13", "blue", "2", "white", "Texte", "", "", "", "", "", "", "", "", "", "", "");
        texTile.draw()

        var imgTile = new TipeeTileImage(demoscene, 160, 0, 150, 150, true, "", "", "", "", "", "", "", "Image", 1, "", 0, 0);
        imgTile.draw()
    }

    //TO DO
    save() {
        var that = this;
        var arrayApp = { 'app': [] };
        var arrayScene = { 'scenes': [] };

        this.scenes.forEach(elementScene => {
            var scene = elementScene.toJSON();
            var arrayTiles = [];
            elementScene.tiles.forEach(tile => {

                    var test = tile.toJSON();
                    arrayTiles.push(test);

            });
            scene['tiles'] = arrayTiles;
            arrayScene['scenes'].push(scene);
        });

        arrayApp['app'].push(arrayScene);

        var json = JSON.stringify(arrayApp);
        var file = new File([json], 'myFilename.txt', {
            type: 'application/octet-stream'
        });

        var blobUrl = (URL || webkitURL).createObjectURL(file);
        window.location = blobUrl;
        sessionStorage.setItem('scenes', JSON.stringify(arrayApp));
        var e = 'Sun May 10 2020 15:44:38'; 
        document.cookie = 'scenes='+ JSON.stringify(arrayApp) +';expires=' + e;

        var performSomeActionInit = function (returned_data) {
            console.log(returned_data);
            if (returned_data == '207') {
                if (that.mode != "dev")
                    requestCreateDashboard('/nodejs/dashboards?userId=' + that.login, json, function () { console.log('create success') })
            }
            else {
                var saveDoneCallback = function (returned) {
                    console.log(returned);
                }
                if (that.mode != "dev")
                    requestUpdateDashboard('/nodejs/dashboard/' + that.login, json, saveDoneCallback)
            }
        };

        if (that.mode != "dev")
            requestGET('/nodejs/dashboard/' + this.login, 'JSON', 'data', '', performSomeActionInit)
    }

    //TO DO
    export() {
        this.save();
        
    }

    createSceneFormValidator() {
        this.formNewSCeneValidator.addValidation('sceneName', 'req', 'Name is required');
        this.formNewSCeneValidator.addValidation('sceneName', 'maxlen=30', 'Max length for name is 30');
    }

    createSigninSignupFormValidator(action) {
        this.formLoginValidator = new ValidationForm('signinSignupForm');
        if (action == "signin") {
            this.formLoginValidator.addValidation('login', 'req', 'Login is required');
            this.formLoginValidator.addValidation('login', 'maxlen=50', 'Max length for login is 50');

            this.formLoginValidator.addValidation('password', 'req', 'Password is required');
            this.formLoginValidator.addValidation('password', 'maxlen=50', 'Max length for password is 50');
        }
        else {
            this.formLoginValidator.addValidation('login', 'req', 'Login is required');
            this.formLoginValidator.addValidation('login', 'maxlen=50', 'Max length for login is 50');

            this.formLoginValidator.addValidation('password', 'req', 'Password is required');
            this.formLoginValidator.addValidation('password', 'maxlen=50', 'Max length for password is 50');
            this.formLoginValidator.addValidation('password', 'minlen=8', 'Min length for password is 8');

            this.formLoginValidator.addValidation('email', 'req', 'Email is required');
            this.formLoginValidator.addValidation('email', 'email', 'Email should be a valid email format');

            this.formLoginValidator.addValidation('repassword', 'req', 'Retype Password is required');
            this.formLoginValidator.addValidation('repassword', 'same=password', 'Passwords should be identicals');

            this.formLoginValidator.addValidation('firstname', 'req', 'Firstname is required');
            this.formLoginValidator.addValidation('lastname', 'req', 'Lastname is required');
        }
    }

    createTileFormValidator() {
        this.formTileValidator.addValidation("title", "req", "Title is required");
        this.formTileValidator.addValidation("title", "minlen=2", "Title min is 2");
        this.formTileValidator.addValidation("title", "maxlen=30", "Title max is 30");

        if (document.getElementById('type').value == 'image') {

            this.formTileValidator.addValidation('imgRefresh', 'req', 'Img Refresh is required');
            this.formTileValidator.addValidation('imgRefresh', 'num', 'Refresh should be a number');
            this.formTileValidator.addValidation('imgRefresh', 'greater=59',
                'Refresh should be minumum 60s');
            if (document.getElementById('imgType').value == 'slideshow') {
                this.formTileValidator.addValidation('imgSlideInterval', 'req',
                    'Interval is required');
                this.formTileValidator.addValidation('imgSlideInterval', 'num',
                    'Interval should be a number');
                this.formTileValidator.addValidation('imgSlideInterval', 'greater=0',
                    'Interval should be minumum 1s');
            }
        }
        this.formTileValidator.addValidation('width', 'req', 'Width is required');
        this.formTileValidator.addValidation('width', 'num', 'Width should be a number');
        this.formTileValidator.addValidation('height', 'req', 'Height is required');
        this.formTileValidator.addValidation('height', 'num', 'Height should be a number');
    }

    createScene() {
        var newSceneName = document.getElementById('sceneName').value;
        var selectSceneInput = document.getElementById('sceneSelect');
        var optionsSelectSceneInput = selectSceneInput.options;
        var alreadyExists = false;

        for (var i, j = 0; i = selectSceneInput.options[j]; j++) {
            if (i.value == newSceneName) {
                alreadyExists = true;
                break;
            }
        }

        if (alreadyExists) {
            return false;
        }
        else {
            var newScene = new TipeeScene();
            newScene.sceneName = newSceneName;

            var option = document.createElement('option');
            option.text = newScene.sceneName;
            option.value = newScene.sceneName;
            selectSceneInput.options.add(option);

            for (var i, j = 0; i = selectSceneInput.options[j]; j++) {
                if (i.value == newScene.sceneName) {
                    selectSceneInput.selectedIndex = j;
                    break;
                }
            }

            var opts = optionsSelectSceneInput.length;

            if (opts > 2)
                optionsSelectSceneInput[0].style.display = 'none'

            if (this.activeScene != null)
                this.clearActiveScene();

            this.setActiveScene(newScene);
            this.showNewTileButton();
            closeSceneForm();
            return true;
        }
    }

    reloadActiveScene() {
        var scene = this.activeScene;
        if (scene != null)
            setValueSectectInput("sceneSelect", scene.sceneName)
        else
            setValueSectectInput("sceneSelect", "default")
    }

    changeScene() {
        var selectSceneInput = document.getElementById('sceneSelect');
        var opts = selectSceneInput.options.length;

        if (opts > 2)
            document.getElementById('sceneSelect').options[0].style.display = 'none'

        if (selectSceneInput.value == 'new') {
            openSceneForm();
        }
        else if (selectSceneInput.value == 'default')
            this.hideNewTileButton();
        else {
            var selectedScene;
            for (var i = 0; i < this.scenes.length; i++) {
                if (this.scenes[i].sceneName == selectSceneInput.value)
                    selectedScene = this.scenes[i];
            }
            this.showNewTileButton();
            this.changeActiveScene(selectedScene);
        }
    }

    showNewTileButton() {
        var addTileButton = document.getElementById('addTile');
        addTileButton.style.display = 'block';
    }

    hideNewTileButton() {
        var addTileButton = document.getElementById('addTile');
        addTileButton.style.display = 'none';
    }

    setActiveScene(scene) {
        this.activeScene = scene;
        scene.isActive = true;
    }

    changeActiveScene(newSceneActive) {
        this.activeScene.clearScene();
        this.activeScene.isActive = false;
        this.setActiveScene(newSceneActive);
        this.drawActiveScene();
    }

    clearActiveScene() {
        this.activeScene.clearScene();
    }

    drawActiveScene() {
        this.activeScene.drawScene();
    }
}

class TipeeScene {
    constructor(sceneName) {
        this.scene = document.getElementById('scene');
        this.sceneId = "scene"
        this.tiles = [];
        this.sceneName = sceneName
        this.isActive;
        this.gridX = 50;
        this.gridY = 50;
        this.idScene = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        if (this.sceneName != "demo")
            myApp.scenes.push(this);
    }

    addDiv(parentDiv, content, attrs) {
        var div = document.createElement('div');
        var parent = document.getElementById(parentDiv);

        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                div.setAttribute(key, attrs[key]);
            }
        }
        div.innerHTML = content;
        if (parent) {
            parent.appendChild(div);
        }
    }

    removeElement(elemId) {
        var elem = document.getElementById(elemId);
        elem.parentNode.removeChild(elem);
    }

    deleteTileById(tileId) {
        var tileToBeDeleted;
        var index;
        for (var j = 0; j < this.tiles.length; j++) {
            var tile = this.tiles[j];
            if (tile.idTile == tileId) {
                tileToBeDeleted = tile;
                index = j;
            }
        }

        if (tileToBeDeleted != null) {
            this.removeElement(tileId + ' resizable');

            if (tileToBeDeleted.intervalId != null)
                clearInterval(tileToBeDeleted.intervalId)
            this.tiles.splice(index, 1);
        }
    }

    duplicateTileById(tileId) {
        var tileToBeDuplicated;
        for (var j = 0; j < this.tiles.length; j++) {
            var tile = this.tiles[j];
            if (tile.idTile == tileId) {
                tileToBeDuplicated = tile;
            }
        }

        if (tileToBeDuplicated.type == 'text') {
            var newTile = new TipeeTileText(tileToBeDuplicated.scene, tileToBeDuplicated.x, tileToBeDuplicated.y, tileToBeDuplicated.width, tileToBeDuplicated.height, false, tileToBeDuplicated.headerColor,
                tileToBeDuplicated.headerFontColor, tileToBeDuplicated.headerFont, tileToBeDuplicated.headerFontSize, tileToBeDuplicated.borderColor, tileToBeDuplicated.borderSize,
                tileToBeDuplicated.contentBackgroundColor, tileToBeDuplicated.title, tileToBeDuplicated.requestUrl, tileToBeDuplicated.reqType, tileToBeDuplicated.responseType, tileToBeDuplicated.responseField, tileToBeDuplicated.textBefore,
                tileToBeDuplicated.textAfter, tileToBeDuplicated.requestRefresh, tileToBeDuplicated.textColor, tileToBeDuplicated.textFont, tileToBeDuplicated.textFontSize, tileToBeDuplicated.operation);
            newTile.draw();
        }
        else if (tileToBeDuplicated.type == 'image') {
            var newTile = new TipeeTileImage(tileToBeDuplicated.scene, tileToBeDuplicated.x, tileToBeDuplicated.y, tileToBeDuplicated.width, tileToBeDuplicated.height, false, tileToBeDuplicated.headerColor,
                tileToBeDuplicated.headerFontColor, tileToBeDuplicated.headerFont, tileToBeDuplicated.headerFontSize, tileToBeDuplicated.borderColor, tileToBeDuplicated.borderSize,
                tileToBeDuplicated.contentBackgroundColor, tileToBeDuplicated.title, tileToBeDuplicated.imgNb, tileToBeDuplicated.imgSrc, tileToBeDuplicated.imgSlideInterval, tileToBeDuplicated.imgRefresh);
            newTile.draw();
            newTile.refreshEvery();
        }
    }

    clearScene() {
        for (var j = 0; j < this.tiles.length; j++) {
            var tile = this.tiles[j];
            var elem = document.getElementById(tile.idTile + ' resizable');
            if (elem != null) {
                elem.parentNode.removeChild(elem);
                if (tile.intervalId != null)
                    clearInterval(tile.intervalId)
            }
        }
    }

    drawScene() {
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            tile.draw();
        }
    }

    toJSON() {
        var valueDict = {};
        valueDict['sceneId'] = this.idScene;
        valueDict['sceneName'] = this.sceneName;
        valueDict['isActive'] = this.isActive;
        return valueDict;
    }
}

class TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor,
        headerFont, headerFontSize, borderColor, borderSize, contentBackgroundColor, title, form) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        if (width == '')
            this.width = 250;
        else
            this.width = parseInt(width);

        if (height == '')
            this.height = 250;
        else
            this.height = parseInt(height);
        this.headerColor = headerColor;
        this.headerFontColor = headerFontColor;
        this.headerFont = headerFont;
        this.headerFontSize = headerFontSize;
        this.borderColor = borderColor;
        this.borderSize = borderSize;
        this.contentBackgroundColor = contentBackgroundColor;
        this.title = title;
        this.isLocked = isLocked;

        this.isDragging = false;
        this.isClicked = false;
        this.isResizing = false;

        this.idTile = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        this.baseForm = new Form(tileFormTemplate)
        var merged = {}
        this.baseForm.merge(merged, this.baseForm.fields, form)
        this.form = new Form(merged);
    }

    // get the center coordinates of the rectangle
    centerX() {
        return this.x + this.width * 0.5;
    }
    centerY() {
        return this.y + this.height * 0.5;
    }
    // get the four side coordinates of the rectangles
    bottom() {
        return this.y + this.height;
    }
    left() {
        return this.x;
    }
    right() {
        return this.x + this.width;
    }
    top() {
        return this.y;
    }

    findClosestAvailablePos(tile) {
        var possiblePos = [];

        var oldx = this.x;
        var oldy = this.y;

        var elem = document.getElementById('info');
        var BB = elem.getBoundingClientRect();

        var i = Math.round(BB.width / this.scene.gridX)
        var j = Math.round(BB.top / this.scene.gridY)

        for (var k = 0; k < j - 4; k++) {
            this.y = k * this.scene.gridY + 50
            loop2:
            for (var l = 0; l < i - 4; l++) {

                this.x = l * this.scene.gridX
                var col = 0
                var elements = this.scene.tiles;
                if (elements.length > 1) {
                    loop3:
                    for (var m = 0; m < elements.length; m++) {
                        if (this != elements[m]) {

                            if (this.testCollision(elements[m])) {
                                col += 1
                                if (k == j - 5 && l == i - 5) {
                                    //return false;
                                }
                                break loop3;

                            }
                        }
                    }
                    if (col == 0) {
                        var valueDict = {};
                        valueDict['x'] = this.x;
                        valueDict['y'] = this.y;
                        var dist = Math.sqrt((oldx - this.x) * (oldx - this.x) +
                            (oldy - this.y) * (oldy - this.y))
                        dist.toFixed(2);
                        valueDict['dist'] = dist;
                        if (dist != 0 && (oldy != this.y && oldx > this.x))
                            possiblePos.push(valueDict)
                    }
                }
                else {
                    var valueDict = {};
                    valueDict['x'] = this.x;
                    valueDict['y'] = this.y;
                    var dist = Math.sqrt((oldx - this.x) * (oldx - this.x) +
                        (oldy - this.y) * (oldy - this.y))
                    dist.toFixed(2);
                    valueDict['dist'] = dist;
                    if (dist != 0 && (oldx != this.x && oldy > this.y))
                        possiblePos.push(valueDict)
                    possiblePos.push(valueDict)
                }
            }
        }

        function compare(a, b) {
            if (a.dist > b.dist) return 1;
            if (b.dist > a.dist) return -1;

            return 0;
        }
        possiblePos.sort(compare)
        const element = document.getElementById(this.idTile + ' resizable');
        if (possiblePos.length > 0) {
            if (element != null) {
                element.style.top = possiblePos[0].y + 'px';
                element.style.left = possiblePos[0].x + 'px';
            }

            this.x = possiblePos[0].x
            this.y = possiblePos[0].y
        }
        else {
            this.x = oldx
            this.y = oldy
            if (element != null) {
                element.style.top = oldy + 'px';
                element.style.left = oldx + 'px';
            }
        }
    }

    findAvailablePos(list) {
        var elem = document.getElementById('info');
        var BB = elem.getBoundingClientRect();

        var i = Math.round(BB.width / this.scene.gridX)
        var j = Math.round(BB.top / this.scene.gridY)

        loop1:
        for (var k = 0; k < j - 5; k++) {
            this.y = k * this.scene.gridY + 50
            loop2:
            for (var l = 0; l < i - 5; l++) {

                this.x = l * this.scene.gridX
                var col = 0
                var elements = list;
                if (elements.length > 1) {
                    loop3:
                    for (var m = 0; m < elements.length; m++) {
                        if (this != elements[m]) {
                            if (this.testCollision(elements[m])) {
                                col += 1
                                if (k == j - 5 && l == i - 5) {
                                    return false;
                                }
                                break loop3;
                            }
                        }
                    }
                    if (col == 0) {
                        const element = document.getElementById(this.idTile + ' resizable');
                        if (element != null) {
                            element.style.top = this.y + 'px';
                            element.style.left = this.x + 'px';
                        }
                        return true;
                    }
                }
                else {
                    const element = document.getElementById(this.idTile + ' resizable');
                    if (element != null) {
                        element.style.top = this.y + 'px';
                        element.style.left = this.x + 'px';
                    }
                    return true;
                }
            }
        }
    }

    autoResize() {
        var oldWidth = this.width;
        var oldHeight = this.height;

        if (oldWidth / this.scene.gridX > 1)
            this.width = this.scene.gridX * ((oldWidth / this.scene.gridX) - 1);
        if (oldHeight / this.scene.gridX > 1)
            this.height = this.scene.gridX * ((oldHeight / this.scene.gridX) - 1);

        const element = document.getElementById(this.idTile + ' resizable');
        element.style.width = this.width + 'px';
        element.style.height = this.width + 'px';
    }

    // determines if a collision is present between two rectangles
    testCollision(tile) {
        // using early outs cuts back on performance costs
        if (this.top() >= tile.bottom() || this.right() <= tile.left() ||
            this.bottom() <= tile.top() || this.left() >= tile.right()) {
            return false;
        }
        return true;
    }

    move(x, y) {
        var allEmements = this.scene.tiles;

        this.x = x
        this.y = y

        const element = document.getElementById(this.idTile + ' resizable');
        element.style.top = this.y + 'px'
        element.style.left = this.x + 'px'

        if (allEmements.length > 1) {
            for (var j = 0; j < allEmements.length; j++) {
                var r2 = allEmements[j];

                if (!r2.isDragging && r2 != this) {
                    if (this.testCollision(r2)) {
                        this.resolveCollision(r2);
                        r2.move(r2.x, r2.y)
                    }
                }
            }
        }
    }
    // push the calling rectangle out of the callee rectangle on the
    // axis that has the most overlap
    resolveCollision(tile) {
        var elem = document.getElementById('info');
        var BB = elem.getBoundingClientRect();
        var vector_x, vector_y;
        // get the distance between center points
        vector_x = this.centerX() - tile.centerX();
        vector_y = this.centerY() - tile.centerY();

        // is the y vector longer than the x vector?
        if (vector_y * vector_y > vector_x * vector_x) { // square to remove negatives
            // is the y vector pointing down?
            if (vector_y > 0) {
                if (tile.y - 50 >= 50)
                    tile.y = tile.y - 50;
                else
                    this.y = tile.bottom();
            } else { // the y vector is pointing up

                if (tile.y + 50 + tile.height <= BB.top)
                    tile.y = tile.y + 50;
                else
                    this.y = tile.y - this.height;
            }
        } else { // the x vector is longer than the y vector
            // is the x vector pointing right?
            if (vector_x > 0) {
                if (tile.x - 50 >= 0) {
                    tile.x = tile.x - 50;
                    this.x -= 50;
                }
                else
                    this.x = tile.x + tile.width
            } else { // the x vector is pointing left

                if (tile.x + tile.width + 50 <= BB.width) {
                    tile.x = tile.x + 50;
                    this.x += 50
                }
                else
                    this.x = tile.x - this.width
            }
        }
    }

    dragElement(elmnt) {
        var that = this;
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        var divbase = elmnt.id.split(' ')[0]

        if (document.getElementById(divbase + 'header')) {
            // if present, the header is where you move the DIV from:
            document.getElementById(divbase + 'header').onmousedown = dragMouseDown;
            document.getElementById(divbase + 'header').ontouchstart = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
            elmnt.ontouchstart = dragMouseDown;
        }

        function dragMouseDown(e) {
            if (e.button == 0) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.ontouchend = closeDragElement;

                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
                document.ontouchmove = elementDrag;
            }
        }

        function elementDrag(e) {
            if (e.button == 0 && !that.isLocked) {
                e = e || window.event;
                e.preventDefault();
                that.isDragging = true;
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                var allEmements = that.scene.tiles;
                var elem = document.getElementById('info');
                var BB = elem.getBoundingClientRect();

                if (!that.isLocked) {
                    that.isClicked = false;
                    that.y = (elmnt.offsetTop - pos2);
                    that.x = (elmnt.offsetLeft - pos1);

                    if (elmnt.offsetTop - pos2 < 50)
                        that.y = 50;

                    if (elmnt.offsetTop - pos2 + that.height > BB.top)
                        that.y = BB.top - that.height;

                    if (elmnt.offsetLeft - pos1 < 0)
                        that.x = 0;

                    if (elmnt.offsetLeft - pos1 + that.width > BB.width)
                        that.x = BB.width - that.width;

                    elmnt.style.top = that.y + 'px';
                    elmnt.style.left = that.x + 'px';

                    elmnt.style.opacity = '80%';
                    elmnt.style.zIndex = 9;

                    const elementShadow = document.getElementById('shadow');
                    elementShadow.style.top = Math.round((that.y) / that.scene.gridY) * that.scene.gridY + 'px';
                    elementShadow.style.left = Math.round(that.x / that.scene.gridX) * that.scene.gridX + 'px';
                    elementShadow.style.width = that.width + 'px';
                    elementShadow.style.height = that.height + 'px';
                    elementShadow.style.display = "block"

                    if (allEmements.length > 1) {
                        for (var j = 0; j < allEmements.length; j++) {
                            var r2 = allEmements[j];

                            if (!r2.isDragging && r2 != that) {
                                if (that.testCollision(r2)) {

                                    const r2elem = document.getElementById(r2.idTile + " resizable")
                                    r2elem.style.top = r2.y + 'px'
                                    r2elem.style.left = r2.x + 'px'

                                    elmnt.style.top = that.y + 'px';
                                    elmnt.style.left = that.x + 'px';

                                    //r2.move(r2.x, r2.y)
                                    that.move(that.x, that.y)
                                }
                            }
                        }
                    }
                }
            }
        }

        function closeDragElement() {
            elmnt.style.top = Math.round(that.y / that.scene.gridY) * that.scene.gridY + 'px';
            elmnt.style.left = Math.round(that.x / that.scene.gridX) * that.scene.gridX + 'px';

            that.y = Math.round(that.y / that.scene.gridY) * that.scene.gridY
            that.x = Math.round(that.x / that.scene.gridX) * that.scene.gridX

            const elementShadow = document.getElementById('shadow');
            elementShadow.style.display = "none"
            elmnt.style.opacity = '100%';
            document.onmouseup = null;
            document.onmousemove = null;
            that.isDragging = false
        }
    }

    makeResizableDiv(div) {
        var that = this;
        const element = document.getElementById(div + ' resizable');
        const elementShadow = document.getElementById('shadow');
        var resizers = [];
        resizers.push(document.getElementById(div + ' resizers top-left'))
        resizers.push(document.getElementById(div + ' resizers top-right'))
        resizers.push(document.getElementById(div + ' resizers bottom-left'))
        resizers.push(document.getElementById(div + ' resizers bottom-right'))
        const minimum_size = this.scene.gridX;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;

        for (let i = 0; i < resizers.length; i++) {
            const currentResizer = resizers[i];
            if (currentResizer.id.includes(div)) {
                currentResizer.addEventListener('mousedown', prepareResize)
            }

            function prepareResize(e) {
                e.preventDefault()
                original_width = parseFloat(getComputedStyle(element, null).
                    getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(element, null).
                    getPropertyValue('height').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_y = element.getBoundingClientRect().top;
                original_mouse_x = e.pageX;
                original_mouse_y = e.pageY;
                window.addEventListener('mousemove', resize);
                window.addEventListener('mouseup', stopResize);
            }

            function resize(e) {
                if (!that.isDragging && !that.isLocked) {
                    that.resize()
                    that.isResizing = true;
                    if (currentResizer.classList.contains('bottom-right')) {
                        const width = original_width + (e.pageX - original_mouse_x);
                        const height = original_height + (e.pageY - original_mouse_y)

                        if (width > minimum_size) {
                            element.style.width = width + 'px';
                            that.height = height;
                        }

                        if (height > minimum_size) {
                            element.style.height = height + 'px'
                            that.width = width;
                        }

                        elementShadow.style.width = Math.round(element.clientWidth / that.scene.gridX) * that.scene.gridX + 'px';
                        elementShadow.style.height = Math.round(element.clientHeight / that.scene.gridX) * that.scene.gridX + 'px'
                        elementShadow.style.display = "block"

                    } else if (currentResizer.classList.contains('bottom-left')) {
                        const height = original_height + (e.pageY - original_mouse_y)
                        const width = original_width - (e.pageX - original_mouse_x)
                        if (height > minimum_size) {
                            element.style.height = height + 'px'
                            that.width = width
                        }
                        if (width > minimum_size) {
                            element.style.width = width + 'px'
                            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                            elementShadow.style.left = Math.round((original_x + (e.pageX - original_mouse_x)) / that.scene.gridX) * that.scene.gridX + 'px';
                            that.x = original_x + (e.pageX - original_mouse_x)
                            that.height = height
                        }

                    } else if (currentResizer.classList.contains('top-right')) {
                        const width = original_width + (e.pageX - original_mouse_x)
                        const height = original_height - (e.pageY - original_mouse_y)
                        if (width > minimum_size) {
                            element.style.width = width + 'px'
                            that.height = height
                        }
                        if (height > minimum_size) {
                            element.style.height = height + 'px'
                            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                            elementShadow.style.top = Math.round((original_y + (e.pageY - original_mouse_y)) / that.scene.gridX) * that.scene.gridX + 'px';
                            that.y = original_y + (e.pageY - original_mouse_y)
                            that.width = width
                        }
                    } else if(currentResizer.classList.contains('top-left')) {
                        const width = original_width - (e.pageX - original_mouse_x)
                        const height = original_height - (e.pageY - original_mouse_y)
                        if (width > minimum_size) {
                            element.style.width = width + 'px'
                            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                            elementShadow.style.left = Math.round((original_x + (e.pageX - original_mouse_x)) / that.scene.gridX) * that.scene.gridX + 'px';
                            that.x = original_x + (e.pageX - original_mouse_x)
                            that.height = height
                        }
                        if (height > minimum_size) {
                            element.style.height = height + 'px'
                            element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                            elementShadow.style.top = Math.round((original_y + (e.pageY - original_mouse_y)) / that.scene.gridX) * that.scene.gridX + 'px';
                            that.y = original_y + (e.pageY - original_mouse_y)
                            that.width = width
                        }
                    }
                    elementShadow.style.width = Math.round(element.clientWidth / that.scene.gridX) * that.scene.gridX + 'px';
                    elementShadow.style.height = Math.round(element.clientHeight / that.scene.gridX) * that.scene.gridX + 'px'
                    elementShadow.style.display = "block"

                    element.style.opacity = '80%';
                    element.style.zIndex = 9;
                }
            }

            function stopResize() {
                const element = document.getElementById(that.idTile + ' resizable');
                if (!that.isDragging) {
                    console.log("stopresize")
                    that.isResizing = false;
                    element.style.width = Math.round(element.clientWidth / that.scene.gridX) * that.scene.gridX + 'px';
                    that.height = Math.round(element.clientHeight / that.scene.gridX) * that.scene.gridX;

                    element.style.height = Math.round(element.clientHeight / that.scene.gridX) * that.scene.gridX + 'px'
                    that.width = Math.round(element.clientWidth / that.scene.gridX) * that.scene.gridX;

                    element.style.top = Math.round(element.offsetTop / that.scene.gridX) * that.scene.gridX + 'px';
                    that.y = Math.round(element.offsetTop / that.scene.gridX) * that.scene.gridX;

                    element.style.left = Math.round(element.offsetLeft / that.scene.gridX) * that.scene.gridX + 'px';
                    that.x = Math.round(element.offsetLeft / that.scene.gridX) * that.scene.gridX;

                    var bleft = document.getElementById(div + ' resizers bottom-left');
                    bleft.setAttribute('class', '');
                    bleft.style.cssText = '';

                    var tleft = document.getElementById(div + ' resizers top-left');
                    tleft.setAttribute('class', '');
                    tleft.style.cssText = '';

                    var bright = document.getElementById(div + ' resizers bottom-right');
                    bright.setAttribute('class', '');
                    bright.style.cssText = '';

                    var tright = document.getElementById(div + ' resizers top-right');
                    tright.setAttribute('class', '');
                    tright.style.cssText = '';

                    elementShadow.style.display = "none"
                    element.style.opacity = '100%';

                    window.removeEventListener('mousemove', resize)
                    window.removeEventListener('mousemove', stopResize)
                    currentResizer.removeEventListener('mousedown', prepareResize)

                   that.resize()
                }
            }
        }
    }

    toJSON() {
        var valueDict = {};
        valueDict['sceneId'] = this.scene.idScene;
        valueDict['x'] = this.x;
        valueDict['y'] = this.y;
        valueDict['width'] = this.width;
        valueDict['height'] = this.height;
        valueDict['headerColor'] = this.headerColor;
        valueDict['headerFontColor'] = this.headerFontColor;
        valueDict['headerFont'] = this.headerFont;
        valueDict['headerFontSize'] = this.headerFontSize;
        valueDict['borderColor'] = this.borderColor;
        valueDict['borderSize'] = this.borderSize;
        valueDict['contentBackgroundColor'] = this.contentBackgroundColor;
        valueDict['title'] = this.title;
        return valueDict;
    }

    buildForm() {
        this.form.buildForm();
    }

    openForm() {
        //this.buildForm();
        openTileForm(this)
    }

    updateForm() {
        var type = this.type;
        for (var i = 0; i < document.getElementsByName("test").length; i++) {
            document.getElementById("type").value = type;
            if (this.idTile != "demo")
                document.getElementsByName("test")[i].disabled = true;
            else
                document.getElementsByName("test")[i].disabled = false;
            if (document.getElementsByName("test")[i].value == type)
                document.getElementsByName("test")[i].checked = true;
        }
    }

    fillForm() {
        document.getElementById("title").value = this.title;
        document.getElementById("type").value = this.type;
        document.getElementById("idTile").value = this.idTile;
        document.getElementById("headerFont").value = this.headerFont;
        document.getElementById("headerFontSize").value = this.headerFontSize;
        document.getElementById("headerFontColor").value = this.headerFontColor;
        document.getElementById("headerFontColor").value = this.headerFontColor;
        document.getElementById("headerColor").value = this.headerColor;
        document.getElementById("contentBackgroundColor").value = this.contentBackgroundColor;
        document.getElementById("borderSize").value = this.borderSize;
        document.getElementById("borderColor").value = this.borderColor;
        document.getElementById("width").value = this.width;
        document.getElementById("height").value = this.height;
    }

    update() {
        this.title = document.getElementById("title").value;
        this.headerFont = document.getElementById("headerFont").value;
        this.headerFontSize = document.getElementById("headerFontSize").value;
        this.headerFontColor = document.getElementById("headerFontColor").value;
        this.headerFontColor = document.getElementById("headerFontColor").value;
        this.headerColor = document.getElementById("headerColor").value;
        this.contentBackgroundColor = document.getElementById("contentBackgroundColor").value;
        this.borderSize = document.getElementById("borderSize").value;
        this.borderColor = document.getElementById("borderColor").value;
        this.width = parseInt(document.getElementById("width").value);
        this.height = parseInt(document.getElementById("height").value);
    }

    resize(){

    }

    draw() {
        var that = this;
        var htmlContent = `
        
        <div class='mydiv resizers' data-attr='attr' id='` + this.idTile + ` resizers'>
            <div class='contentTxt' id='` + this.idTile + ` content'>
            </div>
            <div data-attr='attr' id='` + this.idTile + ` resizers top-left'>
            </div>
            <div data-attr='attr' id='` + this.idTile + ` resizers top-right'>
            </div>
            <div data-attr='attr' id='` + this.idTile + ` resizers bottom-left'>
            </div>
            <div data-attr='attr' id='` + this.idTile + ` resizers bottom-right'>
            </div>
            <div class='mydivheader' data-attr='attr' id='` + this.idTile + `header'>` +
            this.title + `</div>
        </div>`

        this.scene.addDiv("scene", htmlContent, {
            'class': 'resizable',
            'id': this.idTile + ' resizable',
        });

        var newdiv = document.getElementById(this.idTile + ' resizable');
        newdiv.style.cssText = 'width:' + this.width + 'px !important; height:' + this.height +
            'px !important; top:' + this.y + 'px !important; left:' + this.x + 'px!important;';

        document.addEventListener('click', function (e) {
            var target = e.target;
            while (target.nodeType !== Node.DOCUMENT_NODE) {
                if (target.classList.contains('shown')) return;
                else target = target.parentNode;
            }
            var elems2hide = document.querySelectorAll('.shown');
            for (var i = 0, length = elems2hide.length; i < length; i++) {
                elems2hide[i].classList.remove('shown');
            }
        });

        var divheader = document.getElementById(this.idTile + 'header');
        divheader.style.cssText = 'background-color: ' + this.headerColor +
            ' !important; font-family:"' + this.headerFont + '"; color: ' +
            this.headerFontColor + '; font-size: ' + this.headerFontSize + 'px;';

        var resizer = document.getElementById(this.idTile + " resizers");
        resizer.style.cssText = 'background-color: ' + this.contentBackgroundColor +
            '; border: ' + this.borderSize + 'px solid ' + this.borderColor + ';';
        resizer.addEventListener('click', function () {
            if (!that.isLocked) {
                var bleft = document.getElementById(that.idTile + " resizers bottom-left");
                bleft.setAttribute("class", "resizer bottom-left");
                bleft.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + '!important;';

                var tleft = document.getElementById(that.idTile + " resizers top-left");
                tleft.setAttribute("class", "resizer top-left");
                tleft.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + ';';

                var bright = document.getElementById(that.idTile + " resizers bottom-right");
                bright.setAttribute("class", "resizer bottom-right");
                bright.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + ';';

                var tright = document.getElementById(that.idTile + " resizers top-right");
                tright.setAttribute("class", "resizer top-right");
                tright.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + ';';
                that.makeResizableDiv(that.idTile)
            }
        });

        resizer.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            var target = e.currentTarget.getAttribute('id').split(' ')[0];
            that.isClicked = true;
            var contextMenu = document.querySelector('.context-menu');
            contextMenu.setAttribute('id', target);
            var posX = (e.clientX + 150 > document.documentElement.clientWidth) ?
                e.clientX - 150 : e.clientX;
            var posY = (e.clientY + 140 + 55 > document.documentElement.clientHeight) ?
                e.clientY - 140 : e.clientY;
            contextMenu.style.top = posY + 'px';
            contextMenu.style.left = posX + 'px';
            contextMenu.classList.add('shown');
        });

        document.querySelector('.context-menu').addEventListener('click', function (e) {
            var target = e.target;
            if (target.nodeName !== 'A') return;
            var action = target.getAttribute('data');
            var id = this.getAttribute('id');
            if (!action) return;
            /*if (action == 'edit')
                updateTileMenuAction(id);
           // else if (action == 'lock')
             //   lockTile(id);
            else if (action == 'delete')
                that.scene.deleteTileById(id);
            else if (action == 'duplicate')
                that.scene.duplicateTileById(id)*/
            this.classList.remove('shown');
        });
        this.dragElement(newdiv);
    }
}
class TipeeTileNote extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, textColor, textFont, textFontSize, text) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileNoteFormTemplate);
        this.scene.tiles.push(this);

        this.textColor = textColor;
        this.textFont = textFont;
        this.textFontSize = textFontSize;
        this.text = text;
        this.type = 'note';
    }

    updateForm() {
        super.updateForm()
    }

    fillForm() {
        this.openForm();
        super.fillForm();
    }

    update() {
        super.update();
        this.textFont = document.getElementById('textFont').value;
        this.textFontSize = document.getElementById('textFontSize').value;
        this.textColor = document.getElementById('textColor').value;
    }

    draw() {
        var that = this;
        super.draw()

        var width = that.width - (that.borderSize*2);
        var headerHeight = document.getElementById(that.idTile+'header').offsetHeight;
        var height = that.height - (that.borderSize*2) - headerHeight;

        var elem = document.getElementById(that.idTile + ' content');
        elem.innerHTML = `<textarea id='` + that.idTile + `textArea' class='contentTxt` + that.idTile + `'  style=' width: ` + width + `px; height: `+ height + `px; ' id='` + that.idTile + `-txt'>`;
        elem.style.cssText = "font-family: '" + that.textFont + "' !important; font-size: " + that.textFontSize + "px !important;";
        elem.style.cssText = "margin: 0px;  position: absolute; top: " + headerHeight+"px; left: 0px;"
        
        var txt = document.getElementById(that.idTile + 'textArea');
        txt.addEventListener("focusout", function () {
            that.text = txt.value;
        })

        txt.style.color = that.textColor;
        txt.style.fontSize = that.textFontSize + "px";
        txt.style.fontFamily = that.textFont;

    }

    redraw() {
        this.scene.removeElement(this.idTile + ' resizable');
        this.draw();
        var area = document.getElementById(this.idTile+ "textArea")
        area.value = this.text;
    }

    resize() {
        //this.redraw();
        super.resize();
        var width = this.width - (this.borderSize*2);
        var headerHeight = document.getElementById(this.idTile+'header').offsetHeight;
        var height = this.height - (this.borderSize) - headerHeight;

        var area = document.getElementById(this.idTile+ "textArea")
        area.style.width = width + "px"
        area.style.height = height + "px"
        area.style.top = headerHeight + "px"
    }

    toJSON() {
        var valueDict = super.toJSON();
        valueDict['textColor'] = this.textColor;
        valueDict['textFont'] = this.textFont;
        valueDict['textFontSize'] = this.textFontSize;
        valueDict['text'] = this.text;
        valueDict['type'] = this.type;
        return valueDict;
    }
}

class TipeeTileTodo extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, textColor, textFont, textFontSize, todo, done) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileTodoFormTemplate);
        this.scene.tiles.push(this);

        this.textColor = textColor;
        this.textFont = textFont;
        this.textFontSize = textFontSize;
        if (todo != null)
            this.todo = todo;
        else
            this.todo = "";
        this.done = done;
        this.type = 'todo';
    }

    updateForm() {
        super.updateForm();
    }

    fillForm() {
        this.openForm();
        super.fillForm();
    }

    update() {
        super.update();
        this.textFont = document.getElementById('textFont').value;
        this.textFontSize = document.getElementById('textFontSize').value;
        this.textColor = document.getElementById('textColor').value;
    }

    draw() {
        var that = this;
        super.draw()

        var todos = that.todo;
        var elem = document.getElementById(that.idTile + ' content');
        elem.style.position = "absolute"
        elem.style.top = document.getElementById(that.idTile + 'header').offsetHeight + 'px'
        elem.style.overflow = 'auto';
        elem.style.width = 'inherit'
        elem.style.height = that.height - document.getElementById(that.idTile + 'header').offsetHeight + 'px'
        elem.innerHTML += '<div><input type="text" id="' + that.idTile + "new" + '"><ul id="todolist' + that.idTile + '"></ul>'

        if (todos != "") {
            todos = that.todo.split(";")

            var filtered = todos.filter(function (el) {
                return (el != null && el != "");
              });

            //elem.innerHTML += ''

            var list = document.getElementById("todolist" + that.idTile);
            list.style.listStyle = "none"
            list.style.padding = "5px"

            for (var i = 0; i < filtered.length; i++) {
                var nelem = document.createElement("li");
                nelem.style.textAlign = "left"
                nelem.id = that.idTile + i;
                var nelem2 = document.createElement("div")

                var item = filtered[i].split("|")

                var ch = document.createElement("INPUT");
                ch.setAttribute("type", "checkbox");
                ch.id = that.idTile + " ch" + i
                if(item[1] == "Y")
                    ch.checked = true;
                else
                    ch.checked = false;

                    (function (index2) {
                        ch.addEventListener('change', function () {
                            var toEdit = index2;
                            var checked;
                            var chb = document.getElementById(that.idTile + " ch"+index2)
                            if(chb.checked==true)
                                checked = "Y"
                            else
                                checked = 'N'
                            filtered[toEdit] = filtered[toEdit].split("|")[0]+"|"+checked
                            var todosNew = ""
                            for (var k = 0; k < filtered.length; k++) {
                                if (filtered[k] != "")
                                    todosNew += filtered[k] + ";"
                            }
    
                            that.todo = todosNew;
                            console.log(that.todo)
                        })
                    })(i)

                nelem2.appendChild(ch)
                nelem2.appendChild(document.createTextNode(item[0]))
                
                nelem.appendChild(nelem2);
                var belem = document.createElement('button');
                belem.id = that.idTile + "todo" + i;
                belem.innerText = "Del";
                belem.style.float = "right";
               
                (function (index) {
                    belem.addEventListener('click', function () {
                        var toRemove = index;
                        filtered.splice(toRemove, 1);

                        var todosNew = ""
                        for (var j = 0; j < filtered.length; j++) {
                            if (filtered[j] != "")
                                todosNew += filtered[j] + ";"
                        }

                        that.todo = todosNew;

                        var id = that.idTile.concat("", toRemove);
                        var elem = document.getElementById(id);
                        elem.parentNode.removeChild(elem);
                        that.redraw()
                    })
                })(i)
                nelem2.appendChild(belem);
                list.appendChild(nelem);
            }
        }
        else {
            todos = []
            //elem.innerHTML += '<div><input type="text" id="' + that.idTile + "new" + '">'
        }

        var addButton = document.getElementById(this.idTile + "new");
        addButton.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                that.todo += document.getElementById(that.idTile + "new").value +"|N" + ";"
                console.log(that.todo)
                that.redraw();
            }
        });
    }

    redraw() {
        this.scene.removeElement(this.idTile + ' resizable');
        this.draw();
    }

    resize() {

    }

    toJSON() {
        var valueDict = super.toJSON();
        valueDict['textColor'] = this.textColor;
        valueDict['textFont'] = this.textFont;
        valueDict['textFontSize'] = this.textFontSize;
        valueDict['todo'] = this.todo;
        valueDict['type'] = this.type;
        return valueDict;
    }

    redraw() {
        this.scene.removeElement(this.idTile + ' resizable');
        this.draw();
    }
}

class TipeeTileText extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, requestUrl, reqType, responseType,
        responseField, textBefore, textAfter, requestRefresh, textColor, textFont, textFontSize, operation) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileTextFormTemplate);
        this.scene.tiles.push(this);

        this.requestUrl = requestUrl;
        this.reqType = reqType;
        this.responseType = responseType;
        this.responseField = responseField;
        this.textBefore = textBefore;
        this.textAfter = textAfter;
        this.requestRefresh = requestRefresh;
        this.textColor = textColor;
        this.textFont = textFont;
        this.textFontSize = textFontSize;
        this.operation = operation;
        this.intervalId;
        this.type = 'text';
    }

    updateForm() {
        super.updateForm()

        var responseType = document.getElementById("responseType");
        var responseFieldChild = document.getElementById("responseFieldChild");
        var responseFieldChildLabel = document.getElementById("responseFieldChildLabel");

        if (responseType.value == "XML") {
            responseFieldChildLabel.style.display = "block";
            responseFieldChild.style.display = "block";
        }
        else {
            responseFieldChildLabel.style.display = "none";
            responseFieldChild.style.display = "none";
        }
    }

    fillForm() {
        this.openForm();
        super.fillForm();
    }

    update() {
        super.update();
        this.textFont = document.getElementById('textFont').value;
        this.textFontSize = document.getElementById('textFontSize').value;
        this.textColor = document.getElementById('textColor').value;
        this.requestUrl = document.getElementById('requestUrl').value;
        this.responseType = document.getElementById('responseType').value;
        this.textBefore = document.getElementById('textBefore').value;
        this.textAfter = document.getElementById('textAfter').value;
        this.requestRefresh = document.getElementById('requestRefresh').value;
        this.reqType = document.getElementById('reqType').value;
        this.operation = document.getElementById('operation').value;

        var responseField;
        if (responseType == 'XML') {
            responseField = document.getElementById('responseField').value;
            responseField += ';';
            responseField += document.getElementById('responseFieldChild').value
        }
        else {
            responseField = document.getElementById('responseField').value;
        }

        this.responseField = responseField
    }

    draw() {
        var that = this;
        super.draw()

        var elem = document.getElementById(this.idTile + ' content');
        elem.innerHTML = `<p id='` + this.idTile + `-txt'>Chargement...</p>`;

        var val;
        var performSomeAction = function (returned_data) {
            var txt = document.getElementById(that.idTile + ' content');
            val = returned_data;
            elem.innerHTML = `<p style:'color: #` + that.textColor + `;'  id='` + that.idTile + `-txt'>` + that.textBefore + " " + val + " " + that.textAfter + `</p>`;
            elem.style.cssText = "color: #" + that.textColor + " !important; font-family: '" + that.textFont + "' !important; font-size: " + that.textFontSize + "px !important;";
        }

        var txt = document.getElementById(this.idTile + '-txt');
        txt.style.cssText = "color: " + this.textColor + "!important; font-family: '" + this.textFont +
            "' !important; font-size: " + this.textFontSize + "px !important;";

        if (this.requestRefresh > 0) {
            request(that.requestUrl, that.reqType, that.responseType, that.responseField, that.operation, performSomeAction);
            that.intervalId = setInterval(function () {
                if (myApp.mode != "dev")
                    request(that.requestUrl, that.reqType, that.responseType, that.responseField, that.operation,
                        performSomeAction);
            }, 1000 * this.requestRefresh);
        }
        else {
            if (myApp.mode != "dev")
                request(that.requestUrl, that.reqType, that.responseType, that.responseField, that.operation, performSomeAction);
        }
    }

    toJSON() {
        var valueDict = super.toJSON();
        valueDict['requestUrl'] = this.requestUrl;
        valueDict['responseType'] = this.responseType
        valueDict['responseField'] = this.responseField;
        valueDict['textBefore'] = this.textBefore;
        valueDict['textAfter'] = this.textAfter;
        valueDict['reqType'] = this.reqType;
        valueDict['requestRefresh'] = this.requestRefresh;
        valueDict['textColor'] = this.textColor;
        valueDict['textFont'] = this.textFont;
        valueDict['textFontSize'] = this.textFontSize;
        valueDict['operation'] = this.operation;
        valueDict['type'] = this.type;
        return valueDict;
    }

    redraw() {
        this.scene.removeElement(this.idTile + ' resizable');
        if (this.intervalId != null)
            clearInterval(this.intervalId)
        this.draw();
    }
}

class TipeeTileImage extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, imgNb, imgSrc,
        imgSlideInterval, imgRefresh) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileImgFormTemplate);
        this.scene.tiles.push(this);
        this.imgNb = parseInt(imgNb);
        this.imgSrc = imgSrc;
        this.imgSlideInterval = parseInt(imgSlideInterval);
        this.imgRefresh = parseInt(imgRefresh);
        this.intervalId;
        this.type = 'image';
    }

    updateForm() {
        super.updateForm()
        var imgType = document.getElementById("imgType");
        var imgNb = document.getElementById("imgNb");
        var imgNbLabel = document.getElementById("imgNbLabel");

        var imgSlideIntervalLabel = document.getElementById("imgSlideIntervalLabel");
        var imgSlideInterval = document.getElementById("imgSlideInterval");

        imgNb.style.display = "none";
        imgNbLabel.style.display = "none";
        imgSlideIntervalLabel.style.display = "none";
        imgSlideInterval.style.display = "none";

        for (var i = 0; i < 10; i++) {
            var elem = document.getElementById("imgSrc" + i);
            elem.style.display = "none";
        }
        var nbImg;
        if (imgType.value == "single") {
            nbImg = 1;
        }
        else if (imgType.value == "slideshow") {
            imgNb.style.display = "block";
            imgNbLabel.style.display = "block";
            imgSlideIntervalLabel.style.display = "block";
            imgSlideInterval.style.display = "block";
            nbImg = imgNb.value;
        }
        for (var i = 0; i < nbImg; i++) {
            var elem = document.getElementById("imgSrc" + i);
            elem.style.display = "block";
        }
    }

    fillForm() {
        this.openForm();
        super.fillForm();
    }

    update() {
        super.update()
        var imgType = document.getElementById('imgType').value;
        var imgNb = document.getElementById('imgNb').value;
        var nb;
        var src = [];
        var imgSlideInterval;
        var imgRefresh = parseInt(document.getElementById('imgRefresh').value);

        if (imgType == 'single') {
            var imgSingleSrc = document.getElementById('imgSrc0');
            src.push(imgSingleSrc.value);
            nb = 1;
            imgSlideInterval = 60;
        }
        else {
            nb = imgNb;
            for (var i = 0; i < nb; i++) {
                var imgSingleSrcI = document.getElementById('imgSrc' + i);
                src.push(imgSingleSrcI.value);
            }
            imgSlideInterval = parseInt(document.getElementById('imgSlideInterval').value);
        }

        this.imgNb = nb;
        this.imgSrc = src;
        this.imgRefresh = imgRefresh;
        this.imgSlideInterval = imgSlideInterval;
    }

    draw() {
        super.draw()

        if (this.imgNb > 1)
            this.slide(this.imgSrc, 0);
        else {
            var elem = document.getElementById(this.idTile + ' resizers');
            elem.style.cssText += `background-image: url(` + this.imgSrc[0] +
                `) !important; background-size: cover !important;`;
        }
    }

    toJSON() {
        var valueDict = super.toJSON();
        valueDict['type'] = this.type;
        valueDict['imgNb'] = this.imgNb;
        valueDict['imgSrc'] = this.imgSrc;
        valueDict['imgSlideInterval'] = this.imgSlideInterval;
        valueDict['imgRefresh'] = this.imgRefresh;
        return valueDict;
    }

    slide(imgSrcs, index) {
        var that = this;
        var elem = document.getElementById(this.idTile + ' resizers');
        elem.style.cssText += `background-image: url(` + imgSrcs[index] +
            `) !important; background-size: cover !important;`;
        index = (index + 1) % imgSrcs.length
        setTimeout(function () { that.slide(imgSrcs, index); }, this.imgSlideInterval * 1000);
    }

    refreshEvery() {
        var that = this;
        that.intervalId = setInterval(function () {
            that.scene.removeElement(that.idTile + ' resizable');
            that.draw();
        }
            , that.imgRefresh * 1000);
    }

    redraw() {
        this.scene.removeElement(this.idTile + ' resizable');
        if (this.intervalId != null)
            clearInterval(this.intervalId)
        this.draw();
        this.refreshEvery();
    }
}

class TipeeTileToggles extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, nbToggles,
        togglesProperties) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileToggleFormTemplate);
        this.scene.tiles.push(this);

        this.nbToggles = nbToggles;
        this.togglesProperties = togglesProperties;
        this.type = 'toggles';
    }

    fillForm() {
        this.openForm();
        super.fillForm();
    }

    updateForm() {
        super.updateForm();

        var togglesNb = document.getElementById("togglesNb");
        for (var i = 0; i < 10; i++) {
            var elem = document.getElementById("togglesPropTr" + i);
            elem.style.display = "none";
        }

        var nb = togglesNb.value;
        for (var i = 0; i < nb; i++) {
            var elem = document.getElementById("togglesPropTr" + i);
            elem.style.display = "block";
        }
    }

    update() {
        super.update();
        var nbToggles = document.getElementById('togglesNb').value;
        var properties = [];

        for (var i = 0; i < nbToggles; i++) {
            var property = {};
            property['name'] = document.getElementById('togglesName' + i).value;
            property['url'] = document.getElementById('togglesURL' + i).value;
            properties.push(property);
        }

        this.nbToggles = nbToggles;
        this.togglesProperties = properties;
    }

    draw() {
        var that = this;
        super.draw()
        var elem = document.getElementById(this.idTile + ' content');
        var htmlContent = '<div class="buttons"><table>';

        for (let i = 0; i < that.nbToggles; i++) {
            if ((i + 1) % 2 == 1) {
                htmlContent += "<tr><td><button id='" + that.idTile + "-button-" + i +
                    "' type='button'>" + that.togglesProperties[i].name + "</button></td>"
            }
            else {
                htmlContent += "<td><button  id='" + that.idTile + "-button-" + i + "' type='button'>" +
                    that.togglesProperties[i].name + "</button></td></tr>"
            }
        }

        htmlContent += "</table></div>";
        elem.innerHTML = htmlContent;

        for (let i = 0; i < that.nbToggles; i++) {
            var bt = document.getElementById(this.idTile + '-button-' + i);
            bt.addEventListener('click', function () {
                that.trigger(that.togglesProperties[i].url);
            });
        }
    }

    redraw() {
        this.scene.removeElement(this.idTile + ' resizable');
        this.draw();
    }

    trigger(requestUrl) {
        requestPOST(requestUrl);
    }

    toJSON() {
        var valueDict = super.toJSON();
        valueDict['type'] = this.type;
        valueDict['nbToggles'] = this.nbToggles;
        valueDict['togglesProperties'] = this.togglesProperties;
        return valueDict;
    }
}

function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        let lines = e.target.result;
        var json = JSON.parse(lines);
        loadJSON(json);
    }
}

function loadJSON(json) {
    var tarrayScenes = json.app[0].scenes;
    var select = document.getElementById('sceneSelect');
    var activeSceneFromFile;
    tarrayScenes.forEach(t => {
        var option = document.createElement('option');
        select.options.add(option);
        option.text = t.sceneName;
        option.value = t.sceneName;

        var sceneToCreate = new TipeeScene();
        sceneToCreate.sceneName = t.sceneName;
        sceneToCreate.sceneId = t.sceneId;
        sceneToCreate.isActive = t.isActive;
        var arrayTiles = t.tiles;

        if (sceneToCreate.isActive) {
            activeSceneFromFile = sceneToCreate;
        }

        arrayTiles.forEach(t => {
            if(t.type == "text")
            var test = new TipeeTileText(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                t.borderSize, t.contentBackgroundColor, t.title, t.requestUrl, t.reqType, t.responseType, t.responseField,
                t.textBefore, t.textAfter, t.requestRefresh, t.textColor, t.textFont, t.textFontSize,
                t.operation);
        else if (t.type == "image")
            var test = new TipeeTileImage(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                t.borderSize, t.contentBackgroundColor, t.title, t.imgNb, t.imgSrc, t.imgSlideInterval,
                t.imgRefresh);
        else if(t.type == "toggles")
            var test = new TipeeTileToggles(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                t.borderSize, t.contentBackgroundColor, t.title, t.nbToggles, t.togglesProperties);
        else if (t.type == "note")
        
            var test = new TipeeTileNote(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                t.borderSize, t.contentBackgroundColor, t.title, t.textColor, t.textFont, t.textFontSize, t.text);
                else if(t.type = "todo")
            var test = new TipeeTileTodo(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                t.borderSize, t.contentBackgroundColor, t.title, t.textColor, t.textFont, t.textFontSize, t.todo, "");
        });
        if (select.options.length > 2)
            document.getElementById('sceneSelect').options[0].style.display = 'none'
    });

    myApp.activeScene = activeSceneFromFile;
    for (var i, j = 0; i = select.options[j]; j++) {
        if (i.value == activeSceneFromFile.sceneName) {
            select.selectedIndex = j;
            break;
        }
    }

    activeSceneFromFile.drawScene();
}

function updateTileMenuAction(id) {
    var tpTile;
    for (var i = 0; i < myApp.activeScene.tiles.length; i++) {
        if (myApp.activeScene.tiles[i].idTile == id) {
            tpTile = myApp.activeScene.tiles[i];
        }
    };
    tpTile.fillForm()
}

function lockTile(id) {
    var tileToLock;
    myApp.activeScene.tiles.forEach(tile => {
        if (tile.idTile == id)
            tileToLock = tile;
    });

    if (tileToLock.isLocked)
        tileToLock.isLocked = false;
    else
        tileToLock.isLocked = true;
}

function deleteElement(deleteElem) {
    myApp.activeScene.deleteTileById(deleteElem);
    closeTileForm();
}
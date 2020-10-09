class TipeeApp {
    constructor() {
        this.scenes = [];
        this.activeSceneId = "";
        this.login = "";
        this.mode = "prod";
        this.demoScene = new TipeeScene("demo");
        this.tileForm = new Form(tileFormTemplate);
        this.sceneForm = new Form(sceneFormTemplate);
        this.loginForm = new Form(loginFormTemplate);
        this.autosavetime =  300;
        this.autoSaveintervalId = null;
    }

    init() {
        var that = this;
        var activeScene = that.getSceneById(that.activeSceneId);

        createUI();
        this.sceneForm.buildForm();
        this.loginForm.buildForm();
        openSigninSignupForm();
        
        updateSigninSignupForm('signin', this.loginForm);

        if (sessionStorage.length > 0) {
            var sessionLogin = JSON.parse(sessionStorage.user);
            if (sessionLogin != null) {
                that.login = sessionLogin;
            }

            var getUserDashboardCallback = function (returned_data) {
                if (returned_data !== '207')
                    loadJSON(JSON.parse(returned_data));
                if (activeScene == null) {
                    openSceneForm();
                    that.changeScene();
                }
            };

            closeSigninSignupForm();

            if (that.mode !== "dev")
                request('/nodejs/dashboard/' + that.login, false, "GET", "", 'JSON', 'data', '', getUserDashboardCallback);
            document.getElementById('splashScreen').classList.add('splashScreenTranslate');
        }

        document.addEventListener('click', function (e) {
            var i = 0;
            var elems2hide = document.querySelectorAll('.shown');
            var activeScene = that.getSceneById(that.activeSceneId);

            for (i = 0, length = elems2hide.length; i < length; i+= 1) {
                elems2hide[i].classList.remove('shown');
            }

            if(activeScene != null){
                var i = 0;
            for(i=0; i<activeScene.tiles.length; i+=1){

            if(!e.target.id.includes(activeScene.tiles[i].idTile)){
            var bleft = document.getElementById(activeScene.tiles[i].idTile + ' resizers bottom-left');
                    bleft.setAttribute('class', '');
                    bleft.style.cssText = '';

                    var tleft = document.getElementById(activeScene.tiles[i].idTile + ' resizers top-left');
                    tleft.setAttribute('class', '');
                    tleft.style.cssText = '';

                    var bright = document.getElementById(activeScene.tiles[i].idTile + ' resizers bottom-right');
                    bright.setAttribute('class', '');
                    bright.style.cssText = '';

                    var tright = document.getElementById(activeScene.tiles[i].idTile + ' resizers top-right');
                    tright.setAttribute('class', '');
                    tright.style.cssText = '';
            }
        }
    }
        });
        this.autoSave();
        this.initDemoScene();
        this.loadSession();
    }

    initDemoScene(){
            var tileNote = new TipeeTileNote(this.demoScene.idScene);
            var tileTodo = new TipeeTileTodo(this.demoScene.idScene);
            var tileToggles = new TipeeTileToggles(this.demoScene.idScene);
            var tileText = new TipeeTileText(this.demoScene.idScene);
            var tileImage= new TipeeTileImage(this.demoScene.idScene);
    }

    logout() {
        this.login = "";
        sessionStorage.clear();
        document.location.reload(true);
    }

    loadSession() {
        if (sessionStorage.length > 0) {
            if (sessionStorage.scenes != null) {
                var sessionScenes = JSON.parse(sessionStorage.scenes);
                if (sessionScenes !== null) {
                    loadJSON(sessionScenes);
                }
            }
        }
    }

    autoSave(){
        var that = this;
        this.autoSaveintervalId = setInterval(function () {
            that.save();
        }
            , that.autosavetime * 1000);
    }

    save() {
        var that = this;
        var json = this.getAppJSON();        

        var saveDashboardCallback = function (returned_data) {
            var data = { "data": json };
            if (returned_data === '207') {
                var createDashboardOKCallback = function (returned) {
                    console.log("Dashboard sucessfully created");
                };
                if (that.mode !== "dev") {
                    request('/nodejs/dashboards?userId=' + that.login, false, "POST", data, "", "", "", createDashboardOKCallback);
                }
            }
            else {
                var updateDashboardOKCallback = function (returned) {
                    console.log("Dashboard successfully updated");
                };
                if (that.mode !== "dev") {
                    request('/nodejs/dashboard/' + that.login, false, "PUT", data, "", "", "", updateDashboardOKCallback);
                }
            }
        };

        if (that.mode !== "dev")
            request('/nodejs/dashboard/' + this.login, false, 'GET', "", "JSON", 'data', '', saveDashboardCallback);
        else
        notif({ title: "MyTest", subTitle: "My test notif" });
    }

    getAppJSON(){
        var arrayApp = { 'app': [] };
        var arrayScene = { 'scenes': [] };

        this.scenes.forEach(elementScene => {
            var scene = elementScene.toJSON();
            var arrayTiles = [];
            elementScene.tiles.forEach(tile => {
                var tileToSave = tile.toJSON();
                arrayTiles.push(tileToSave);
            });
            scene['tiles'] = arrayTiles;
            arrayScene['scenes'].push(scene);
        });

        arrayApp['app'].push(arrayScene);
        var json = JSON.stringify(arrayApp);
        return json;
    }

    export() {
        var file = new File([this.getAppJSON()], 'myFilename.txt', {
             type: 'application/octet-stream'
         });

         var blobUrl = (URL || webkitURL).createObjectURL(file);
         window.location = blobUrl;
    }

    /****************************************************************************/
    /* Forms submit functions                                                   */
    /****************************************************************************/

    signinSignupSubmit() {
        var that = this;
        var activeScene = that.getSceneById(that.activeSceneId);
        that.loginForm.validation.checkFields();
        var errors = document.getElementById('signinSignupForm_errorUL');

        if (errors.children.length === 0) {
            document.getElementById('signinSignupForm_errorloc').style.display = "none";
            var login = document.getElementById('login').value;
                var password = document.getElementById('password').value;
            if (document.getElementById('sign').value === 'signup') {
                
                that.login = login;

                var loginCallback = function (returned_data) {
                    if (returned_data === 1) {
                        sessionStorage.setItem('user', JSON.stringify(login));
                        var getUserDashboardCallback = function (returned_data) {
                            if (returned_data !== '207')
                                loadJSON(JSON.parse(returned_data));
                            if (activeScene === null) {
                                openSceneForm();
                                that.changeScene();
                            }
                        };
                        document.getElementById('signinSignupForm_errorloc').style.display = "none";
                        if (that.mode !== "dev")
                            request('/nodejs/dashboard/' + login, false, "GET", "", 'JSON', 'data', '', getUserDashboardCallback);
                        document.getElementById('splashScreen').classList.add('splashScreenTranslate');
                    }
                    else{
                        var li = document.createElement("li");
                     if (returned_data === 2) {
                        document.getElementById('signinSignupForm_errorloc').style.display = "block";
                        li.appendChild(document.createTextNode("Login and password not match"));
                    }
                    else if (returned_data === 3) {
                        document.getElementById('signinSignupForm_errorloc').style.display = "block";
                        li.appendChild(document.createTextNode('Login does not exists'));
                    }
                    errors.appendChild(li);
                }
                };
                if (that.mode !== "dev") {
                    var data = { "password": password };
                    request('/nodejs/user/' + login, false, "POST", data, "", "", "", loginCallback);
                }
                else
                    loginCallback(1);
            }
            else {
                var repassword = document.getElementById('repassword').value;
                var email = document.getElementById('email').value;
                var firstname = document.getElementById('firstname').value;
                var lastname = document.getElementById('lastname').value;

                if (password === repassword) {
                    var formData = {};
                    formData['login'] = login;
                    formData['password'] = password;
                    formData['email'] = email;
                    formData['firstname'] = firstname;
                    formData['lastname'] = lastname;

                    var createUserCallback = function (return_value) {
                        if (return_value === 1) {
                            var getUserDashboardCallback = function (returned_data) {
                                if (returned_data !== '207')
                                    loadJSON(JSON.parse(returned_data));
                                if (activeScene === null) {
                                    openSceneForm();
                                    that.changeScene();
                                }
                            };

                            if (that.mode !== "dev")
                                request('/nodejs/dashboard/' + login, false, "GET", "", 'JSON', 'data', '', getUserDashboardCallback);
                            document.getElementById('splashScreen').classList.add('splashScreenTranslate');
                        }
                        else{
                            var li = document.createElement("li");

                         if (return_value === 2) {
                            document.getElementById('signinSignupForm_errorloc').style.display = "block";
                            li.appendChild(document.createTextNode('Login already exists'));

                        }
                        else if (return_value === 3) {
                            document.getElementById('signinSignupForm_errorloc').style.display = "block";
                            li.appendChild(document.createTextNode('Email already exists'));
                        }
                        errors.appendChild(li);
                    }
                    };
                    if (that.mode !== "dev")
                        request('/nodejs/users/', false, "POST", formData, "", "", "", createUserCallback);
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
    }

    createSceneSubmit() {
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
        var activeScene = this.getActiveScene();

        var tileToBeUpdtated;
        if (idTile !== '') {
            for (var i = 0; i < activeScene.tiles.length; i+= 1) {
                if (activeScene.tiles[i].idTile === idTile) {
                    tileToBeUpdtated = activeScene.tiles[i];
                    tileToBeUpdtated.update();
                    tileToBeUpdtated.redraw();
                }
            }
        }
        else {
            var newTile = null;
            if (type === 'note') {
                newTile = new TipeeTileNote(activeScene.idScene);
            }
            else if (type === 'todo') {
                newTile = new TipeeTileTodo(activeScene.idScene);
            }
            else if (type === 'text') {
                newTile = new TipeeTileText(activeScene.idScene);
            }
            else if (type === 'image') {
                newTile = new TipeeTileImage(activeScene.idScene);
            }
            else if (type === 'toggles') {
                newTile = new TipeeTileToggles(activeScene.idScene);
            }

            if(newTile !== null){
                newTile.findAvailablePos();
                newTile.update();
                newTile.draw();

                if (type === "image")
                    newTile.refreshEvery();
            }
        }

        closeTileForm();
    }

    /****************************************************************************/
    /* UI display functions                                                     */
    /****************************************************************************/

    showNewTileButton() {
        var addTileButton = document.getElementById('addTile');
        addTileButton.style.display = 'block';
    }

    hideNewTileButton() {
        var addTileButton = document.getElementById('addTile');
        addTileButton.style.display = 'none';
    }

    /****************************************************************************/
    /* Scene functions                                                          */
    /****************************************************************************/

    createScene() {
        var newSceneName = document.getElementById('sceneName').value;
        var selectSceneInput = document.getElementById('sceneSelect');
        var optionsSelectSceneInput = selectSceneInput.options;
        var alreadyExists = false;

        for (var i, j = 0; i = selectSceneInput.options[j]; j+= 1) {
            if (i.value === newSceneName) {
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

            for (i, j = 0; i = selectSceneInput.options[j]; j+= 1) {
                if (i.value === newScene.sceneName) {
                    selectSceneInput.selectedIndex = j;
                    break;
                }
            }

            var opts = optionsSelectSceneInput.length;

            if (opts > 2)
                optionsSelectSceneInput[0].style.display = 'none';

            if (this.activeSceneId != "")
                this.clearActiveScene();

            this.setActiveScene(newScene);
            this.showNewTileButton();
            closeSceneForm();
            return true;
        }
    }

    getSceneById(sceneId){
        for(var i=0; i< this.scenes.length; i+=1){
            if(this.scenes[i].idScene === sceneId)
                return this.scenes[i];    
        }

        if(sceneId === "demo")
            return this.demoScene;
    }

    getActiveScene(){
        return this.getSceneById(this.activeSceneId);
    }

    reloadActiveScene() {
        var scene = this.getActiveScene();
        if (scene != null)
            setValueSectectInput("sceneSelect", scene.sceneName);
        else
            setValueSectectInput("sceneSelect", "default");
    }

    changeScene() {
        var selectSceneInput = document.getElementById('sceneSelect');
        var opts = selectSceneInput.options.length;

        if (opts > 2){
            document.getElementById('sceneSelect').options[0].style.display = 'none';
        }
        if (selectSceneInput.value === 'new') {
            openSceneForm();
        }
        else if (selectSceneInput.value === 'default'){
            this.hideNewTileButton();
        }
        else {
            var selectedScene = null;
            for (var i = 0; i < this.scenes.length; i+= 1) {
                if (this.scenes[i].sceneName === selectSceneInput.value){
                    selectedScene = this.scenes[i];
                }
            }

            if(selectedScene !== null){
                this.showNewTileButton();
                this.changeActiveScene(selectedScene);
            }
        }
    }

    setActiveScene(scene) {
        this.activeSceneId = scene.idScene;
        scene.isActive = true;
    }

    changeActiveScene(newSceneActive) {
        var scene = this.getActiveScene();
        if(scene != null){
            scene.clearScene();
            scene.isActive = false;
        }
        
        this.setActiveScene(newSceneActive);
        this.drawActiveScene();
    }

    clearActiveScene() {
        this.getActiveScene().clearScene();
    }

    drawActiveScene() {
        this.getActiveScene().drawScene();
    }

    deleteActiveScene(){
        var scene = this.getActiveScene();
        if(scene != null){
        scene.clearScene();

        for(var i=0; i < this.scenes.length; i+= 1){
            if(this.scenes[i].idScene === scene.idScene)
                this.scenes.splice(i,1);
        }

        var selectSceneInput = document.getElementById('sceneSelect');
        var optionsSelectSceneInput = selectSceneInput.options;

        for (var i, j = 0; i = selectSceneInput.options[j]; j+= 1) {
            if (i.value === scene.sceneName) {
                selectSceneInput.options.remove(j);
                break;
            }
        }

        var opts = optionsSelectSceneInput.length;

        if (opts > 2){
            var nextSceneName = optionsSelectSceneInput[2].value;
            var nextScene;
            for(var i=0; i<this.scenes.length; i+= 1){
                if(this.scenes[i].sceneName === nextSceneName){
                    nextScene = this.scenes[i];
                    break;
                }
            }

            if(nextScene !== null){
                selectSceneInput.value = nextScene.sceneName;
                this.changeActiveScene(nextScene);
            }
            optionsSelectSceneInput[0].style.display = 'none';
        }
        else
            optionsSelectSceneInput[0].style.display = 'block';
    }
}
}

class TipeeScene {
    constructor(sceneName) {
        this.scene = document.getElementById('scene');
        this.sceneId = "scene";
        this.tiles = [];
        this.sceneName = sceneName;
        this.isActive = false;
        this.gridX = 50;
        this.gridY = 50;
        
        if (this.sceneName !== "demo"){
            this.idScene = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
            myApp.scenes.push(this);
        }
        else
            this.idScene = "demo";
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
        elem = null;
    }

    deleteTileById(tileId) {
        var tileToBeDeleted = null;
        var index = 0;
        for (var j = 0; j < this.tiles.length; j+= 1) {
            var tile = this.tiles[j];
            if (tile.idTile === tileId) {
                tileToBeDeleted = tile;
                index = j;
            }
        }

        if (tileToBeDeleted !== null) {
            this.removeElement(tileId + ' resizable');

            if (tileToBeDeleted.intervalId !== null)
                clearInterval(tileToBeDeleted.intervalId);
            this.tiles[index] = null;
            this.tiles.splice(index, 1);
            tileToBeDeleted = null;
        }
    }

    getTileById(id){
        for(var i=0; i<this.tiles.length; i+=1){
            if(this.tiles[i].idTile == id){
                return this.tiles[i];
            }
        }
        return null;
    }

    getTilesByType(type){
        var tiles = [];
        for(var i=0; i<this.tiles.length; i+=1){
            if(this.tiles[i].type == type){
                tiles.push(this.tiles[i]);
            }
        }
        return tiles;
    }

    duplicateTileById(tileId) {
        var tileToBeDuplicated = null;
        for (var j = 0; j < this.tiles.length; j+= 1) {
            var tile = this.tiles[j];
            if (tile.idTile === tileId) {
                tileToBeDuplicated = tile;
            }
        }

        if(tileToBeDuplicated!== null){
        var newTile = null;
        if (tileToBeDuplicated.type === 'text') {
             newTile = new TipeeTileText(tileToBeDuplicated.sceneId, tileToBeDuplicated.x, tileToBeDuplicated.y, tileToBeDuplicated.width, tileToBeDuplicated.height, false, tileToBeDuplicated.headerColor,
                tileToBeDuplicated.headerFontColor, tileToBeDuplicated.headerFont, tileToBeDuplicated.headerFontSize, tileToBeDuplicated.borderColor, tileToBeDuplicated.borderSize,
                tileToBeDuplicated.contentBackgroundColor, tileToBeDuplicated.title, tileToBeDuplicated.requestUrl, tileToBeDuplicated.reqType, tileToBeDuplicated.responseType, tileToBeDuplicated.responseField, tileToBeDuplicated.textBefore,
                tileToBeDuplicated.textAfter, tileToBeDuplicated.requestRefresh, tileToBeDuplicated.textColor, tileToBeDuplicated.textFont, tileToBeDuplicated.textFontSize, tileToBeDuplicated.operation);
            newTile.draw();
        }
        else if (tileToBeDuplicated.type === 'image') {
             newTile = new TipeeTileImage(tileToBeDuplicated.sceneId, tileToBeDuplicated.x, tileToBeDuplicated.y, tileToBeDuplicated.width, tileToBeDuplicated.height, false, tileToBeDuplicated.headerColor,
                tileToBeDuplicated.headerFontColor, tileToBeDuplicated.headerFont, tileToBeDuplicated.headerFontSize, tileToBeDuplicated.borderColor, tileToBeDuplicated.borderSize,
                tileToBeDuplicated.contentBackgroundColor, tileToBeDuplicated.title, tileToBeDuplicated.imgNb, tileToBeDuplicated.imgSrc, tileToBeDuplicated.imgSlideInterval, tileToBeDuplicated.imgRefresh);
            newTile.draw();
            newTile.refreshEvery();
        }
        newTile.findAvailablePos();
    }
    }

    clearScene() {
        for (var j = 0; j < this.tiles.length; j+= 1) {
            var tile = this.tiles[j];
            var elem = document.getElementById(tile.idTile + ' resizable');
            if (elem !== null) {
                elem.parentNode.removeChild(elem);
                if (tile.intervalId !== null)
                    clearInterval(tile.intervalId);
            }
            elem = null;
        }
    }

    drawScene() {
        for (var i = 0; i < this.tiles.length; i+= 1) {
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
    constructor(sceneId, x, y, width, height, isLocked, headerColor, headerFontColor,
        headerFont, headerFontSize, borderColor, borderSize, contentBackgroundColor, title, form) {
        this.sceneId = sceneId;
        this.x = x;
        this.y = y;
        if (width === '')
            this.width = 250;
        else
            this.width = parseInt(width);

        if (height === '')
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

        if(this.sceneId === "demo"){
            var merged = {};
            merge(merged, tileFormTemplate, form);
            this.form = new Form(merged);
        }
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

    positionTile() {
        var scene = myApp.getSceneById(this.sceneId);
        var testPosition = this.findAvailablePos();

        function orderTilesBySurface(scene){

            var orderedTile = [];
            for(var i=0; i<scene.tiles.length; i+=1){
                var t = {};
                t.id = scene.tiles[i].idTile;
                t.surface = scene.tiles[i].width * scene.tiles[i].height;
                orderedTile.push(t);
            }

            function compare(a, b) {
                if (a.surface > b.surface) return -1;
                if (b.surface > a.surface) return 1;
          
                return 0;
            }

            orderedTile.sort(compare);
            return orderedTile;
        }
        

        while (!testPosition) {
            var orderedTiles = orderTilesBySurface(scene);
            if(orderedTiles.length > 1){
                if(!scene.getTileById(orderedTiles[0].id).isDragging)
                    scene.getTileById(orderedTiles[0].id).autoResize();
                else
                    scene.getTileById(orderedTiles[1].id).autoResize();
            }

            var list = [];
            for (var i = 0; i < scene.tiles.length; i+= 1) {
                if (scene.tiles[i] !== this) {
                    list.push(scene.tiles[i]);
                    scene.tiles[i].findAvailablePos();
                }
            }
            testPosition = this.findAvailablePos();
        }
    }

    findAvailablePos() {
        var scene = myApp.getSceneById(this.sceneId);
        var elem = document.getElementById('info');
        var BB = elem.getBoundingClientRect();

        var i = Math.round(BB.width / scene.gridX);
        var j = Math.round(BB.top / scene.gridY);

        loop1:
        for (var k = 0; k < j - 5; k+= 1) {
            this.y = k * scene.gridY + 50;
            loop2:
            for (var l = 0; l < i - 5; l+= 1) {

                this.x = l * scene.gridX;
                var col = 0;
                if (scene.tiles.length > 1) {
                    loop3:
                    for (var m = 0; m < scene.tiles.length; m+= 1) {
                        if (this !== scene.tiles[m]) {
                            if (this.testCollision(scene.tiles[m]) || this.testOutsideUI()) {
                                col += 1;
                                if (k === j - 5 && l === i - 5) {
                                    return false;
                                }
                                break loop3;
                            }
                        }
                    }
                    if (col === 0) {
                        const element = document.getElementById(this.idTile + ' resizable');
                        if (element !== null) {
                            element.style.top = this.y + 'px';
                            element.style.left = this.x + 'px';
                        }
                        return true;
                    }
                }
                else {
                    const element = document.getElementById(this.idTile + ' resizable');
                    if (element !== null) {
                        element.style.top = this.y + 'px';
                        element.style.left = this.x + 'px';
                    }
                    return true;
                }
            }
        }
        return false;
    }

    autoResize() {
        var scene = myApp.getSceneById(this.sceneId);
        var oldWidth = this.width;
        var oldHeight = this.height;

        if (oldWidth / scene.gridX > 1)
            this.width = scene.gridX * ((oldWidth / scene.gridX) - 1);
        if (oldHeight / scene.gridX > 1)
            this.height = scene.gridX * ((oldHeight / scene.gridX) - 1);

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

    testOutsideUI(){
        var elem = document.getElementById('info');
        var BB = elem.getBoundingClientRect();

        if (this.y + this.height > BB.top)
            return true;
        else
            return false;
    }

    dragElement(elmnt) {
        var that = this;
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        var divbase = elmnt.id.split(' ')[0];

        var elem = document.getElementById('info');
        var BB = elem.getBoundingClientRect();

        if (document.getElementById(divbase + ' header')) {
            // if present, the header is where you move the DIV from:
            document.getElementById(divbase + ' header').onmousedown = dragMouseDown;
            document.getElementById(divbase + ' header').ontouchstart = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
            elmnt.ontouchstart = dragMouseDown;
        }

        function dragMouseDown(e) {
            if (e.button === 0) {
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
            if (e.button === 0 && !that.isLocked) {
                e = e || window.event;
                e.preventDefault();
                that.isDragging = true;
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                var scene = myApp.getSceneById(that.sceneId);
                var allEmements = scene.tiles;

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
                    elementShadow.style.top = Math.round((that.y) / scene.gridY) * scene.gridY + 'px';
                    elementShadow.style.left = Math.round(that.x / scene.gridX) * scene.gridX + 'px';
                    elementShadow.style.width = that.width + 'px';
                    elementShadow.style.height = that.height + 'px';
                    elementShadow.style.display = "block";

                    if (elementShadow.offsetTop + that.height > BB.top)
                        elementShadow.style.top = BB.top - that.height + "px";

                    if (allEmements.length > 1) {
                        var colliding = [];
                        for (var j = 0; j < allEmements.length; j+= 1) {
                            var r2 = allEmements[j];

                            if (!r2.isDragging && r2 !== that) {
                                if (that.testCollision(r2)) {
                                    colliding.push(r2);
                                }
                            }
                        }

                        for (var i = 0; i < colliding.length; i+= 1)
                            colliding[i].positionTile();
                    }
                }
            }
        }

        function closeDragElement() {
            var scene = myApp.getSceneById(that.sceneId);

            elmnt.style.top = Math.round(that.y / scene.gridY) * scene.gridY + 'px';
            elmnt.style.left = Math.round(that.x / scene.gridX) * scene.gridX + 'px';

            that.y = Math.round(that.y / scene.gridY) * scene.gridY;
            that.x = Math.round(that.x / scene.gridX) * scene.gridX;

            if (elmnt.offsetTop + that.height > BB.top) {
                that.y = BB.top - that.height;
                elmnt.style.top = BB.top - that.height + "px";
            }

            const elementShadow = document.getElementById('shadow');
            elementShadow.style.display = "none";
            elmnt.style.opacity = '100%';
            document.onmouseup = null;
            document.onmousemove = null;
            that.isDragging = false;
        }
    }

    makeResizableDiv(div) {
        var that = this;
        var scene = myApp.getSceneById(that.sceneId);
        const element = document.getElementById(div + ' resizable');
        const elementShadow = document.getElementById('shadow');

        var elem = document.getElementById('info');
        var BB = elem.getBoundingClientRect();

        var resizers = [];
        resizers.push(document.getElementById(div + ' resizers top-left'));
        resizers.push(document.getElementById(div + ' resizers top-right'));
        resizers.push(document.getElementById(div + ' resizers bottom-left'));
        resizers.push(document.getElementById(div + ' resizers bottom-right'));

        const minimum_size = scene.gridX;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;

        for (let i = 0; i < resizers.length; i+= 1) {
            const currentResizer = resizers[i];
            if (currentResizer.id.includes(div)) {
                currentResizer.addEventListener('mousedown', prepareResize);
            }

            function prepareResize(e) {
                e.preventDefault();
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
                    that.isResizing = true;
                    if (currentResizer.classList.contains('bottom-right')) {
                        const width = original_width + (e.pageX - original_mouse_x);
                        const height = original_height + (e.pageY - original_mouse_y);

                        if (width > minimum_size) {
                            element.style.width = width + 'px';
                            that.width = width;
                        }

                        if (height > minimum_size) {
                            if(that.y + height < BB.top){
                                element.style.height = height + 'px';
                                that.height = height;
                            }
                        }

                    } else if (currentResizer.classList.contains('bottom-left')) {
                        const height = original_height + (e.pageY - original_mouse_y);
                        const width = original_width - (e.pageX - original_mouse_x);
                       
                        if(that.y + height < BB.top){
                            element.style.height = height + 'px';
                            that.height = height;                   
                        }
                            
                        if (width > minimum_size) {
                            element.style.width = width + 'px';
                            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                            elementShadow.style.left = Math.round((original_x + (e.pageX - original_mouse_x)) / scene.gridX) * scene.gridX + 'px';
                            that.x = original_x + (e.pageX - original_mouse_x);
                            that.width = width;
                        }

                    } else if (currentResizer.classList.contains('top-right')) {
                        const width = original_width + (e.pageX - original_mouse_x);
                        const height = original_height - (e.pageY - original_mouse_y);
                        
                        if (width > minimum_size) {
                            element.style.width = width + 'px';
                            that.width = width;

                        }

                        if (height > minimum_size ) {
                            if(original_y + (e.pageY - original_mouse_y) < 50){
                                element.style.top = 50 + 'px';
                                elementShadow.style.top = 50 + 'px';
                                that.y = 50;
                            }
                            else{
                                element.style.height = height + 'px';
                                element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                                elementShadow.style.top = Math.round((original_y + (e.pageY - original_mouse_y)) / scene.gridX) * scene.gridX + 'px';
                                that.y = original_y + (e.pageY - original_mouse_y);
                                that.height = height;
                            }
                        }
                        
                    } else if (currentResizer.classList.contains('top-left')) {
                        const width = original_width - (e.pageX - original_mouse_x);
                        const height = original_height - (e.pageY - original_mouse_y);
                        if (width > minimum_size) {
                            element.style.width = width + 'px';
                            element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                            elementShadow.style.left = Math.round((original_x + (e.pageX - original_mouse_x)) / scene.gridX) * scene.gridX + 'px';
                            that.x = original_x + (e.pageX - original_mouse_x);
                            that.width = width;

                        }
                        if (height > minimum_size) {
                            if(original_y + (e.pageY - original_mouse_y) < 50){
                                element.style.top = 50 + 'px';
                                elementShadow.style.top = 50 + 'px';
                                that.y = 50;
                            }
                            else{
                                element.style.height = height + 'px';
                                element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                                elementShadow.style.top = Math.round((original_y + (e.pageY - original_mouse_y)) / scene.gridX) * scene.gridX + 'px';
                                that.y = original_y + (e.pageY - original_mouse_y);
                                that.height = height;
                            }
                        }
                    }

                    elementShadow.style.width = Math.round(element.clientWidth / scene.gridX) * scene.gridX + 'px';
                    elementShadow.style.height = Math.round(element.clientHeight / scene.gridX) * scene.gridX + 'px';
                    elementShadow.style.display = "block";

                    if (elementShadow.offsetTop + elementShadow.clientHeight > BB.top)
                        elementShadow.style.height = element.clientHeight + "px";
                    
                    elementShadow.style.display = "block";

                    element.style.opacity = '80%';
                    element.style.zIndex = 9;
                    that.resize();
                }
            }

            function stopResize() {
                const element = document.getElementById(that.idTile + ' resizable');
                if (!that.isDragging) {
                    that.isResizing = false;
                    element.style.width = Math.round(element.clientWidth / scene.gridX) * scene.gridX + 'px';
                    that.height = Math.round(element.clientHeight / scene.gridX) * scene.gridX;

                    element.style.height = Math.round(element.clientHeight / scene.gridX) * scene.gridX + 'px';
                    that.width = Math.round(element.clientWidth / scene.gridX) * scene.gridX;

                    element.style.top = Math.round(element.offsetTop / scene.gridX) * scene.gridX + 'px';
                    that.y = Math.round(element.offsetTop / scene.gridX) * scene.gridX;

                    element.style.left = Math.round(element.offsetLeft / scene.gridX) * scene.gridX + 'px';
                    that.x = Math.round(element.offsetLeft / scene.gridX) * scene.gridX;

                    if (element.offsetTop + that.height > BB.top) {
                        that.y = BB.top - that.height;
                        element.style.top = BB.top - that.height + "px";
                    }

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

                    elementShadow.style.display = "none";
                    element.style.opacity = '100%';

                    that.resize();
                }

                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
                currentResizer.removeEventListener('mousedown', prepareResize);
            }
        }
    }

    toJSON() {
        var valueDict = {};
        valueDict['sceneId'] = this.sceneId;
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

    /****************************************************************************/
    /* Tile form functions                                                      */
    /****************************************************************************/
    buildForm() {
        this.form.buildForm();
    }

    openForm() {
        openTileForm(this);
    }

    updateForm() {
        var type = this.type;
        for (var i = 0; i < document.getElementsByName("test").length; i+= 1) {
            document.getElementById("type").value = type;
            if (this.idTile !== "demo")
                document.getElementsByName("test")[i].disabled = true;
            else
                document.getElementsByName("test")[i].disabled = false;
            if (document.getElementsByName("test")[i].value === type)
                document.getElementsByName("test")[i].checked = true;
        }
    }

    fillForm() {
        document.getElementById("title").value = this.title;
        document.getElementById("type").value = this.type;
        document.getElementById("idTile").value = this.idTile;
        document.getElementById("headerFont").value = this.headerFont;
        document.getElementById("headerFont").onchange();
        document.getElementById("headerFontSize").value = this.headerFontSize;
        document.getElementById("headerFontColor").value = this.headerFontColor;
        updatePicker("headerFontColor");
        document.getElementById("headerColor").value = this.headerColor;
        updatePicker("headerColor");
        document.getElementById("contentBackgroundColor").value = this.contentBackgroundColor;
        updatePicker("contentBackgroundColor");
        document.getElementById("borderSize").value = this.borderSize;
        document.getElementById("borderColor").value = this.borderColor;
        updatePicker("borderColor");
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

    resize() {

    }

    draw() {
        var that = this;
        var scene = myApp.getSceneById(that.sceneId);

        var htmlContent =
            `<div class='tile resizers' id='` + this.idTile + ` resizers'>
            <div class='tileContent' id='` + this.idTile + ` content'>
            </div>
            <div id='` + this.idTile + ` resizers top-left'>
            </div>
            <div id='` + this.idTile + ` resizers top-right'>
            </div>
            <div id='` + this.idTile + ` resizers bottom-left'>
            </div>
            <div id='` + this.idTile + ` resizers bottom-right'>
            </div>
            <div class='tileHeader' id='` + this.idTile + ` header'>` +
            this.title + `</div>
        </div>`;

        scene.addDiv("scene", htmlContent, {
            'class': 'resizable',
            'id': this.idTile + ' resizable',
        });

        var newdiv = document.getElementById(this.idTile + ' resizable');
        newdiv.style.width = this.width + 'px';
        newdiv.style.height = this.height + 'px';
        newdiv.style.top = this.y + 'px';
        newdiv.style.left = this.x + 'px';

        var divheader = document.getElementById(this.idTile + ' header');
        divheader.style.cssText = 'background-color: ' + this.headerColor +
            ' !important; font-family:"' + this.headerFont + '"; color: ' +
            this.headerFontColor + '; font-size: ' + this.headerFontSize + 'px;';

        var resizer = document.getElementById(this.idTile + " resizers");
        resizer.style.cssText = 'background-color: ' + this.contentBackgroundColor +
            '; border: ' + this.borderSize + 'px solid ' + this.borderColor + ';';
            divheader.addEventListener('dblclick', function () {
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
                that.makeResizableDiv(that.idTile);
            }
        });

        divheader.addEventListener('contextmenu', function (e) {
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

        this.dragElement(newdiv);
    }
}

class TipeeTileNote extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, textColor, textFont, textFontSize, text) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileNoteFormTemplate);
            
        var scene = myApp.getSceneById(this.sceneId);
        scene.tiles.push(this);

        this.textColor = textColor;
        this.textFont = textFont;
        this.textFontSize = textFontSize;
        this.text = text || "";
        this.type = 'note';
    }

    updateForm() {
        super.updateForm();
    }

    fillForm() {
        super.fillForm();
        document.getElementById('textFont').value = this.textFont;
        document.getElementById('textFont').onchange();
        document.getElementById('textFontSize').value = this.textFontSize;
        document.getElementById('textColor').value = this.textColor;
        updatePicker("textColor");
    }

    update() {
        super.update();
        this.textFont = document.getElementById('textFont').value;
        this.textFontSize = document.getElementById('textFontSize').value;
        this.textColor = document.getElementById('textColor').value;
    }

    draw() {
        var that = this;
        super.draw();

        var width = that.width - (that.borderSize * 2);
        var headerHeight = document.getElementById(that.idTile + ' header').offsetHeight;
        var height = that.height - (that.borderSize * 2) - headerHeight;

        var elem = document.getElementById(that.idTile + ' content');
        elem.innerHTML = `<textarea id='` + that.idTile + ` textArea' style=' resize: none; width: ` + width + `px; height: ` + height + `px;'>`;
        elem.style.cssText = "position: absolute; top: " + headerHeight + "px; left: 0px;";

        var txt = document.getElementById(that.idTile + ' textArea');
        txt.value = that.text;
        txt.addEventListener("focusout", function () {
            that.text = txt.value;
        })

        txt.style.color = that.textColor;
        txt.style.fontSize = that.textFontSize + "px";
        txt.style.fontFamily = that.textFont;
    }

    redraw() {
        var scene = myApp.getSceneById(this.sceneId);
        scene.removeElement(this.idTile + ' resizable');
        this.draw();
    }

    resize() {
        super.resize();
        var width = this.width - (this.borderSize * 2);
        var headerHeight = document.getElementById(this.idTile + ' header').offsetHeight;
        var height = this.height - (this.borderSize) -1 - headerHeight;

        var textArea = document.getElementById(this.idTile + " textArea");
        textArea.style.width = width + "px";
        textArea.style.height = height + "px";
        textArea.style.top = headerHeight + "px";
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

        var scene = myApp.getSceneById(this.sceneId);
        scene.tiles.push(this);

        this.textColor = textColor;
        this.textFont = textFont;
        this.textFontSize = textFontSize;
        if (todo !== null)
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
        super.fillForm();
        document.getElementById('textFont').value = this.textFont;
        document.getElementById('textFont').onchange();
        document.getElementById('textFontSize').value = this.textFontSize;
        document.getElementById('textColor').value = this.textColor;
        updatePicker("textColor");
    }

    update() {
        super.update();
        this.textFont = document.getElementById('textFont').value;
        this.textFontSize = document.getElementById('textFontSize').value;
        this.textColor = document.getElementById('textColor').value;
    }

    draw() {
        var that = this;
        super.draw();

        var todos = that.todo || "";
        var headerHeight = document.getElementById(that.idTile + ' header').offsetHeight;
        var elem = document.getElementById(that.idTile + ' content');
        elem.style.position = "absolute";
        elem.style.top = headerHeight + 'px';
        elem.style.overflow = 'auto';
        elem.style.width = 'inherit';
        elem.style.height = that.height - headerHeight - (that.borderSize*2) + 'px'; 
        elem.innerHTML += '<div><input type="text" id="' + that.idTile + ' new" style="margin-top:5px" placeholder="New task"><ul id="' + that.idTile + ' todolist"></ul>';

        if (todos !== "") {
            todos = that.todo.split(";");

            var filtered = todos.filter(function (el) {
                return (el !== null && el !== "");
            });

            var list = document.getElementById(that.idTile + ' todolist');
            list.style.listStyle = "none";
            list.style.padding = "5px";

            for (var i = 0; i < filtered.length; i+= 1) {
                var li = document.createElement("li");
                li.style.textAlign = "left";
                li.id = that.idTile + i;
                li.style.marginBottom = "3px";

                var div = document.createElement("div");
                var item = filtered[i].split("|");

                var chb = document.createElement("INPUT");
                chb.setAttribute("type", "checkbox");
                chb.id = that.idTile + " chb" + i;
                if (item[1] === "Y")
                    chb.checked = true;
                else
                    chb.checked = false;

                (function (index) {
                    chb.addEventListener('change', function () {
                        var checked;
                        var chb = document.getElementById(that.idTile + " chb" + index);

                        if (chb.checked === true)
                            checked = "Y";
                        else
                            checked = 'N';

                        filtered[index] = filtered[index].split("|")[0] + "|" + checked;

                        var todosNew = ""
                        for (var k = 0; k < filtered.length; k+= 1) {
                            if (filtered[k] !== "")
                                todosNew += filtered[k] + ";"
                        }
                        that.todo = todosNew;
                    })
                })(i)

                var bt = document.createElement('button');
                bt.innerText = "Del";
                bt.style.float = "right";
                bt.innerHTML = '<i class="fas fa-minus"></i>';

                (function (index) {
                    bt.addEventListener('click', function () {
                        filtered.splice(index, 1);

                        var todosNew = "";
                        for (var j = 0; j < filtered.length; j+= 1) {
                            if (filtered[j] !== "")
                                todosNew += filtered[j] + ";";
                        }

                        that.todo = todosNew;

                        var id = that.idTile.concat("", index);
                        var elem = document.getElementById(id);
                        elem.parentNode.removeChild(elem);
                        elem =null;
                        that.redraw();
                    })
                })(i)

                div.appendChild(chb);
                div.appendChild(document.createTextNode(item[0]));
                div.appendChild(bt);
                li.appendChild(div);
                list.appendChild(li);
            }
        }
        else {
            todos = [];
        }

        var addButton = document.getElementById(this.idTile + " new");
        addButton.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                var val = document.getElementById(that.idTile + " new").value;
                if(val !== "")
                that.todo += val  + "|N" + ";";
                that.redraw();
            }
        });
    }

    redraw() {
        var scene = myApp.getSceneById(this.sceneId);
        scene.removeElement(this.idTile + ' resizable');
        this.draw();
    }

    resize() {
        var headerHeight = document.getElementById(this.idTile + ' header').offsetHeight;
        var elem = document.getElementById(this.idTile + ' content');
        elem.style.height = this.height - headerHeight - (this.borderSize*2) + 'px'; 
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
        var scene = myApp.getSceneById(this.sceneId);
        scene.removeElement(this.idTile + ' resizable');
        this.draw();
    }
}

class TipeeTileText extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, requestUrl, reqType, responseType,
        responseField, textBefore, textAfter, requestRefresh, textColor, textFont, textFontSize, operation) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileTextFormTemplate);
        
        var scene = myApp.getSceneById(this.sceneId);
        scene.tiles.push(this);

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
        this.intervalId = 0;
        this.type = 'text';
    }

    updateForm() {
        super.updateForm()

        var responseType = document.getElementById("responseType");
        var responseFieldChild = document.getElementById("responseFieldChild");
        var responseFieldChildLabel = document.getElementById("responseFieldChildLabel");

        if (responseType.value === "XML") {
            responseFieldChildLabel.style.display = "block";
            responseFieldChild.style.display = "block";
            this.form.validation.activateField("responseFieldChild");
        }
        else {
            responseFieldChildLabel.style.display = "none";
            responseFieldChild.style.display = "none";
            this.form.validation.desactivateField("responseFieldChild");
        }
    }

    fillForm() {
        super.fillForm();

        document.getElementById('textFont').value = this.textFont;
        document.getElementById('textFont').onchange();
        document.getElementById('textFontSize').value = this.textFontSize;
        document.getElementById('textColor').value = this.textColor;
        updatePicker("textColor");
        document.getElementById("textBefore").value = this.textBefore;
        document.getElementById("textAfter").value = this.textAfter;
        document.getElementById("requestUrl").value = this.requestUrl;
        document.getElementById("operation").value = this.operation;
        document.getElementById("reqType").value = this.reqType;
        document.getElementById("requestRefresh").value = this.requestRefresh;
        document.getElementById('responseType').value = this.responseType;

        if (this.responseType === 'XML') {
            document.getElementById('responseField').value = this.responseField.split(";")[0];
            document.getElementById("responseFieldChild").value = this.responseField.split(";")[1];
        }
        else {
            document.getElementById('responseField').value = this.responseField;
        }
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
        if (this.responseType === 'XML') {
            responseField = document.getElementById('responseField').value;
            responseField += ';';
            responseField += document.getElementById('responseFieldChild').value;
        }
        else {
            responseField = document.getElementById('responseField').value;
        }

        this.responseField = responseField;
    }

    draw() {
        var that = this;
        super.draw();

        var elem = document.getElementById(this.idTile + ' content');
        elem.innerHTML = `<p id='` + this.idTile + ` contentTxt'>Chargement...</p>`;

        var headerHeight = document.getElementById(this.idTile + ' header').offsetHeight;
        elem.style.top = headerHeight + "px";
        var height = that.height - headerHeight;

        elem.style.height = height + "px";
        elem.style.position = "absolute";
        elem.style.color = that.textColor;
        elem.style.fontFamily = that.textFont;
        elem.style.fontSize = that.textFontSize + "px";
        elem.style.display = "flex";
        elem.style.overflow = "hidden";

        var txt = document.getElementById(this.idTile + ' contentTxt');
        txt.style.display = "flex";
        txt.style.alignItems = "center";
        txt.style.marginLeft = that.width/2 - txt.offsetWidth/2 + "px";


        var requestCallback = function (returned_data) {
            elem.innerHTML = `<p style:'color: #` + that.textColor + `;'  id='` + that.idTile + ` contentTxt'>` + that.textBefore + " " + returned_data + " " + that.textAfter + `</p>`;
            var txt = document.getElementById(that.idTile + ' contentTxt');
            txt.style.display = "flex";
            txt.style.alignItems = "center";
            txt.style.marginLeft = that.width/2 - txt.offsetWidth/2 + "px";
        };

        if (this.requestRefresh > 0) {
            request(that.requestUrl, true, that.reqType, "", that.responseType, that.responseField, that.operation, requestCallback);
            that.intervalId = setInterval(function () {
                if (myApp.mode !== "dev")
                    request(that.requestUrl, true, that.reqType, "", that.responseType, that.responseField, that.operation,
                        requestCallback);
            }, 1000 * this.requestRefresh);
        }
        else {
            if (myApp.mode !== "dev")
                request(that.requestUrl, true, that.reqType, "", that.responseType, that.responseField, that.operation, requestCallback);
        }
    }

    resize() {
        var headerHeight = document.getElementById(this.idTile + ' header').offsetHeight;
        var elem = document.getElementById(this.idTile + ' content');
        elem.style.height = this.height - headerHeight - (this.borderSize*2) + 'px';

        var txt = document.getElementById(that.idTile + ' contentTxt');
        txt.style.marginLeft = that.width/2 - txt.offsetWidth/2 + "px";
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
        var scene = myApp.getSceneById(this.sceneId);
        scene.removeElement(this.idTile + ' resizable');
        if (this.intervalId !== null)
            clearInterval(this.intervalId);
        this.draw();
    }
}

class TipeeTileImage extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, imgNb, imgSrc,
        imgSlideInterval, imgRefresh) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileImgFormTemplate);
        
        var scene = myApp.getSceneById(this.sceneId);
        scene.tiles.push(this);
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

        this.form.validation.desactivateField("imgSlideInterval");

        for (var i = 0; i < 10; i+= 1) {
            var elem = document.getElementById("imgSrc" + i);
            elem.style.display = "none";
            this.form.validation.desactivateField("imgSrc" + i);
        }
        var nbImg = 0;
        if (imgType.value === "single") {
            nbImg = 1;
        }
        else if (imgType.value === "slideshow") {
            imgNb.style.display = "block";
            imgNbLabel.style.display = "block";
            imgSlideIntervalLabel.style.display = "block";
            imgSlideInterval.style.display = "block";
            nbImg = imgNb.value;
            this.form.validation.activateField("imgSlideInterval");
        }

        for (var i = 0; i < nbImg; i+= 1) {
            var elem = document.getElementById("imgSrc" + i);
            elem.style.display = "block";
            this.form.validation.activateField("imgSrc" + i);
        }
    }

    fillForm() {
        super.fillForm();

        if (this.imgNb === 1) {
            document.getElementById('imgType').value = 'single';
        }
        else {
            document.getElementById('imgType').value = 'slideshow';
            document.getElementById('imgSlideInterval').value = this.imgSlideInterval;
        }

        document.getElementById('imgRefresh').value = this.imgRefresh;

        for (var i = 0; i < this.imgNb; i+= 1)
            document.getElementById('imgSrc' + i).value = this.imgSrc[i];
    }

    update() {
        super.update();
        var imgType = document.getElementById('imgType').value;
        var imgNb = document.getElementById('imgNb').value;
        var nb = 0;
        var src = [];
        var imgSlideInterval = 0;
        var imgRefresh = parseInt(document.getElementById('imgRefresh').value);

        if (imgType === 'single') {
            var imgSingleSrc = document.getElementById('imgSrc0');
            src.push(imgSingleSrc.value);
            nb = 1;
            imgSlideInterval = 60;
        }
        else {
            nb = imgNb;
            for (var i = 0; i < nb; i+= 1) {
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
        super.draw();

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
        index = (index + 1) % imgSrcs.length;
        setTimeout(function () { that.slide(imgSrcs, index); }, this.imgSlideInterval * 1000);
    }

    refreshEvery() {
        var that = this;
        var scene = myApp.getSceneById(that.sceneId);

        that.intervalId = setInterval(function () {
            scene.removeElement(that.idTile + ' resizable');
            that.draw();
        }
            , that.imgRefresh * 1000);
    }

    redraw() {
        var scene = myApp.getSceneById(that.sceneId);
        scene.removeElement(this.idTile + ' resizable');
        if (this.intervalId !== null)
            clearInterval(this.intervalId);
        this.draw();
        this.refreshEvery();
    }
}

class TipeeTileToggles extends TipeeTile {
    constructor(sceneId, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, nbToggles,
        togglesProperties) {
        super(sceneId, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileToggleFormTemplate);

        var scene = myApp.getSceneById(this.sceneId);
        scene.tiles.push(this);

        this.nbToggles = nbToggles;
        this.togglesProperties = togglesProperties;
        this.type = 'toggles';
    }

    fillForm() {
        super.fillForm();

        var togglesNb = document.getElementById("togglesNb").value;
        for (var i = 0; i < togglesNb; i+= 1) {
            document.getElementById('togglesName' + i).value = this.togglesProperties[i].name;
            document.getElementById('togglesURL' + i).value = this.togglesProperties[i].url;
        }
    }

    updateForm() {
        super.updateForm();

        var togglesNb = document.getElementById("togglesNb");
        for (var i = 0; i < 10; i+= 1) {
            document.getElementById("togglesName" + i).style.display = "none";
            document.getElementById("togglesURL" + i).style.display = "none";
            this.form.validation.desactivateField("togglesName" + i);
            this.form.validation.desactivateField("togglesURL" + i);
        }

        var nb = togglesNb.value;
        for (var i = 0; i < nb; i+= 1) {
            document.getElementById("togglesName" + i).style.display = "block";
            document.getElementById("togglesURL" + i).style.display = "block";

            this.form.validation.activateField("togglesName" + i);
            this.form.validation.activateField("togglesURL" + i);
        }
    }

    update() {
        super.update();
        var nbToggles = document.getElementById('togglesNb').value;
        var properties = [];

        for (var i = 0; i < nbToggles; i+= 1) {
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
        super.draw();
        var elem = document.getElementById(this.idTile + ' content');
        var htmlContent = '<div class="buttons"><table>';

        for (let i = 0; i < that.nbToggles; i+= 1) {
            if ((i + 1) % 2 === 1) {
                htmlContent += "<tr><td><button id='" + that.idTile + "-button-" + i +
                    "'>" + that.togglesProperties[i].name + "</button></td>";
            }
            else {
                htmlContent += "<td><button  id='" + that.idTile + "-button-" + i + "'>" +
                    that.togglesProperties[i].name + "</button></td></tr>";
            }
        }

        htmlContent += "</table></div>";
        elem.innerHTML = htmlContent;

        for (let i = 0; i < that.nbToggles; i+= 1) {
            var bt = document.getElementById(this.idTile + '-button-' + i);
            bt.addEventListener('click', function () {
                that.trigger(that.togglesProperties[i].url);
            });
        }
    }

    redraw() {
        var scene = myApp.getSceneById(this.sceneId);
        scene.removeElement(this.idTile + ' resizable');
        this.draw();
    }

    trigger(requestUrl) {
        request(requestUrl, true, "POST", "", "", "", "", "");
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
    if(tarrayScenes != null && tarrayScenes.length > 0){
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
            var tile = null;
            if (t.type === "text")
            tile = new TipeeTileText(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                    t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                    t.borderSize, t.contentBackgroundColor, t.title, t.requestUrl, t.reqType, t.responseType, t.responseField,
                    t.textBefore, t.textAfter, t.requestRefresh, t.textColor, t.textFont, t.textFontSize,
                    t.operation);
            else if (t.type === "image")
            tile = new TipeeTileImage(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                    t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                    t.borderSize, t.contentBackgroundColor, t.title, t.imgNb, t.imgSrc, t.imgSlideInterval,
                    t.imgRefresh);
            else if (t.type === "toggles")
            tile = new TipeeTileToggles(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                    t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                    t.borderSize, t.contentBackgroundColor, t.title, t.nbToggles, t.togglesProperties);
            else if (t.type === "note")

            tile = new TipeeTileNote(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                    t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                    t.borderSize, t.contentBackgroundColor, t.title, t.textColor, t.textFont, t.textFontSize, t.text);
            else if (t.type = "todo")
            tile= new TipeeTileTodo(sceneToCreate, t.x, t.y, t.width, t.height, t.isLocked,
                    t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                    t.borderSize, t.contentBackgroundColor, t.title, t.textColor, t.textFont, t.textFontSize, t.todo, "");
        });
        if (select.options.length > 2)
            document.getElementById('sceneSelect').options[0].style.display = 'none';
    });


    myApp.activeSceneId = activeSceneFromFile.idScene;
    for (var i, j = 0; i = select.options[j]; j+= 1) {
        if (i.value === activeSceneFromFile.sceneName) {
            select.selectedIndex = j;
            break;
        }
    }

    activeSceneFromFile.drawScene();
}
}

function updateTileMenuAction(id) {
    var tpTile = null;
    var scene = myApp.getSceneById(myApp.activeSceneId);

    for (var i = 0; i < scene.tiles.length; i+= 1) {
        if (scene.tiles[i].idTile === id) {
            tpTile = scene.tiles[i];
        }
    };

    if(tpTile !== null)
        tpTile.openForm();
}

function lockTile(id) {
    var tileToLock = null;
    var scene = myApp.getSceneById(myApp.activeSceneId)

    for(var i=0; i<scene.tiles.length; i+=1){
        if (scene.tiles[i].idTile === id)
            tileToLock = scene.tiles[i];
    }

    if(tileToLock !== null){
    if (tileToLock.isLocked)
        tileToLock.isLocked = false;
    else
        tileToLock.isLocked = true;
    }
}
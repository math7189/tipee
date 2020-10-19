window.tipeeApp = () => {
    const tipeeApp = new TipeeApp();
    tipeeApp.init();
    return tipeeApp;
}

class TipeeApp {
    constructor() {
        this.scenes = [];
        this.activeSceneId = '';
        this.login = '';
        this.mode = 'prod';
        this.demoScene = new TipeeScene('demo');
        this.tileForm = new Form(tileFormTemplate);
        this.sceneForm = new Form(sceneFormTemplate);
        this.loginForm = new Form(loginFormTemplate);
        this.autosavetime = 300;
        this.autoSaveintervalId = null;
    }

    init() {
        const that = this;
        let activeScene = that.getSceneById(that.activeSceneId);

        this.createUI();
        notificationCenter({offsetTop:50});

        this.sceneForm.build();
        this.loginForm.build();

        this.openSigninSignupForm();
        this.updateSigninSignupForm('signin');

        if (sessionStorage.length > 0) {
            const sessionLogin = JSON.parse(sessionStorage.user);
            if (sessionLogin != null) {
                that.login = sessionLogin;
            }

            const getUserDashboardCallback = function (returned_data) {
                if (returned_data !== '207')
                    that.loadJSON(JSON.parse(returned_data));
                    activeScene = that.getSceneById(that.activeSceneId);
                if (activeScene == null) {
                    that.openSceneForm();
                    that.changeScene();
                }
            };

            this.closeSigninSignupForm();

            if (that.mode !== 'dev')
                request('/nodejs/dashboard/' + that.login, false, 'GET', '', 'JSON', 'data', '', getUserDashboardCallback);
            document.getElementById('splashScreen').classList.add('splashScreenTranslate');
        }

        document.addEventListener('click', function (e) {
            let i = 0;
            const elems2hide = document.querySelectorAll('.shown');
            const activeScene = that.getSceneById(that.activeSceneId);

            for (i = 0, length = elems2hide.length; i < length; i += 1) {
                elems2hide[i].classList.remove('shown');
            }

            if (activeScene != null) {
                for (i = 0; i < activeScene.tiles.length; i += 1) {

                    if (!e.target.id.includes(activeScene.tiles[i].idTile)) {
                        const bleft = document.getElementById(activeScene.tiles[i].idTile + ' resizers bottom-left');
                        bleft.setAttribute('class', '');
                        bleft.style.cssText = '';

                        const tleft = document.getElementById(activeScene.tiles[i].idTile + ' resizers top-left');
                        tleft.setAttribute('class', '');
                        tleft.style.cssText = '';

                        const bright = document.getElementById(activeScene.tiles[i].idTile + ' resizers bottom-right');
                        bright.setAttribute('class', '');
                        bright.style.cssText = '';

                        const tright = document.getElementById(activeScene.tiles[i].idTile + ' resizers top-right');
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

    initDemoScene() {
        const tileNote = new TipeeTileNote(this.demoScene.idScene);
        this.demoScene.tiles.push(tileNote);
        const tileTodo = new TipeeTileTodo(this.demoScene.idScene);
        this.demoScene.tiles.push(tileTodo);
        const tileToggles = new TipeeTileToggles(this.demoScene.idScene);
        this.demoScene.tiles.push(tileToggles);
        const tileText = new TipeeTileText(this.demoScene.idScene);
        this.demoScene.tiles.push(tileText);
        const tileImage = new TipeeTileImage(this.demoScene.idScene);
        this.demoScene.tiles.push(tileImage);
    }

    logout() {
        this.login = '';
        sessionStorage.clear();
        document.location.reload(true);
    }

    loadSession() {
        if (sessionStorage.length > 0) {
            if (sessionStorage.scenes != null) {
                const sessionScenes = JSON.parse(sessionStorage.scenes);
                if (sessionScenes !== null) {
                    this.loadJSON(sessionScenes);
                }
            }
        }
    }

    loadJSON(json) {
        const arrayScenes = json.app[0].scenes;

        if (arrayScenes != null && arrayScenes.length > 0) {
            const selectSceneElemnt = document.getElementById('sceneSelect');

            let activeSceneFromFile = null;
            arrayScenes.forEach(t => {
                const option = document.createElement('option');

                selectSceneElemnt.options.add(option);
                option.text = t.sceneName;
                option.value = t.sceneName;

                const sceneToCreate = new TipeeScene();
                sceneToCreate.sceneName = t.sceneName;
                sceneToCreate.sceneId = t.sceneId;
                sceneToCreate.isActive = t.isActive;
                this.scenes.push(sceneToCreate);
                const arrayTiles = t.tiles;

                if (sceneToCreate.isActive) {
                    activeSceneFromFile = sceneToCreate;
                }

                arrayTiles.forEach(t => {
                    let tile = null;
                    if (t.type === 'text')
                        tile = new TipeeTileText(sceneToCreate.idScene, t.x, t.y, t.width, t.height, t.isLocked,
                            t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                            t.borderSize, t.contentBackgroundColor, t.title, t.requestUrl, t.reqType, t.responseType, t.responseField,
                            t.textBefore, t.textAfter, t.requestRefresh, t.textColor, t.textFont, t.textFontSize,
                            t.operation);
                    else if (t.type === 'image')
                        tile = new TipeeTileImage(sceneToCreate.idScene, t.x, t.y, t.width, t.height, t.isLocked,
                            t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                            t.borderSize, t.contentBackgroundColor, t.title, t.imgNb, t.imgSrc, t.imgSlideInterval,
                            t.imgRefresh);
                    else if (t.type === 'toggles')
                        tile = new TipeeTileToggles(sceneToCreate.idScene, t.x, t.y, t.width, t.height, t.isLocked,
                            t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                            t.borderSize, t.contentBackgroundColor, t.title, t.togglesNb, t.togglesProperties);
                    else if (t.type === 'note')
                        tile = new TipeeTileNote(sceneToCreate.idScene, t.x, t.y, t.width, t.height, t.isLocked,
                            t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                            t.borderSize, t.contentBackgroundColor, t.title, t.textColor, t.textFont, t.textFontSize, t.text);
                    else if (t.type = 'todo')
                        tile = new TipeeTileTodo(sceneToCreate.idScene, t.x, t.y, t.width, t.height, t.isLocked,
                            t.headerColor, t.headerFontColor, t.headerFont, t.headerFontSize, t.borderColor,
                            t.borderSize, t.contentBackgroundColor, t.title, t.textColor, t.textFont, t.textFontSize, t.todo);
                    sceneToCreate.tiles.push(tile);
                });
                if (selectSceneElemnt.options.length > 2)
                    document.getElementById('sceneSelect').options[0].style.display = 'none';
            });

            let i = 0, j = 0;
            this.activeSceneId = activeSceneFromFile.idScene;
            for (j = 0; i = selectSceneElemnt.options[j]; j += 1) {
                if (i.value === activeSceneFromFile.sceneName) {
                    selectSceneElemnt.selectedIndex = j;
                    break;
                }
            }

            activeSceneFromFile.drawScene();
        }
    }

    autoSave() {
        const that = this;
        this.autoSaveintervalId = setInterval(function () {
            that.save();
        }
            , that.autosavetime * 1000);
    }

    save() {
        const that = this;
        const json = this.getAppJSON();

        const saveDashboardCallback = function (returned_data) {
            const data = { 'data': json };
            if (returned_data === '207') {
                const createDashboardOKCallback = function (returned) {
                    console.log('Dashboard sucessfully created');
                };
                if (that.mode !== 'dev') {
                    request('/nodejs/dashboards?userId=' + that.login, false, 'POST', data, '', '', '', createDashboardOKCallback);
                }
            }
            else {
                const updateDashboardOKCallback = function (returned) {
                    console.log('Dashboard successfully updated');
                };
                if (that.mode !== 'dev') {
                    request('/nodejs/dashboard/' + that.login, false, 'PUT', data, '', '', '', updateDashboardOKCallback);
                }
            }
        };

        if (that.mode !== 'dev')
            request('/nodejs/dashboard/' + this.login, false, 'GET', '', 'JSON', 'data', '', saveDashboardCallback);
        else
            notif({ title: 'New Notification', subTitle: 'Successfully saved' });
    }

    getAppJSON() {
        let arrayApp = { 'app': [] };
        let arrayScene = { 'scenes': [] };

        this.scenes.forEach(elementScene => {
            const scene = elementScene.toJSON();
            let arrayTiles = [];
            elementScene.tiles.forEach(tile => {
                const tileToSave = tile.toJSON();
                arrayTiles.push(tileToSave);
            });
            scene['tiles'] = arrayTiles;
            arrayScene['scenes'].push(scene);
        });

        arrayApp['app'].push(arrayScene);
        return JSON.stringify(arrayApp);
    }

    export() {
        const file = new File([this.getAppJSON()], 'myFilename.txt', {
            type: 'application/octet-stream'
        });

        const blobUrl = (URL || webkitURL).createObjectURL(file);
        window.location = blobUrl;
    }

    /****************************************************************************/
    /* Forms functions                                                   */
    /****************************************************************************/

    openSigninSignupForm() {
        document.getElementById('signinSignupForm').style.display = 'block';
        document.getElementById('splashScreen').classList.add('splashScreen');
    }
    
    closeSigninSignupForm() {
        document.getElementById('signinSignupForm').style.display = 'none';
        document.getElementById('splashScreen').classList.remove('splashScreen');
        document.getElementById('signinSignupForm_errorloc').style.display = 'none';
    }
    
    signinSignupSubmit() {
        const that = this;
        const activeScene = that.getSceneById(that.activeSceneId);
        that.loginForm.validation.checkFields();
        const errors = document.getElementById('signinSignupForm_errorUL');

        if (errors.children.length === 0) {
            document.getElementById('signinSignupForm_errorloc').style.display = 'none';
            const login = document.getElementById('login').value;
            const password = document.getElementById('password').value;

            const getUserDashboardCallback = function (returned_data) {
                if (returned_data !== '207')
                    that.loadJSON(JSON.parse(returned_data));
                if (activeScene === null) {
                    that.openSceneForm();
                    that.changeScene();
                }
            };

            if (document.getElementById('sign').value === 'signup') {

                that.login = login;

                const loginCallback = function (returned_data) {
                    if (returned_data === 1) {
                        sessionStorage.setItem('user', JSON.stringify(login));
                        document.getElementById('signinSignupForm_errorloc').style.display = 'none';
                        if (that.mode !== 'dev')
                            request('/nodejs/dashboard/' + login, false, 'GET', '', 'JSON', 'data', '', getUserDashboardCallback);
                        document.getElementById('splashScreen').classList.add('splashScreenTranslate');
                    }
                    else {
                        const li = document.createElement('li');
                        if (returned_data === 2) {
                            document.getElementById('signinSignupForm_errorloc').style.display = 'block';
                            li.appendChild(document.createTextNode('Login and password not match'));
                        }
                        else if (returned_data === 3) {
                            document.getElementById('signinSignupForm_errorloc').style.display = 'block';
                            li.appendChild(document.createTextNode('Login does not exists'));
                        }
                        errors.appendChild(li);
                    }
                };
                if (that.mode !== 'dev') {
                    const data = { 'password': password };
                    request('/nodejs/user/' + login, false, 'POST', data, '', '', '', loginCallback);
                }
                else
                    loginCallback(1);
            }
            else {
                const repassword = document.getElementById('repassword').value;
                const email = document.getElementById('email').value;
                const firstname = document.getElementById('firstname').value;
                const lastname = document.getElementById('lastname').value;

                if (password === repassword) {
                    let formData = {};
                    formData['login'] = login;
                    formData['password'] = password;
                    formData['email'] = email;
                    formData['firstname'] = firstname;
                    formData['lastname'] = lastname;

                    const createUserCallback = function (return_value) {
                        if (return_value === 1) {
                            if (that.mode !== 'dev')
                                request('/nodejs/dashboard/' + login, false, 'GET', '', 'JSON', 'data', '', getUserDashboardCallback);
                            document.getElementById('splashScreen').classList.add('splashScreenTranslate');
                        }
                        else {
                            const li = document.createElement('li');

                            if (return_value === 2) {
                                document.getElementById('signinSignupForm_errorloc').style.display = 'block';
                                li.appendChild(document.createTextNode('Login already exists'));

                            }
                            else if (return_value === 3) {
                                document.getElementById('signinSignupForm_errorloc').style.display = 'block';
                                li.appendChild(document.createTextNode('Email already exists'));
                            }
                            errors.appendChild(li);
                        }
                    };
                    if (that.mode !== 'dev')
                        request('/nodejs/users/', false, 'POST', formData, '', '', '', createUserCallback);
                }
                else {
                    document.getElementById('signinSignupForm_errorloc').style.display = 'block';
                    const li = document.createElement('li');
                    li.appendChild(document.createTextNode('Password does not match'));
                    errors.appendChild(li);
                }
            }
        }
        else {
            document.getElementById('signinSignupForm_errorloc').style.display = 'block';
        }
    }

    updateSigninSignupForm(action) {
        if (action === 'signin') {
            document.getElementById('passwordTd').colSpan = '2';
            document.getElementById('btvalLogTd').colSpan = '2';
            document.getElementById('sign').value = 'signup';
            document.getElementById('sign').innerText = 'Sign Up';
    
            this.loginForm.validation.desactivateField('repassword');
            this.loginForm.validation.desactivateField('lastname');
            this.loginForm.validation.desactivateField('firstname');
            this.loginForm.validation.desactivateField('email');
    
            document.getElementById('repassword').style.display = 'none';
            document.getElementById('lastname').style.display = 'none';
            document.getElementById('firstname').style.display = 'none';
            document.getElementById('emailTr').style.display = 'none';
            document.getElementById('forgot').style.display = 'block';
        }
        else {
            this.loginForm.validation.activateField('repassword');
            this.loginForm.validation.activateField('lastname');
            this.loginForm.validation.activateField('firstname');
            this.loginForm.validation.activateField('email');
            document.getElementById('passwordTd').colSpan = '1';
            document.getElementById('btvalLogTd').colSpan = '2';
            document.getElementById('sign').value = 'signin';
            document.getElementById('sign').innerText = 'Sign In';
            document.getElementById('repassword').style.display = 'block';
            document.getElementById('lastname').style.display = 'block';
            document.getElementById('firstname').style.display = 'block';
            document.getElementById('emailTr').style.display = 'table-row';
            document.getElementById('forgot').style.display = 'none';
        }
    }

    openSceneForm() {
        document.getElementById('sceneForm').style.display = 'flex';
        document.getElementById('backgroundScreen').classList.add('backgroundScreen');
    }
    
    closeSceneForm() {
        this.reloadActiveScene();
        document.getElementById('sceneForm').style.display = 'none';
        document.getElementById('sceneName').value = '';
        document.getElementById('backgroundScreen').classList.remove('backgroundScreen');
        document.getElementById('sceneForm_errorloc').style.display = 'none';
    }

    createSceneSubmit() {
        const isCreated = this.createScene();
        if (!isCreated) {
            const errors = document.getElementById('sceneForm_errorUL');
            document.getElementById('sceneForm_errorloc').style.display = 'block';
            const li = document.createElement('li');
            li.appendChild(document.createTextNode('Scene already exists'));
            errors.appendChild(li);
        }
        else
            document.getElementById('sceneForm_errorloc').style.display = 'none';
    }

    openTileForm(tpTile) {
        if (tpTile != null) {
            const form = this.demoScene.getTilesByType(tpTile.type)[0].form;
            tpTile.form = form;
            tpTile.form.init = 1;
            tpTile.form.build();
            tpTile.updateForm();
            tpTile.fillForm();
            tpTile.updateForm();
            tpTile.fillForm();
        }
        else {
            const tileText = this.demoScene.getTilesByType('text')[0];
            this.tileForm.fields = tileText.form.fields;
            this.tileForm.formId = tileText.form.formId;
            this.tileForm.validation = tileText.form.validation;
            this.tileForm.build();
        }
    
        document.getElementById('tileForm').style.display = 'flex';
        document.getElementById('backgroundScreen').classList.add('backgroundScreen');
        document.getElementById('tileForm_errorloc').style.display = 'none';
    }
    
    closeTileForm() {
        document.getElementById('tileForm').style.display = 'none';
        document.getElementById('idTile').value = '';
        document.getElementById('backgroundScreen').classList.remove('backgroundScreen');
        document.getElementById('tileForm_errorUL').innerHTML = '';
    }

    updateType(elm) {
        document.getElementById('type').value = elm.value;
    
        let tile = null;
        if (elm.value === 'note') {
            tile = this.demoScene.getTilesByType(elm.value)[0];
        }
        else if (elm.value === 'todo') {
            tile = this.demoScene.getTilesByType(elm.value)[0];
        }
        else if (elm.value === 'toggles') {
            tile = this.demoScene.getTilesByType(elm.value)[0];
        }
        else if (elm.value === 'text') {
            tile = this.demoScene.getTilesByType(elm.value)[0];
        }
        else if (elm.value === 'image') {
            tile = this.demoScene.getTilesByType(elm.value)[0];
        }
    
        this.tileForm.fields = tile.form.fields;
        this.tileForm.formId = tile.form.formId;
        this.tileForm.validation = tile.form.validation;
        tile.idTile = 'demo';
        this.tileForm.build();
        tile.updateForm();
    } 

    updateTileForm() {
        const idTile = document.getElementById('idTile');
        const type = document.getElementById('type');
        let i = 0;
        //var deletebtn = document.getElementById('deleteElem');
    
        if (idTile.value !== '') {
            //deletebtn.style.display = 'block';
            let tileToUpadateForm = null;
    
            for (i; i < this.getActiveScene().tiles.length; i += 1) {
                const tile = this.getActiveScene().tiles[i];
                if (tile.idTile === idTile.value) {
                    tileToUpadateForm = tile;
                }
            }
            tileToUpadateForm.updateForm();
        }
        else {
            //deletebtn.style.display = 'none';
            this.demoScene.getTilesByType(type.value)[0].updateForm();
    
            for (i; i < document.getElementsByName('test').length; i++)
                document.getElementsByName('test')[i].disabled = false;
        }
    }

    createOrUpdateTpTile() {
        const type = document.getElementById('type').value;
        const idTile = document.getElementById('idTile').value;
        const activeScene = this.getActiveScene();

        let tileToBeUpdtated = null;
        let i = 0;

        if (idTile !== '') {
            for (i; i < activeScene.tiles.length; i += 1) {
                if (activeScene.tiles[i].idTile === idTile) {
                    tileToBeUpdtated = activeScene.tiles[i];
                    tileToBeUpdtated.update();
                    tileToBeUpdtated.redraw();
                    notif({ title: 'New Notification', subTitle: 'Tile updated' });
                }
            }
        }
        else {
            let newTile = null;
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

            activeScene.tiles.push(newTile);

            if (newTile !== null) {
                newTile.update();
                newTile.draw();
                newTile.findAvailablePos();

                if (type === 'image')
                    newTile.refreshEvery();

                    notif({ title: 'New Notification', subTitle: 'New Tile created' });
                
            }
        }

        this.closeTileForm();
    }

    /****************************************************************************/
    /* UI display functions                                                     */
    /****************************************************************************/

    createUI() {
        const body = document.getElementsByTagName('body')[0];
        body.innerHTML = ` 
        <div id="container">
       <div id="left">
          <input type="file" id="fileinput" style="display: none;"  onchange="loadFile();"/>
          <ul class="Menu -horizontal">
             <li class="-hasSubmenu -noChevron">
                <a href="#" data-icon="dehaze"></a>
                <ul>
                   <li class="-hasSubmenu">
                      <a href="#">New</a>
                      <ul>
                         <li><a href="#" onclick="tipee.openSceneForm()">New Dashboard</a></li>
                      </ul>
                   </li>
                   <li class="-hasSubmenu">
                      <a href="#">Edit</a>
                      <ul>
                         <li><a href="#" onclick="tipee.deleteActiveScene()">Delete Dashboard</a></li>
                      </ul>
                   </li>
                   <li><a href="#" onclick="tipee.save()">Save</a></li>
                   <li class="-hasSubmenu">
                      <a href="#">File</a>
                      <ul>
                         <li><a href="#" onclick="document.getElementById("fileinput").click();">Import</a></li>
                         <li><a href="#" onclick="tipee.export()">Export</a></li>
                      </ul>
                   </li>
                   <li><a href="#" onclick="tipee.logout()">Logout</a></li>
                   <li><a href="#" onclick="openSettingsForm()">Settings</a></li>
                </ul>
             </li>
          </ul>
       </div>
       <div id="center">
          <p>Tipee</p>
       </div>
       <div id="right" class="selectdiv">
            <div id = "centerOpenBt"><i id="centerOpenIcon" class="fas fa-comment-alt"></i>
            </div>
          <label>
             <select id="sceneSelect" name="sceneSelect" onchange="tipee.changeScene()">
                <option value="default">Select Dashboard</option>
                <option value="new">New</option>
          </label>
          </select>
       </div>
    </div>
    <menu class="context-menu">
       <a href="javascript:;" class="bold" id="menuTitle">Menu</a>
       <hr>
       <a href="javascript:;" data="edit" onClick="tipee.updateTileMenuAction(this.parentElement.id)">Edit</a>
       <a href="javascript:;" data="lock" onClick="tipee.lockTile(this.parentElement.id)">Lock</a>
       <a href="javascript:;" data="duplicate" onClick="tipee.getActiveScene().duplicateTileById(this.parentElement.id)">Duplicate</a>
       <a href="javascript:;" data="delete" onClick="tipee.getActiveScene().deleteTileById(this.parentElement.id)">Delete</a>
    </menu>
    <div class"scene" id="scene">
    <div class="tileShadow" id="shadow"></div>
    </div>
    <div id="backgroundScreen"></div>
    <div id="splashScreen">
       <p class="splashScreenTitle">Tipee</p>
       <div class="splashScreenText">
          <p>Creates dashboards easily with Tipee</p>
          <p>Signin to your dashboards! Don't have an account yet? Just signup!</p>
       </div>
       <div class="form-popup-3" id="signinSignupForm"></div>
    </div>
    <div class="form-popup-2" id="sceneForm"></div>
    <div class="form-popup" id="tileForm"></div>
    <button id="addTile" class="open-button" onclick="tipee.openTileForm(null)">Add tile</button>
    <div id="info"> Math </div>`;
    } 
    
    showNewTileButton() {
        const addTileButton = document.getElementById('addTile');
        addTileButton.style.display = 'block';
    }

    hideNewTileButton() {
        const addTileButton = document.getElementById('addTile');
        addTileButton.style.display = 'none';
    }

     /****************************************************************************/
    /* ContextMenu functions                                                          */
    /****************************************************************************/
    updateTileMenuAction(id) {
        let tpTile = null;
        let i = 0;
        const scene = this.getSceneById(this.activeSceneId);
    
        for (i; i < scene.tiles.length; i += 1) {
            if (scene.tiles[i].idTile === id) {
                tpTile = scene.tiles[i];
            }
        };
    
        if (tpTile !== null)
            tpTile.openForm();
    }
  
    lockTile(id) {
    let tileToLock = null;
    let i = 0;
    const scene = this.getSceneById(this.activeSceneId)

    for (i; i < scene.tiles.length; i += 1) {
        if (scene.tiles[i].idTile === id)
            tileToLock = scene.tiles[i];
    }

    if (tileToLock !== null) {
        if (tileToLock.isLocked)
            tileToLock.isLocked = false;
        else
            tileToLock.isLocked = true;
    }
}

    /****************************************************************************/
    /* Scene functions                                                          */
    /****************************************************************************/

    createScene() {
        const newSceneName = document.getElementById('sceneName').value;
        const selectSceneInput = document.getElementById('sceneSelect');
        const optionsSelectSceneInput = selectSceneInput.options;
        let alreadyExists = false;
        let i = 0, j = 0;

        for (i, j; i = selectSceneInput.options[j]; j += 1) {
            if (i.value === newSceneName) {
                alreadyExists = true;
                break;
            }
        }

        if (alreadyExists) {
            return false;
        }
        else {
            const newScene = new TipeeScene();
            newScene.sceneName = newSceneName;
            this.scenes.push(newScene);

            const option = document.createElement('option');
            option.text = newScene.sceneName;
            option.value = newScene.sceneName;
            selectSceneInput.options.add(option);

            for (i, j = 0; i = selectSceneInput.options[j]; j += 1) {
                if (i.value === newScene.sceneName) {
                    selectSceneInput.selectedIndex = j;
                    break;
                }
            }

            const opts = optionsSelectSceneInput.length;

            if (opts > 2)
                optionsSelectSceneInput[0].style.display = 'none';

            if (this.activeSceneId != '')
                this.clearActiveScene();

            this.setActiveScene(newScene);
            this.showNewTileButton();
            this.closeSceneForm();
            return true;
        }
    }

    getSceneById(sceneId) {
        let i = 0;
        for (i; i < this.scenes.length; i += 1) {
            if (this.scenes[i].idScene === sceneId)
                return this.scenes[i];
        }

        if (sceneId === 'demo')
            return this.demoScene;
    }

    getActiveScene() {
        return this.getSceneById(this.activeSceneId);
    }

    setActiveScene(scene) {
        this.activeSceneId = scene.idScene;
        scene.isActive = true;
    }

    reloadActiveScene() {
        const scene = this.getActiveScene();
        if (scene != null)
            setValueSectectInput('sceneSelect', scene.sceneName);
        else
            setValueSectectInput('sceneSelect', 'default');
    }

    changeScene() {
        const selectSceneInput = document.getElementById('sceneSelect');
        const opts = selectSceneInput.options.length;

        if (opts > 2) {
            document.getElementById('sceneSelect').options[0].style.display = 'none';
        }
        if (selectSceneInput.value === 'new') {
            this.openSceneForm();
        }
        else if (selectSceneInput.value === 'default') {
            this.hideNewTileButton();
        }
        else {
            let selectedScene = null;
            let i = 0;

            for (i; i < this.scenes.length; i += 1) {
                if (this.scenes[i].sceneName === selectSceneInput.value) {
                    selectedScene = this.scenes[i];
                }
            }

            if (selectedScene !== null) {
                this.showNewTileButton();
                this.changeActiveScene(selectedScene);
            }
        }
    }

    changeActiveScene(newSceneActive) {
        const scene = this.getActiveScene();
        if (scene != null) {
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

    deleteActiveScene() {
        const scene = this.getActiveScene();
        if (scene != null) {
            scene.clearScene();
            let i = 0, j = 0;
            for (i; i < this.scenes.length; i += 1) {
                if (this.scenes[i].idScene === scene.idScene)
                    this.scenes.splice(i, 1);
            }

            const selectSceneInput = document.getElementById('sceneSelect');
            const optionsSelectSceneInput = selectSceneInput.options;

            for (i = 0, j; i = selectSceneInput.options[j]; j += 1) {
                if (i.value === scene.sceneName) {
                    selectSceneInput.options.remove(j);
                    break;
                }
            }

            const opts = optionsSelectSceneInput.length;

            if (opts > 2) {
                const nextSceneName = optionsSelectSceneInput[2].value;
                let nextScene = null;
                for (i = 0; i < this.scenes.length; i += 1) {
                    if (this.scenes[i].sceneName === nextSceneName) {
                        nextScene = this.scenes[i];
                        break;
                    }
                }

                if (nextScene !== null) {
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
        this.sceneId = 'scene';
        this.tiles = [];
        this.sceneName = sceneName;
        this.isActive = false;
        this.gridX = 50;
        this.gridY = 50;

        if (this.sceneName !== 'demo') {
            this.idScene = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
        }
        else
            this.idScene = 'demo';
    }

    addDiv(parentDiv, content, attrs) {
        const div = document.createElement('div');
        const parent = document.getElementById(parentDiv);

        for (let key in attrs) {
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
        let elem = document.getElementById(elemId);
        elem.parentNode.removeChild(elem);
        elem = null;
    }

    deleteTileById(tileId) {
        let tileToBeDeleted = null;
        let index = 0, i = 0;

        for (i; i < this.tiles.length; i += 1) {
            if (this.tiles[i].idTile === tileId) {
                tileToBeDeleted = this.tiles[i];
                index = i;
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

    getTileById(id) {
        let i = 0;
        for (i; i < this.tiles.length; i += 1) {
            if (this.tiles[i].idTile === id) {
                return this.tiles[i];
            }
        }
        return null;
    }

    getTilesByType(type) {
        let tiles = [];
        let i = 0;
        for (i; i < this.tiles.length; i += 1) {
            if (this.tiles[i].type === type) {
                tiles.push(this.tiles[i]);
            }
        }
        return tiles;
    }

    duplicateTileById(tileId) {
        let tileToBeDuplicated = null;
        let i = 0;
        for (i; i < this.tiles.length; i += 1) {
            if (this.tiles[i].idTile === tileId) {
                tileToBeDuplicated = this.tiles[i];
            }
        }

        if (tileToBeDuplicated !== null) {
            let newTile = null;
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
            this.activeScene.tiles.push(newTile);
            newTile.findAvailablePos();
        }
    }

    clearScene() {
        let i = 0;
        for (i; i < this.tiles.length; i += 1) {
            const tile = this.tiles[i];
            let elem = document.getElementById(tile.idTile + ' resizable');
            if (elem !== null) {
                elem.parentNode.removeChild(elem);
                if (tile.intervalId !== null)
                    clearInterval(tile.intervalId);
            }
            elem = null;
        }
    }

    drawScene() {
        let i = 0;
        for (i; i < this.tiles.length; i += 1) {
            this.tiles[i].draw();
        }
    }

    toJSON() {
        let valueDict = {};
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

        this.__UIElements = {};
        this.__FormElements = {};

        this.idTile = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        if (this.sceneId === 'demo') {
            let merged = {};
            merge(merged, tileFormTemplate, form);
            this.form = new Form(merged);
        }

        this.UIAppBottomBoundary = document.getElementById('info').getBoundingClientRect()
    }

    __getUIElements() {
        const UITile = document.getElementById(this.idTile + ' resizable');
        const UITileHeader = document.getElementById(this.idTile + ' header');
        const UITileContent = document.getElementById(this.idTile + ' content');
        const UITileShadow = document.getElementById('shadow')
        return { UITile, UITileHeader, UITileContent, UITileShadow };
    }

    __getFormElements() {
        const title = document.getElementById('title');
        const headerFont = document.getElementById('headerFont');
        const headerFontSize = document.getElementById('headerFontSize');
        const headerFontColor = document.getElementById('headerFontColor');
        const headerColor = document.getElementById('headerColor');
        const contentBackgroundColor = document.getElementById('contentBackgroundColor');
        const borderSize = document.getElementById('borderSize');
        const borderColor = document.getElementById('borderColor');
        const width = document.getElementById('width');
        const height = document.getElementById('height');
        return {
            title, headerFont, headerFontSize, headerFontColor, headerColor,
            contentBackgroundColor, borderSize, borderColor, width, height
        };
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
        const scene = tipee.getSceneById(this.sceneId);
        let testPosition = this.findAvailablePos();

        function orderTilesBySurface(scene) {
            let i = 0;
            let orderedTile = [];
            for (i; i < scene.tiles.length; i += 1) {
                let tile = {};
                tile.id = scene.tiles[i].idTile;
                tile.surface = scene.tiles[i].width * scene.tiles[i].height;
                orderedTile.push(tile);
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
            const orderedTiles = orderTilesBySurface(scene);
            let list = [];
            let i = 0;

            if (orderedTiles.length > 1) {
                if (!scene.getTileById(orderedTiles[0].id).isDragging)
                    scene.getTileById(orderedTiles[0].id).autoResize();
                else
                    scene.getTileById(orderedTiles[1].id).autoResize();
            }

            for (i; i < scene.tiles.length; i += 1) {
                if (scene.tiles[i] !== this) {
                    list.push(scene.tiles[i]);
                    scene.tiles[i].findAvailablePos();
                }
            }
            testPosition = this.findAvailablePos();
        }
    }

    findAvailablePos() {
        const scene = tipee.getSceneById(this.sceneId);

        let i = Math.round(this.UIAppBottomBoundary.width / scene.gridX);
        let j = Math.round(this.UIAppBottomBoundary.top / scene.gridY);
        let k = 0, l = 0, m = 0;

        loop1:
        for (k; k < j - 5; k += 1) {
            this.y = k * scene.gridY + 50;
            loop2:
            for (l; l < i - 5; l += 1) {
                let col = 0;
                this.x = l * scene.gridX;

                if (scene.tiles.length > 1) {
                    loop3:
                    for (m; m < scene.tiles.length; m += 1) {
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
                        if (this.__UIElements.UITile !== null) {
                            this.__UIElements.UITile.style.top = this.y + 'px';
                            this.__UIElements.UITile.style.left = this.x + 'px';
                        }
                        return true;
                    }
                }
                else {
                    if (this.__UIElements.UITile !== null) {
                        this.__UIElements.UITile.style.top = this.y + 'px';
                        this.__UIElements.UITile.style.left = this.x + 'px';
                    }
                    return true;
                }
            }
        }
        return false;
    }

    autoResize() {
        const scene = tipee.getSceneById(this.sceneId);
        const oldWidth = this.width;
        const oldHeight = this.height;

        if (oldWidth / scene.gridX > 1)
            this.width = scene.gridX * ((oldWidth / scene.gridX) - 1);
        if (oldHeight / scene.gridX > 1)
            this.height = scene.gridX * ((oldHeight / scene.gridX) - 1);

        this.__UIElements.UITile.style.width = this.width + 'px';
        this.__UIElements.UITile.style.height = this.width + 'px';
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

    testOutsideUI() {
        if (this.y + this.height > this.UIAppBottomBoundary.top)
            return true;
        else
            return false;
    }

    dragElement() {
        const that = this;
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;

        if (this.__UIElements.UITileHeader) {
            // if present, the header is where you move the DIV from:
            this.__UIElements.UITileHeader.onmousedown = dragMouseDown;
            this.__UIElements.UITileHeader.ontouchstart = dragMouseDown;
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

                const scene = tipee.getSceneById(that.sceneId);
                const allEmements = scene.tiles;

                if (!that.isLocked) {
                    that.isClicked = false;
                    that.y = (that.__UIElements.UITile.offsetTop - pos2);
                    that.x = (that.__UIElements.UITile.offsetLeft - pos1);

                    if (that.__UIElements.UITile.offsetTop - pos2 < 50)
                        that.y = 50;

                    if (that.__UIElements.UITile.offsetTop - pos2 + that.height > that.UIAppBottomBoundary.top)
                        that.y = that.UIAppBottomBoundary.top - that.height;

                    if (that.__UIElements.UITile.offsetLeft - pos1 < 0)
                        that.x = 0;

                    if (that.__UIElements.UITile.offsetLeft - pos1 + that.width > that.UIAppBottomBoundary.width)
                        that.x = that.UIAppBottomBoundary.width - that.width;

                    that.__UIElements.UITile.style.top = that.y + 'px';
                    that.__UIElements.UITile.style.left = that.x + 'px';

                    that.__UIElements.UITile.style.opacity = '80%';
                    that.__UIElements.UITile.style.zIndex = 9;

                    that.__UIElements.UITileShadow.style.top = Math.round((that.y)
                        / scene.gridY) * scene.gridY + 'px';
                    that.__UIElements.UITileShadow.style.left = Math.round(that.x
                        / scene.gridX) * scene.gridX + 'px';
                    that.__UIElements.UITileShadow.style.width = that.width + 'px';
                    that.__UIElements.UITileShadow.style.height = that.height + 'px';
                    that.__UIElements.UITileShadow.style.display = 'block';

                    if (that.__UIElements.UITileShadow.offsetTop + that.height > that.UIAppBottomBoundary.top)
                        that.__UIElements.UITileShadow.style.top = that.UIAppBottomBoundary.top - that.height + 'px';

                    if (allEmements.length > 1) {
                        let colliding = [];
                        let i = 0;
                        for (i; i < allEmements.length; i += 1) {
                            const r2 = allEmements[i];

                            if (!r2.isDragging && r2 !== that) {
                                if (that.testCollision(r2)) {
                                    colliding.push(r2);
                                }
                            }
                        }

                        for (i=0; i < colliding.length; i += 1)
                            colliding[i].positionTile();
                    }
                }
            }
        }

        function closeDragElement() {
            const scene = tipee.getSceneById(that.sceneId);

            that.__UIElements.UITile.style.top = Math.round(that.y / scene.gridY) * scene.gridY + 'px';
            that.__UIElements.UITile.style.left = Math.round(that.x / scene.gridX) * scene.gridX + 'px';

            that.y = Math.round(that.y / scene.gridY) * scene.gridY;
            that.x = Math.round(that.x / scene.gridX) * scene.gridX;

            if (that.__UIElements.UITile.offsetTop + that.height > that.UIAppBottomBoundary.top) {
                that.y = that.UIAppBottomBoundary.top - that.height;
                that.__UIElements.UITile.style.top = that.UIAppBottomBoundary.top - that.height + 'px';
            }

            that.__UIElements.UITileShadow.style.display = 'none';
            that.__UIElements.UITile.style.opacity = '100%';
            document.onmouseup = null;
            document.onmousemove = null;
            that.isDragging = false;
        }
    }

    makeResizableDiv() {
        const that = this;
        const scene = tipee.getSceneById(that.sceneId);

        let resizers = [];
        resizers.push(document.getElementById(this.idTile + ' resizers top-left'));
        resizers.push(document.getElementById(this.idTile + ' resizers top-right'));
        resizers.push(document.getElementById(this.idTile + ' resizers bottom-left'));
        resizers.push(document.getElementById(this.idTile + ' resizers bottom-right'));

        const minimum_size = scene.gridX;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;
        let i = 0;

        for (i; i < resizers.length; i += 1) {
            const currentResizer = resizers[i];
            if (currentResizer.id.includes(this.idTile)) {
                currentResizer.addEventListener('mousedown', prepareResize);
            }

            function prepareResize(e) {
                e.preventDefault();
                original_width = parseFloat(getComputedStyle(that.__UIElements.UITile, null).
                    getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(that.__UIElements.UITile, null).
                    getPropertyValue('height').replace('px', ''));
                original_x = that.__UIElements.UITile.getBoundingClientRect().left;
                original_y = that.__UIElements.UITile.getBoundingClientRect().top;
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
                            that.__UIElements.UITile.style.width = width + 'px';
                            that.width = width;
                        }

                        if (height > minimum_size) {
                            if (that.y + height < that.UIAppBottomBoundary.top) {
                                that.__UIElements.UITile.style.height = height + 'px';
                                that.height = height;
                            }
                        }

                    } else if (currentResizer.classList.contains('bottom-left')) {
                        const height = original_height + (e.pageY - original_mouse_y);
                        const width = original_width - (e.pageX - original_mouse_x);

                        if (that.y + height < that.UIAppBottomBoundary.top) {
                            that.__UIElements.UITile.style.height = height + 'px';
                            that.height = height;
                        }

                        if (width > minimum_size) {
                            that.__UIElements.UITile.style.width = width + 'px';
                            that.__UIElements.UITile.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                            that.__UIElements.UITileShadow.style.left = Math.round((original_x + (e.pageX - original_mouse_x)) / scene.gridX) * scene.gridX + 'px';
                            that.x = original_x + (e.pageX - original_mouse_x);
                            that.width = width;
                        }

                    } else if (currentResizer.classList.contains('top-right')) {
                        const width = original_width + (e.pageX - original_mouse_x);
                        const height = original_height - (e.pageY - original_mouse_y);

                        if (width > minimum_size) {
                            that.__UIElements.UITile.style.width = width + 'px';
                            that.width = width;
                        }

                        if (height > minimum_size) {
                            if (original_y + (e.pageY - original_mouse_y) < 50) {
                                that.__UIElements.UITile.style.top = 50 + 'px';
                                that.__UIElements.UITileShadow.style.top = 50 + 'px';
                                that.y = 50;
                            }
                            else {
                                that.__UIElements.UITile.style.height = height + 'px';
                                that.__UIElements.UITile.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                                that.__UIElements.UITileShadow.style.top = Math.round((original_y + (e.pageY - original_mouse_y)) / scene.gridX) * scene.gridX + 'px';
                                that.y = original_y + (e.pageY - original_mouse_y);
                                that.height = height;
                            }
                        }

                    } else if (currentResizer.classList.contains('top-left')) {
                        const width = original_width - (e.pageX - original_mouse_x);
                        const height = original_height - (e.pageY - original_mouse_y);
                        if (width > minimum_size) {
                            that.__UIElements.UITile.style.width = width + 'px';
                            that.__UIElements.UITile.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                            that.__UIElements.UITileShadow.style.left = Math.round((original_x + (e.pageX - original_mouse_x)) / scene.gridX) * scene.gridX + 'px';
                            that.x = original_x + (e.pageX - original_mouse_x);
                            that.width = width;

                        }
                        if (height > minimum_size) {
                            if (original_y + (e.pageY - original_mouse_y) < 50) {
                                that.__UIElements.UITile.style.top = 50 + 'px';
                                that.__UIElements.UITileShadow.style.top = 50 + 'px';
                                that.y = 50;
                            }
                            else {
                                that.__UIElements.UITile.style.height = height + 'px';
                                that.__UIElements.UITile.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                                that.__UIElements.UITileShadow.style.top =
                                    Math.round((original_y + (e.pageY - original_mouse_y)) / scene.gridX) * scene.gridX + 'px';
                                that.y = original_y + (e.pageY - original_mouse_y);
                                that.height = height;
                            }
                        }
                    }

                    that.__UIElements.UITileShadow.style.width = Math.round(that.__UIElements.UITile.clientWidth /
                        scene.gridX) * scene.gridX + 'px';
                    that.__UIElements.UITileShadow.style.height = Math.round(that.__UIElements.UITile.clientHeight /
                        scene.gridX) * scene.gridX + 'px';
                    that.__UIElements.UITileShadow.style.display = 'block';

                    if (that.__UIElements.UITileShadow.offsetTop + that.__UIElements.UITileShadow.clientHeight > that.UIAppBottomBoundary.top)
                        that.__UIElements.UITileShadow.style.height = that.__UIElements.UITile.clientHeight + 'px';

                    that.__UIElements.UITileShadow.style.display = 'block';

                    that.__UIElements.UITile.style.opacity = '80%';
                    that.__UIElements.UITile.style.zIndex = 9;
                    that.resize();
                }
            }

            function stopResize() {
                if (!that.isDragging) {
                    that.isResizing = false;
                    that.__UIElements.UITile.style.width = Math.round(that.__UIElements.UITile.clientWidth / scene.gridX)
                        * scene.gridX + 'px';
                    that.height = Math.round(that.__UIElements.UITile.clientHeight / scene.gridX) * scene.gridX;

                    that.__UIElements.UITile.style.height = Math.round(that.__UIElements.UITile.clientHeight / scene.gridX)
                        * scene.gridX + 'px';
                    that.width = Math.round(that.__UIElements.UITile.clientWidth / scene.gridX) * scene.gridX;

                    that.__UIElements.UITile.style.top = Math.round(that.__UIElements.UITile.offsetTop / scene.gridX)
                        * scene.gridX + 'px';
                    that.y = Math.round(that.__UIElements.UITile.offsetTop / scene.gridX) * scene.gridX;

                    that.__UIElements.UITile.style.left = Math.round(that.__UIElements.UITile.offsetLeft / scene.gridX)
                        * scene.gridX + 'px';
                    that.x = Math.round(that.__UIElements.UITile.offsetLeft / scene.gridX) * scene.gridX;

                    if (that.__UIElements.UITile.offsetTop + that.height > that.UIAppBottomBoundary.top) {
                        that.y = that.UIAppBottomBoundary.top - that.height;
                        that.__UIElements.UITile.style.top = that.UIAppBottomBoundary.top - that.height + 'px';
                    }

                    const bleft = document.getElementById(that.idTile + ' resizers bottom-left');
                    bleft.setAttribute('class', '');
                    bleft.style.cssText = '';

                    const tleft = document.getElementById(that.idTile + ' resizers top-left');
                    tleft.setAttribute('class', '');
                    tleft.style.cssText = '';

                    const bright = document.getElementById(that.idTile + ' resizers bottom-right');
                    bright.setAttribute('class', '');
                    bright.style.cssText = '';

                    const tright = document.getElementById(that.idTile + ' resizers top-right');
                    tright.setAttribute('class', '');
                    tright.style.cssText = '';

                    that.__UIElements.UITileShadow.style.display = 'none';
                    that.__UIElements.UITile.style.opacity = '100%';

                    that.resize();
                }

                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
                currentResizer.removeEventListener('mousedown', prepareResize);
            }
        }
    }

    toJSON() {
        let valueDict = {};
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
        this.form.build();
        this.__FormElements = this.__getFormElements();
    }

    openForm() {
        tipee.openTileForm(this);
    }

    updateForm() {
        const type = this.type;
        let i = 0;
        for (i; i < document.getElementsByName('test').length; i += 1) {
            document.getElementById('type').value = type;
            if (this.idTile !== 'demo')
                document.getElementsByName('test')[i].disabled = true;
            else
                document.getElementsByName('test')[i].disabled = false;
            if (document.getElementsByName('test')[i].value === type)
                document.getElementsByName('test')[i].checked = true;
        }
    }

    fillForm() {
        document.getElementById('title').value = this.title;
        document.getElementById('type').value = this.type;
        document.getElementById('idTile').value = this.idTile;
        document.getElementById('headerFont').value = this.headerFont;
        document.getElementById('headerFont').onchange();
        document.getElementById('headerFontSize').value = this.headerFontSize;
        document.getElementById('headerFontColor').value = this.headerFontColor;
        updatePicker('headerFontColor');
        document.getElementById('headerColor').value = this.headerColor;
        updatePicker('headerColor');
        document.getElementById('contentBackgroundColor').value = this.contentBackgroundColor;
        updatePicker('contentBackgroundColor');
        document.getElementById('borderSize').value = this.borderSize;
        document.getElementById('borderColor').value = this.borderColor;
        updatePicker('borderColor');
        document.getElementById('width').value = this.width;
        document.getElementById('height').value = this.height;
    }

    update() {
        this.title = document.getElementById('title').value;
        this.headerFont = document.getElementById('headerFont').value;
        this.headerFontSize = document.getElementById('headerFontSize').value;
        this.headerFontColor = document.getElementById('headerFontColor').value;
        this.headerFontColor = document.getElementById('headerFontColor').value;
        this.headerColor = document.getElementById('headerColor').value;
        this.contentBackgroundColor = document.getElementById('contentBackgroundColor').value;
        this.borderSize = document.getElementById('borderSize').value;
        this.borderColor = document.getElementById('borderColor').value;
        this.width = parseInt(document.getElementById('width').value);
        this.height = parseInt(document.getElementById('height').value);
    }

    resize() {

    }

    draw() {
        const that = this;
        const scene = tipee.getSceneById(that.sceneId);

        const htmlContent =
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

        scene.addDiv('scene', htmlContent, {
            'class': 'resizable',
            'id': this.idTile + ' resizable',
        });

        this.__UIElements = this.__getUIElements();

        this.__UIElements.UITile.style.width = this.width + 'px';
        this.__UIElements.UITile.style.height = this.height + 'px';
        this.__UIElements.UITile.style.top = this.y + 'px';
        this.__UIElements.UITile.style.left = this.x + 'px';

        this.__UIElements.UITileHeader.style.cssText = 'background-color: ' + this.headerColor +
            ' !important; font-family:"' + this.headerFont + '"; color: ' +
            this.headerFontColor + '; font-size: ' + this.headerFontSize + 'px;';

        const resizer = document.getElementById(this.idTile + ' resizers');
        resizer.style.cssText = 'background-color: ' + this.contentBackgroundColor +
            '; border: ' + this.borderSize + 'px solid ' + this.borderColor + ';';
        this.__UIElements.UITileHeader.addEventListener('dblclick', function () {
            if (!that.isLocked) {
                const bleft = document.getElementById(that.idTile + ' resizers bottom-left');
                bleft.setAttribute('class', 'resizer bottom-left');
                bleft.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + '!important;';

                const tleft = document.getElementById(that.idTile + ' resizers top-left');
                tleft.setAttribute('class', 'resizer top-left');
                tleft.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + ';';

                const bright = document.getElementById(that.idTile + ' resizers bottom-right');
                bright.setAttribute('class', 'resizer bottom-right');
                bright.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + ';';

                const tright = document.getElementById(that.idTile + ' resizers top-right');
                tright.setAttribute('class', 'resizer top-right');
                tright.style.cssText += 'border: ' + that.borderSize + 'px solid ' +
                    that.borderColor + ';';
                that.makeResizableDiv();
            }
        });

        this.__UIElements.UITileHeader.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            const target = e.currentTarget.getAttribute('id').split(' ')[0];
            that.isClicked = true;
            const contextMenu = document.querySelector('.context-menu');
            contextMenu.setAttribute('id', target);
            const posX = (e.clientX + 150 > document.documentElement.clientWidth) ?
                e.clientX - 150 : e.clientX;
            const posY = (e.clientY + 140 + 55 > document.documentElement.clientHeight) ?
                e.clientY - 140 : e.clientY;
            contextMenu.style.top = posY + 'px';
            contextMenu.style.left = posX + 'px';
            contextMenu.classList.add('shown');
        });

        this.dragElement();
    }

    redraw() {
        this.__UIElements.UITile.parentNode.removeChild(this.__UIElements.UITile);
        this.__UIElements.UITile = null;
    }
}

class TipeeTileNote extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, textColor, textFont,
        textFontSize, text) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileNoteFormTemplate);

        this.textColor = textColor;
        this.textFont = textFont;
        this.textFontSize = textFontSize;
        this.text = text || '';
        this.type = 'note';
    }

    __getUIElements() {
        let baseElements = super.__getUIElements();
        const UITextArea = document.getElementById(this.idTile + ' textArea');
        return { UITextArea, ...baseElements };
    }

    __getFormElements() {
        let baseElements = super.__getFormElements();
        const textFont = document.getElementById('textFont');
        const textFontSize = document.getElementById('textFontSize');
        const textColor = document.getElementById('textColor');
        return { ...baseElements, textFont, textFontSize, textColor };
    }

    updateForm() {
        super.updateForm();
    }

    fillForm() {
        super.fillForm();
        this.__FormElements.textFont.value = this.textFont;
        this.__FormElements.textFont.onchange();
        this.__FormElements.textFontSize.value = this.textFontSize;
        this.__FormElements.textColor.value = this.textColor;
        updatePicker('textColor');
    }

    update() {
        super.update();
        this.__FormElements = this.__getFormElements();
        this.textFont = this.__FormElements.textFont.value;
        this.textFontSize = this.__FormElements.textFontSize.value;
        this.textColor = this.__FormElements.textColor.value;
    }

    draw() {
        const that = this;
        super.draw();

        const width = this.width - (this.borderSize * 2);
        const headerHeight = this.__UIElements.UITileHeader.offsetHeight;
        const height = this.height - (this.borderSize * 2) - headerHeight;

        this.__UIElements.UITileContent.innerHTML = `<textarea id='` + this.idTile + ` textArea' 
        style=' resize: none; width: ` + width + `px; height: ` + height + `px;'>`;
        this.__UIElements.UITileContent.style.cssText = 'position: absolute; top: ' + headerHeight +
            'px; left: 0px;';

        this.__UIElements = this.__getUIElements();

        this.__UIElements.UITextArea.value = this.text;
        this.__UIElements.UITextArea.addEventListener('focusout', () => {
            that.text = this.__UIElements.UITextArea.value;
        })

        this.__UIElements.UITextArea.style.color = this.textColor;
        this.__UIElements.UITextArea.style.fontSize = this.textFontSize + 'px';
        this.__UIElements.UITextArea.style.fontFamily = this.textFont;
    }

    redraw() {
        super.redraw();
        this.draw();
    }

    resize() {
        super.resize();
        const width = this.width - (this.borderSize * 2);
        const headerHeight = this.__UIElements.UITileHeader.offsetHeight;
        const height = this.height - (this.borderSize) - 1 - headerHeight;

        this.__UIElements.UITextArea.style.width = width + 'px';
        this.__UIElements.UITextArea.style.height = height + 'px';
        this.__UIElements.UITextArea.style.top = headerHeight + 'px';
    }

    toJSON() {
        let valueDict = super.toJSON();
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
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, textColor,
        textFont, textFontSize, todo) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title,
            tileTodoFormTemplate);

        this.textColor = textColor;
        this.textFont = textFont;
        this.textFontSize = textFontSize;
        if (todo != null)
            this.todo = todo;
        else
            this.todo = '';
        this.type = 'todo';
    }

    __getUIElements() {
        let baseElements = super.__getUIElements();
        const UITodoList = document.getElementById(this.idTile + ' todolist');
        return { UITodoList, ...baseElements };
    }

    __getFormElements() {
        let baseElements = super.__getFormElements();
        const textFont = document.getElementById('textFont');
        const textFontSize = document.getElementById('textFontSize');
        const textColor = document.getElementById('textColor');
        return { ...baseElements, textFont, textFontSize, textColor };
    }

    updateForm() {
        super.updateForm();
        this.__FormElements = this.__getFormElements();
    }

    fillForm() {
        super.fillForm();
        this.__FormElements.textFont.value = this.textFont;
        this.__FormElements.textFont.onchange();
        this.__FormElements.textFontSize.value = this.textFontSize;
        this.__FormElements.textColor.value = this.textColor;
        updatePicker('textColor');
    }

    update() {
        super.update();
        this.__FormElements = this.__getFormElements();
        this.textFont = this.__FormElements.textFont.value;
        this.textFontSize = this.__FormElements.textFontSize.value;
        this.textColor = this.__FormElements.textColor.value;
    }

    draw() {
        const that = this;
        super.draw();

        let todos = this.todo || '';
        const headerHeight = this.__UIElements.UITileHeader.offsetHeight;

        this.__UIElements.UITileContent.style.position = 'absolute';
        this.__UIElements.UITileContent.style.top = headerHeight + 'px';
        this.__UIElements.UITileContent.style.overflow = 'auto';
        this.__UIElements.UITileContent.style.width = 'inherit';
        this.__UIElements.UITileContent.style.height = this.height - headerHeight -
            (this.borderSize * 2) + 'px';
        this.__UIElements.UITileContent.innerHTML += '<div><input type="text" id="' +
            this.idTile + ' new" style="margin-top:5px" placeholder="New task"><ul id="' +
            this.idTile + ' todolist"></ul>';

        this.__UIElements = this.__getUIElements()

        if (todos !== '') {
            let i = 0;
            todos = that.todo.split(';');

            const filtered = todos.filter(function (el) {
                return (el != null && el !== '');
            });

            this.__UIElements.UITodoList.style.listStyle = 'none';
            this.__UIElements.UITodoList.style.padding = '5px';

            for (i; i < filtered.length; i += 1) {
                const li = document.createElement('li');
                li.style.textAlign = 'left';
                li.id = that.idTile + i;
                li.style.marginBottom = '3px';

                const div = document.createElement('div');
                const item = filtered[i].split('|');

                const chb = document.createElement('INPUT');
                chb.setAttribute('type', 'checkbox');
                chb.id = that.idTile + ' chb' + i;
                if (item[1] === 'Y')
                    chb.checked = true;
                else
                    chb.checked = false;

                (function (index) {
                    chb.addEventListener('change', function () {
                        let checked = '';
                        let todosNew = ''
                        let k = 0;

                        const chb = document.getElementById(that.idTile + ' chb' + index);

                        if (chb.checked === true)
                            checked = 'Y';
                        else
                            checked = 'N';

                        filtered[index] = filtered[index].split('|')[0] + '|' + checked;

                        for (k = 0; k < filtered.length; k += 1) {
                            if (filtered[k] !== '')
                                todosNew += filtered[k] + ';'
                        }
                        that.todo = todosNew;
                    })
                })(i)

                const bt = document.createElement('button');
                bt.innerText = 'Del';
                bt.style.float = 'right';
                bt.innerHTML = '<i class="fas fa-minus"></i>';

                (function (index) {
                    bt.addEventListener('click', function () {
                        filtered.splice(index, 1);
                        let j = 0;
                        let todosNew = '';

                        for (j; j < filtered.length; j += 1) {
                            if (filtered[j] !== '')
                                todosNew += filtered[j] + ';';
                        }

                        that.todo = todosNew;

                        const id = that.idTile.concat('', index);
                        let elem = document.getElementById(id);
                        elem.parentNode.removeChild(elem);
                        elem = null;
                        that.redraw();
                    })
                })(i)

                div.appendChild(chb);
                div.appendChild(document.createTextNode(item[0]));
                div.appendChild(bt);
                li.appendChild(div);
                this.__UIElements.UITodoList.appendChild(li);
            }
        }
        else {
            todos = [];
        }

        const addButton = document.getElementById(this.idTile + ' new');
        addButton.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const val = document.getElementById(that.idTile + ' new').value;
                if (val !== '')
                    that.todo += val + '|N' + ';';
                that.redraw();
            }
        });
    }

    redraw() {
        super.redraw();
        this.draw();
    }

    resize() {
        this.__UIElements.UITileContent.style.height = this.height -
            this.__UIElements.UITileHeader.offsetHeight - (this.borderSize * 2) + 'px';
    }

    toJSON() {
        let valueDict = super.toJSON();
        valueDict['textColor'] = this.textColor;
        valueDict['textFont'] = this.textFont;
        valueDict['textFontSize'] = this.textFontSize;
        valueDict['todo'] = this.todo;
        valueDict['type'] = this.type;
        return valueDict;
    }
}

class TipeeTileText extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, requestUrl, reqType,
        responseType, responseField, textBefore, textAfter, requestRefresh, textColor, textFont, textFontSize,
        operation) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileTextFormTemplate);

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

    __getUIElements() {
        let baseElements = super.__getUIElements();
        const UIContentTxt = document.getElementById(this.idTile + ' contentTxt');
        return { UIContentTxt, ...baseElements };
    }

    __getFormElements() {
        let baseElements = super.__getFormElements();
        const responseFieldChildLabel = document.getElementById('responseFieldChildLabel');
        const textFont = document.getElementById('textFont');
        const textFontSize = document.getElementById('textFontSize');
        const textColor = document.getElementById('textColor');
        const requestUrl = document.getElementById('requestUrl');
        const responseType = document.getElementById('responseType');
        const textBefore = document.getElementById('textBefore');
        const textAfter = document.getElementById('textAfter');
        const requestRefresh = document.getElementById('requestRefresh');
        const reqType = document.getElementById('reqType');
        const operation = document.getElementById('operation');
        const responseField = document.getElementById('responseField');
        const responseFieldChild = document.getElementById('responseFieldChild');
        return {
            ...baseElements, responseType, responseFieldChild, responseFieldChildLabel, textFont,
            textFontSize, textColor, requestUrl, textBefore, textAfter, requestRefresh, reqType, operation,
            responseField, responseFieldChild
        };
    }

    updateForm() {
        super.updateForm()
        this.__FormElements = this.__getFormElements();

        if (responseType.value === 'XML') {
            this.__FormElements.responseFieldChildLabel.style.display = 'block';
            this.__FormElements.responseFieldChild.style.display = 'block';
            this.form.validation.activateField('responseFieldChild');
        }
        else {
            this.__FormElements.responseFieldChildLabel.style.display = 'none';
            this.__FormElements.responseFieldChild.style.display = 'none';
            this.form.validation.desactivateField('responseFieldChild');
        }
    }

    fillForm() {
        super.fillForm();
        this.__FormElements = this.__getFormElements();

        this.__FormElements.textFont.value = this.textFont;
        document.getElementById('textFont').onchange();
        this.__FormElements.textFontSize.value = this.textFontSize;
        this.__FormElements.textColor.value = this.textColor;
        updatePicker('textColor');
        this.__FormElements.textBefore.value = this.textBefore;
        this.__FormElements.textAfter.value = this.textAfter;
        this.__FormElements.requestUrl.value = this.requestUrl;
        this.__FormElements.operation.value = this.operation;
        this.__FormElements.reqType.value = this.reqType;
        this.__FormElements.requestRefresh.value = this.requestRefresh;
        this.__FormElements.responseType.value = this.responseType;

        if (this.responseType === 'XML') {
            this.__FormElements.responseField.value = this.responseField.split(';')[0];
            this.__FormElements.responseFieldChild.value = this.responseField.split(';')[1];
        }
        else {
            this.__FormElements.responseField.value = this.responseField;
        }
    }

    update() {
        super.update();
        this.__FormElements = this.__getFormElements();

        this.textFont = this.__FormElements.textFont.value;
        this.textFontSize = this.__FormElements.textFontSize.value;
        this.textColor = this.__FormElements.textColor.value;
        this.requestUrl = this.__FormElements.requestUrl.value;
        this.responseType = this.__FormElements.responseType.value;
        this.textBefore = this.__FormElements.textBefore.value;
        this.textAfter = this.__FormElements.textAfter.value;
        this.requestRefresh = this.__FormElements.requestRefresh.value;
        this.reqType = this.__FormElements.reqType.value;
        this.operation = this.__FormElements.operation.value;

        let responseField = '';
        if (this.responseType === 'XML') {
            responseField = this.__FormElements.responseField.value;
            responseField += ';';
            responseField += this.__FormElements.responseFieldChild.value;
        }
        else {
            responseField = this.__FormElements.responseField.value;
        }

        this.responseField = responseField;
    }

    draw() {
        super.draw();
        const that = this;

        this.__UIElements.UITileContent.innerHTML = `<p id='` + this.idTile + ` contentTxt'>Chargement...</p>`;
        this.__UIElements = this.__getUIElements();
        this.__UIElements.UITileContent.style.top = this.__UIElements.UITileHeader.offsetHeight + 'px';

        const height = this.height - this.__UIElements.UITileHeader.offsetHeight;

        this.__UIElements.UITileContent.style.height = height + 'px';
        this.__UIElements.UITileContent.style.position = 'absolute';
        this.__UIElements.UITileContent.style.color = this.textColor;
        this.__UIElements.UITileContent.style.fontFamily = this.textFont;
        this.__UIElements.UITileContent.style.fontSize = this.textFontSize + 'px';
        this.__UIElements.UITileContent.style.display = 'flex';
        this.__UIElements.UITileContent.style.overflow = 'hidden';

        this.__UIElements.UIContentTxt.style.display = 'flex';
        this.__UIElements.UIContentTxt.style.alignItems = 'center';
        this.__UIElements.UIContentTxt.style.marginLeft = this.width / 2
            - this.__UIElements.UIContentTxt.offsetWidth / 2 + 'px';


        const requestCallback = function (returned_data) {
            that.__UIElements.UITileContent.innerHTML = `<p style:'color: #` + that.textColor + `;'  id='`
                + that.idTile + ` contentTxt'>` + that.textBefore + ' ' + returned_data + ' ' + that.textAfter +
                `</p>`;
            that.__UIElements.UIContentTxt.style.display = 'flex';
            that.__UIElements.UIContentTxt.style.alignItems = 'center';
            that.__UIElements.UIContentTxt.style.marginLeft = that.width / 2 -
                that.__UIElements.UIContentTxt.offsetWidth / 2 + 'px';
        };

        if (this.requestRefresh > 0) {
            request(that.requestUrl, true, that.reqType, '', that.responseType, that.responseField,
                that.operation, requestCallback);
            that.intervalId = setInterval(function () {
                if (tipee.mode !== 'dev')
                    request(that.requestUrl, true, that.reqType, '', that.responseType, that.responseField,
                        that.operation, requestCallback);
            }, 1000 * this.requestRefresh);
        }
        else {
            if (tipee.mode !== 'dev')
                request(that.requestUrl, true, that.reqType, '', that.responseType, that.responseField,
                    that.operation, requestCallback);
        }
    }

    redraw() {
        super.redraw();
        if (this.intervalId !== null)
            clearInterval(this.intervalId);
        this.draw();
    }

    resize() {
        this.__UIElements.UITileContent.style.height = this.height
            - this.__UIElements.UITileHeader.offsetHeight - (this.borderSize * 2) + 'px';
        this.__UIElements.UIContentTxt.style.marginLeft = that.width / 2
            - this.__UIElements.UIContentTxt.offsetWidth / 2 + 'px';
    }

    toJSON() {
        let valueDict = super.toJSON();
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
}

class TipeeTileImage extends TipeeTile {
    constructor(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, imgNb, imgSrc,
        imgSlideInterval, imgRefresh) {
        super(scene, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileImgFormTemplate);

        this.imgNb = parseInt(imgNb);
        this.imgSrc = imgSrc;
        this.imgSlideInterval = parseInt(imgSlideInterval);
        this.imgRefresh = parseInt(imgRefresh);
        this.intervalId;
        this.type = 'image';
    }

    __getUIElements() {
        let baseElements = super.__getUIElements();
        const UIImage = document.getElementById(this.idTile + ' resizers');
        return { UIImage, ...baseElements };
    }

    __getFormElements() {
        let baseElements = super.__getFormElements();
        const imgType = document.getElementById('imgType');
        const imgNb = document.getElementById('imgNb');
        const imgNbLabel = document.getElementById('imgNbLabel');
        const imgSlideIntervalLabel = document.getElementById('imgSlideIntervalLabel');
        const imgSlideInterval = document.getElementById('imgSlideInterval');
        const imgRefresh = document.getElementById('imgRefresh');
        return {
            ...baseElements, imgType, imgNb, imgNbLabel, imgSlideIntervalLabel,
            imgSlideInterval, imgRefresh
        };
    }

    updateForm() {
        super.updateForm()
        this.__FormElements = this.__getFormElements();

        let i = 0, nbImg = 0;

        this.__FormElements.imgNb.style.display = 'none';
        this.__FormElements.imgNbLabel.style.display = 'none';
        this.__FormElements.imgSlideIntervalLabel.style.display = 'none';
        this.__FormElements.imgSlideInterval.style.display = 'none';

        this.form.validation.desactivateField('imgSlideInterval');

        for (i; i < 10; i += 1) {
            const elem = document.getElementById('imgSrc' + i);
            elem.style.display = 'none';
            this.form.validation.desactivateField('imgSrc' + i);
        }

        if (this.__FormElements.imgType.value === 'single') {
            nbImg = 1;
        }
        else if (this.__FormElements.imgType.value === 'slideshow') {
            this.__FormElements.imgNb.style.display = 'block';
            this.__FormElements.imgNbLabel.style.display = 'block';
            this.__FormElements.imgSlideIntervalLabel.style.display = 'block';
            this.__FormElements.imgSlideInterval.style.display = 'block';
            nbImg = imgNb.value;
            this.form.validation.activateField('imgSlideInterval');
        }

        for (i = 0; i < nbImg; i += 1) {
            const elem = document.getElementById('imgSrc' + i);
            elem.style.display = 'block';
            this.form.validation.activateField('imgSrc' + i);
        }
    }

    fillForm() {
        super.fillForm();
        let i = 0;

        if (this.imgNb === 1) {
            this.__FormElements.imgType.value = 'single';
        }
        else {
            this.__FormElements.imgType.value = 'slideshow';
            this.__FormElements.imgSlideInterval.value = this.imgSlideInterval;
            this.__FormElements.imgNb.value = this.imgNb;
        }

        this.__FormElements.imgRefresh.value = this.imgRefresh;

        for (i; i < this.imgNb; i += 1)
            document.getElementById('imgSrc' + i).value = this.imgSrc[i];
    }

    update() {
        super.update();
        this.__FormElements = this.__getFormElements();

        let i = 0, nb = 0;
        let src = [];
        let imgSlideInterval = 0;
        const imgRefresh = parseInt(this.__FormElements.imgRefresh.value);

        if (this.__FormElements.imgType.value === 'single') {
            const imgSingleSrc = document.getElementById('imgSrc0');
            src.push(imgSingleSrc.value);
            nb = 1;
            imgSlideInterval = 60;
        }
        else {
            nb = parseInt(this.__FormElements.imgNb.value);
            for (i; i < nb; i += 1) {
                const imgSingleSrcI = document.getElementById('imgSrc' + i);
                src.push(imgSingleSrcI.value);
            }
            imgSlideInterval = parseInt(this.__FormElements.imgSlideInterval.value);
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
            this.__UIElements.UIImage.style.cssText += `background-image: url(` + this.imgSrc[0] +
                `) !important; background-size: cover !important;`;
        }
    }

    redraw() {
        super.redraw();
        if (this.intervalId !== null)
            clearInterval(this.intervalId);
        this.draw();
        this.refreshEvery();
    }

    slide(imgSrcs, index) {
        const that = this;
        this.__UIElements.UIImage.style.cssText += `background-image: url(` + imgSrcs[index] +
            `) !important; background-size: cover !important;`;
        index = (index + 1) % imgSrcs.length;
        setTimeout(() => { that.slide(imgSrcs, index); }, this.imgSlideInterval * 1000);
    }

    refreshEvery() {
        const scene = tipee.getSceneById(this.sceneId);
        const that = this;

        this.intervalId = setInterval(() => {
            scene.removeElement(that.idTile + ' resizable');
            that.draw();
        }
            , this.imgRefresh * 1000);
    }

    toJSON() {
        const valueDict = super.toJSON();
        valueDict['type'] = this.type;
        valueDict['imgNb'] = this.imgNb;
        valueDict['imgSrc'] = this.imgSrc;
        valueDict['imgSlideInterval'] = this.imgSlideInterval;
        valueDict['imgRefresh'] = this.imgRefresh;
        return valueDict;
    }
}

class TipeeTileToggles extends TipeeTile {
    constructor(sceneId, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
        headerFontSize, borderColor, borderSize, contentBackgroundColor, title, togglesNb,
        togglesProperties) {
        super(sceneId, x, y, width, height, isLocked, headerColor, headerFontColor, headerFont,
            headerFontSize, borderColor, borderSize, contentBackgroundColor, title, tileToggleFormTemplate);

        this.togglesNb = togglesNb;
        this.togglesProperties = togglesProperties;
        this.type = 'toggles';
    }

    __getUIElements() {
        let baseElements = super.__getUIElements();
        return { ...baseElements };
    }

    __getFormElements() {
        let baseElements = super.__getFormElements();
        const togglesNb = document.getElementById('togglesNb');
        return { ...baseElements, togglesNb };
    }

    fillForm() {
        super.fillForm();
        let i = 0;
        this.__FormElements.togglesNb.value = this.togglesNb;
        for (i; i < this.togglesNb; i += 1) {
            document.getElementById('togglesName' + i).value = this.togglesProperties[i].name;
            document.getElementById('togglesURL' + i).value = this.togglesProperties[i].url;
        }
    }

    updateForm() {
        super.updateForm();
        this.__FormElements = this.__getFormElements();

        let i = 0;

        for (i; i < 10; i += 1) {
            document.getElementById('togglesName' + i).style.display = 'none';
            document.getElementById('togglesURL' + i).style.display = 'none';
            this.form.validation.desactivateField('togglesName' + i);
            this.form.validation.desactivateField('togglesURL' + i);
        }

        for (i = 0; i < this.__FormElements.togglesNb.value; i += 1) {
            document.getElementById('togglesName' + i).style.display = 'block';
            document.getElementById('togglesURL' + i).style.display = 'block';
            this.form.validation.activateField('togglesName' + i);
            this.form.validation.activateField('togglesURL' + i);
        }
    }

    update() {
        super.update();
        this.__FormElements = this.__getFormElements();

        let i = 0;
        let properties = [];

        for (i; i < parseInt(this.__FormElements.togglesNb.value); i += 1) {
            let property = {};
            property['name'] = document.getElementById('togglesName' + i).value;
            property['url'] = document.getElementById('togglesURL' + i).value;
            properties.push(property);
        }

        this.togglesNb = parseInt(this.__FormElements.togglesNb.value);
        this.togglesProperties = properties;
    }

    draw() {
        super.draw();
        const that = this;

        let i = 0;
        let htmlContent = '<div class="buttons"><table>';

        for (i; i < this.togglesNb; i += 1) {
            if ((i + 1) % 2 === 1) {
                htmlContent += '<tr><td><button id="' + this.idTile + '-button-' + i +
                    '">' + this.togglesProperties[i].name + '</button></td>';
            }
            else {
                htmlContent += '<td><button  id="' + this.idTile + '-button-' + i + '">' +
                    this.togglesProperties[i].name + '</button></td></tr>';
            }
        }

        htmlContent += '</table></div>';
        this.__UIElements.UITileContent.innerHTML = htmlContent;

        for (i = 0; i < this.togglesNb; i += 1) {
            let bt = document.getElementById(this.idTile + '-button-' + i);
            (function (index) {
                bt.addEventListener('click', () => {
                    that.trigger(that.togglesProperties[index].url);
                });
            })(i)
        }
    }

    redraw() {
        super.redraw();
        this.draw();
    }

    trigger(requestUrl) {
        request(requestUrl, true, 'POST');
    }

    toJSON() {
        let valueDict = super.toJSON();
        valueDict['type'] = this.type;
        valueDict['togglesNb'] = this.togglesNb;
        valueDict['togglesProperties'] = this.togglesProperties;
        return valueDict;
    }
}

function loadFile() {
    let input, file, fr;

    if (typeof window.FileReader !== 'function') {
        alert('The file API isn\'t supported on this browser yet.');
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert('Um, couldn\'t find the fileinput element.');
    }
    else if (!input.files) {
        alert('This browser doesn\'t seem to support the `files` property of file inputs.');
    }
    else if (!input.files[0]) {
        alert('Please select a file before clicking \'Load\'');
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        let lines = e.target.result;
        const json = JSON.parse(lines);
        loadJSON(json);
    }
}

function request(urlRequest, crossOrigine, requestType, data, responseType, responseField, operation, callback) {
    const httpReq = new XMLHttpRequest();
    if (crossOrigine)
        httpReq.open(requestType, 'https://cors-anywhere.herokuapp.com/' + urlRequest, true);
    else
        httpReq.open(requestType, urlRequest, true);

    httpReq.overrideMimeType('text/xml');
    httpReq.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    httpReq.setRequestHeader('Access-Control-Allow-Headers', '*');
    httpReq.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    httpReq.setRequestHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

    if (requestType !== 'GET' && data !== '')
        httpReq.send(JSON.stringify(data));
    else
        httpReq.send();

    let requestResult = '';

    httpReq.onreadystatechange = (e) => {
        if (httpReq.readyState === 4 && httpReq.status === 200) {
            if (requestType === 'GET' && responseType === 'JSON') {
                if (httpReq.responseText !== '') {
                    let json = JSON.parse(httpReq.responseText);
                    const fields = responseField.split('.');
                    let i = 0;
                    if (json.length > 0) {
                        for (i; i < fields.length; i += 1)
                            json = json[0][fields[i]];
                        if (operation === 'kelvinToCelcius')
                            requestResult = kelvinToCelcius(json);
                        else
                            requestResult = json;
                        callback.apply(this, [requestResult]);
                    }
                    else {
                        for (i; i < fields.length; i += 1)
                            json = json[fields[i]];
                        if (operation === 'kelvinToCelcius')
                            requestResult = kelvinToCelcius(json);
                        else
                            requestResult = json;
                        callback.apply(this, [requestResult]);
                    }
                }
            }
            else if (requestType === 'GET' && responseType === 'XML') {
                if (httpReq.responseText !== '') {
                    const xml = httpReq.responseXML;
                    let xmlResult = '';
                    if (xml != null) {
                        let arr = responseField.split(';');
                        if (arr.length > 1 && arr[1] !== '')
                            xmlResult = xml.getElementsByTagName(arr[0])[parseInt(arr[1])].childNodes[0].textContent;
                        else
                            xmlResult = xml.getElementsByTagName(arr[0])[0].textContent;
                        if (operation === 'kelvinToCelcius')
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
        else if (httpReq.readyState === 4 && httpReq.status === 210) {
            requestResult = 2;
            callback.apply(this, [requestResult]);
        }
        else if (httpReq.readyState === 4 && httpReq.status === 211) {
            requestResult = 3;
            callback.apply(this, [requestResult]);
        }
        else if (httpReq.readyState === 4 && httpReq.status === 204) {
            requestResult = 2;
            callback.apply(this, [requestResult]);
        }
        else if (httpReq.readyState === 4 && httpReq.status === 206) {
            requestResult = 3;
            callback.apply(this, [requestResult]);
        }
        else if (httpReq.readyState === 4 && httpReq.status === 207) {
            requestResult = '207';
            callback.apply(this, [requestResult]);
        }
    };

    httpReq.onerror = function () {
        console.log('** An error occurred during the transaction');
        notif({ title: 'New Notification', subTitle: 'An error occurred during the transaction' });

    };

    httpReq.onloadend = function () {
        if (httpReq.status == 404)
        notif({ title: 'New Notification', subTitle: 'An error occurred during the transaction' });

        else if (httpReq.status == 403)
        notif({ title: 'New Notification', subTitle: 'An error occurred during the transaction' });

    };
}

function kelvinToCelcius(valueKelvin) {
    return roundDecimal(parseFloat(valueKelvin) - 273.15, 1);
}

function roundDecimal(nb, precision) {
    return Math.round(nb * Math.pow(10, precision || 2)) / Math.pow(10, precision || 2);
}

function createScene() {
    tipee.createSceneSubmit();
}

function signin() {
    tipee.signinSignupSubmit();
}

function createOrUpdateTpTile() {
    tipee.createOrUpdateTpTile();
}
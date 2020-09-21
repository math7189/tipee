function openSceneForm() {
   document.getElementById("sceneForm").style.display = "flex";
   document.getElementById("backgroundScreen").classList.add("backgroundScreen");
}

function closeSceneForm() {
   myApp.reloadActiveScene()
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
      form = myApp.loginForm
      
   if (action == "signin") {
      document.getElementById("passwordTd").colSpan = "2";
      document.getElementById("btvalLogTd").colSpan = "2";
      document.getElementById("sign").value = "signup"
      document.getElementById("sign").innerText = "Sign Up"

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
      document.getElementById("sign").value = "signin"
      document.getElementById("sign").innerText = "Sign In"
      document.getElementById("repassword").style.display = "block";
      document.getElementById("lastname").style.display = "block";
      document.getElementById("firstname").style.display = "block";
      document.getElementById("emailTr").style.display = "table-row";
      document.getElementById("forgot").style.display = "none";
   }
}

function openTileForm(tpTile) {
   if(tpTile != null){
      
      myApp.tileForm.fields = tpTile.form.fields
      myApp.tileForm.formId = tpTile.form.formId
      myApp.tileForm.validation = tpTile.form.validation
      myApp.tileForm.buildForm();
      tpTile.fillForm()
      tpTile.updateForm()
   }
   else{
      var tileText = new TipeeTileText(myApp.demoScene)

      myApp.tileForm.fields = tileText.form.fields
      myApp.tileForm.formId = tileText.form.formId
      myApp.tileForm.validation = tileText.form.validation
      myApp.tileForm.buildForm();
   }

   document.getElementById("tileForm").style.display = "flex";
   document.getElementById("backgroundScreen").classList.add("backgroundScreen");
   document.getElementById('tileForm_errorloc').style.display = "none";
}

function closeTileForm() {
   myApp.demoScene.tiles = [];
   document.getElementById("tileForm").style.display = "none";
   document.getElementById("idTile").value = "";
   document.getElementById("backgroundScreen").classList.remove("backgroundScreen");
   document.getElementById("tileForm_errorUL").innerHTML = "";
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

function updateType(elm){
   document.getElementById("type").value = elm.value;
   myApp.demoScene.tiles = [];

   var tile;
   if(elm.value == "note"){
      tile= new TipeeTileNote(myApp.demoScene)
   }
   else if(elm.value == "todo"){
      tile= new TipeeTileTodo(myApp.demoScene)
   }
   else if(elm.value == "toggles"){
      tile= new TipeeTileToggles(myApp.demoScene)
   }
   else if(elm.value == "text"){
      tile= new TipeeTileText(myApp.demoScene)
   }
   else if(elm.value == "image"){
      tile= new TipeeTileImage(myApp.demoScene)
   }
   myApp.tileForm.fields = tile.form.fields
   myApp.tileForm.formId = tile.form.formId
   myApp.tileForm.validation = tile.form.validation
   tile.idTile = "demo"
   myApp.tileForm.buildForm();
   tile.updateForm();
}

function updateTileForm() {
   var idTile = document.getElementById("idTile");
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
        tileToUpadateForm.updateForm()
   }
      else {
         //deletebtn.style.display = "none";
         myApp.demoScene.tiles[0].updateForm();

         for(var i = 0; i < document.getElementsByName("test").length; i++)
            document.getElementsByName("test")[i].disabled = false;
      }
}
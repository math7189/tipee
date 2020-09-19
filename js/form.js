function openSceneForm() {
   document.getElementById("sceneForm").style.display = "flex";
   document.getElementById("error_wrapper").classList.add("error_wrapper");
}

function closeSceneForm() {
   myApp.reloadActiveScene()
   document.getElementById("sceneForm").style.display = "none";
   document.getElementById("sceneName").value = "";
   document.getElementById("error_wrapper").classList.remove("error_wrapper");
   document.getElementById("sceneForm_errorloc").style.display = "none";
}

function openSigninSignupForm() {
   document.getElementById("signinSignupFormDiv").style.display = "block";
   document.getElementById("splashScreen").classList.add("splashScreen");
}

function closeSigninSignupForm() {
   document.getElementById("signinSignupFormDiv").style.display = "none";
   document.getElementById("splashScreen").classList.remove("splashScreen");
   document.getElementById("signinSignupForm_errorloc").innerHTML = "";
}

function createSigninSignupForm() {
   var signinSignupFormDiv = document.getElementById("signinSignupFormDiv");
   signinSignupFormDiv.innerHTML = `
   <form id='signinSignupForm' action="javascript:void(0);" class="form-container">
   <label id="sceneNameLabel" for="sceneName"><b>Login</b></label>
   <table>
      <tr>
         <td colspan="2">
            <input type="text" placeholder="Enter login" id="login" name="login"  autocomplete="username">
         </td>
         <td>&nbsp;</td>
      </tr>
      <tr id='emailTr'>
         <td colspan="2">
            <input type="text" placeholder="Email" id="email" name="email">
         </td>
         <td>&nbsp;</td>
      </tr>
      <tr id='passwordTr'>
         <td id='passwordTd'>
            <input type="password" placeholder="Enter password" id="password" name="pasword" autocomplete="current-password">
         </td>
         <td><input type="password" placeholder="Retype password" id="repassword" name="repasword" autocomplete="new-password"></td>
      </tr>
      <tr id='firstLastNameTr'>
         <td>
            <input type="text" placeholder="Firstname" id="firstname" name="firstname">
         </td>
         <td><input type="text" placeholder="Lastname" id="lastname" name="lastname"></td>
      </tr>
      <tr>
         <td id="signTd">
            <a id='signup' href="#" onclick="updateSigninSignupForm('signup');return false;">Sign Up</a>
            <a id='signin' href="#" onclick="updateSigninSignupForm('signin');return false;">Sign In</a>
         </td>
         <td id="forgot"><a>Forgot password</a></td>
      </tr>
      <tr>
         <td colspan="2">
            <div id='signinSignupForm_errorloc' class="formError2"><ul id=signinSignupForm_errorUL></ul></div>
         </td>
      </tr>
      <tr>
         <td id="btvalLogTd" colspan="2">
            <button id='btvalLog' type="submit" class="btn">Go</button>
         </td>
         <td>
            <button id='btCancelLog' type="button" class="btn cancel" onclick="closeSceneForm()">Cancel</button>
         </td>
      </tr>
   </table>
</form>`;
}

function updateSigninSignupForm(action) {
   
   if (action == "signin") {
      document.getElementById("passwordTd").colSpan = "2";
      document.getElementById("btvalLogTd").colSpan = "2";
      document.getElementById("signTd").colSpan = "1";
      document.getElementById("repassword").style.display = "none";
      document.getElementById("lastname").style.display = "none";
      document.getElementById("firstname").style.display = "none";
      document.getElementById("emailTr").style.display = "none";
      document.getElementById("signin").style.display = "none";
      document.getElementById("signup").style.display = "block";
      document.getElementById("btCancelLog").style.display = "none";
      document.getElementById("forgot").style.display = "block";
   }
   else {
      document.getElementById("passwordTd").colSpan = "1";
      document.getElementById("btvalLogTd").colSpan = "2";
      document.getElementById("signTd").colSpan = "2";
      document.getElementById("repassword").style.display = "block";
      document.getElementById("lastname").style.display = "block";
      document.getElementById("firstname").style.display = "block";
      document.getElementById("emailTr").style.display = "table-row";
      document.getElementById("signin").style.display = "block";
      document.getElementById("signup").style.display = "none";
      document.getElementById("forgot").style.display = "none";
      document.getElementById("btCancelLog").style.display = "none";
   }
}

function openTileForm(tpTile) {
   if(tpTile != null){
      
      myApp.tileForm.fields = tpTile.form.fields
      myApp.tileForm.formId = tpTile.form.formId
      myApp.tileForm.validation = tpTile.form.validation
      myApp.tileForm.buildForm();
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
   document.getElementById("error_wrapper").classList.add("error_wrapper");
   document.getElementById('tileForm_errorloc').style.display = "none";
}

function closeTileForm() {
   myApp.demoScene.tiles = [];
   document.getElementById("tileForm").style.display = "none";
   document.getElementById("idTile").value = "";
   document.getElementById("error_wrapper").classList.remove("error_wrapper");
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
   var type = document.getElementById("type");
   
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
   
  // myApp.createTileFormValidator();
}
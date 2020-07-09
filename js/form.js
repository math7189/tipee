function openSceneForm() {
   document.getElementById("sceneFormDiv").style.display = "flex";
   document.getElementById("error_wrapper").classList.add("error_wrapper");
}

function closeSceneForm() {
   document.getElementById("sceneFormDiv").style.display = "none";
   document.getElementById("sceneName").value = "";
   document.getElementById("error_wrapper").classList.remove("error_wrapper");
   document.getElementById("sceneForm_errorloc").innerHTML = "";
}

function openSigninSignupForm() {
   document.getElementById("signinSignupFormDiv").style.display = "block";
   document.getElementById("splashScreen").classList.add("splashScreen");
}

function closeSigninSignupForm() {
   document.getElementById("signinSignupFormDiv").style.display = "none";
   document.getElementById("sceneName").value = "";
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
      document.getElementById("btvalLogTd").colSpan = "1";
      document.getElementById("signTd").colSpan = "2";
      document.getElementById("repassword").style.display = "block";
      document.getElementById("lastname").style.display = "block";
      document.getElementById("firstname").style.display = "block";
      document.getElementById("emailTr").style.display = "table-row";
      document.getElementById("signin").style.display = "block";
      document.getElementById("signup").style.display = "none";
      document.getElementById("forgot").style.display = "none";
      document.getElementById("btCancelLog").style.display = "block";
   }
}

function createSceneForm() {
   var sceneFormDiv = document.getElementById("sceneFormDiv");
   sceneFormDiv.innerHTML = `
   <form id='sceneForm' action="javascript:void(0);" class="form-container">
   <table>
      <tr>
         <td colspan="2">
            <label id="sceneNameLabel" for="sceneName"><b>New Dashboard</b></label>
            <input type="text" placeholder="Enter Dashboard name" id="sceneName" name="sceneName">
         </td>
         <td>&nbsp;</td>
      </tr>
      <tr>
         <td colspan="2">
            <div id='sceneForm_errorloc' class="formError2"><ul id=sceneForm_errorUL></ul></div>
         </td>
         <td>
      <tr>
         <td id="btNewScene" style="width: 50%;">
            <button type="submit" class="btn">Add</button>
         </td>
         <td id="cancelNewSceneTd">
            <button id="cancelNewScene" type="button" class="btn cancel" onclick="closeSceneForm()">Cancel</button>
         </td>
      </tr>
   </table>
</form>`;
}

function openTileForm(tpTile) {
   document.getElementById("tileFormDiv").style.display = "flex";
   document.getElementById("error_wrapper").classList.add("error_wrapper");
   document.getElementById('tileForm_errorloc').style.display = "none";
   fillTileForm(tpTile);
   updateTileForm();
}

function closeTileForm() {
   document.getElementById("tileFormDiv").style.display = "none";
   document.getElementById("idTile").value = "";
   document.getElementById("error_wrapper").classList.remove("error_wrapper");
   //document.getElementById("tileForm_errorloc").innerHTML = "";
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

function createTileForm() {
   var tileFormDiv = document.getElementById("tileFormDiv");
   tileFormDiv.innerHTML = `<p class="formTitle">New tile</p>
   <ul id="tab_ul" class="tabs">
   <li class="selected"><a rel="tab_div1" href="#" onclick="javascript:showActiveTab(this);">Générals</a></li>
   <li class=""><a rel="tab_div2" href="#" onclick="javascript:showActiveTab(this);">Style</a></li>
   <li class=""><a rel="tab_div3" href="#" onclick="javascript:showActiveTab(this);">Avancés</a></li>
   <li class=""><a rel="tab_div4" href="#" onclick="javascript:showActiveTab(this);">Tab 4</a></li>
</ul>
<div class="tabcontents">
   <form id='tileForm' action="javascript:void(0);" class="form-container">
      <div class="tabcontent" id="tab_div1" style="display: block;">
         <table>
            <tr>
               <td colspan="2">
                  <label id="typeLabel" for="type"><b>Type</b></label>
                  <select id="type" name="type" onchange="updateTileForm()">
                     <option value="text">Texte</option>
                     <option value="image">Image</option>
                     <option value="toggles">Toggles</option>
                  </select>
               </td>
               <td>&nbsp;</td>
            </tr>
            <tr>
               <td colspan="2">
                  <input type="text" placeholder="Enter Title" id = "idTile" name="idTile" style="display:none">
                  <label for="title"><b>Title</b></label>
                  <input type="text" placeholder="Enter Title" id = "title" name="title">
               </td>
               <td>&nbsp;</td>
            </tr>
            <tr>
               <td colspan="3">
                  <label id="reqLabel" for="requestUrl"><b>Request URL</b></label>
                  <input type="text" placeholder="Enter URL" id = "requestUrl" name="requestUrl">
               </td>
            </tr>
            <tr>
               <td>
                  <label id="responseTypeLabel" for="responseType"><b>Response Type</b></label>
                  <select id="responseType" name="responseType" onchange="updateTileForm()">
                     <option value="XML">XML</option>
                     <option value="JSON">JSON</option>
                  </select>
               </td>
               <td>
                  <label id="responseFieldLabel" for"responseField"><b>Response Field</b></label>
                  <input type="text" placeholder="Enter response field" id = "responseField" name="responseField">
               </td>
               <td>
                  <label id="responseFieldChildLabel" for"responseFieldChild"><b>Response Field Chidl</b></label>
                  <input type="text" placeholder="Enter response field chidl" id = "responseFieldChild" name="responseFieldChild">
               </td>
            </tr>
            <tr>
               <td><label id="refreshLabel" for"requestRefresh"><b>Request refresh</b></label>
                  <input type="text" placeholder="Enter refresh" id = "requestRefresh" name="requestRefresh">
               </td>
               <td><label id="reqTypeLabel" for"reqType"><b>Request type</b></label>
                  <input type="text" placeholder="Enter type" id = "reqType" name="reqType">
               </td>
            </tr>
            <tr>
               <td>
                  <label id="textBeforeLabel" for="requestUrl"><b>Text before</b></label>
                  <input type="text" placeholder="Enter URL" id = "textBefore" name="textBefore">
               </td>
               <td><label id="textAfterLabel" for"textAfter"><b>Text after</b></label>
                  <input type="text" placeholder="Enter text" id = "textAfter" name="textAfter">
               </td>
               <td><label id="operationLabel" for"operation"><b>Operation</b></label>
                  <input type="text" placeholder="Enter operation" id = "operation" name="operation">
               </td>
            </tr>
            <tr>
               <td>
                  <label id="imgTypeLabel" for="imgType"><b>Type</b></label>
                  <select id="imgType" name="imgType" onchange="updateTileForm()">
                     <option value="single">Single</option>
                     <option value="slideshow">Slideshow</option>
                  </select>
               </td>
               <td><label id="imgNbLabel" for="imgNb"><b>Images Number</b></label>
                  <select id = "imgNb" name="imgNb" value="2" onchange="updateTileForm()">
               </td>
            </tr>
            <tr>
               <td><label id="imgSlideIntervalLabel" for="imgSlideInterval"><b>Interval</b></label>
                  <input type="text" placeholder="Interval en s" name="imgSlideInterval" id="imgSlideInterval" >
            </tr>
            <tr id="imgSingleSrcBlock">
               <td colspan="2">
                  <label id="imgSingleSrcLabel" for="imgSingleSrc">
                     <b>URL Image</b>
                     <input type="text" placeholder="URL image" name="imgSingleSrc" id="imgSingleSrc" > 
               </td>
            </tr>
            <tr id="imgSlideShowSrcBlock">
            <td colspan="2">
            <label id="imgSingleSrcLabel" for="imgSingleSrc"><b>URL Image</b>
            <input type="text" placeholder="URL image" name="imgSingleSrc0" id="imgSingleSrc0" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc1" id="imgSingleSrc1" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc2" id="imgSingleSrc2" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc3" id="imgSingleSrc3" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc4" id="imgSingleSrc4" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc5" id="imgSingleSrc5" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc6" id="imgSingleSrc6" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc7" id="imgSingleSrc7" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc8" id="imgSingleSrc8" > 
            <input type="text" placeholder="URL image" name="imgSingleSrc9" id="imgSingleSrc9" > 
            </td>
            </tr>
            <tr>
            <td colspan="2">
            <label id="imgRefreshLabel" for="imgRefresh"><b>Refresh every</b></label>
            <input type="text" placeholder="secondes" name="imgRefresh" id="imgRefresh" > 
            </td>
            </tr>
            <tr colspan="2">
            <td><label id="togglesNbLabel" for="togglesNb"><b>Toggles number</b></label>
            <select id = 'togglesNb' name="togglesNb" value="2" onchange="updateTileForm()">
            </td>
            </tr>
            <table id="itemsTable">
            <tr id="togglesPropTr0" > 
            <td><input type="text" placeholder="URL image" name="togglesName0" id="togglesName0" ></td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName0" id="togglesURL0" > </td> 
            </tr>
            <tr id="togglesPropTr1">
            <td><input type="text" placeholder="URL image" name="togglesName1" id="togglesName1" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName1" id="togglesURL1" > </td> 
            </tr>
            <tr id="togglesPropTr2">
            <td>
            <input type="text" placeholder="URL image" name="togglesName2" id="togglesName2" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL2" > </td> 
            </tr>
            <tr id="togglesPropTr3">
            <td>
            <input type="text" placeholder="URL image" name="togglesName3" id="togglesName3" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL3" > </td> 
            </tr>
            <tr id="togglesPropTr4">
            <td>
            <input type="text" placeholder="URL image" name="togglesName4" id="togglesName4" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL4" > </td> 
            </tr>
            <tr id="togglesPropTr5">
            <td>
            <input type="text" placeholder="URL image" name="togglesName5" id="togglesName5" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL5" > </td> 
            </tr>
            <tr id="togglesPropTr6">
            <td>
            <input type="text" placeholder="URL image" name="togglesName6" id="togglesName6" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL6" > </td> 
            </tr>
            <tr id="togglesPropTr7">
            <td>
            <input type="text" placeholder="URL image" name="togglesName7" id="togglesName7" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL7" > </td> 
            </tr>
            <tr id="togglesPropTr8">
            <td>
            <input type="text" placeholder="URL image" name="togglesName8" id="togglesName8" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL8" > </td> 
            </tr>
            <tr id="togglesPropTr9">
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesName9" > </td> 
            <td>
            <input type="text" placeholder="URL image" name="togglesName9" id="togglesURL9" > </td> 
            </tr>
            </table>
            
         </table>
      </div>
      <div class="tabcontent" id="tab_div2" style="display: none;">
         <table>
            <tr>
               <td>Header</td>
            </tr>
            <tr>
               <td><label for="headerFont"><b>Font</b></label>
                  <select id = 'headerFont' onChange = "return applyFontInput('headerFont');" name="headerFont">
               </td>
               <td><label for="headerFontSize"><b>Font size</b></label>
                  <select id = 'headerFontSize' name="headerFontSize" value="20">
               </td>
               <td><label for="color"><b>Font Color</b></label>
                  <input readonly type="text" placeholder="Pick a color" name="headerFontColor" id ="headerFontColor" 
                     class="jscolor" value="FFFFFF">
               </td>
            </tr>
            <tr>
               <td><label for="color"><b>Background Color</b></label>
                  <input readonly type="text" placeholder="Pick a color" name="headerColor" id ="headerColor" 
                     class="jscolor" value='2196F3'>
               </td>
            </tr>
            <tr>
               <td>Tile</td>
            </tr>
            <tr>
               <td><label for="color"><b>Background Color</b></label>
                  <input readonly type="text" placeholder="Enter color" name="contentcolor" id ="contentBackgroundColor" 
                     class="jscolor" value="FFFFFF">
               </td>
            </tr>
            <tr>
               <td><label for="borderSize"><b>Border size</b></label>
                  <select id = 'borderSize' name="borderSize" value="3">
               </td>
               <td><label for="color"><b>Border Color</b></label>
                  <input readonly type="text" placeholder="Enter color" name="borderColor" id ="borderColor" class="jscolor" value="2196F3">
               </td>
            </tr>
            <tr>
               <td id="textStyleLabel">Text</td>
            </tr>
            <tr>
               <td><label id="textFontLabel" for="textFont"><b>Font</b></label>
                  <select id = 'textFont' onChange = "return applyFontInput('textFont');" name="textFont">
               </td>
               <td><label id="textFontSizeLabel" for="textFontSize"><b>Font size</b></label>
                  <select id = 'textFontSize' name="textFontSize" value="20">
               </td>
               <td><label id="textColorLabel" for="textColor"><b>Font Color</b></label>
                  <input readonly type="text" placeholder="Pick a color" name="textColor" id ="textColor" class="jscolor" value="FFFFFF">
               </td>
            </tr>
         </table>
      </div>
      <div class="tabcontent" id="tab_div3" style="display: none;">
         <table>
         </table>
      </div>
      <div class="tabcontent" id="tab_div4" style="display: none;">
         <table>
            <tr>
               <td><label for="width"><b>Width (px)</b></label>
                  <input type="text" placeholder="Enter width" id = "width" name="width" value="250">
               </td>
               <td><label for="height"><b>Height (px)</b></label>
                  <input type="text" placeholder="Enter height" id = "height" name="height" value="250">
               </td>
            </tr>
         </table>
      </div>
      <div id='tileForm_errorloc' class="formError"><ul id=tileForm_errorUL></ul></div>
      <table style="
      bottom: 0;
      position: absolute;
  ">
         <tr>
            <td>
               <button type="submit" class="btn">OK</button>
            </td>
            <td>
               <button id="deleteElem" type="button" class="btn cancel" onclick="deleteElement(idTile.value)" style="display:none;">Delete</button>
            </td>
            <td>
               <button type="button" class="btn cancel" onclick="closeTileForm()">Cancel</button>
            </td>
         </tr>
      </table>
   </form>
</div>`;
}

function createTileFormInputs() {
   initSelectFontInput("headerFont");
   initSelectFontInput("textFont");
   initSelectNumberInput('borderSize', 0, 10, 3);
   initSelectNumberInput('headerFontSize', 11, 72, 20);
   initSelectNumberInput('textFontSize', 11, 72, 20);
   initSelectNumberInput('imgNb', 2, 10, 2);
   initSelectNumberInput('togglesNb', 1, 10, 1);
}

function updateTileForm() {
   var idTile = document.getElementById("idTile");
   var deletebtn = document.getElementById("deleteElem");
   var type = document.getElementById("type");
   var typeLabel = document.getElementById("typeLabel");
   var textStyleLabel = document.getElementById("textStyleLabel");
   var textFontLabel = document.getElementById("textFontLabel");
   var textFont = document.getElementById("textFont");
   var textFontSize = document.getElementById("textFontSize");
   var textFontSizeLabel = document.getElementById("textFontSizeLabel");
   var textColor = document.getElementById("textColor");
   var textColorLabel = document.getElementById("textColorLabel");
   var reqLabel = document.getElementById("reqLabel");
   var requestUrl = document.getElementById("requestUrl");
   var responseType = document.getElementById("responseType");
   var responseTypeLabel = document.getElementById("responseTypeLabel");
   var responseField = document.getElementById("responseField");
   var responseFieldLabel = document.getElementById("responseFieldLabel");
   var responseFieldChild = document.getElementById("responseFieldChild");
   var responseFieldChildLabel = document.getElementById("responseFieldChildLabel");
   var textBefore = document.getElementById("textBefore");
   var textBeforeLabel = document.getElementById("textBeforeLabel");
   var textAfter = document.getElementById("textAfter");
   var textAfterLabel = document.getElementById("textAfterLabel");
   var requestRefresh = document.getElementById("requestRefresh");
   var reqTypeLabel = document.getElementById("reqTypeLabel");
   var reqType = document.getElementById("reqType");
   var refreshLabel = document.getElementById("refreshLabel");
   var operation = document.getElementById("operation");
   var operationLabel = document.getElementById("operationLabel");

   var imgType = document.getElementById("imgType");
   var imgTypeLabel = document.getElementById("imgTypeLabel");
   var imgNb = document.getElementById("imgNb");
   var imgNbLabel = document.getElementById("imgNbLabel");
   var imgSingleSrcBlock = document.getElementById("imgSingleSrcBlock");
   var imgSlideshowSrcBlock = document.getElementById("imgSlideShowSrcBlock");
   var imgSlideIntervalLabel = document.getElementById("imgSlideIntervalLabel");
   var imgSlideInterval = document.getElementById("imgSlideInterval");
   var imgSingleSrcLabel = document.getElementById("imgSingleSrcLabel");
   var imgSingleSrc = document.getElementById("imgSingleSrc");
   var imgRefresh = document.getElementById("imgRefresh");
   var imgRefreshLabel = document.getElementById("imgRefreshLabel");
   var togglesNbLabel = document.getElementById("togglesNbLabel");
   var togglesNb = document.getElementById("togglesNb");

   reqLabel.style.display = "none";
   requestUrl.style.display = "none";
   responseTypeLabel.style.display = "none";
   responseType.style.display = "none";
   textStyleLabel.style.display = "none";
   textFontLabel.style.display = "none";
   textFont.style.display = "none";
   textFontSize.style.display = "none";
   textColorLabel.style.display = "none";
   textFontSizeLabel.style.display = "none";
   textColor.style.display = "none";
   responseField.style.display = "none";
   responseFieldLabel.style.display = "none";
   textBefore.style.display = "none";
   textBeforeLabel.style.display = "none";
   textAfter.style.display = "none";
   textAfterLabel.style.display = "none";
   requestRefresh.style.display = "none";
   reqTypeLabel.style.display = "none";
   reqType.style.display = "none";
   refreshLabel.style.display = "none";
   operation.style.display = "none";
   operationLabel.style.display = "none";
   responseFieldChildLabel.style.display = "none";
   responseFieldChild.style.display = "none";

   imgType.style.display = "none";
   imgTypeLabel.style.display = "none";
   imgNb.style.display = "none";
   imgNbLabel.style.display = "none";
   imgSlideIntervalLabel.style.display = "none";
   imgSlideInterval.style.display = "none";
   imgSingleSrcLabel.style.display = "none";
   imgSingleSrc.style.display = "none";
   imgSingleSrcBlock.style.display = "none";
   imgSlideshowSrcBlock.style.display = "none";
   for (var i = 0; i < 10; i++) {
      var elem = document.getElementById("imgSingleSrc" + i);
      elem.style.display = "none";
   }
   imgRefresh.style.display = "none";
   imgRefreshLabel.style.display = "none";
   togglesNbLabel.style.display = "none";
   togglesNb.style.display = "none";
   for (var i = 0; i < 10; i++) {
      var elem = document.getElementById("togglesPropTr" + i);
      elem.style.display = "none";
   }

   if (idTile.value != '') {
      deletebtn.style.display = "block";
      type.style.display = "none";
      typeLabel.style.display = "none";
   }
   else {
      type.style.display = "block";
      typeLabel.style.display = "block";
      deletebtn.style.display = "none";
   }

   if (type.value == "text") {
      reqLabel.style.display = "block";
      requestUrl.style.display = "block";
      responseField.style.display = "block";
      responseTypeLabel.style.display = "block";
      responseType.style.display = "block";
      responseFieldLabel.style.display = "block";
      textBefore.style.display = "block";
      textBeforeLabel.style.display = "block";
      textAfter.style.display = "block";
      textAfterLabel.style.display = "block";
      requestRefresh.style.display = "block";
      refreshLabel.style.display = "block";
      operation.style.display = "block";
      operationLabel.style.display = "block";
      textStyleLabel.style.display = "block";
      textFontLabel.style.display = "block";
      textFont.style.display = "block";
      textFontSize.style.display = "block";
      textColorLabel.style.display = "block";
      textFontSizeLabel.style.display = "block";
      textColor.style.display = "block";
      reqTypeLabel.style.display = "block";
      reqType.style.display = "block";

      if (responseType.value == "XML") {
         responseFieldChildLabel.style.display = "block";
         responseFieldChild.style.display = "block";
      }
   }
   else if (type.value == "image") {

      imgType.style.display = "block";
      imgTypeLabel.style.display = "block";
      imgRefresh.style.display = "block";
      imgRefreshLabel.style.display = "block";

      if (imgType.value == "single") {
         imgSingleSrcLabel.style.display = "block";
         imgSingleSrc.style.display = "block";
         imgSingleSrcBlock.style.display = "block";
         imgSlideshowSrcBlock.style.display = "none";
      }
      else if (imgType.value == "slideshow") {
         imgNb.style.display = "block";
         imgNbLabel.style.display = "block";
         imgSlideIntervalLabel.style.display = "block";
         imgSlideInterval.style.display = "block";
         imgSlideshowSrcBlock.style.display = "block";

         var nbImg = imgNb.value;

         for (var i = 0; i < nbImg; i++) {
            var elem = document.getElementById("imgSingleSrc" + i);
            elem.style.display = "block";
         }
      }
   }
   else if (type.value == "toggles") {
      togglesNbLabel.style.display = "block";
      togglesNb.style.display = "block";
      textStyleLabel.style.display = "block";
      textFontLabel.style.display = "block";
      textFont.style.display = "block";
      textFontSize.style.display = "block";
      textColorLabel.style.display = "block";
      textFontSizeLabel.style.display = "block";
      textColor.style.display = "block";

      var nb = togglesNb.value;
      for (var i = 0; i < nb; i++) {
         var elem = document.getElementById("togglesPropTr" + i);
         elem.style.display = "block";
      }
   }

   //myApp.formTileValidator.clearAllValidations();
   myApp.createTileFormValidator();
}
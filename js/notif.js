const __notifTemplate = `
<div id="notifContainer-notifId" class="notifContainer">
  <div id="notifId" class="notif">
    <div id="notifLeft" class="notifLeft">
        <div id="notifHeader-notifId" class="notifHeader">
            <p>New Notification</p>
        </div>
        <div id="notifBody-notifId" class="notifBody">
            test
        </div>
    </div>
    <div id="notifBtOK-notifId" class="notifBtOK">
        <p id="notifBtOKTxt-notifId">OK</p>
    </div>
  </div>
</div>
`.replace(/<!--(?!>)[\S\s]*?-->/g, "");

const __notifTemplate2 = `
<div id="notifCenterContainer-notifId" class="notifCenterContainer">
  <div id="notifCenter-notifId" class="notifCenter">
    <div id="notifCenterLeft" class="notifCenterLeft">
        <div id="notifCenterHeader-notifId" class="notifCenterHeader">
            <p>New Notification</p>
            <div id="notifCenterBt-notifId" class="numberCircle">x</div>
        </div>
        <div id="notifCenterBody-notifId" class="notifCenterBody">
            test
        </div>
    </div>
     
  </div>
</div>
`.replace(/<!--(?!>)[\S\s]*?-->/g, "");
const __notifications = [];

class NotificationCenter {

  constructor(options) {
    this.__isShown = false;
    this.__centerDateElemnt = null;
    this.__defaultOptions = {
      offsetTop : 120
    }
    this.__options = { ...this.__defaultOptions, ...options};
  }

  static __generateNotifTemplate(id) {
    let template = __notifTemplate2;
    template = template.replace(/notifId/g, "notif_" + id);
    return template;
  }

  createCenter() {

    const mydiv = document.createElement('Div');
    mydiv.setAttribute('id', 'notifCenter')
    mydiv.setAttribute('class', 'center')
    mydiv.style.paddingTop = this.__options.offsetTop + 'px';
    document.body.appendChild(mydiv)

    var notifCenterDateDiv = document.createElement('Div');
    notifCenterDateDiv.setAttribute('id', 'notifCenterDate')
    notifCenterDateDiv.setAttribute('class', 'notifCenterDate')
    this.__centerDateElemnt = notifCenterDateDiv;
    mydiv.appendChild(notifCenterDateDiv);

    const notifCenterNotifs = document.createElement('Div')
    notifCenterNotifs.setAttribute('id', 'notifCenterNotifs');
    notifCenterNotifs.setAttribute('class', 'notifCenterNotifs');

    mydiv.appendChild(notifCenterNotifs)

    var centerbt = document.getElementById("centerOpenIcon");
    var that = this;

    centerbt.addEventListener("click", function () {
      var center = document.getElementById('notifCenter');
      that.updateCenterDate();
      if (that.__isShown) {
        center.style.right = '-800px'
        that.__isShown = false;
      }
      else {
        center.style.right = '0px'
        that.__isShown = true;
        that.populate();
      }
    });

    window.addEventListener('click', function (e) {
      var center = document.getElementById('notifCenter');
      e.stopPropagation();
      if (!e.target.id.startsWith('notifCenter') && e.target.id != 'centerOpenIcon') {
        
        center.style.right = '-800px'
        that.__isShown = false;
      }
    });
  }

  updateCenterDate(){
    this.__centerDateElemnt.innerText = '10 Oct 2020'
  }

  populate() {
    const center = document.getElementById("notifCenterNotifs");
    center.innerHTML = '';
    for (var i = 0; i < __notifications.length; i += 1) {
      const newNotif = this.constructor.__generateNotifTemplate(__notifications[i].__id);
      center.insertAdjacentHTML("beforeend", newNotif);

      const notifCenterBt = document.getElementById('notifCenterBt-notif_' + __notifications[i].__id);
      const that = __notifications[i];
      notifCenterBt.addEventListener('click', function () {
        that.dissmissAndReadCenter()
      })
    }
  }
}

class Notification {
  constructor(options) {
    this.__id = -1;
    this.__isRead = false;
    this.__hasDisplayed = false;
    this.__hasDismissed = false;

    this.__defaultOptions = {
      title: "New Notification",
      subTitle: "You have a new notification",
      sounds: false,
      dismissDelay: 5,
      autoDismiss: true
    };

    this.__options = { ...this.__defaultOptions, ...options };
  }

  static __nextId() {
    if (__notifications == null || __notifications.length === 0) return 0;
    else {
      let max = 0;
      for (let i = 0; i < __notifications.length; i += 1)
        if (__notifications[i].__id > max) max = __notifications[i].__id;
      return max + 1;
    }
  }

  static __generateNotifTemplate() {
    let template = __notifTemplate;
    const id = this.__nextId();

    template = template.replace(/notifId/g, "notif_" + id);
    return { template, id };
  }

  static __updatePosAll() {
    let i = 0;
    for (i; i < __notifications.length; i += 1)
      if (!__notifications[i].__hasDisplayed)
        __notifications[i].__updatePos();
  }

  dissmissAndRead() {
    this.__isRead = true;
    this.__hasDismissed = true;

    const id = "notif_" + this.__id;
    const notifElem = document.getElementById(id);
    notifElem.style.opacity = "0.1";
    notifElem.style.right = -notifElem.offsetWidth + "px";

    setTimeout(() => {
      notifElem.parentElement.parentElement.removeChild(
        notifElem.parentElement
      );
    }, 800);

    for (let i = 0; i < __notifications.length; i += 1)
      if (__notifications[i].__id == this.__id) __notifications.splice(i, 1);
  }

  dissmissAndReadCenter() {
    this.__isRead = true;
    this.__hasDisplayed = true;

    const id = "notifCenter-notif_" + this.__id;
    const notifCenterElem = document.getElementById(id);
    notifCenterElem.style.opacity = "0";

    setTimeout(() => {
      notifCenterElem.parentElement.parentElement.removeChild(
        notifCenterElem.parentElement
      );
    }, 1000);

    for (let i = 0; i < __notifications.length; i += 1)
      if (__notifications[i].__id == this.__id) __notifications.splice(i, 1);
  }

  dissmiss() {
    const id = "notif_" + this.__id;
    const notifElem = document.getElementById(id);
    notifElem.style.opacity = "0.1";
    notifElem.style.right = -notifElem.offsetWidth + "px";

    this.__hasDisplayed = true;
    this.__hasDismissed = true;

    setTimeout(() => {
      notifElem.parentElement.parentElement.removeChild(
        notifElem.parentElement
      );
    }, 800);
  }

  __updatePos() {
    const id = this.__id;
    let elemAbove = 0;
    let i = 0;

    for (i; i < __notifications.length; i += 1)
      if (!__notifications[i].__isRead && __notifications[i].__id > id)
        elemAbove += 1;

    let notifElem = document.getElementById("notifContainer-notif_" + id);
    let newPos = notifElem.offsetHeight * elemAbove;
    notifElem.style.top = newPos + "px";
  }

  __showNotif() {
    setTimeout(() => {
      const that = this;
      const templateData = this.constructor.__generateNotifTemplate();
      this.__id = templateData.id;
      __notifications.unshift(this);

      document.body.insertAdjacentHTML("beforeend", templateData.template);

      this.title = this.__options.title;
      this.subTitle = this.__options.subTitle;

      const id = "notif_" + this.__id;
      const notifElem = document.getElementById(id);
      const titleElem = document.getElementById("notifHeader-" + id);
      titleElem.innerText = this.title;

      const subTitleElem = document.getElementById("notifBody-" + id);
      subTitleElem.innerText = this.subTitle;

      const dissmissButton = document.getElementById("notifBtOK-" + id);
      dissmissButton.onclick = function (e) {
        e.stopPropagation();
        console.log(e.target.id);
        for (let i = 0; i < __notifications.length; i += 1) {
          if (e.target.id.split("_")[1] == __notifications[i].__id) {
            __notifications[i].dissmissAndRead();
          }
        }
        that.constructor.__updatePosAll();
      };

      this.constructor.__updatePosAll();
      notifElem.style.opacity = "1";
      notifElem.style.right = "15px";

      if (this.__options.autoDismiss && !this.__hasDismissed) {
        setTimeout(() => {
          this.dissmiss();
        }, this.__options.dismissDelay * 1000)
      }
    }, 1000);
  }
}

window.onload = function () {
  window.notificationCenter = (options) => {
    const nCenter = new NotificationCenter(options);
    nCenter.createCenter();
  }

  window.notif = (options) => {
    const newNotif = new Notification(options);
    newNotif.__showNotif();
    return newNotif;
  };
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
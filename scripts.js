"use strict";

var unityContainer = document.getElementById('unity-container');
function playBtn() {
  changeCurrent('');
  unityContainer.classList.remove('hiddingClass');
  unityContainer.classList.add('dontHideAgain');
  unityContainer.classList.remove('hiddingUnity');
  myGameInstance.SendMessage('Main Camera', 'RestartGame');
}
function playAgainBtn() {
  changeCurrent('');
  unityContainer.classList.remove('hiddingUnity');
  myGameInstance.SendMessage('Main Camera', 'RestartGame');
}
var tableBody = document.getElementById('tableBody');
var grayedOut = document.querySelectorAll('.grayedOut');

//This is call from Unity
function openLeaderboard() {
  grayedOut.forEach(function (element) {
    element.classList.remove('grayedOut');
  });
  changeCurrent('Leaderboard');
  populateTable();
}
function populateTable() {
  fetch('https://bovadacontests.com/api/game/leaderboard/gusadventure3/50').then(function (resp) {
    return resp.json();
  }).then(function (data) {
    tableBody.innerHTML = '';
    data.map(function (element, index) {
      tableBody.innerHTML += "\n                <tr>\n                    <td>".concat(index + 1, "</td>\n                    <td>").concat(element.display_name, "</td>\n                    <td>").concat(element.points, "</td>\n                </tr>");
    });
  });
}
var sections = document.querySelectorAll('section');
function changeCurrent(targetSection) {
  sections.forEach(function (s) {
    return s.classList.remove('currentSection');
  });
  if (targetSection) document.querySelector('#section' + targetSection).classList.add('currentSection');
}
var nInput = document.getElementById('nameInput');
var dInput = document.getElementById('displayInput');
var eInput = document.getElementById('emailInput');
var submitBtn = document.getElementById('submit-button');

// FACEBOOK
window.fbAsyncInit = function () {
  FB.init({
    appId: 932245221122507,
    cookie: true,
    xfbml: true,
    oauth: true,
    version: 'v15.0'
  });
  fb_status();
};
function fb_login() {
  FB.getLoginStatus(function (response) {
    if (response.status === 'connected') {
      facebookLoginHandler(response);
    } else {
      FB.login(function (response) {
        facebookLoginHandler(response);
      });
    }
  });
}
function fb_status() {
  FB.getLoginStatus(function (response) {
    facebookLoginHandler(response);
  });
}
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');
function facebookLoginHandler(response) {
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', {
      fields: 'email,name'
    }, function (response) {
      fillFields(response.name, response.name, response.email);
    });
  } else {
    // The person is not logged into your app or we are unable to tell.
    console.log('Not logged in!');
  }
}

// GOOGLE
function googleLoginHandler(response) {
  console.log('Logged in with google!');
  var tokens = response.credential.split('.');
  var data = JSON.parse(atob(tokens[1]));
  fillFields(data.name, data.given_name, data.email);
}

// Fill the fields
function fillFields(name, display, email) {
  nInput.value = name;
  dInput.value = display;
  eInput.value = email;
  nInput.classList.remove('invalidField');
  dInput.classList.remove('invalidField');
  eInput.classList.remove('invalidField');
}
nInput.onkeydown = function () {
  return nInput.classList.remove('invalidField');
};
dInput.onkeydown = function () {
  return dInput.classList.remove('invalidField');
};
eInput.onkeydown = function () {
  return eInput.classList.remove('invalidField');
};
submitBtn.onclick = function () {
  return submitScore();
};
function submitScore() {
  console.log('Submitting Score');
  if (nInput.value === '' || nInput.value.includes(',')) {
    alert('Name empty or invalid');
    nInput.classList.add('invalidField');
    return;
  }
  if (dInput.value === '' || dInput.value.includes(',')) {
    alert('Display name empty or invalid');
    dInput.classList.add('invalidField');
    return;
  }
  if (eInput.value === '' || !validateEmail(eInput.value) || eInput.value.includes(',')) {
    alert('Email empty or invalid');
    eInput.classList.add('invalidField');
    return;
  }
  var userData = "".concat(nInput.value, ",").concat(dInput.value, ",").concat(eInput.value);
  console.log('Sending data:', userData);
  myGameInstance.SendMessage('Main Camera', 'PostScore', userData);
}
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
var container = document.querySelector('#unity-container');
var canvas = document.querySelector('#unity-canvas');
var loadingBar = document.querySelector('#unity-loading-bar');
var progressBarFull = document.querySelector('#unity-progress-bar-full');
// var fullscreenButton = document.querySelector('#unity-fullscreen-button');
var warningBanner = document.querySelector('#unity-warning');

// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
function unityShowBanner(msg, type) {
  function updateBannerVisibility() {
    warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
  }
  var div = document.createElement('div');
  div.innerHTML = msg;
  warningBanner.appendChild(div);
  if (type == 'error') div.style = 'background: red; padding: 10px;';else {
    if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
    setTimeout(function () {
      warningBanner.removeChild(div);
      updateBannerVisibility();
    }, 5000);
  }
  updateBannerVisibility();
}
var buildUrl = 'gusadventure6/build/Build/';
var buildName = '1.0.1';
var loaderUrl = buildUrl + buildName + '.loader.js';
var config = {
  dataUrl: buildUrl + buildName + '.data',
  frameworkUrl: buildUrl + buildName + '.framework.js',
  codeUrl: buildUrl + buildName + '.wasm',
  streamingAssetsUrl: 'StreamingAssets',
  companyName: 'DefaultCompany',
  productName: 'SlotsRunner',
  productVersion: '1.0',
  showBanner: unityShowBanner
};
console.log(config);

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  // Mobile device style: fill the whole browser client area with the game canvas:

  var meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
  document.getElementsByTagName('head')[0].appendChild(meta);
  container.className = 'unity-mobile';
  canvas.className = 'unity-mobile';

  // To lower canvas resolution on mobile devices to gain some
  // performance, uncomment the following line:
  // config.devicePixelRatio = 1;
} else {
  // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

  canvas.style.width = '960px';
  canvas.style.height = '600px';
}
loadingBar.style.display = 'block';
var script = document.createElement('script');
var myGameInstance;
script.src = loaderUrl;
script.onload = function () {
  createUnityInstance(canvas, config, function (progress) {
    progressBarFull.style.width = 100 * progress + '%';
  }).then(function (unityInstance) {
    myGameInstance = unityInstance;
    loadingBar.style.display = 'none';
    // fullscreenButton.onclick = () => {
    //     unityInstance.SetFullscreen(1);
    // };
  })["catch"](function (message) {
    alert(message);
  });
};
document.body.appendChild(script);

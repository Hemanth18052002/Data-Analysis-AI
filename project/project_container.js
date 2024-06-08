function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
function check(){
    var username = getUrlParameter('username');
    var nameElement = document.getElementById('name1');
    nameElement.innerText = "Hi " + username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
}

document.getElementById('add_button').addEventListener('click', function(){
    var tempdiv = document.querySelector('.templ1');
    var newDiv = tempdiv.cloneNode(true);
    newDiv.style.display = 'block';
    document.getElementById('project_container').appendChild(newDiv);
});
var enter_button = document.getElementById('enter_button');
enter_button.addEventListener('click', function(){
    window.location.href = 'http://127.0.0.1:5003/';
});

const close = document.querySelector('.cookie_close');
const cookiepop = document.querySelector('.cookie_pop_up');
close.addEventListener("click", closefun);
function closefun()
{
    cookiepop.style.display = 'none';
}

if(document.cookie.length>=1){
    cookiepop.style.display = 'none';
}
const cookiebutton = document.querySelector('.cookie_button');
cookiebutton.addEventListener('click', acceptCookies);
function setCookie(name, value, days) {
    var now = new Date();
    var expirationTime = new Date(now.getTime() + (days*60* 1000));
    document.cookie = name + "=" + value + "; expires=" + expirationTime.toUTCString() + "; path=/; SameSite=None; Secure";
    cookiepop.style.display = 'none';
}
function acceptCookies() {
    var username = document.querySelector('.username').innerHTML;
    setCookie(username, 'true', 1);
    username = username.slice(3);
    console.log(username);
}

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


// const addButton = document.getElementById("add_project_button");
// const project_container = document.getElementById("add_cont")
// document.getElementById("add_project_button").addEventListener("click", newdivfun);

// function newdivfun()
// {
//     const newdiv = document.createElement("div");
//     console.log("added");
//     newdiv.classList.add('template');
//     project_container.appendChild(newdiv);

//     const renameDiv = document.createElement("div");
//     renameDiv.classList.add('rename');
//     renameDiv.innerText = "Project";
//     newdiv.appendChild(renameDiv);

//     renameDiv.addEventListener('dblclick', function () {
//         var newName = prompt('Enter a new name:');
//         if (newName !== null) {
//             renameDiv.innerText = newName;
//         }
//     });

//     renameDiv.addEventListener('click',function(){
//         setTimeout(function() {
//             window.location.href = 'analysis.html';
//         }, 1000);
//     });
// }
    // window.location.href = 'analysis.html';
document.getElementById('add_button').addEventListener('click', function(){
    var tempdiv = document.querySelector('.templ1');
    var newDiv = tempdiv.cloneNode(true);
    newDiv.style.display = 'block';
    document.getElementById('project_container').appendChild(newDiv);
});
var enter_button = document.getElementById('enter_button');
enter_button.addEventListener('click', function(){
    console.log("posa");
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
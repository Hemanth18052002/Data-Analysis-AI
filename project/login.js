var forlogin = document.querySelector(".loginlink");
var forsignup = document.querySelector(".signuplink");
var forgotlink = document.querySelector('.forgotlink');
var floginlink = document.querySelector('.floginlink');
var fsignuplink = document.querySelector('.fsignuplink');

var loginclass = document.querySelector('.login');
var signupclass = document.querySelector('.signup');
var forgotclass = document.querySelector('.forgot');

forlogin.addEventListener('click',()=>{
    signupclass.style.visibility = 'hidden';
    forgotclass.style.visibility = 'hidden';
    loginclass.style.visibility = 'visible';
})

forsignup.addEventListener('click',()=>{
    loginclass.style.visibility = 'hidden';
    forgotclass.style.visibility = 'hidden';
    signupclass.style.visibility = 'visible';
})

forgotlink.addEventListener('click', ()=>{
    loginclass.style.visibility = 'hidden';
    forgotclass.style.visibility = 'visible';
    signupclass.style.visibility = 'hidden';
})

floginlink.addEventListener('click',()=>{
    signupclass.style.visibility = 'hidden';
    forgotclass.style.visibility = 'hidden';
    loginclass.style.visibility = 'visible';
})
fsignuplink.addEventListener('click',()=>{
    loginclass.style.visibility = 'hidden';
    forgotclass.style.visibility = 'hidden';
    signupclass.style.visibility = 'visible';
})
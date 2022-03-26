var userName = document.querySelector("#user-name");
var userEmail = document.querySelector("#user-email");
var password = document.querySelector("#password");
var passwordControl = document.querySelector("#password-control");
var inputSubmitBtn = document.querySelector(".input-submit");
var loginBtn = document.querySelector(".login");

loginBtn.addEventListener("click", function () {
    location.replace("http://localhost:8080/todo/auth.do");
})

inputSubmitBtn.addEventListener("click", function() {
    if (validate(event)) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/todo/reg.do',
            data: {
                name: userName.value,
                email: userEmail.value,
                password: password.value
            },
            dataType: 'json',
            async: false
        }).done(function(msg) {
            if (msg == true) {
                alert("You successfully signed in. Now you will be redirected to authorization page");
                window.location.href = "http://localhost:8080/todo/auth.do";
            } else {
                alert("User with this email was already signed in. Please try with another email or log in");
            }

        }).fail(function (err) {
            console.log(err)
        });
    }
})

function validate(event) {
    if (userName.value === ''
        || userEmail.value === ''
        || password.value === ''
        || passwordControl.value === '') {
        alert(userName.getAttribute('title'));
        event.preventDefault();
        return false;
    }
    if (password.value != passwordControl.value) {
        alert(password.getAttribute('title'));
        event.preventDefault();
        password.value = "";
        passwordControl.value = "";
        return false;
    }
    return true;
}




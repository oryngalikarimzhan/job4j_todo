var userEmail = document.querySelector("#user-email");
var password = document.querySelector("#password");
var inputSubmitBtn = document.querySelector(".input-submit");
var signInBtn = document.querySelector(".sign-in");

signInBtn.addEventListener("click", function () {
    location.replace("http://localhost:8080/todo/reg.do");
})

inputSubmitBtn.addEventListener("click", function (event) {
    if (validate(event)) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/todo/auth.do',
            data: {
                email: userEmail.value,
                password: password.value
            },
            dataType: 'json',
            async: false
        }).done(function(msg) {
            if (msg == true) {
                window.location.href = "http://localhost:8080/todo/";
            } else {
                alert("Please try again or sign in with existing account");
            }
        }).fail(function (err) {
            console.log(err)
        });
    }
})

function validate(event) {
    if (userEmail.value === ''
        || password.value === '') {
        alert(password.title);
        event.preventDefault();
        return false;
    }
    return true;
}
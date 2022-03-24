const description = document.getElementById("todo-input");
const addButton = document.getElementById("todo-input-btn");

document.querySelector(".items-statuses").addEventListener("click", function (e) {
    const id = e.target.id;
    if (id) {
        document.querySelector(".on").classList.remove("on");
        document.getElementById(id).classList.add("on");
    }

    var checkMarks = document.querySelectorAll(".todo-item .check .check-mark");
    var checkMarksChecked = document.querySelectorAll(".todo-item .check .check-mark-checked");

    if (id === "all") {
        checkMarks.forEach((checkMark) => {
            console.log("all1")
            checkMark.parentElement.parentElement.style.display = "flex"
        });
        checkMarksChecked.forEach((checkMark) => {
            console.log("all2")
            checkMark.parentElement.parentElement.style.display = "flex"
        });
    } else if (id === "active") {
        checkMarks.forEach((checkMark) => {
            console.log("active1")
            checkMark.parentElement.parentElement.style.display = "flex"
        });
        checkMarksChecked.forEach((checkMark) => {
            console.log("active2")
            checkMark.parentElement.parentElement.style.display = "none"
        });
    } else if (id === "completed") {
        checkMarks.forEach((checkMark) => {
            console.log("completed1")
            checkMark.parentElement.parentElement.style.display = "none"
        });
        checkMarksChecked.forEach((checkMark) => {
            console.log("completed2")
            checkMark.parentElement.parentElement.style.display = "flex"
        });
    }
});

addButton.addEventListener("click", function () {
    validate(event);
});
description.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        validate(event);
        e.preventDefault();
    }
});

$(document).ready(function () {
    document.getElementById("all").classList.add("on");
    showItems();
    createEventListeners();
});

function showItems() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/todo/todo.do',
        dataType: 'json',
        async: false
    }).done(function (data) {
        for (var i = 0; i < data.length; i++) {
            generate(data[i]);
        }
    }).fail(function (err) {
        console.log(err);
    });
}

function validate(event) {
    if (description.value === "") {
        alert(description.title);
        event.preventDefault()
    } else {
        addItem();
    }
}

function addItem() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/todo/todo.do',
        data: {
            description: description.value
        },
        dataType: 'json',
        async: false
    }).done(function(item) {
        generate(item);
        document.location.reload();
    }).fail(function (err) {
        alert(err)
    });
    description.value = "";
}

function generate(item) {
    const todoItem = document.createElement("div");
    const check = document.createElement("div");
    const checkMark = document.createElement("div");
    const img = document.createElement("img");
    const todoText = document.createElement("div");
    const del = document.createElement("div");
    const delItem = document.createElement("div");
    const delImg = document.createElement("img");

    todoItem.classList.add("todo-item");
    check.classList.add("check");

    if (item.done == true) {
        checkMark.classList.add("check-mark-checked");
    } else if (item.done == false){
        checkMark.classList.add("check-mark");
    }

    todoText.classList.add("todo-text");
    del.classList.add("delete");
    delItem.classList.add("delete-item");

    delItem.setAttribute("item-id", item.id);
    delImg.setAttribute("src", "images/icon-cross.svg");

    img.setAttribute("src", "images/icon-check.svg");
    checkMark.setAttribute("item-id", item.id);

    todoText.innerHTML = item.description;
    checkMark.appendChild(img);
    delItem.appendChild(delImg);
    del.appendChild(delItem);
    check.appendChild(checkMark);
    todoItem.appendChild(check);
    todoItem.appendChild(todoText);
    todoItem.appendChild(del);

    document.querySelector('.todo-items').appendChild(todoItem);
}

function createEventListeners() {
    var checkMarks = document.querySelectorAll(".todo-item .check .check-mark");
    var checkMarksChecked = document.querySelectorAll(".todo-item .check .check-mark-checked");
    var deleteButtons = document.querySelectorAll(".todo-item .delete .delete-item");
    checkMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", function() {
            markCompleted(checkMark);
        })
    })
    checkMarksChecked.forEach((checkMark) => {
        checkMark.addEventListener("click", function() {
            markCompleted(checkMark);
        })
    })
    deleteButtons.forEach((delItem) => {
        delItem.addEventListener("click", function() {
            deleteItem(delItem);
        })
    })
}

function markCompleted(item) {
    console.log("mark completed");
    var rsl;
    if (item.className === "check-mark") {
        item.classList.remove("check-mark");
        item.classList.add("check-mark-checked");
        rsl = true;
    } else if (item.className === "check-mark-checked") {
        item.classList.remove("check-mark-checked");
        item.classList.add("check-mark");
        rsl = false;
    }
    var itemId = item.getAttribute("item-id");
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/todo/mark.do',
        data: {
            id: itemId,
            done: rsl
        },
        async: false
    }).done(function(data) {
        console.log(data);
    }).fail(function (err) {
        alert(err)
    });
}

function deleteItem(item) {
    var itemId = item.getAttribute("item-id");
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/todo/delete.do',
        data: {
            id: itemId
        },
        async: false
    }).done(function(data) {
        console.log(data);
        item.parentElement.parentElement.remove();
    }).fail(function (err) {
        alert(err)
    });
}






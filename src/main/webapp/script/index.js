const description = document.getElementById("todo-input");
const addButton = document.getElementById("todo-input-btn");

document.querySelector(".select-field").addEventListener("click", () => {
    document.querySelector(".list").classList.toggle("show");
    document.querySelector(".down-arrow").classList.toggle("rotate180");
});

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
            checkMark.parentElement.parentElement.style.display = "flex"
        });
        checkMarksChecked.forEach((checkMark) => {
            checkMark.parentElement.parentElement.style.display = "flex"
        });
    } else if (id === "active") {
        checkMarks.forEach((checkMark) => {
            checkMark.parentElement.parentElement.style.display = "flex"
        });
        checkMarksChecked.forEach((checkMark) => {
            checkMark.parentElement.parentElement.style.display = "none"
        });
    } else if (id === "completed") {
        checkMarks.forEach((checkMark) => {
            checkMark.parentElement.parentElement.style.display = "none"
        });
        checkMarksChecked.forEach((checkMark) => {
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

function validate(event) {
    if (description.value === "" || $('input[type="checkbox"]:checked').length == 0) {
        alert(description.title);
        event.preventDefault()
    } else {
        addItem();
    }
}

function addItem() {
    var checkedCategoriesId = [];
    $('input[type="checkbox"]:checked').each(function() {
        checkedCategoriesId.push(this.id);
        this.checked = false;
    });
    document.querySelector(".list").classList.toggle("show");
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/todo/todo.do',
        data: {
            description: description.value,
            categoriesId: JSON.stringify({
                checkedCategoriesId
            })
        },
        dataType: 'json',
        async: false
    }).done(function(item) {
        generate(item);
    }).fail(function (err) {
        console.log(err)
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

    const categories = document.createElement("div");
    categories.classList.add("item-categories");

    for (var i = 0; i < item.categories.length; i++) {
        const category = document.createElement("span");
        category.innerText = item.categories[i].name;
        categories.appendChild(category);
    }

    todoItem.classList.add("todo-item");
    check.classList.add("check");

    if (item.done == true) {
        checkMark.className = "check-mark-checked";
        todoText.className = "todo-text-checked";
    } else if (item.done == false){
        checkMark.className = "check-mark";
        todoText.className ="todo-text";
    }
    checkMark.setAttribute("item-id", item.id);
    img.setAttribute("src", "images/icon-check.svg");
    todoText.innerHTML = item.description;

    del.classList.add("delete");
    delItem.classList.add("delete-item");
    delItem.setAttribute("item-id", item.id);
    delImg.setAttribute("src", "images/icon-cross.svg");

    checkMark.appendChild(img);
    delItem.appendChild(delImg);
    del.appendChild(delItem);
    check.appendChild(checkMark);
    todoItem.appendChild(check);
    todoItem.appendChild(todoText);
    todoItem.appendChild(categories);
    todoItem.appendChild(del);
    document.querySelector('.todo-items').appendChild(todoItem);

    checkMark.addEventListener("click", function() {
        markCompleted(checkMark);
    });
    delItem.addEventListener("click", function() {
        deleteItem(delItem);
    });
}

function markCompleted(item) {
    var rsl;
    if (item.className === "check-mark") {
        item.className = "check-mark-checked";
        item.parentElement.nextElementSibling.className = "todo-text-checked";
        rsl = true;
    } else if (item.className === "check-mark-checked") {
        item.className = "check-mark";
        item.parentElement.nextElementSibling.className = "todo-text";
        rsl = false;
    }
    var itemId = item.getAttribute("item-id");
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/todo/mark.do',

        data: {
            id: itemId,
            done: JSON.stringify(rsl)
        },
        dataType: 'json',
        async: false
    }).done(function(data) {
        console.log(data);
    }).fail(function (err) {
        console.log(err)
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
        console.log(err)
    });
}

$(document).ready(function () {
    document.getElementById("all").classList.add("on");
    showItems();
    showCategories();
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

function showCategories() {
    const list = document.getElementById("list");
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/todo/category.do',
        dataType: 'json',
        async: false
    }).done(function (categories) {
        for (var i = 0; i < categories.length; i++) {
            list.appendChild(generateCategory(categories[i]));
        }
    }).fail(function (err) {
        console.log(err);
    });
}

function generateCategory(category) {
    const label = document.createElement("label");
    const inputCheckbox = document.createElement("input");
    const text = document.createElement("div");

    label.className = "category";
    label.setAttribute("for", category.id);

    text.innerText = category.name;

    inputCheckbox.setAttribute("type", "checkbox");
    inputCheckbox.setAttribute("id", category.id);

    label.appendChild(inputCheckbox);
    label.appendChild(text);
    return label;
}










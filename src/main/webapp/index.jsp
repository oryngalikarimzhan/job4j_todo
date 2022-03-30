<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="preconnect" href="https://fonts.googleapis.com"> 
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/index.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <title>To Do App</title>
</head>
<body>
    <div class="background-image">
        <img src="images/bg.png">
    </div>
    <div class="container">
        <div class="header">
            <div class="title">
                TODO
            </div>
        </div>
        <div class="new-todo">
            <div class="check">
                <div class="check-mark" id="todo-input-btn">
                   +
                </div>
            </div>
            <div class="new-todo-input">
                <form>
                    <input id="todo-input"
                           type="text"
                           placeholder="Create a new todo"
                           title="Please enter the task and choose categories"/>
                </form>
            </div>
            <div class="multi-selector">
                <div class="select-field">
                    <input type="text" readonly name="" placeholder="Chose categories" id="" class="input-selector">
                    <span class="down-arrow">&triangledown;</span>
                </div>
                <div class="list" id="list">

                </div>
            </div>
        </div>
        <div class="todo-items-wrapper">
            <div class="todo-items-config">
                <div class="items-statuses">
                    <span id="all">All</span>
                    <span id="active">Active</span>
                    <span id="completed">Completed</span>
                </div>
                <div class="user">
                    <c:if test="${user != null}">
                        <div class="user-name">
                            <c:out value="${user.name}"/>
                        </div>
                        <div>
                            <a class="log-out" href="<%=request.getContextPath()%>/logout.do">
                                <img src="images/signout.png" style="width: 30px; height: 30px">
                            </a>
                        </div>
                    </c:if>
                    <c:if test="${user == null}">
                        <div>
                            <a class="log-in" href="<%=request.getContextPath()%>/auth.do">
                                LOGIN
                            </a>
                        </div>
                        <div>
                            <a class="signin-link" href="<%=request.getContextPath()%>/reg.do">
                                SIGNIN
                            </a>
                        </div>
                    </c:if>
                </div>
            </div>
            <div class="todo-items"></div>
        </div>
    </div>
    <script src="script/index.js"></script>
</body>
</html>
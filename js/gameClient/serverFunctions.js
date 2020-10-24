
// server functions 

function updateUserList(){
    let userList = document.getElementById("userList");
    userList.innerHTML = "";
    if(server.state.users){
        server.state.users.forEach(function(obj){
            let user = obj;
            let entry = document.createElement('li');
            entry.appendChild(document.createTextNode(user.name));
            userList.appendChild(entry);
        });
    }
    
}
function userReady(){
    let gameInfo = document.getElementById("gameInfo");
    gameInfo.innerHTML = `<h2>Your name: ${ client.name }</h2>`;
    //updateUserList();
    
}
function sendMessage(data) {
    let msg = JSON.stringify(data);
    ws.send(msg);
}

ws.onopen = function (event) {
    console.log("connected to the web socket server");
    server.connected = true;
};

// handle messages from the server
ws.onmessage = function(event) {
    let msg = JSON.parse(event.data);
    switch(msg.type){
        case "serverState":
            server.state = JSON.parse(msg.state);
            break;
        case "userReady":
            client.ready = true;
            userReady();
            break;
        case "notReady":
            alert(msg.reason + "\nSorry! Please try another username.");
            location.reload();
            break;
        case "userJoined":
            console.log(msg.userName + " joined");
            updateUserList();
            break;
        case "userLeft":
            console.log(msg.userName + " left");
            updateUserList();
            break;
    }
}

/*
ws.onmessage = function(event) {
    msg = JSON.parse(event.data);
    if(msg.type == "userReady"){ 
        client.ready = true;
        userReady();
    }
    if(msg.type == "serverState"){ // server sends latest state
        server.state = msg.state;
    }
    if(msg.type == "userNameRejected"){ 
        alert(msg.reason + "\nPlease try another username");
        location.reload();
    }
    if(msg.type == "connected"){
        console.log("This works!");
    }
    if(msg.type == "userJoined"){
        console.log(msg.userName + " joined");
        updateUserList();
    }
    if(msg.type == "userLeft"){
        console.log(msg.userName + " left");
        updateUserList();
    }
}*/


//var time = new Date(msg.date);
//var timeStr = time.toLocaleTimeString();
/*
switch(msg.type) {
case "id":
clientID = msg.id;
setUsername();
break;
case "username":
text = "<b>User <em>" + msg.name + "</em> signed in at " + timeStr + "</b><br>";
break;
case "message":
text = "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>";
break;
case "rejectusername":
text = "<b>Your username has been set to <em>" + msg.name + "</em> because the name you chose is in use.</b><br>"
break;
case "userlist":
var ul = "";


for (i=0; i < msg.users.length; i++) {
ul += msg.users[i] + "<br>";
}
document.getElementById("userlistbox").innerHTML = ul;
break;
}
*/
/*if (text.length) {
f.write(text);
document.getElementById("chatbox").contentWindow.scrollByPages(1);
}*/
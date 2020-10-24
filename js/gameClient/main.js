

// server connection and state 
let server = {
    connected:false,
    state:{}
}

// local client
let client = {
    name:undefined,
    ready:false,
    score:0,
	mouse:{
		x:null,
		y:null,
		velocity:0,
		down:{
            count: 0,
            active:false,
            timeStamp:null,
			x:null,
            y:null,
            upX:null,
            upY:null,
			duration:null,
			active:false,
			count: 0
		},
    },
};

// view and display functions 
function showIntro(){
    hideView("loading");
    showView("intro");
}
function showView(elementID){
	let element = document.getElementById(elementID);
    element.style.display = "block";
}
function hideView(elementID){
	let element = document.getElementById(elementID);
    element.style.display = "none";
}

// define canvas 
let canvas = document.getElementById('gameCanvas');
let dpr = window.devicePixelRatio || 1; 
let rect = canvas.getBoundingClientRect(); 
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
let context = canvas.getContext('2d');

// include the mouse/keyboard control functions
include("js/gameClient/inputControls.js");


// client loop
function startLoop(){
    if(window){
        window.requestAnimationFrame(clientLoop);
    }
}

function clientLoop(timeStamp) {
    update();
    draw();
    window.requestAnimationFrame(clientLoop);
}

function update(){
    canvas.setAttribute("width",screen.width);
    canvas.setAttribute("height",screen.height);

    if(server.connected){
        let focused = document.hasFocus();

        let canvasFocused = (document.activeElement === canvas);
        if(canvasFocused == false){
            sendMessage({
                type:"canvasLostFocus",
                clientName:client.name
            });
        }
    }
}

function draw(){
    // clear the canvas
    context.clearRect(0,0,canvas.width, canvas.height);

    // draw new state
    if(server.state.users){
        server.state.users.forEach(function(user){
            let size = user.size;
            context.beginPath();
            context.arc(user.location.x, user.location.y, size, 0, 2 * Math.PI, true);
            context.fillStyle = user.color;
            context.fill();
            //console.log(user.guns.dotGun.shots);
            if(user.walls.dots.length){
                let userWalls = user.walls.dots;
                userWalls.forEach(function(dot){
                    let size = 5;
                    context.beginPath();
                    context.arc(dot.x, dot.y, size, 0, 2 * Math.PI, true);
                    context.fillStyle = user.color;
                    context.fill();
                }); 
            }
            if(user.guns.dotGun.shots.length > 0){
                let shots = user.guns.dotGun.shots;
                shots.forEach(function(shot){
                    let size = 5;
                    context.beginPath();
                    context.arc(shot.destination.x, shot.destination.y, size, 0, 2 * Math.PI, true);
                    context.fillStyle = "#ffffff";//user.color;
                    context.fill();
                }); 
            }
        });
    }
}

// startLoop();


// define a connection to the web socket server
const WEBSOCKET_SERVER_URL = "ws://game.jadon.me:8080";
let ws = new WebSocket(WEBSOCKET_SERVER_URL);

// include the server functions
include("js/gameClient/serverFunctions.js");

showIntro();

function startGame(){
    showView("gameCanvas");
    context.scale(dpr, dpr); 
    
    // listen for controls
	canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mouseleave', mouseLeave, false);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
    canvas.addEventListener('focusin', () => {
        sendMessage({
            type:"canvasFocusIn",
        });
    });
    canvas.addEventListener('focusout', () => {
        sendMessage({
            type:"canvasFocusOut",
        });
    });

    client.name = document.getElementById("clientName").value;
    if(client.name.trim() == ''){
        client.name = "unnamed";
    }
    sendMessage({
        type:"userReady",
        clientName:client.name
    });

    startLoop();
    setTimeout(function(){
        showView("main");
        hideView("intro");
    },100);
}

function connect(url){
    return new Promise(function(resolve, reject){
        ws = new WebSocket(url);
        ws.onopen = function() {
            resolve(ws);
        };
        ws.onerror = function(err) {
            reject(err);
        };
    });
}
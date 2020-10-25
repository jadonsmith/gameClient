

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
    facing: "left", // left OR right
    spriteX:0,
    spriteY:0,
    keyPresses:{},
    playerSprite:{
        current:null,
        left:{
            facing: './image/avatar_facing_left.png',
            moving:[
                './image/avatar_moving_left0.png',
                './image/avatar_moving_left1.png',
                './image/avatar_moving_left2.png',
                './image/avatar_moving_left3.png'
            ]
        },
        right:{
            facing: './image/avatar_facing_right.png',
            moving:[
                './image/avatar_moving_right0.png',
                './image/avatar_moving_right1.png',
                './image/avatar_moving_right2.png',
                './image/avatar_moving_right3.png'
            ]
        }
    },
    moving: false,
    movementStep:0,
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

let playerSprite = new Image();
playerSprite.src = './image/sprite_sheet.png'


// include the mouse/keyboard control functions
include("js/gameClient/inputControls.js");

document.getElementById('startButton').addEventListener('click', function(){
    startGame();
});


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
            function drawPlayer(spriteX, spriteY){
                let width = 128;
                let height = 128;
                context.drawImage(playerSprite,spriteX, spriteY,width,height,user.location.x-64,user.location.y-64,width,height);
            }
            let size = user.size;
            context.beginPath();
            context.arc(user.location.x, user.location.y, size, 0, 2 * Math.PI, true);
            context.fillStyle = user.color;
            context.fill();

            if(client.facing == "left"){
                if(client.moving){
                    //moving
                }else{
                    client.spriteX = 0;
                    client.spriteY = 0;
                    drawPlayer(client.spriteX, client.spriteY);
                    
                }
            }else if (client.facing == "right"){
                if(client.moving){
                    //moving
                }else{
                    client.spriteX = 0;
                    client.spriteY = 128;
                    drawPlayer(client.spriteX, client.spriteY);
                }
            }
            

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
const WEBSOCKET_SERVER_URL = "wss://game.jadon.me:8443";
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
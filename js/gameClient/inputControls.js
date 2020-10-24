
function keyDown(event){
    sendMessage({
        type:"keyDown",
        key:event.code,
    });
}
function keyUp(event){
    sendMessage({
        type:"keyUp",
        key:event.code
    });
}
function mouseMove(event){
    let e = event;
    rect = canvas.getBoundingClientRect();
	client.mouse.x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    client.mouse.y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
    sendMessage({
        type:"mouseMove",
        x:client.mouse.x,
        y:client.mouse.y
    });
}
function mouseDown(event){
    //event.preventDefault();
    client.mouse.down.active = true;
    client.mouse.down.count++;
	client.mouse.down.x = client.mouse.x;
    client.mouse.down.y = client.mouse.y;
    client.mouse.down.timeStamp = Date.now();
    sendMessage({
        type:"mouseDown",
        x:client.mouse.x,
        y:client.mouse.y
    });
}
function mouseUp(){
    client.mouse.down.active = false;
    client.mouse.down.upX = client.mouse.x;
    client.mouse.down.upY = client.mouse.y;
    client.mouse.down.duration = Date.now() - client.mouse.down.timeStamp;
    sendMessage({
        type:"mouseUp",
        x : client.mouse.x,
        y : client.mouse.y
    });
}
function mouseLeave(){
    console.log("mouseleave");
    sendMessage({
        type:"mouseLeave",
    });
}
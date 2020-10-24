
// this function appends scripts to the bottom of <body>
function include(src){
    let script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.body.append(script);
}

window.addEventListener("load", function() {
    include("js/gameClient/main.js");
});
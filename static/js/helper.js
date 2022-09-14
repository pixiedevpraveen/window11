function init() {
    document.addEventListener('contextmenu', function (e) { /* console.log(e.target.getAttribute('alt') || ''); */ e.preventDefault()})
    getTime();
    // setTimeout(() => {
    //     document.getElementById("main-loading").classList.toggle('hide');
    // }, 1000);
}
function helloWorld() {
    console.log("Hello World!");
}
function getTime() {
    let s = new Date().toLocaleString();
    for (let index = 0; index < document.getElementsByClassName("datetime").length; index++)
        document.getElementsByClassName("datetime")[index].innerHTML = s.slice(0, -6).concat(' ').concat(s.slice(-2));

    setTimeout(getTime, 30000);
}
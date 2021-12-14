/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();
/* 2) Make a reference to your HTML button and add a click handler. */
// var leftButton = document.querySelector("#leftB");
// leftButton.addEventListener("click", manualFixG);
// var rightButton = document.querySelector("#rightB");
// rightButton.addEventListener("click", manualFixD);

// var fixButton = document.querySelector("#fixBut");
// fixButton.addEventListener("click", fixFunc);

var swiButton = document.querySelector("#switchSide");
swiButton.addEventListener("click", switchSideFunc);

var movNumField=document.querySelector("#pageField");

var movButton = document.querySelector("#movePage");
movButton.addEventListener("click", movPage);

/* 3) Write a helper function to pass instructions to the ExtendScript side. */
// function manualFixG(){
//   csInterface.evalScript("offsetG()");
// }
// function manualFixD(){
//   csInterface.evalScript("manualFix('right',4)");
// }
// function manualFixG(){
//   csInterface.evalScript("manualFix('left',4)");
// }
// function manualFixD(){
//   csInterface.evalScript("manualFix('right',4)");
// }
// function fixFunc() {
// csInterface.evalScript("autoFix()");  
// }

function switchSideFunc() {
  csInterface.evalScript("switchSideJSX()");  
}
function movPage() {
  var movNum=movNumField.value;
  csInterface.evalScript("movePageJSX("+movNum+")");  
}
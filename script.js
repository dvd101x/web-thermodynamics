const Input = document.getElementById("Input")
const Results = document.getElementById("Results")
const wait = 200;

function insertExample() {
  const CoolPropExample = [
    "# Density of Nitrogen at a temperature 25 °C and a pressure 1 atmosphere:",
    "props('D', 'T', 25 degC, 'P', 1 atm, 'Nitrogen')",
    ,
    "# Phase of Water at a pressure of 1 atmosphere and 0% Quality",
    "phase('P',1 atm,'Q',0%,'Water')",
    ,
    "# Enthalpy as a function of temperature, pressure and relative humidity at STP",
    "HAprops('H','T',25 degC,'P', 1 atm,'R', 50%)"
  ]
  Input.value = CoolPropExample.join("\n")
}

var mathWorker = new Worker("mathWorker.js");


function sendMath(){
  const expressions = Input.value.split("\n");
  const request = {expr: expressions}
  mathWorker.postMessage(JSON.stringify(request))
}

insertExample()

var timer;
Input.addEventListener("input", code => {
  clearTimeout(timer);
  timer = setTimeout(sendMath, wait, code);
})

mathWorker.onmessage = function (event) {
  const callback = JSON.parse(event.data);
  const lines = callback.lines;
  const results = callback.result;

  let tableRows = "";
  lines.forEach((line,N) => {
  tableRows += "<tr><td>"+line+":  </td><td>"+results[N].split("\n").join("<br>")+"</td></tr>"
  });
  Results.innerHTML = tableRows;
};
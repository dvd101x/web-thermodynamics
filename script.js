const Input = document.getElementById("Input")
const Results = document.getElementById("Results")
const wait = 200;
const firstResponse = ["Type on the input to get results"]

math.import({props, HAprops, phase})
const parser = self.math.parser()

function showResults(results){
  let tableRows = "";
  results.forEach((result,N) => {
    if(result && result != "[]"){
      let formattedResult = math.format(result,14);
      tableRows += "<tr><td>"+(N+1)+":  </td><td>"+formattedResult.split("\n").join("<br>")+"</td></tr>"
    }
  });
  Results.innerHTML = tableRows;
}

function doMath(expressions){
  let results = []

  parser.clear()
  expressions.forEach(expression => {
    try {
      output = parser.evaluate(expression);
    } catch (error) {
      output = error;
    }
    results.push(output)
  })
  return results
}

function sendMath(){
  const expressoins = Input.value.split("\n")
  showResults(doMath(expressoins))
}

showResults(firstResponse)

var timer;
Input.addEventListener("input", code => {
  clearTimeout(timer);
  timer = setTimeout(sendMath, wait, code);
})
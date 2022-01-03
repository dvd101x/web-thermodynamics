const Input = document.getElementById("Input")
const Results = document.getElementById("Results")
const wait = 200;
const firstResponse = ["Type on the input to get results"]

math.import({props, HAprops, phase})
const parser = self.math.parser()

function showResults(results){
  Results.value = results.filter(result => result && result !="[]" && result != "undefined").join("\n");
}

function doMath(expressions){
  let results = []

  parser.clear()
  expressions.forEach(expression => {
    try {
      output = math.format(parser.evaluate(expression),14);
    } catch (error) {
      output = error;
    }
    results.push(output)
  })
  return results
}

function sendMath(){
  const expressions = Input.value.split("\n")
  showResults(doMath(expressions))
}

var timer;
Input.addEventListener("input", code => {
  clearTimeout(timer);
  timer = setTimeout(sendMath, wait, code);
})
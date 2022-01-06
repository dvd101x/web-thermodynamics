const Input = document.getElementById("Input")
const Results = document.getElementById("Results")
const wait = 200;

math.import({ props, HAprops, phase })
const parser = self.math.parser()

function showResults(results) {
  Results.value = results.filter(res => res && res != "[]" && res != "undefined").join("\n");
}

function doMath(expressions) {
  parser.clear()
  return expressions.map(ex => {
    try {
      return math.format(parser.evaluate(ex), 14)
    } catch (e) {
      return e.toString()
    }
  }
  )
}

function sendMath() {
  const expressions = Input.value.split("\n")
  showResults(doMath(expressions))
}

var timer;
Input.addEventListener("input", code => {
  clearTimeout(timer);
  timer = setTimeout(sendMath, wait, code);
})

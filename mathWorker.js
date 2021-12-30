importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.1/math.js", 'coolprop.js', 'fluidProperties.js')

const firstResponse = {
  lines: ["1"],
  result: ["Type on the input to get results"]
}

postMessage(JSON.stringify(firstResponse))

math.import({ props, HAprops, phase })
const parser = self.math.parser()

function doMath(expressions) {
  let outputs = [];
  let lines = [];
  parser.clear();
  expressions.forEach((expression, N) => {
    try {
      output = parser.evaluate(expression);
    } catch (error) {
      output = error;
    }
    if (output && output.toString() != "[]" && typeof (output) != "function" && output.toString() != "[object Object]") {
      outputs.push(math.format(output, 14))
      lines.push(N +1 )
    }
  })
  return [lines, outputs]
}

onmessage = function (event) {
  const request = JSON.parse(event.data)
  mathResult = doMath(request.expr)
  // build a response
  const response = {
    result: mathResult[1],
    lines: mathResult[0]
  }
  postMessage(JSON.stringify(response))
}
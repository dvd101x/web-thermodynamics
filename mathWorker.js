importScripts("https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.1/math.js", 'coolprop.js', 'fluidProperties.js')

const firstResponse = {
  result: ["Type on the input to get results"]
}

postMessage(JSON.stringify(firstResponse))

math.import({ props, HAprops, phase })
const parser = self.math.parser()

function doMath(expressions) {
  let outputs = [];
  parser.clear();
  expressions.forEach((expression, N) => {
    try {
      output = parser.evaluate(expression);
    } catch (error) {
      output = error;
    }
    if (output && output.toString() != "[]" && typeof (output) != "function" && output.toString() != "[object Object]") {
      outputs.push(N + 1 + ":\t" + math.format(output, 14))
    }
  })
  return outputs
}

onmessage = function (event) {
  const request = JSON.parse(event.data)
  // build a response
  const response = {
    result: doMath(request.expr)
  }
  postMessage(JSON.stringify(response))
}
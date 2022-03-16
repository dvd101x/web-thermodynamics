const wait = 500;

math.import({ props, HAprops, phase })
math.createUnit('TR', '12e3 BTU/h')
const parser = math.parser()

ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14')

var timer;
var editor = ace.edit("editor");
editor.setOptions({
  showGutter: false, // hide the gutter
  theme: "ace/theme/solarized_light",
  mode: "ace/mode/python",
  wrap: "free"
});

editor.on("change", code => {
  clearTimeout(timer);
  timer = setTimeout(sendMath, wait, code);
});

var results = ace.edit("result");
results.setOptions({
  showGutter: false,
  theme: "ace/theme/iplastic",
  mode: "ace/mode/javascript",
  readOnly: true,
})

function doMath(expressions) {
  // Clear variables from parser
  parser.clear()
  // Test each block of expressions
  return expressions.map(x => {
    try {
      return parser.evaluate(x)
    } catch (error) {
      return error.toString()
    }
  })
}

function showMath(x) {
  if (['string', undefined].includes(typeof x)) {
    return x
  }
  else {
    return math.format(x, 14)
  }
}

function resultsToString(blockResults) {
  let lines = "";
  let blockResult
  for (blockResult of blockResults) {
    if (blockResult.entries) {
      const results = blockResult.entries
      let result
      for (result of results) {
        lines += "\n" + showMath(result)
      }
    }
    else {
      lines += "\n" + showMath(blockResult)
    }
    lines += "\n"
  }
  return lines.slice(1,-1) //ignore the first new line
}

function sendMath() {
  const expressions = editor.getValue().split(/\n\W*\n/g).filter(x => x);
  const calculated = doMath(expressions);
  results.setValue(resultsToString(calculated));
  results.clearSelection();
}

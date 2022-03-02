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
  parser.clear()
  return expressions.map(ex => {
    try {
      let result = parser.evaluate(ex)
      if (typeof result != 'string')
        {result = math.format(result,14)}
      return result
    } catch (e) {
      return e.toString()
    }
  }
  )
}

function sendMath() {
  const expressions = editor.getValue().split("\n");
  const calculated = doMath(expressions);
  results.setValue(calculated.filter(x => x != "undefined" && x != "[]").join("\n"));
  results.clearSelection();
}

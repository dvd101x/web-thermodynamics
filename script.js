const wait = 200;

math.import({ props, HAprops, phase })
const parser = self.math.parser()

ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13')

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
  const expressions = editor.getValue().split("\n");
  const calculated = doMath(expressions);
  results.setValue(calculated.filter(x => x != "undefined" && x != "[]").join("\n"));
  results.clearSelection();
}

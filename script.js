const wait = 500;

const example = [
    "# # Examples of props",
    "# ",
    "# *Density* $[\\frac{kg}{m^3}]$ of **nitrogen** at a *temperature* **25 °C** and a *pressure* **1 atmosphere**:",
    "props('D', 'Nitrogen', {T:25 degC, P:1 atm})",
    "",
    "# Saturated vapor enthalpy $[\\frac{J}{kg}]$ of **R134a** at **25 °C**",
    "props('H', 'R134a', {T: 25 degC, Q:1})",
    "",
    "# # Example of Phase",
    "# ",
    "# *Phase* of **water** at a *pressure* of **1 atmosphere** and **0%** *Quality*:",
    "phase('Water', {P:1 atm, Q: 0 %})",
    "",
    "# # Examples of HAprops",
    "# ",
    "# * *Enthalpy* $\\frac{J}{{kg}_{dry\\ air}}$ as a function of *temperature*, *pressure* and *relative humidity* at STP ",
    "h = HAprops('H', {T: 25 degC, P:1 atm, R:50 %})",
    "",
    "# * *Temperature* of **saturated air** at the previous *enthalpy*",
    "HAprops('T', {P:1 atm, H:h, R:1.0})"
]

math.import({ props, HAprops, phase })
math.createUnit('TR', '12e3 BTU/h')

const parser = math.parser()
const inputCode = document.getElementById('editor')
inputCode.value = example.join('\n');
let timer;
var editor = CodeMirror.fromTextArea(inputCode, {
  lineNumbers: true,
  lineWrapping: true,
  mode: "mathjs",
  keyMap: "sublime",
  autoCloseBrackets: true,
  extraKeys: {
    "Alt-F": "findPersistent",
    "Ctrl-Space": "autocomplete"
  },
  matchBrackets: true,
  highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: false },
  foldGutter: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  showCursorWhenSelecting: true,
  theme: "blackboard",
  styleActiveLine: true,
});

editor.on("change", code => {
    clearTimeout(timer);
    timer = setTimeout(sendMath, wait, code);
});

function math2str(x) {
    return typeof x == "string" ? x : math.format(x, 14)
}

function evalBlock(block) {
    let mathResult
    try {
        mathResult = parser.evaluate(block)
    } catch (error) {
        return error.toString()
    }
    if (typeof mathResult != 'undefined') {
        if (mathResult.entries) {
            return mathResult.entries
                .filter(x => typeof x != 'undefined')
                .map(x => math2str(x)).join("\n")
        }
        else {
            return math2str(mathResult)
        }
    }
}

function evalBlocks(blocks){
	return blocks.map(block=>evalBlock(block))
}

const md = markdownit({ html: true })
  .use(texmath, {
    engine: katex,
    delimiters: ['dollars', 'beg_end'],
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
  })

  function makeDoc(code) {
    const splitCode = code.split('\n');
    const lineTypes = splitCode.map(line => line.startsWith('# ') ? 'md' : 'math');
    let cells = [];
    let lastType = '';
    parser.clear()
    splitCode
      .forEach((line, lineNum) => {
        if (lastType === lineTypes[lineNum]) {
          cells[cells.length - 1].source.push(line)
        }
        else {
          cells.push({ cell_type: lineTypes[lineNum], source: [line] })
        }
        lastType = lineTypes[lineNum]
      })
    let cleanCells = []
    cells.forEach(x => {
      if (x.cell_type === 'md') {
        cleanCells.push({ cell_type: 'md', source: x.source.map(e => e.slice(2)) })
      }
      else {
		const thereIsSomething = x.source.join('\n').trim();
        if (thereIsSomething) {
          cleanCells.push({ cell_type: 'math', source: x.source})
        }
      }
    })
  
    let output = [];
  
    const processOutput = {
      math: mathCell => {
        const results = evalBlocks(
			mathCell.join('\n')
				.split(/\n\s*\n/g)
			)
        return results.map(
			result => result.length ? '<pre>' + result + '</pre>' : '').join('\n')
      },
      md: markdown => md.render(markdown.join('\n'))
    }
  
    cleanCells.forEach(
      cell => output.push(processOutput[cell.cell_type](cell.source))
    )
    return output.join('\n')
  }

const results = document.getElementById("output")

function sendMath() {
    results.innerHTML = makeDoc(editor.getValue());
}

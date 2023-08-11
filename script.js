const wait = 300;

const example = [
  "# # Examples of props",
  "# ",
  "# *Density* $\\frac{kg}{m^3}$ of **nitrogen** at a *temperature* **25 °C** and a *pressure* **1 atmosphere**:",
  "props('D', 'Nitrogen', {T:25 degC, P:1 atm})",
  "",
  "# Saturated vapor enthalpy $\\frac{J}{kg}$ of **R134a** at **25 °C**",
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

/**
 * auto complete a text
 * @param {String} text
 * @return {[Array, String]} completions
 */
function completer(text) {
  // based on https://github.com/josdejong/mathjs/tree/develop/bin/cli.js
  let matches = []
  let keyword
  const m = /[a-zA-Z_0-9]+$/.exec(text)
  if (m) {
    keyword = m[0]

    // scope variables
    for (const def in parser.getAll()) {
      if (def.startsWith(keyword)) {
        matches.push(def)
      }
    }

    // math functions and constants
    const ignore = ['expr', 'type']
    const mathFunctions = math.expression.mathWithTransform

    for (const func in mathFunctions) {
      if (hasOwnPropertySafe(mathFunctions, func)) {
        if (func.startsWith(keyword) && ignore.indexOf(func) === -1) {
          matches.push(func)
        }
      }
    }

    const importedFunctions = ["props", "HAprops", "phase", "MM"]
    for (const func of importedFunctions) {
      if (func.startsWith(keyword)) {
        matches.push(func)
      }
    }

    // units
    const Unit = math.Unit
    for (const name in Unit.UNITS) {
      if (hasOwnPropertySafe(Unit.UNITS, name)) {
        if (name.startsWith(keyword)) {
          matches.push(name)
        }
      }
    }
    for (const name in Unit.PREFIXES) {
      if (hasOwnPropertySafe(Unit.PREFIXES, name)) {
        const prefixes = Unit.PREFIXES[name]
        for (const prefix in prefixes) {
          if (hasOwnPropertySafe(prefixes, prefix)) {
            if (prefix.startsWith(keyword)) {
              matches.push(prefix)
            } else if (keyword.startsWith(prefix)) {
              const unitKeyword = keyword.substring(prefix.length)
              for (const n in Unit.UNITS) {
                const fullUnit = prefix + n
                if (hasOwnPropertySafe(Unit.UNITS, n)) {
                  if (
                    !matches.includes(fullUnit) &&
                    n.startsWith(unitKeyword) &&
                    Unit.isValuelessUnit(fullUnit)) {
                    matches.push(fullUnit)
                  }
                }
              }
            }
          }
        }
      }
    }

    // remove duplicates
    matches = Array.from(new Set(matches))
  }

  return matches
}

function mathHints(cm, options) {
  return new Promise(function (accept) {
    setTimeout(function () {
      const cursor = cm.getCursor(), line = cm.getLine(cursor.line)
      let start = cursor.ch, end = cursor.ch
      while (start && /\w/.test(line.charAt(start - 1))) --start
      while (end < line.length && /\w/.test(line.charAt(end))) ++end
      const word = line.slice(start, end)
      const results = completer(word)
      if (results.length > 0) {
        return accept({
          list: results,
          from: CodeMirror.Pos(cursor.line, start),
          to: CodeMirror.Pos(cursor.line, end)
        })
      } else {
        return accept(null)
      }
    }, 100)
  })
}

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
  hintOptions: { hint: mathHints }
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
  if (mathResult && typeof mathResult !== 'undefined' && typeof mathResult === 'object') {
    if (mathResult.entries && Array.isArray(mathResult.entries)) {
      return mathResult.entries
        .filter(x => typeof x !== 'undefined')
        .map(x => math2str(x)).join("\n")
    }
  }
  return math2str(mathResult)
}


function evalBlocks(blocks) {
  return blocks.map(block => evalBlock(block))
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
        cleanCells.push({ cell_type: 'math', source: x.source })
      }
    }
  })

  let output = [];

  const processOutput = {
    math: mathCell => {
      const blocks = mathCell.join('\n')
        .split(/\n\s*\n/g)
        .filter(x => x.trim().length > 0)
      const results = evalBlocks(blocks)
      return results
        .filter(x => typeof x !== 'undefined')
        .map(
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

// helper function to safely check whether an object has a property
// copy from the function in object.js which is ES6
function hasOwnPropertySafe(object, property) {
  return object && Object.hasOwnProperty.call(object, property)
}
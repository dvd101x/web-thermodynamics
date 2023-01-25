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

// consistently gets the size of an array, matrix or scalar as an array
sizeAsArray = (x) => (math.isMatrix(x) | isScalar(x)) ? math.size(x).toArray() : math.size(x)

// checks if a value is scalar
isScalar = (x) => math.count(math.size(x)) == 0

// checks if the size of a value corresponds to a scalar
sizeOfScalar = (size) => math.sum(math.size(size)) == 0

// creates shape of the dimension needed to concat a value in N dimensions
// a matrix of size [3, 4] to dim = 3 yields [1, 3, 3]
// in other words it appends 1 to the left as needed
shapeToConcat = (Mat, dim) => math.resize(sizeAsArray(Mat).reverse(), [dim], 1).reverse()

// calculates what is the common sizes/shapes of the functions to concat
// throws an error specifying why the sizes/shapes can't be broadcasted
function broadcast_shapes(...shapes) {
  // is the number of dims of the shapes to broadcast
  const sizes = shapes.map(shape => shape.length)
  // it should work with scalars but it doesn't
  const N = math.max(sizes)
  let broadcasted_shape = []
  let maxDims = []

  // Gets the maximum size in each dimension
  for (let n = 0; n < N; ++n) {
    let maxDim = 0
    shapes.forEach((shape, ns) => {
      if (sizes[ns] > n) {
        const nDim = shape[sizes[ns] - n - 1]
        if (nDim > maxDim) {
          maxDim = nDim
        }
      }
    })
    maxDims[N - n - 1] = maxDim
  }

  // Calculates the broadcasted shape
  // If for each shape to broadcast, check from right to left
  // from last dimension to first dimension if it can be broadcasted
  // It means it is possible to broadcast a dimension to a dimension N
  // the current dimension is none, 1
  // if the current dimension is already N there is nothing to be done
  // it is not possible to broadcast a dimension size 2 to a 3 for example

  for (let n = 0; n < N; ++n) {
    shapes.forEach((shape, ns) => {
      if (sizes[ns] > n) {
        const dimID = sizes[ns] - n - 1 // right to left
        const nDim = shape[dimID]
        const broadcastID = N - n - 1 // right to left
        if ((nDim < maxDims[broadcastID]) & (nDim > 1)) {
          throw new Error(`shape missmatch: missmatch is found in arg ${ns} with shape (${shape}) not possible to broadcast dimension ${dimID} with size ${nDim} to size ${maxDims[broadcastID]}`)
        }
        else {
          broadcasted_shape[broadcastID] = maxDims[broadcastID]
        }
      }
    })
  }

  return broadcasted_shape
}

function broadcast_matrices(...Ms) {
  // Broadcasts many arrays
	
  // if they are all scalars, there is nothing to do
  if (Ms.every(x => isScalar(x))) {
    return Ms
  }

  const s = broadcast_shapes(...Ms.map(x => sizeAsArray(x)))
  const N = s.length
  return Ms.map(M => {
    if (isScalar(M) & !sizeOfScalar(s)) {
      M = math.matrix([M])
    }

    if (sizeAsArray(M).length < N) {
      M.reshape(shapeToConcat(M, N))
    }

    for (let i = 0; i < N; ++i) {
      if (((M.size()[i] == 1) | (M.size()[i] == 0)) & (s[i] > 1)) {
        M = math.concat(...Array(s[i]).fill(M), i)
      }
    }
    return M
  })
}

const mat = math.create()

mat.import({
  add: (...Ms) => math.add(...broadcast_matrices(...Ms)),
  subtract: (...Ms) => math.subtract(...broadcast_matrices(...Ms)),
  dotMultiply: (...Ms) => math.dotMultiply(...broadcast_matrices(...Ms)),
  dotDivide: (...Ms) => math.dotDivide(...broadcast_matrices(...Ms)),
},{override:true})

mat.import({
  props,
  HAprops,
  phase,
  exp: math.typed({
    'Array | Matrix': x => math.map(x, math.exp)
  }),
  log: math.typed({
    'Array | Matrix': x => math.map(x, x1 => math.log(x1, math.e)),
    'Array | Matrix, number': (x, base) => math.map(x, x1 => math.log(x1, base))
  }),
  gamma: math.typed({
    'Array | Matrix' : x => math.map(x, math.gamma)
  }),
  square: math.typed({
    'Array | Matrix' : x => math.map(x, math.square)
  }),
  sqrt: math.typed({
    'Array | Matrix' : x => math.map(x, math.sqrt)
  }),
  cube: math.typed({
    'Array | Matrix' : x => math.map(x, math.cube)
  }),
  cbrt: math.typed({
    // temporary fix until cbrt can't be mapped
    'Array | Matrix' : x => math.map(x, x => math.cbrt(x))
  }),
  // trigonometrics [sin, cos, tan, csc, sec, cot]
  sin: math.typed({
    'Array | Matrix' : x => math.map(x, math.sin)
  }),
  cos: math.typed({
    'Array | Matrix' : x => math.map(x, math.cos)
  }),
  tan: math.typed({
    'Array | Matrix' : x => math.map(x, math.tan)
  }),
  csc: math.typed({
    'Array | Matrix' : x => math.map(x, math.csc)
  }),
  sec: math.typed({
    'Array | Matrix' : x => math.map(x, math.sec)  
  }),
  cot: math.typed({
    'Array | Matrix' : x => math.map(x, math.cot)
  }),

  // trigonometrics hypberbolics [sinh, cosh, tanh, csch, sech, coth]
  sinh: math.typed({
    'Array | Matrix' : x => math.map(x, math.sinh)
  }),
  cosh: math.typed({
    'Array | Matrix' : x => math.map(x, math.cosh)
  }),
  tanh: math.typed({
    'Array | Matrix' : x => math.map(x, math.tanh)
  }),
  csch: math.typed({
    'Array | Matrix' : x => math.map(x, math.csch)
  }),
  sech: math.typed({
    'Array | Matrix' : x => math.map(x, math.sech)  
  }),
  coth: math.typed({
    'Array | Matrix' : x => math.map(x, math.coth)
  }),

  // trigonometrics arc [asin, acos, atan, acsc, asec, acot]
  asin: math.typed({
    'Array | Matrix' : x => math.map(x, math.asin)
  }),
  acos: math.typed({
    'Array | Matrix' : x => math.map(x, math.acos)
  }),
  atan: math.typed({
    'Array | Matrix' : x => math.map(x, math.atan)
  }),
  acsc: math.typed({
    'Array | Matrix' : x => math.map(x, math.acsc)
  }),
  asec: math.typed({
    'Array | Matrix' : x => math.map(x, math.asec)  
  }),
  acot: math.typed({
    'Array | Matrix' : x => math.map(x, math.acot)
  }),

  // trigonometrics arc hyperbolic [asinh, acosh, atanh, acsch, asech, acoth]
    asinh: math.typed({
    'Array | Matrix' : x => math.map(x, math.asinh)
  }),
  acosh: math.typed({
    'Array | Matrix' : x => math.map(x, math.acosh)
  }),
  atanh: math.typed({
    'Array | Matrix' : x => math.map(x, math.atanh)
  }),
  acsch: math.typed({
    'Array | Matrix' : x => math.map(x, math.acsch)
  }),
  asech: math.typed({
    'Array | Matrix' : x => math.map(x, math.asech)  
  }),
  acoth: math.typed({
    'Array | Matrix' : x => math.map(x, math.acoth)
  })
},
           {
             override:false}
          )

mat.createUnit('TR', '12e3 BTU/h')

const parser = mat.parser()
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
		const blocks = mathCell.join('\n')
			.split(/\n\s*\n/g)
			.filter(x=>x.trim())
        const results = evalBlocks(blocks)
        return results
			.filter(x=>x)
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

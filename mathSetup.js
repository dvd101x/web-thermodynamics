import {create, all} from "mathjs"
import {props, phase, HAprops} from './fluidProperties.js'
const math = create(all)

// this is a setup of mathjs that can use vectorized operations and thermodynamic properties

function mapped(f) {
  return math.typed({
    'Array | Matrix': X => math.map(X, x => f(x))
  })
}

// at some point mathjs lost vectorization of these functions, this is an attempt to add the function back
const functionsToVectorize = [
  "exp", "gamma", "square", "sqrt", "cube", "cbrt",
  "sin", "cos", "tan", "csc", "sec", "cot",
  "sinh", "cosh", "tanh", "csch", "sech", "coth",
  "asin", "acos", "atan", "acsc", "asec", "acot",
  "asinh", "acosh", "atanh", "acsch", "asech", "acoth"
]

math.import(
  {
    ...Object.fromEntries(functionsToVectorize.map(f => [f, mapped(math[f])])),
    log: math.typed({
      'Array | Matrix': x => math.map(x, x1 => math.log(x1, math.e)),
      'Array | Matrix, number': (x, base) => math.map(x, x1 => math.log(x1, base))
    })
  }
  , { override: false })

// add thermodynamic properties

math.import(
  { props, HAprops, phase },
  { override: false }
)

math.createUnit('TR', '12e3 BTU/h')

export default math
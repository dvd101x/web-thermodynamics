// Math calculations
import math from './mathSetup.js'

// Formating and css
import 'github-markdown-css/github-markdown-light.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'markdown-it-texmath/css/texmath.css'
import texmath from 'markdown-it-texmath'
import markdownit from 'markdown-it'

import getExpressions from './getExpressions.js'

const digits = 14

export default makeDoc

// Setup markdown
const md = markdownit({ html: true })
    .use(texmath, {
        engine: katex,
        delimiters: ['dollars', 'beg_end'],
        katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
    })

// Setup math parser
const parser = math.parser()

function makeDoc(code) {
    const splitCode = code.split('\n');
    const lineTypes = splitCode.map(line => line.startsWith('# ') ? 'md' : 'math');
    let cells = [];
    let lastType = '';
    parser.clear()

    // {from, to, source, outputs, visible, type}
    splitCode
        .forEach((line, lineNum) => {
            const thisCell = cells.length - 1
            if (lastType === lineTypes[lineNum]) {
                cells[thisCell].source.push(line)
                cells[thisCell].to = lineNum
            }
            else {
                cells.push({ from: lineNum, to: lineNum, cell_type: lineTypes[lineNum], source: [line] })
            }
            lastType = lineTypes[lineNum]
        })

    const outputCells = [];
    cells.forEach(cell => {
        if (cell.cell_type === 'md') {
            const mdCode = cell.source.map(line => line.slice(2)).join('\n')
            const mdRender = md.render(mdCode)
            outputCells.push({ ...cell, visible: true, outputs: mdRender })
        }
        else {
            const mathResults = processExpressions(getExpressions(cell.source.join('\n')))
            mathResults.forEach(result => {
                outputCells.push({
                    from: cell.from + result.from,
                    to: cell.from + result.to,
                    source: cell.source,
                    visible: result.visible, outputs: result.outputs
                })
            })
        }
    })
    return outputCells
}

/**
 * Evaluates a given expression using a parser.
 *
 * @param {string} expression - The expression to evaluate.
 * @returns {any} The result of the evaluation, or the error message if an error occurred.
*/
function calc(expression) {
    let result
    try {
        result = parser.evaluate(expression)
    } catch (error) {
        result = error.toString()
    }
    return result
}

/**
 * Formats result depending on the type of result
 *
 * @param {number, string, Help, any} result - The result to format
 * @returns {string} The string in HTML with the formated result
 */
const formatResult = math.typed({
    'number': result => math.format(result, { precision: digits }),
    'string': result => `<code>${result}</code>`,
    'Help': result => `<pre>${math.format(result)}</pre>`,
    'any': math.typed.referTo(
        'number',
        fnumber => result => {
            if (result.isUnit) {
                let rString = result.toString()
                if (rString.includes('/')) {
                    let rJSON = result.toJSON()
                    return katex.renderToString(
                        `${parseToTex(fnumber(rJSON.value).toString())}\ ${parseToTex(rJSON.unit)}`)
                }
            }
            return katex.renderToString(parseToTex(fnumber(result)))
        }
    )
})


function parseToTex(expression) {
    return math.parse(expression).toTex()
}

/**
 * Processes an array of expressions by evaluating them, formatting the results,
 * and determining their visibility.
 *
 * @param {Array<{from: number, to: number, source: string}>} expressions - An array of objects representing expressions,
 *   where each object has `from`, `to`, and `source` properties.
 * @returns {Array<{from: number, to: number, source: string, outputs: any, visible: boolean}>} An array of processed expressions,
 *   where each object has additional `outputs` and `visible` properties.
 */
function processExpressions(expressions) {
    return expressions.map(expression => {
        const result = calc(expression.source)
        const outputs = formatResult(result)
        // Determine visibility based on the result type:
        // - Undefined results are hidden.
        // - Results with an `isResultSet` property are hidden when empty.
        // - All other results are visible.
        const visible = result === undefined ? false : (result.isResultSet && result.entries.length === 0) ? false : true
        return ({
            ...expression,
            outputs,
            visible
        })
    })
}
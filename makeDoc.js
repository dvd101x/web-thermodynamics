import math from './mathSetup.js'
import 'katex/dist/katex.min.css'
import katex from 'katex'

import 'markdown-it-texmath/css/texmath.css'
import texmath from 'markdown-it-texmath'

import markdownit from 'markdown-it'

export default makeDoc

const md = markdownit({ html: true })
.use(texmath, {
    engine: katex,
    delimiters: ['dollars', 'beg_end'],
    katexOptions: { macros: { "\\RR": "\\mathbb{R}" } }
})
const parser = math.parser()


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
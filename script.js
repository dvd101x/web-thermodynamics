const wait = 500;

math.import({ props, HAprops, phase })
math.createUnit('TR', '12e3 BTU/h')
const parser = math.parser()

ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14')

let timer;
let editor = ace.edit("editor");
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

let results = ace.edit("result");

results.setOptions({
    showGutter: false,
    theme: "ace/theme/iplastic",
    mode: "ace/mode/javascript",
    readOnly: true,
})

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
    if (mathResult) {
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

function showMath(input) {
    parser.clear()
    const blocks =
        input
            .trim()            // trim input
            .split(/\n\s*\n/g)
    blockResults = blocks.map(x => evalBlock(x)).filter(x => typeof x != 'undefined' & x != [])
    return typeof blockResults == "string" ? blockResults : blockResults.join('\n\n')
}

function sendMath() {
    results.setValue(showMath(editor.getValue()));
    results.clearSelection();
}

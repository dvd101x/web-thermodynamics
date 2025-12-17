import './style.css'

import 'github-markdown-css/github-markdown-light.css'

import 'katex/dist/katex.min.css'

import Alpine from 'alpinejs'
import makeDoc from './makeDoc.js'

import { EditorView, basicSetup } from "codemirror"
import {
  StreamLanguage
} from '@codemirror/language'

import { mathjsLang } from './mathjs.js'

import math from './mathSetup.js'

const editorDOM = document.querySelector('#editor')
const docChanged = new CustomEvent('docChanged')
const selectionChanged = new CustomEvent('selectionChanged')

const example = [
  "# # Examples of props",
  "# ",
  "# *Density* $\\frac{kg}{m^3}$ of **nitrogen** at a *temperature* **25 °C** ",
  "# and a *pressure* **1 atmosphere**:",
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

const editor = new EditorView({
  doc: example.join('\n'),
  extensions: [
    basicSetup,
    StreamLanguage.define(mathjsLang(math)),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        editorDOM.dispatchEvent(docChanged)
        if (update.selectionSet) {
          editorDOM.dispatchEvent(selectionChanged)
        }
      } else if (update.selectionSet) {
        editorDOM.dispatchEvent(selectionChanged)
      }
    })
  ],
  parent: editorDOM,
  lineWrapping: true,
})

window.Alpine = Alpine

Alpine.data(
  'app',
  () => ({
    expressions: makeDoc("# # Type and get results - just like that!"),
    currentLine: 1,
    currentLineFrom: 1,
    currentLineTo: 1,
    get calcExpressions() {
      this.expressions = makeDoc(editor.state.doc.toString())
    },
    get getSelection() {
      this.currentLineFrom = editor.state.doc.lineAt(
        editor.state.selection.ranges[editor.state.selection.mainIndex].from
      ).number - 1
      this.currentLineTo = editor.state.doc.lineAt(
        editor.state.selection.ranges[editor.state.selection.mainIndex].to
      ).number - 1 
    },

  })
)

Alpine.start()
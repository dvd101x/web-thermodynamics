import './style.css'

import Alpine from 'alpinejs'
import makeDoc from './makeDoc.js'


const example = [
  "# # Examples of props",
  "# ",
  "# *Density* $\\frac{kg}{m^3}$ of **nitrogen** at a *temperature* **25 °C** " ,
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

window.Alpine = Alpine
Alpine.data('app',()=>({
  input:example.join('\n'),
  calc: makeDoc,
  output:'<h1>Type and get results - just like that!</h1>'
}))
Alpine.start()
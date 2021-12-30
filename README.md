# CoolPropJavascriptDemo
This is a simple example of how to run CoolProp Javascript wrapper with units handled by mathjs

https://dvd101x.github.io/CoolPropJavascriptDemo/

It loads with three example functions:

* *Density* of **nitrogen** at a *temperature* **25 °C** and a *pressure* **1 atmosphere**: `props('D', 'T', 25 degC, 'P', 1 atm, 'Nitrogen')` shall return `1.1452448929367 kg / m^3`
* *Phase* of **water** at a *pressure* of **1 atmosphere** and **0%** *Quality*: `phase('P',1 atm,'Q',0%,'Water')`shall return `"twophase"
* *Enthalpy* as a function of *temperature*, *pressure* and *relative humidity* at STP `HAprops('H','T',25 degC,'P', 1 atm,'R', 50%)` shall return `50423.450391029 J / kg`

# References

* [List of fluids](http://coolprop.sourceforge.net/fluid_properties/PurePseudoPure.html#list-of-fluids)
* [List of fluid properties](http://www.coolprop.org/coolprop/HighLevelAPI.html#table-of-string-inputs-to-propssi-function)
* [List of psycrometric properties](http://coolprop.sourceforge.net/fluid_properties/HumidAir.html#table-of-inputs-outputs-to-hapropssi)
* [List of units](https://mathjs.org/docs/datatypes/units.html)
* [List of extra functions](https://mathjs.org/docs/reference/functions.html)
* [Syntax](https://mathjs.org/docs/expressions/syntax.html)

# Extension

Te example provided is simple, but the capabilities are much more extense. For example it can be used to calculate complete thermodynamic cycles by using variables or arrays.

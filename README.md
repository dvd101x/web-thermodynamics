# CoolPropJavascriptDemo
This is a simple example of how to run CoolProp Javascript wrapper with units handled by mathjs

# Getting started

Open this link:

https://dvd101x.github.io/CoolPropJavascriptDemo/

# Basic example

It loads with three example expressions for each of the CoolProp functions available:

* *Density* of **nitrogen** at a *temperature* **25 °C** and a *pressure* **1 atmosphere**: `props('D', 'T', 25 degC, 'P', 1 atm, 'Nitrogen')` shall return `1.1452448929367 kg / m^3`
* *Phase* of **water** at a *pressure* of **1 atmosphere** and **0%** *Quality*: `phase('P',1 atm,'Q',0%,'Water')`shall return `"twophase"`
* *Enthalpy* as a function of *temperature*, *pressure* and *relative humidity* at STP `HAprops('H','T',25 degC,'P', 1 atm,'R', 50%)` shall return `50423.450391029 J / kg`

# Intermediate example

This demo uses libraries with many capabilities. There are many conversions available for inputs and ouputs and the results can be stored on variables, arrays and objects to be used later.

``` python
# Density of carbon dioxide at 100 bar and 25C in lbm/in^3
rho = props('D', 'T', 25 degC, 'P', 100 bar, 'CO2') in lbm/in^3

# Saturated vapor enthalpy [J/kg] of R134a at 25C
enthalpy = props('H', 'T', 25 celsius, 'Q', 100%, 'R134a')

# Enthalpy (J per kg dry air) as a function of temperature, pressure, 
#    and relative humidity at STP
enthalpyDry = HAprops('H', 'T', 298.15 K, 'P', 101325 Pa, 'R', 0.5)

# Create an empty array inside an object
cycle = {Temp:[]};

# Temperature of saturated air at the previous enthalpy
cycle.Temp[1] = HAprops('T', 'P', 1 atm, 'H', enthalpyDry, 'R', 1.0)

# Temperature of saturated air in farenheit
cycle.Temp[2] = HAprops('T', 'H', enthalpyDry, 'R', 1.0, 'P', 1 atm) to degF

cycle.Temp to degC
```
Shall return:
```javascript
0.029538663149234 lbm / in^3
4.1233395323187e+5 J / kg
50423.450391029 J / kg
290.96209246917 K
64.0617664445 degF
[17.812092469167 degC, 17.812092469167 degC]
```

# Advanced examples

It can solve many other problems based con [CoolProp High Level API documentation](http://www.coolprop.org/coolprop/HighLevelAPI.html#high-level-api):

```python
# Saturation temperature of Water at 1 atm in K
props('T', 'P', 101325 Pa, 'Q', 0, 'Water')

# Saturated vapor enthalpy of Water at 1 atm in J/kg
H_V = props('H', 'P', 101325 Pa, 'Q', 1, 'Water')

# Saturated liquid enthalpy of Water at 1 atm in J/kg
H_L = props('H', 'P', 101325 Pa, 'Q', 0, 'Water')

# Latent heat of vaporization of Water at 1 atm in J/kg
H_V - H_L

# Get the density of Water at T = 461.1 K and P = 5.0e6 Pa, imposing the liquid phase
props('D', 'T|liquid', 461.1 K, 'P', 5e6 Pa, 'Water')

# Get the density of Water at T = 597.9 K and P = 5.0e6 Pa, imposing the gas phase
props('D', 'T', 597.9 K, 'P|gas', 5e6 Pa, 'Water')

# You can call the props function directly using dummy arguments for the other unused parameters:
props("Tcrit", "", 0, "", 0, "Water")

# It can be useful to know what the phase of a given state point is
phase('P', 101325 Pa, 'Q', 0, 'Water')

# The phase index (as floating point number) can also be obtained using the props function:
props('Phase', 'P', 101325 Pa, 'Q', 0, 'Water')

# c_p using c_p
props('C', 'P', 101325 Pa, 'T', 300 K, 'Water')

# c_p using derivate
props('d(Hmass)/d(T)|P', 'P', 101325 Pa, 'T', 300 K, 'Water')

# c_p using second partial derivative
props('d(d(Hmass)/d(T)|P)/d(Hmass)|P', 'P', 101325 Pa, 'T', 300 K, 'Water')
```
Shall return
```javascript
373.12429584768 K
2.6755293255007e+6 J / kg
4.1905773309408e+5 J / kg
2.2564715924067e+6 J / kg
881.00085333474 kg / m^3
20.50849607058 kg / m^3
647.096 K
"twophase"
6
4180.6357765552 J / (kg K)
4180.6357765552 J / (kg K)
-7.7679894680327e-5 (J kg) / (kg K J)
```

These concepts can be used to calculate complete thermodyinamic cycles.

``` python
# Vapor compression cycle
fluid = 'R134a'
mDot = 1 kg/minute

evap = {T: -20 degC, P_drop: 0 Pa, superHeating: 10 K}
cond = {T:  40 degC, P_drop: 0 Pa, subCooling  : 10 K}
etaS = 0.75

# Store empty arrays for Temperature, Pressure, Density, Enthalpy and Entropy
# Inside an object called cycle
cycle = {T:[], P:[], D:[], H:[], S:[]};

# Define low and high pressure
pLow  = props('P', 'T', evap.T, 'Q', 1, fluid);
pHigh = props('P', 'T', cond.T, 'Q', 0, fluid);

# 4 to 1 Evaporation
cycle.P[1] = pLow;
cycle.T[1] = evap.T+ evap.superHeating;
cycle.D[1] = props('D', 'T', cycle.T[1], 'P', cycle.P[1], fluid);
cycle.H[1] = props('H', 'T', cycle.T[1], 'P', cycle.P[1], fluid);
cycle.S[1] = props('S', 'T', cycle.T[1], 'P', cycle.P[1], fluid);

# 1 to 2 Compression of vapor
cycle.P[2] = pHigh;
H_i        = props('H', 'P', cycle.P[2], 'S', cycle.S[1], fluid);
cycle.H[2] = (H_i-cycle.H[1])/etaS + cycle.H[1];
cycle.T[2] = props('T', 'P', cycle.P[2], 'H', cycle.H[2], fluid);
cycle.D[2] = props('D', 'P', cycle.P[2], 'H', cycle.H[2], fluid);
cycle.S[2] = props('S', 'P', cycle.P[2], 'H', cycle.H[2], fluid);

# 2 to 3 Condensation
cycle.P[3] = cycle.P[2] - cond.P_drop;
cycle.T[3] = cond.T-cond.subCooling;
cycle.D[3] = props('D', 'P', cycle.P[3], 'T', cycle.T[3], fluid);
cycle.H[3] = props('H', 'P', cycle.P[3], 'T', cycle.T[3], fluid);
cycle.S[3] = props('S', 'P', cycle.P[3], 'T', cycle.T[3], fluid);

# 3 to 4 Expansion
cycle.H[4] = cycle.H[3];
cycle.P[4] = cycle.P[1] - evap.P_drop;
cycle.T[4] = props('T', 'P', cycle.P[4], 'H', cycle.H[4], fluid);
cycle.D[4] = props('D', 'P', cycle.P[4], 'H', cycle.H[4], fluid);
cycle.S[4] = props('S', 'P', cycle.P[4], 'H', cycle.H[4], fluid);

# Work and Energy
W_comp = mDot*(cycle.H[2] - cycle.H[1]);
Q_h    = mDot*(cycle.H[2] - cycle.H[3]);
Q_c    = mDot*(cycle.H[1] - cycle.H[4]);

# Display results
"Compressor power:"
W_comp to [W, BTU/h]
"Condenser heat out:"
Q_h    to [W, BTU/h]
"Evaporator heat in:"
Q_c    to [W, BTU/h]
"COP(cooling):"
evap_COP = Q_c/W_comp
"COP(heating):"
cond_COP = Q_h/W_comp
```
Shall return:

``` javascript
"R134a"
1 kg / minute
{"T": -20 degC, "P_drop": 0 Pa, "superHeating": 10 K}
{"T": 40 degC, "P_drop": 0 Pa, "subCooling": 10 K}
0.75
"Compressor power:"
[992.07276890481 W, 3385.0927978726 BTU / h]
"Condenser heat out:"
[3542.0178578852 W, 12085.866598173 BTU / h]
"Evaporator heat in:"
[2549.9450889803 W, 8700.7738003 BTU / h]
"COP(cooling):"
2.5703206144801
"COP(heating):"
3.5703206144801
```

# Additional features

Here is a similar project [Engineering-Solver](https://github.com/dvd101x/Engineering-Solver) that includes additional features:

* Text editor with syntax highlighting, find and replace, closing parenthesis, etc.
* Saves in the browser (you can continue where you left off)
* 9 workspaces, so you can try different things
* The interface doesn't freeze during big calculaitons (uses a webworker)
* A few more examples focused on the many features of mathjs

# References

* [Example of fluid properties function **props** and **phase**](http://coolprop.sourceforge.net/coolprop/HighLevelAPI.html#high-level-api)
* [List of fluids](http://coolprop.sourceforge.net/fluid_properties/PurePseudoPure.html#list-of-fluids)
* [List of fluid properties](http://www.coolprop.org/coolprop/HighLevelAPI.html#table-of-string-inputs-to-propssi-function)
* [Example of psychrometric function **HAprops**](http://coolprop.sourceforge.net/fluid_properties/HumidAir.html#sample-hapropssi-code)
* [List of psychometric properties](http://coolprop.sourceforge.net/fluid_properties/HumidAir.html#table-of-inputs-outputs-to-hapropssi)
* [List of units](https://mathjs.org/docs/datatypes/units.html#reference)
* [List of extra functions](https://mathjs.org/docs/reference/functions.html)
* [Syntax](https://mathjs.org/docs/expressions/syntax.html)

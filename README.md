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

``` python
# Vapor compression cycle
fluid = 'R134a'
mDot = 1 kg/minute

evap = {T: -20 degC, P_drop :0 Pa, superHeating : 10 K};
cond = {T: 40 degC, P_drop: 0 Pa, subCooling : 10 K};
etaS = 0.75;

T = [];P = [];D = [];H = [];S = [];

P_low = props('P','T',evap.T,'Q',1,fluid);
# Step 1 Between evaporator and compressor
P[1] = P_low;
T[1] = evap.T+ evap.superHeating;
D[1] = props('D','T',T[1],'P',P[1],fluid);
H[1] = props('H','T',T[1],'P',P[1],fluid);
S[1] = props('S','T',T[1],'P',P[1],fluid);
p_High = props('P','T',cond.T, 'Q',0,fluid);
# Step 2 Between compressor and condenser
P[2] = p_High;
H_i = props('H','P',P[2],'S',S[1],fluid);
H[2] = (H_i-H[1])/etaS + H[1];
T[2] = props('T','P',P[2],'H',H[2],fluid);
D[2] = props('D','P',P[2],'H',H[2],fluid);
S[2] = props('S','P',P[2],'H',H[2],fluid);
# Step 3 Between condenser and expansion
P[3] = P[2]-cond.P_drop;
T[3] = cond.T-cond.subCooling;
D[3] = props('D','P',P[3],'T',T[3],fluid);
H[3] = props('H','P',P[3],'T',T[3],fluid);
S[3] = props('S','P',P[3],'T',T[3],fluid);
# Step 4 Between expansion and evaporation
H[4] = H[3];
P[4] = P[1]-evap.P_drop;
T[4] = props('T','P',P[4],'H',H[4],fluid);
D[4] = props('D','P',P[4],'H',H[4],fluid);
S[4] = props('S','P',P[4],'H',H[4],fluid);

"\nCompressor's work:"
W_comp = mDot*(H[2]-H[1])
"\nCondenser heat out:"
Q_h = mDot*(H[2]-H[3])
"\nEvaporator heat in:"
Q_c = mDot*(H[1]-H[4])

"\nCOP(cooling):"
evap_COP = Q_c/W_comp
"\nCOP(heating):"
cond_COP = Q_h/W_comp
```
Shall return

``` javascript
2:	"R134a"
3:	1 kg / minute
39:	"
	Compressor's work:"
40:	992.07276890481 W
41:	"
	Condenser heat out:"
42:	3.5420178578852 kW
43:	"
	Evaporator heat in:"
44:	2.5499450889803 kW
46:	"
	COP(cooling):"
47:	2.5703206144801
48:	"
	COP(heating):"
49:	3.5703206144801
```

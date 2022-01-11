// Based on website but run directly from js
// http://www.coolprop.org/coolprop/HighLevelAPI.html#high-level-api

Module.PropsSI('T','P',101325,'Q',0,'Water') //373.124295847684
Module.PropsSI('H','P',101325,'Q',1,'Water') //2675529.3255007486
Module.PropsSI('H','P',101325,'Q',0,'Water') //419057.73309408233
Module.PropsSI('D','T|liquid',461.1,'P',5e6,'Water') //881.0008533347351
Module.PropsSI('D','T',597.9,'P|gas',5e6,'Water') //20.508496070579998
Module.PropsSI("Tcrit","",0,"",0,"Water") //647.096
Module.PropsSI('Phase','P',101325,'Q',0,'Water') //6
Module.PropsSI('C','P',101325,'T',300,'Water') //4180.635776555229
Module.PropsSI('d(Hmass)/d(T)|P','P',101325,'T',300,'Water') //4180.635776555229
Module.PropsSI('d(d(Hmass)/d(T)|P)/d(Hmass)|P','P',101325,'T',300,'Water') //-0.00007767989468032719
Module.PropsSI('d(Hmolar)/d(T)|sigma','P',101325,'Q',1,'Water') //28.427795995713694
Module.PropsSI('D','P',101325,'T',300,'Air.mix') //1.1766922904667523
Module.PropsSI('D','T',300,'P',101325,'HEOS::R32[0.697615]&R125[0.302385]') //2.9868867796357237
Module.PropsSI('H', 'T', 233.15, 'Q', 0, 'n-Propane') //105123.27213761592
Module.PropsSI("Dmolar", "T", 298.15, "P", 101325, "NH3") //41.3091396277897
Module.PropsSI("Hmolar", "T", 298.15, "P", 101325, "NH3") //28820.69621489391
Module.PropsSI("Smolar", "T", 298.15, "P", 101325, "NH3") //120.66066990509945
Module.PropsSI('C','T',298.15,'P',101325,'INCOMP::MEG-20%') //3905.2706242925874
Module.PropsSI('D','T',298.15,'P',101325,'Air') //1.1843184839089664
Module.PropsSI('T','P',101325,'Q',0,'Water') //373.124295847684
Module.PropsSI('H','T',273.15,'Q',1,'R134a') //398603.45362765493
Module.PropsSI('H','T',273.15,'Q',0,'R134a') //199999.988526145
Module.PropsSI('D','T',300,'P',101325,'HEOS::R32[0.697615]&R125[0.302385]') //2.9868867796357237
Module.PropsSI('D','T',300,'P',101325,'R410A') //2.986868076922677
Module.PropsSI('D','T',400,'Q',1,'IF97::Water') //1.3692496283046673
Module.PropsSI('D','T',400,'Q',1,'Water') //1.3694075410068192

// Based on website but run directly from js
// http://www.coolprop.org/fluid_properties/HumidAir.html#humid-air

Module.HAPropsSI('H','T',298.15,'P',101325,'R',0.5) //50423.45039102888
Module.HAPropsSI('T','P',101325,'H',50000,'R',1.0) //290.82601987578465
Module.HAPropsSI('T','H',50000,'R',1.0,'P',101325) //290.82601987578465
Module.HAPropsSI('H','T',298.15,'P',101335,'R',0.5) //50420.899958578375
Module.HAPropsSI('T','P',101335,'H',50000,'R',1.0) //290.827070344889
Module.HAPropsSI('T','H',50000,'R',1.0,'P',101335) //290.827070344889
Module.HAPropsSI('H','T',300.15,'P',101325,'R',0.5) //55710.860356099925
Module.HAPropsSI('T','P',101325,'H',50000,'R',0.9) //291.93845100465626
Module.HAPropsSI('T','H',50000,'R',0.8,'P',101325) //293.1733729304764

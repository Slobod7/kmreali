export const reviewed = '2026-11-14';
export const rankingSource = 'https://www.autovit.ro/blog/uploads/2025/10/AVT-brosura_gala-2025-small.pdf#page=14';
const adac = (file, page = 2) => `https://assets.adac.de/Autodatenbank/GWInfo/${file}-bericht.pdf#page=${page}`;
export const generalSource = 'https://assets.adac.de/image/upload/v1573463333/ADAC-eV/KOR/Text/PDF/gebrauchtwagenkauf-checkliste_jah0cu.pdf';
export const serviceSource = 'https://www.adac.de/rund-ums-fahrzeug/auto-kaufen-verkaufen/gebrauchtwagenkauf/kfz-kaufvertrag/';
export const skodaSource = 'https://www.skoda-auto.com/_doc/eb5dd7a6-8c4c-4376-a719-799ed4f87427#page=4';
const check = (id, title, text, extra = {}) => ({ id, title, text, kind: 'inspection', group: 'specific', ...extra });
export const models = [
  { id: 'bmw-3', name: 'BMW Seria 3', generation: 'F30 / F31 · 2012–2018', minYear: 2012, maxYear: 2018, fuel: 'Diesel', source: adac('gw0267-bmw-3er-reihe-2012-2018-diesel'), checks: [
    check('b3-suspensie', 'Arcuri, amortizoare și pierderi de ulei', 'ADAC semnalează probleme la ansamblurile arc–amortizor și pierderi de ulei. Cere verificarea lor pe elevator; zgomotele singure nu confirmă cauza.'),
    check('b3-egr', 'Campaniile pentru răcitorul EGR', 'Raportul descrie o campanie pentru anumite motoare diesel. Cere reprezentanței verificarea după VIN și dovada remedierii; nu toate exemplarele sunt afectate.', { group: 'documents' }),
  ] },
  { id: 'vw-golf', name: 'Volkswagen Golf', generation: 'VII · 2012–2020', minYear: 2012, maxYear: 2020, fuel: 'Diesel', source: adac('gw0260-vw-golf-vii-2012-2020-diesel', 1), checks: [
    check('g7-dsg', 'Plecare lină cu DSG', 'La proba de drum, urmărește dacă plecarea de pe loc este lină. ADAC recomandă atenție la smucituri; cere diagnoză înainte de a presupune o reparație.', { gearbox: 'auto' }),
    check('g7-frane', 'Frâne și ansambluri arc–amortizor', 'Raportul indică uzura frânelor și defecte ale arcurilor/amortizoarelor. Cere evaluarea uzurii și un deviz doar pentru lucrările constatate.'),
  ] },
  { id: 'bmw-5', name: 'BMW Seria 5', generation: 'F10 / F11 · 2010–2017', minYear: 2010, maxYear: 2017, fuel: 'Diesel', source: adac('gw0133-bmw-5er-reihe-2010-2017-diesel', 1), checks: [
    check('b5-punte', 'Jocuri la articulațiile punții față', 'ADAC evidențiază uzura articulațiilor față. Solicită verificare pe elevator, inclusiv a arcurilor și a burdufurilor planetarelor.'),
    check('b5-lant', 'Distribuția la dieselul cu patru cilindri', 'Raportul menționează alungirea lanțului la versiunile cu patru cilindri. Confirmă motorul și cere evaluare la service dacă apar zgomote; lipsa unei facturi nu înseamnă înlocuire obligatorie.'),
  ] },
  { id: 'audi-a4', name: 'Audi A4', generation: 'B9 · 2015–2024', minYear: 2015, maxYear: 2024, fuel: 'Diesel', source: adac('gw0369-audi-a4-2015-2024-diesel'), checks: [
    check('a4-punte', 'Prinderile suspensiei, arcurile și amortizoarele', 'ADAC menționează ocazional aceste puncte, fără a descrie o defecțiune inevitabilă. Cere inspectarea lor la service.'),
    check('a4-campanii', 'Campanii de siguranță după VIN', 'Raportul enumeră campanii pentru anumite scaune, airbaguri și pretensionatoare. Reprezentanța poate confirma dacă mașina este vizată și dacă intervențiile au fost făcute.', { group: 'documents' }),
  ] },
  { id: 'skoda-octavia', name: 'Škoda Octavia', generation: 'III · 2013–2020', minYear: 2013, maxYear: 2020, fuel: 'Diesel', source: adac('gw0235-skoda-octavia-2013-2020-diesel'), checks: [
    check('o3-arcuri', 'Arcurile suspensiei', 'Raportul semnalează arcuri rupte, în contextul rulajelor mari. Cere inspecție pe elevator; kilometrajul nu stabilește singur starea lor.'),
    check('o3-dsg', 'Smucituri la plecarea cu DSG', 'ADAC menționează plecări uneori sacadate. Notează comportamentul la manevre și cere evaluarea cutiei dacă observi nereguli.', { gearbox: 'auto' }),
  ] },
  { id: 'vw-passat', name: 'Volkswagen Passat', generation: 'B8 · 2014–2023', minYear: 2014, maxYear: 2023, fuel: 'Diesel', source: adac('gw0351-vw-passat-2014-2023-diesel', 1), checks: [
    check('p8-suspensie', 'Suspensia și frânele la un fost automobil de flotă', 'ADAC le identifică drept puncte de atenție, în contextul rulajelor frecvent mari. Cere verificarea stării, nu doar a istoricului de schimburi.'),
    check('p8-dsg', 'Comportamentul DSG la plecare', 'Raportul menționează plecări uneori neuniforme. Verifică manevrele lente și cere diagnoză dacă apar smucituri.', { gearbox: 'auto' }),
  ] },
  { id: 'mercedes-c', name: 'Mercedes-Benz Clasa C', generation: 'W205 / S205 · 2014–2021', minYear: 2014, maxYear: 2021, fuel: 'Diesel', source: adac('gw0358-mercedes-benz-c-klasse-2014-2023-diesel'), checks: [
    check('c205-punte', 'Prinderile și articulațiile suspensiei', 'Raportul ADAC observă unele probleme ale suspensiei. Include verificarea jocurilor la inspecția pe elevator.'),
    check('c205-om651', 'Campania întinzătorului de lanț, dacă motorul este OM651', 'ADAC descrie o campanie din 2015 pentru garnitura întinzătorului. Confirmă codul motorului și situația după VIN la reprezentanță; nu o extinde la toate dieselurile.', { group: 'documents' }),
  ] },
  { id: 'mercedes-e', name: 'Mercedes-Benz Clasa E', generation: 'W212 / S212 · 2009–2016', minYear: 2009, maxYear: 2016, fuel: 'Diesel', source: adac('gw0188-mercedes-benz-e-klasse-2009-2016-diesel', 1), checks: [
    check('e212-coroziune', 'Coroziunea cadrului punții spate', 'ADAC menționează suporturi ale punții spate afectate de rugină. Cere verificare pe elevator înainte de cumpărare; nu te baza pe aspectul caroseriei.'),
    check('e212-frana', 'Frâna de parcare și pierderile de ulei', 'Sunt puncte de atenție în raport. Cere verificarea funcționării frânei de parcare și localizarea eventualelor scurgeri la service.'),
  ] },
  { id: 'audi-a6', name: 'Audi A6', generation: 'C7 · 2011–2018', minYear: 2011, maxYear: 2018, fuel: 'Diesel', source: adac('gw0275-audi-a6-2011-2018-diesel'), checks: [
    check('a6-evacuare', 'Sistemul de evacuare', 'ADAC evidențiază evacuarea între punctele care merită atenție. Cere verificarea etanșeității și a stării pe elevator; nu deduce din aceasta că filtrul de particule trebuie schimbat.'),
  ] },
  { id: 'renault-megane', name: 'Renault Mégane', generation: 'III · 2008–2016', minYear: 2008, maxYear: 2016, fuel: 'Diesel', source: adac('gw0196-renault-megane-2008-2016-diesel'), checks: [
    check('m3-rulare', 'Direcție, planetare și suspensie', 'Raportul menționează articulațiile direcției, planetarele, prinderile suspensiei, arcurile și amortizoarele. Cere control pe elevator.'),
    check('m3-electric', 'Iluminare și frâne', 'ADAC semnalează probleme la aceste sisteme. Verifică luminile și solicită evaluarea frânelor; nu considera un martor stins drept verificare tehnică.'),
  ] },
  { id: 'skoda-superb', name: 'Škoda Superb · mașina autorului', generation: 'III · 2019–2020', minYear: 2019, maxYear: 2020, fuel: '2.0 TSI 272 CP', source: '/recenzii/skoda-superb-2020-pareri-proprietar/', checks: [
    check('s3-rece', 'Pornirea la rece și consumul de ulei', 'Ascultă pornirea la rece și întreabă cât ulei completează proprietarul. Zgomotele necesită evaluare; nu confirmă singure o problemă de distribuție.'),
    check('s3-pompa', 'Urme de antigel', 'Cere verificarea pompei de apă și a carcasei termostatului dacă vezi urme de lichid. Nu deschide vasul de expansiune cu motorul cald.'),
    check('s3-dsg', 'Schimbările 1–2 și diagnoza DSG', 'Probează manevrele lente și cere citirea modulului cutiei. O resetare a adaptărilor nu este dovada unei reparații.', { gearbox: 'auto' }),
    check('s3-4x4', 'Diagnoza modulului 4x4', 'Cere citirea modulului și verificarea funcționării cuplajului la service, plus inspectarea scurgerilor. Nu testa tracțiunea prin manevre riscante.', { drive: 'awd', source: '/recenzii/skoda-superb-4x4/' }),
  ] },
];
models.forEach((model, i) => { model.rank = i < 10 ? i + 1 : null; });

export const commonChecks = [
  check('vin', 'Seria de șasiu și actele originale', 'Compară seria de șasiu (VIN) de pe mașină cu talonul și cartea de identitate. Dacă vânzătorul nu e proprietarul din acte, cere o împuternicire scrisă.', { group: 'documents', source: generalSource }),
  check('autopass', 'Istoricul kilometrajului', 'Cere certificatul RAR Auto-Pass (42 de lei, numai pe site-ul RAR) și compară kilometrajul din el cu facturile de service. Certificatul arată kilometrajul înregistrat, nu și daunele.', { group: 'documents', source: 'https://www.rarom.ro/?p=298753' }),
  check('caroserie', 'Caroseria și urmele de intervenții', 'Caută diferențe de vopsea, rosturi neuniforme și coroziune. Cere explicații și o inspecție pentru zonele suspecte.', { group: 'inspection', source: generalSource }),
  check('anvelope', 'Anvelope, jante și uzură neuniformă', 'Examinează flancurile și uzura. Notează deteriorările pentru verificarea la service.', { group: 'inspection', source: generalSource }),
  check('pornire', 'Pornirea și funcționarea motorului', 'Observă pornirea, ralantiul, zgomotele și scurgerile vizibile. Cere diagnostic pentru orice anomalie.', { group: 'inspection', source: generalSource }),
  check('drum', 'Probă de drum', 'Urmărește schimbarea treptelor, direcția, vibrațiile și frânarea în condiții normale și sigure.', { group: 'inspection', source: generalSource }),
  check('dotari', 'Dotările promise în anunț', 'Probează climatizarea, luminile, geamurile și dotările prezentate de vânzător. Cere lista echipării originale.', { group: 'inspection', source: serviceSource }),
  check('service', 'Inspecție independentă înainte să semnezi', 'Programează controlul tehnic și cere constatări scrise, cu lucrările și costurile separate.', { group: 'inspection', source: serviceSource }),
];

export const serviceChecks = [
  { id: 'ulei', title: 'Ulei motor și filtre', text: 'Compară factura și kilometrajul ultimei revizii cu planul exact al mașinii. Completează intervalul confirmat de carnet sau service.', kind: 'service', group: 'maintenance', source: generalSource },
  { id: 'distributie', title: 'Planul distribuției', text: 'Identifică motorul și tipul distribuției. Introdu un interval numai dacă există în planul aplicabil; un lanț nu primește automat un termen de înlocuire.', kind: 'service', group: 'maintenance', source: generalSource },
  { id: 'cutie', title: 'Întreținerea cutiei automate', text: 'Identifică tipul exact al cutiei și planul de întreținere. Numărul treptelor sau denumirea comercială nu sunt suficiente.', kind: 'service', group: 'maintenance', gearbox: 'auto', source: generalSource },
];

export const haldex = { id: 'haldex', title: 'Uleiul cuplajului Haldex', text: 'Planul Škoda citat indică 3 ani. Confirmă aplicabilitatea după VIN; verifică factura și cere controlul sitei pompei.', kind: 'service', group: 'maintenance', intervalMonths: 36, source: skodaSource };

export const groups = [ ['documents', '01', 'Acte și istoric'], ['maintenance', '02', 'Ce întreținere urmează'], ['specific', '03', 'Atenție la modelul ales'], ['inspection', '04', 'La vizionare și pe drum'] ];

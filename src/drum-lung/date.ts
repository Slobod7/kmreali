// What the road-trip checklist (/pregatire-drum-lung/) says, and where each claim comes from.
// The checks are generic on purpose: the car's manual decides procedures and specifications.
// Country sheets were checked against the linked official pages on the date in `reviewed`.

import type { Condition, Engine } from './stare.ts';

export const reviewed = '2026-11-15';

export interface Link { label: string; url: string }

export const sources = {
  nhtsa: { label: 'NHTSA · pregătirea mașinii', url: 'https://www.nhtsa.gov/summer-driving-tips' },
  coolant: { label: 'Ford · verificarea lichidului de răcire (exemplu de procedură; urmează manualul tău)', url: 'https://www.ford.co.uk/support/how-tos/owner-resources/vehicle-maintenance/how-to-check-and-add-engine-coolant' },
  rac: { label: 'RAC · verificări înainte de drum', url: 'https://www.rac.co.uk/drive/advice/know-how/regular-car-checks/' },
  met: { label: 'Met Office · verificări pentru drum lung', url: 'https://weather.metoffice.gov.uk/warnings-and-advice/seasonal-advice/travel/vehicle-checks-to-make-before-a-long-journey' },
  michelin: { label: 'Michelin · presiunea corectă', url: 'https://www.michelin.ro/auto/sfat/presiune-anvelope/ce-presiune-in-anvelope' },
  cold: { label: 'Michelin · măsurarea presiunii', url: 'https://www.michelin.ro/auto/sfat/presiune-anvelope/umflare-anvelope' },
  tyres: { label: 'Continental · inspecția anvelopelor', url: 'https://www.continental-tires.com/tire-knowledge/tire-inspection-safety-checklist/' },
  eu: { label: 'Your Europe · reguli de circulație', url: 'https://europa.eu/youreurope/citizens/travel/driving-abroad/road-rules-and-safety/index_en.htm' },
  insurance: { label: 'Your Europe · permis și asigurare', url: 'https://europa.eu/youreurope/citizens/travel/driving-abroad/driving-licence-and-insurance/index_en.htm' },
  ro: { label: 'Poliția Română · OUG 195/2002, dotarea autovehiculului', url: 'https://bpr.politiaromana.ro/files/pages_files/OUG_195_actualizat_feb_2022.pdf' },
} satisfies Record<string, Link>;

export type SourceId = keyof typeof sources;

export const engineLabels: Record<Engine, string> = {
  petrol: 'Benzină',
  diesel: 'Diesel',
  hybrid: 'Hibrid',
  phev: 'Plug-in hybrid',
  ev: 'Electrică',
};

/** The tag on a check that applies only to some cars or trips. Shown when every check is listed (no JavaScript, print). */
export const conditionLabels: Partial<Record<Condition, string>> = {
  diesel: 'Doar diesel',
  plug: 'Electrică / plug-in',
  winter: 'Iarnă / munte',
  children: 'Cu copii',
  trailer: 'Cu remorcă',
};

export interface Country {
  id: string;
  name: string;
  /** Two-letter code on the buttons. */
  code: string;
  taxTitle: string;
  tax: string;
  taxLink: Link;
  /** A KM Reali guide about this country's road taxes, linked under the official page. */
  guide?: Link;
  gear: string;
  gearLink?: Link;
  tip: string;
  tipLinks?: Link[];
  /** The country's page in Your Europe: speeds, alcohol, lights and the rest. */
  rules: string;
}

const rules = (slug: string) => `https://europa.eu/youreurope/citizens/travel/driving-abroad/road-rules-and-safety/${slug}/index_en.htm`;

export const countries: Country[] = [
  {
    id: 'ro', name: 'România', code: 'RO', rules: rules('romania'),
    taxTitle: 'Taxe de drum',
    tax: 'Verifică rovinieta și taxele de pod de pe traseu, inclusiv la întoarcere.',
    taxLink: { label: 'CNAIR · e-rovinieta', url: 'https://www.erovinieta.ro/' },
    gear: 'Trusă medicală, două triunghiuri reflectorizante și stingător, omologate. Verifică starea și data de expirare.',
    gearLink: sources.ro,
    tip: 'Anvelopele de iarnă sunt obligatorii pe drumurile acoperite cu zăpadă, gheață sau polei.',
  },
  {
    id: 'bg', name: 'Bulgaria', code: 'BG', rules: rules('bulgaria'),
    taxTitle: 'Taxe de drum',
    tax: 'Verifică e-vinieta pentru rețeaua taxată: numărul de înmatriculare, categoria și perioada.',
    taxLink: { label: 'BG Toll · condiții e-vinietă', url: 'https://web.bgtoll.bg/Content/tc/termsandconditions.html?languageCultureName=en-GB' },
    gear: 'Vestă reflectorizantă, triunghi, trusă de prim ajutor și stingător sunt enumerate în ghidul oficial.',
    tip: 'Luminile sunt obligatorii și ziua. Verifică separat eventualele taxe de pod de la graniță.',
  },
  {
    id: 'hu', name: 'Ungaria', code: 'HU', rules: rules('hungary'),
    taxTitle: 'Taxe de drum',
    tax: 'Alege e-matrica pentru categoria mașinii și drumurile folosite. O vinietă de județ nu acoperă toată țara.',
    taxLink: { label: 'Nemzeti Útdíj · tarife e-matrica', url: 'https://nemzetiutdij.hu/en/e-vignette/tolls/e-vignette-rates' },
    guide: { label: 'Ce vinietă alegi și cât costă în 2027', url: '/ghiduri/vinieta-ungaria/' },
    gear: 'Ghidul oficial enumeră triunghiul de avertizare. Ține și vesta la îndemână pentru o oprire de urgență.',
    tip: 'Toleranță zero la alcool pentru șoferi. Luminile sunt obligatorii și ziua, în afara localităților.',
  },
  {
    id: 'at', name: 'Austria', code: 'AT', rules: rules('austria'),
    taxTitle: 'Taxe de drum',
    tax: 'Verifică vinieta și tronsoanele cu taxă separată, ca unele treceri prin Alpi. Vinieta digitală anuală sau de 2 luni cumpărată online e valabilă abia din a 18-a zi după cumpărare. Cea de 1 sau 10 zile și cea luată de la un punct de vânzare sunt valabile imediat.',
    taxLink: { label: 'Guvernul Austriei · vinieta până la 3,5 t', url: 'https://www.oesterreich.gv.at/en/themen/mobilitaet/kfz/10/Vignette-und-Maut/Vignette-fuer-Fahrzeuge-bis-3,5-t.html' },
    gear: 'Trusă de prim ajutor, triunghi de avertizare și vestă reflectorizantă sunt enumerate în ghidul oficial.',
    tip: 'Pentru autoturisme de până la 3,5 t, între 1 noiembrie și 15 aprilie se aplică regulile de echipare de iarnă când drumul are zăpadă, zăpadă topită sau gheață. Anvelopele de iarnă trebuie să aibă cel puțin 4 mm profil.',
    tipLinks: [
      { label: 'Guvernul Austriei · echipare de iarnă', url: 'https://www.oesterreich.gv.at/en/themen/mobilitaet/kfz/10/2/Seite.063100' },
      { label: 'Guvernul Austriei · profilul minim', url: 'https://www.oesterreich.gv.at/en/themen/mobilitaet/kfz/10/Seite.063320' },
    ],
  },
  {
    id: 'si', name: 'Slovenia', code: 'SI', rules: rules('slovenia'),
    taxTitle: 'Taxe de drum',
    tax: 'Verifică e-vinieta, clasa vehiculului și data de început în portalul DARS. Unele tronsoane au taxă separată.',
    taxLink: { label: 'DARS · portal e-vinietă', url: 'https://evinjeta.dars.si/selfcare/en' },
    gear: 'Consultă echipamentul și luminile cerute pentru mașina ta în fișa oficială de circulație.',
    tip: 'Verifică regulile de iarnă și limitele pentru categoria mașinii, mai ales dacă ai remorcă.',
  },
  {
    id: 'hr', name: 'Croația', code: 'HR', rules: rules('croatia'),
    taxTitle: 'Taxe de drum',
    tax: 'Pe rețeaua HAC, taxa depinde de distanță și de categoria mașinii. Verifică operatorul fiecărui tronson de pe traseu.',
    taxLink: { label: 'HAC · taxe de autostradă', url: 'https://www.hac.hr/en/toll' },
    gear: 'Verifică dotările obligatorii în fișa de circulație și ține echipamentul la îndemână.',
    tip: 'Verifică regulile de sezon și starea drumurilor înainte de plecare, inclusiv restricțiile pentru vânt.',
  },
  {
    id: 'gr', name: 'Grecia', code: 'GR', rules: rules('greece'),
    taxTitle: 'Taxe de drum',
    tax: 'Bugetează taxele pe tronsoane. Pe Egnatia Odos verifică stațiile și categoria la operator; celelalte autostrăzi au alți operatori.',
    taxLink: { label: 'Nea Egnatia Odos · stații de taxare', url: 'https://neodos.gr/en/stathmoi-diodion/' },
    gear: 'Ghidul oficial enumeră triunghi de avertizare, trusă de prim ajutor și stingător.',
    tip: 'Telefonul se folosește la volan numai cu sistem hands-free. Verifică limitele de viteză în fișa oficială, nu te baza pe cele de acasă.',
  },
  {
    id: 'it', name: 'Italia', code: 'IT', rules: rules('italy'),
    taxTitle: 'Taxe de drum',
    tax: 'Taxa depinde de traseul exact. Pe rețeaua Autostrade per l’Italia contează distanța și clasa mașinii.',
    taxLink: { label: 'Autostrade · cum se calculează taxa', url: 'https://www.autostrade.it/en/servizi-al-cliente/pedaggio/come-si-calcola-il-pedaggio' },
    gear: 'Vesta reflectorizantă și triunghiul de avertizare sunt enumerate în ghidul oficial.',
    tip: 'Luminile sunt obligatorii și ziua. Verifică regulile de iarnă pentru drumurile tale și zonele cu trafic limitat (ZTL) din orașe.',
  },
  {
    id: 'de', name: 'Germania', code: 'DE', rules: rules('germany'),
    taxTitle: 'Acces în orașe',
    tax: 'Dacă intri în orașe, verifică zonele de mediu și dacă mașina ta are nevoie de vigneta de emisii (Umweltplakette).',
    taxLink: { label: 'Umweltbundesamt · zone de mediu', url: 'https://www.umweltbundesamt.de/en/topics/air/particulate-matter-pm10/low-emission-zones-in-germany' },
    gear: 'Trusa de prim ajutor, triunghiul și vesta reflectorizantă sunt enumerate în ghidul oficial.',
    tip: 'Verifică marcajele acceptate pe anvelopele de iarnă și limitele afișate. Autobahn nu înseamnă automat fără limită de viteză.',
  },
];

export type CategoryId = 'car' | 'gear' | 'docs' | 'departure';

export const categories: { id: CategoryId; name: string; tab: string; number: string; intro: string }[] = [
  { id: 'car', name: 'Mașina', tab: 'Mașina', number: '01', intro: 'Începe cu ce poate transforma drumul într-o oprire la service.' },
  { id: 'gear', name: 'Echipamentul', tab: 'Echipamentul', number: '02', intro: 'Ce ai în mașină și cât de repede ajungi la el.' },
  { id: 'docs', name: 'Acte și asistență', tab: 'Acte', number: '03', intro: 'Pentru șofer, mașină și țările pe care le traversezi.' },
  { id: 'departure', name: 'În ziua plecării', tab: 'Plecarea', number: '04', intro: 'Ultima tură în jurul mașinii, înainte să pornești.' },
];

export interface Check {
  id: string;
  cat: CategoryId;
  title: string;
  short: string;
  steps: string[];
  /** Where the advice comes from; without one, the page points to the car's manual. */
  source?: SourceId;
  when: string;
  condition?: Condition;
  important?: boolean;
  /** A KM Reali page that helps with this check. */
  related?: { label: string; path: string };
}

export const checks: Check[] = [
  {
    id: 'oil', cat: 'car', condition: 'combustion', important: true, source: 'met', when: 'Cu câteva zile înainte',
    title: 'Nivelul și specificația uleiului',
    short: 'Verifică nivelul după procedura din manual. Nu completa la întâmplare.',
    steps: [
      'Parchează pe o suprafață plană. Respectă temperatura motorului și timpul de așteptare indicate de producător, apoi folosește joja sau măsurarea electronică.',
      'Completează doar cu ulei care respectă specificația motorului și fără să depășești nivelul maxim. Dacă observi pierderi sau consum neobișnuit, programează o verificare.',
    ],
  },
  {
    id: 'coolant', cat: 'car', important: true, source: 'coolant', when: 'Cu motorul rece',
    title: 'Lichidul de răcire și eventualele scurgeri',
    short: 'Controlează nivelul la rece. Nu deschide vasul când motorul este fierbinte.',
    steps: [
      'Verifică vasul de expansiune conform manualului și caută urme de scurgeri. Nu amesteca lichide cu specificații necunoscute.',
      'Scăderile repetate sau supraîncălzirea cer o verificare înainte de drum. La hibride și electrice, circuitele pot avea instrucțiuni speciale: nu interveni în sistemul de înaltă tensiune.',
    ],
  },
  {
    id: 'pressure', cat: 'car', important: true, source: 'michelin', when: 'Înainte de încărcare',
    title: 'Presiunea în anvelope, pentru mașina încărcată',
    short: 'Folosește valorile de pe eticheta mașinii, potrivite pentru pasageri și bagaje.',
    steps: [
      'Măsoară la rece și verifică toate roțile. Valorile recomandate sunt pe eticheta mașinii sau în manual și pot diferi între punți.',
      'Pentru încărcare mare, folosește valorile dedicate. Nu folosi presiunea maximă de pe flanc ca țintă. Resetează sau calibrează TPMS numai după procedura mașinii.',
    ],
  },
  {
    id: 'tread', cat: 'car', important: true, source: 'tyres', when: 'Cu câteva zile înainte',
    title: 'Profilul, flancurile și starea anvelopelor',
    short: 'Caută uzură neuniformă, tăieturi, crăpături, umflături și pierderi de presiune.',
    steps: [
      'Inspectează banda de rulare și flancurile și măsoară profilul cu un instrument potrivit. Verifică și partea interioară, cât poți vedea în siguranță.',
      'O umflătură sau o deteriorare vizibilă cere evaluare la un specialist înainte de drum. Verifică cerințele legale ale tuturor țărilor, inclusiv cele pentru iarnă.',
    ],
  },
  {
    id: 'brakes', cat: 'car', important: true, source: 'rac', when: 'La nevoie, la service',
    title: 'Frânele și lichidul de frână',
    short: 'Zgomote noi, vibrații sau o pedală neobișnuită? Rezolvă cauza înainte de drum.',
    steps: [
      'Dacă frânarea s-a schimbat, cere o inspecție. Verifică nivelul lichidului numai după instrucțiunile mașinii; un nivel scăzut nu se rezolvă doar prin completare.',
      'Confirmă în istoricul de service când trebuie verificat sau schimbat lichidul. Nu porni cu un martor de frână aprins sau cu o problemă de frânare nerezolvată.',
    ],
  },
  {
    id: 'service', cat: 'car', source: 'nhtsa', when: 'Cu 1–2 săptămâni înainte',
    title: 'Revizia și lucrările care ajung la termen',
    short: 'Adaugă și kilometrii de întoarcere când verifici următoarea scadență.',
    steps: [
      'Compară kilometrajul și timpul până la următoarea revizie cu întregul drum. Confirmă intervalele în planul de întreținere al mașinii.',
      'Dacă există o problemă cunoscută, programează service-ul din timp și lasă loc pentru o verificare după reparație.',
    ],
  },
  {
    id: 'battery', cat: 'car', source: 'nhtsa', when: 'Cu câteva zile înainte',
    title: 'Bateria de 12 V și pornirea',
    short: 'O pornire greoaie merită verificată înainte să pleci.',
    steps: ['Cere verificarea bateriei și a încărcării dacă ai simptome sau un istoric de descărcare. Și o mașină electrică are, de regulă, o baterie de 12 V.'],
  },
  {
    id: 'lights', cat: 'car', source: 'nhtsa', when: 'Cu o zi înainte',
    title: 'Faruri, stopuri și semnalizări',
    short: 'Probează toate luminile, inclusiv stopurile și lampa de marșarier.',
    steps: ['Roagă pe cineva să te ajute. Curăță farurile și reglează-le pentru mașina încărcată, conform manualului.'],
  },
  {
    id: 'wipers', cat: 'car', source: 'met', when: 'Cu o zi înainte',
    title: 'Ștergătoare și lichid de parbriz',
    short: 'Ai nevoie de vizibilitate bună pe tot traseul.',
    steps: ['Înlocuiește lamelele care lasă urme și completează lichidul de spălare potrivit temperaturilor de pe traseu. Curăță geamurile și pe interior.'],
  },
  {
    id: 'adblue', cat: 'car', condition: 'diesel', when: 'Cu câteva zile înainte',
    title: 'AdBlue, dacă mașina folosește acest sistem',
    short: 'Verifică autonomia și instrucțiunile de completare.',
    steps: ['Consultă manualul pentru lichidul acceptat, cantitate și procedură. Dacă apare un mesaj de defect al sistemului, cere diagnostic; completarea nu rezolvă orice avertizare.'],
  },
  {
    id: 'charge', cat: 'car', condition: 'plug', when: 'Când planifici traseul',
    title: 'Încărcarea și stațiile de rezervă',
    short: 'Planifică opririle după autonomia reală, vreme și încărcarea mașinii.',
    steps: [
      'Verifică mufele, aplicațiile și plata la operatorii de pe traseu. Alege și o alternativă pentru opririle esențiale.',
      'Confirmă în manual ce cabluri îți trebuie. La un plug-in hybrid, verifică și partea termică a mașinii.',
    ],
  },
  {
    id: 'winter', cat: 'gear', condition: 'winter', source: 'eu', when: 'Înainte de plecare',
    title: 'Anvelope și echipament pentru iarnă',
    short: 'Verifică marcajele acceptate, profilul și cerințele fiecărei țări.',
    steps: [
      'Țările au cerințe diferite, uneori după dată, alteori după starea drumului. Verifică și drumurile montane pe care mergi.',
      'Dacă ai nevoie de lanțuri, alege o dimensiune compatibilă și puntea permisă de manual. Exersează montarea într-un loc sigur înainte de plecare.',
    ],
  },
  {
    id: 'spare', cat: 'gear', source: 'cold', when: 'Cu câteva zile înainte',
    title: 'Roata de rezervă sau kitul de pană',
    short: 'Verifică presiunea rezervei sau termenul soluției din kit.',
    steps: [
      'Confirmă că ai un compresor funcțional sau sculele potrivite: cric, cheie și adaptorul pentru prezoanele antifurt, după caz.',
      'Citește limitele de utilizare ale rezervei sau kitului. Nu orice pană se repară cu soluție. Intervino numai într-un loc sigur; altfel cheamă asistența.',
    ],
  },
  {
    id: 'kit', cat: 'gear', source: 'ro', when: 'Cu o zi înainte',
    title: 'Trusă, triunghiuri, stingător și veste',
    short: 'Verifică dotarea obligatorie și ține vestele în habitaclu.',
    steps: [
      'Pentru România: trusă medicală, două triunghiuri reflectorizante și stingător, omologate. Verifică starea și data de expirare.',
      'Citește și cerințele țărilor de tranzit. Pune vestele la îndemână, ca să nu descarci portbagajul pe marginea drumului.',
    ],
  },
  {
    id: 'children', cat: 'gear', condition: 'children', source: 'eu', when: 'Înainte de încărcare',
    title: 'Scaunul copilului și instalarea lui',
    short: 'Verifică potrivirea, fixarea și regulile din toate țările traversate.',
    steps: ['Montează scaunul conform instrucțiunilor lui și ale mașinii. Verifică centurile și ancorările și nu lăsa obiecte grele nefixate în jur.'],
  },
  {
    id: 'trailer', cat: 'gear', condition: 'trailer', source: 'eu', when: 'Cu câteva zile înainte',
    title: 'Remorca: anvelope, cuplare și lumini',
    short: 'Verifică și masele admise, permisul, asigurarea și categoria de taxare.',
    steps: ['Urmează manualele pentru cuplare, sarcina pe cârlig și distribuirea încărcăturii. Confirmă limitele de viteză pentru ansamblul tău în fiecare țară.'],
  },
  {
    id: 'papers', cat: 'docs', source: 'insurance', when: 'Cu câteva zile înainte',
    title: 'Permis, talon, ITP și RCA',
    short: 'Verifică documentele și valabilitatea lor pentru tot drumul, inclusiv întoarcerea.',
    steps: [
      'Ia documentele acceptate de autoritățile de pe traseu. Confirmă valabilitatea asigurării și a permisului în fiecare țară.',
      'La o mașină închiriată, de firmă sau în leasing, verifică permisiunea de ieșire din țară și documentele cerute de proprietar sau de autorități.',
    ],
  },
  {
    id: 'assistance', cat: 'docs', source: 'insurance', when: 'Cu câteva zile înainte',
    title: 'Asistență rutieră și contacte',
    short: 'Salvează numărul de asistență și citește ce acoperă polița.',
    steps: [
      'Verifică țările acoperite, tractarea, eventualele limite și condițiile de continuare a drumului. RCA nu înseamnă automat asistență rutieră.',
      'Păstrează offline polița și numerele utile. Stabilește ce faci dacă mașina rămâne imobilizată departe de casă.',
    ],
  },
  {
    id: 'load', cat: 'departure', source: 'rac', when: 'La încărcare',
    title: 'Bagaje fixate și vizibilitate liberă',
    short: 'Respectă sarcina admisă și limitele portbagajului de plafon, dacă îl folosești.',
    steps: ['Pune obiectele grele jos și fixează-le. Nu lăsa în habitaclu obiecte care pot aluneca. Consultă manualul pentru sarcinile admise.'],
  },
  {
    id: 'route', cat: 'departure', source: 'nhtsa', when: 'În ziua plecării',
    title: 'Traseu, vreme și pauze',
    short: 'Planifică opriri și alternative, fără un program care te obligă să conduci obosit.',
    steps: [
      'Verifică închiderile, lucrările, prognoza și restricțiile pentru ruta reală. Salvează harta offline și ia suportul de telefon.',
      'Dacă apare somnolența, oprește într-un loc sigur. Timpul estimat de navigație nu include toate pauzele de care ai nevoie.',
    ],
  },
  {
    id: 'fuel', cat: 'departure', when: 'În ziua plecării',
    related: { label: 'Prețul carburanților în țările UE', path: 'preturi-carburanti-europa/' },
    title: 'Combustibil sau baterie pentru prima etapă',
    short: 'Pleacă cu o rezervă rezonabilă și o oprire de alimentare planificată.',
    steps: ['Verifică autonomia pentru prima etapă și alternativele de pe traseu. Ia în calcul traficul, frigul, relieful și consumul cu mașina încărcată.'],
  },
  {
    id: 'walk', cat: 'departure', important: true, source: 'met', when: 'Chiar înainte să pornești',
    related: { label: 'Ce înseamnă un martor de bord', path: 'martori-bord/' },
    title: 'O ultimă tură în jurul mașinii',
    short: 'Scurgeri, roți, lumini, uși, bagaje și martori de bord.',
    steps: [
      'Asigură-te că nu ai lăsat obiecte lângă roți sau pe mașină și că toate închiderile sunt sigure.',
      'Un martor roșu de presiune ulei, temperatură sau frână cere oprire în siguranță și consultarea manualului. Nu îl bifa ca rezolvat doar pentru că ai completat lista.',
    ],
  },
];

# Căutătorul de martori de bord

## Starea cercetării și limita termenului „verificat”

Actualizare de context: 14 noiembrie 2026. A fost făcută o cercetare substanțială în manuale și ghiduri ale constructorilor, cu verificarea secțiunilor relevante pentru intrările incluse. Nu a fost efectuat un audit exhaustiv al fiecărui detaliu și nici o validare tehnică independentă. Formularea anterioară „verificat” a fost prea categorică: intrările sunt confruntate cu surse într-o primă etapă de cercetare, nu certificate ca acoperire completă.

Înainte de publicare este necesară o a doua revizuire, simbol cu simbol, în special pentru culoare, contur, piață, echipare, combinații de martori și condițiile mesajelor. Marcajul de implementare `verified: true` controlează apariția în selector; nu este o certificare independentă a exactității. Testele automate confirmă structura datelor și funcționarea implementării, nu corectitudinea instrucțiunilor pentru șofer. Verificarea pe dispozitive fizice și cu cititoare de ecran reale rămâne deschisă.

### A doua revizuire (14 noiembrie 2026)

Intrările au fost recitite față de paginile citate, pentru toate mărcile în afară de Ford (9 intrări). Manualul Ford blochează descărcarea automată și nu a putut fi deschis. Corecturi aplicate:

- Fiat 500 `frana`: manualul cere oprirea imediată dacă martorul se aprinde în mers. Singura condiție lăsată este frâna de mână, pe care șoferul o poate verifica.
- Dacia Sandero `frana`: am eliminat afirmația că martorul confirmă frâna de mână. P. 79 are un martor separat pentru frâna de mână, iar p. 79 este acum citată.
- Audi `presiune-ulei`: acțiunea începe cu „nu continua drumul”, ca în manual. Continuarea este permisă doar după completare și stingerea martorului.
- Formularea „verificat” a fost scoasă din interfață, din descrierea paginii, din eticheta Tesla și din textul `detail` comun celor 176 de intrări. Au rămas doar mențiunile de domeniu, de tipul „neverificată aici”.

Corecturi mai mici, aplicate tot atunci:

- Toyota `anvelope`: acțiunea are avertizarea de oprire de pe p. 488, acum citată.
- Octavia `eco`: „toate motoarele Superb” a fost corectat în „Octavia”.
- Škoda `racire` (Superb, Octavia, Fabia): verificarea siguranței ventilatorului a fost mutată la mesajul de nivel scăzut, ca în manuale.
- Dacia și Renault `rezerva` indică autonomia de ~50 km din manual. Peugeot `incarcare` cere curățarea și strângerea bornelor (p. 13).
- „Cuplați centurile” a devenit „Cuplează centurile”, la persoana a II-a singular ca restul catalogului.

Rămân deschise Ford (sursă inaccesibilă) și cifrele „3–6 secunde” la airbagul Kia, ilizibile în fontul PDF-ului.

Ruta `/martori-bord/` folosește layout-ul, fonturile și navigarea KM Reali. Este accesibilă din Ghiduri. Articolul `martori-bord-skoda` e publicat din 26 noiembrie 2026 la `/ghiduri/martori-bord-skoda/`, iar instrumentul trimite înapoi către el.

## Interfața actuală

Selectoare dependente marcă → model → generație/ediție verificată, căutare fără diacritice după nume/formă și filtre de culoare. Hover sau focus cu Tab afișează o explicație; clicul, Enter sau atingerea o fixează. Escape sau Închide revine la simbol. Pe mobil, selecția aduce explicația în ecran.

La cererea utilizatorului, lista separată „Simbolurile, pe îndelete” a fost eliminată. Explicațiile și detaliile suplimentare sunt disponibile în panoul interactiv. Fiecare explicație are „Mai multe detalii”, link direct și referință la manual. Metadatele modelului, limitele, documentul-sursă și creditele sunt grupate în subsolul instrumentului, după panou. Fără JavaScript se afișează un mesaj scurt și rămâne accesibil manualul din subsol, fără o listă duplicată.

Legăturile existente rămân valabile: `?vehicul=<configurație>#martor-<configurație>-<martor>`. Ancora identifică acum butonul din bord; reîncărcarea deschide explicația corectă, inclusiv pe mobil. Un vehicul sau simbol necunoscut primește mesajul de acoperire lipsă.

## Date și extindere

- `src/data/martori/symbols.json`: numai identificare vizuală — nume, formă căutabilă, ilustrație. Fără instrucțiuni universale.
- `superb-3v-2018.json`: 38 de intrări; `octavia-5e-2018.json`: 37; `fabia-nj-2018.json`: 31. Fiecare fișier are domeniu, sursă și variații verificate separat.
- `src/data/martori/index.ts`: tipuri, registrul configurațiilor și descoperirea automată a fișierelor JSON și conversia paginii tipărite în pagina PDF. Numai înregistrările cu `verified: true` apar în selectoare.
- `MartoriFinder.astro`: panouri, șabloane de explicații și subsoluri, generate din registru.
- `src/scripts/martori-finder.ts`: selectoare, căutare, filtre, fixare, focus, linkuri și istoric.

La un model nou verifică manualul exact, adaugă un fișier propriu, citează paginile fiecărei intrări cu `verified: true`; registrul o descoperă automat. Nu copia automat instrucțiunile pe baza unei pictograme comune. ID-urile sunt stabile pentru partajare. Nu sunt create pagini sau opțiuni pentru mărci neacoperite.

Nu există afiliere. `detail` permite ulterior context editorial și recomandări relevante, verificate separat; instrucțiunea imediată rămâne distinctă.

## Manuale verificate

Cele trei manuale Škoda sunt ediții **11/2018 în limba română**, cu data și identificatorul confirmate pe ultima pagină. Verificare: 14 noiembrie 2026. Numerele afișate sunt paginile tipărite; linkurile PDF adaugă 2.

| Configurație | Document | Lămpi de control | Sursă |
| --- | --- | --- | --- |
| Superb III (3V) | 3V0012714AJ | p. 41–51 | https://ownersmanuals.blob.core.windows.net/ownersmanuals/ro/Superb_3V/11-2018/OwnersManual.pdf |
| Octavia III (5E) | 5E0012714AQ | p. 39–49 | https://ownersmanuals.blob.core.windows.net/ownersmanuals/ro/Octavia_5E/11-2018/OwnersManual.pdf |
| Fabia III (NJ) | 6V0012714AK | p. 37–45 | https://ownersmanuals.blob.core.windows.net/ownersmanuals/ro/Fabia_NJ/11-2018/OwnersManual.pdf |

Au fost citite secțiunile de martori, iar paginile cu reprezentările colorate au fost inspectate vizual. Au fost consultate și trimiterile relevante pentru lichide, service, presiuni anvelope, START-STOP și Lane Assist. Pentru Octavia: p. 57, 76, 209, 254–255, 259, 285–286; pentru Fabia: p. 52, 168, 197, 216–217. Referințele fiecărui martor sunt în datele configurației. PDF-urile nu sunt incluse în repository.

SHA-256 pentru fișierele descărcate:

- Superb (344 pagini): `f66fb6c90fc95b2cc09437f7d86242702f383c2e887219a384c60d242ef3d515`
- Octavia (352 pagini): `c1f4087df08e2219ba1e7947e0f24dbe08eb62a298d493b54ee5c64c640b5ac0`
- Fabia (276 pagini): `26c35e0770736a6371c95a17b007c4361af5c2560652d896c7d11187f0cc7f3b`

## Diferențe păstrate explicit

- Octavia și Fabia descriu frâna de mână și avertizarea sonoră peste 5 km/h. Mesajele de defecțiune ale frânei electrice Superb nu sunt transferate.
- La Fabia, avertizarea roșie a instalației de frână cere oprire și interzice continuarea, fără condiționare de ABS. Acțiunea nu este copiată de la Superb.
- Rezerva este aproximativ 6 litri pentru benzina/motorina Octavia și 7 litri pentru Fabia. Nu este o autonomie garantată.
- Pictograma cutiei automate Fabia este afișată numai pe MAXI DOT. Afișajul cu segmente poate folosi text abreviat.
- La Fabia, pagina 44 permite mersul foarte precaut la mesajul despre nivelul ridicat de ulei, dar pagina 216 interzice continuarea dacă nivelul măsurat este peste domeniul admis. Explicația menționează ambele și cere oprire/asistență dacă măsurarea confirmă depășirea.
- Fabia oferă memorarea presiunii din Infotainment sau din butonul dedicat, după verificarea și corectarea presiunilor. Nu este impusă o procedură a altui model.
- Auto Hold nu este adăugat la Octavia/Fabia. La Fabia nu sunt oferite Lane Assist, preîncălzire diesel, apă în motorină, plăcuțe, ECO sau Light Assist din lista Superb. Versiunile diesel Fabia nu sunt confirmate de acest catalog.
- Cheia de service Octavia poate însoți și verificarea rezervoarelor GNC. Mesajul distinge situațiile; nu este prezentată doar ca revizie obișnuită.
- Pentru check engine care clipește, aceste secțiuni nu dau o instrucțiune separată. Nu se extrapolează permisiunea de continuare.
- Galben nu este o permisiune generală de mers: anvelopele și nivelul uleiului pot cere mai întâi oprire. Roșu nu impune automat oprirea motorului la orice simbol.

## Limite

Cataloage parțiale, cu simbolurile neincluse enumerate în subsolul fiecărei configurații. Nu sunt desenate toate variațiile ACC, Front Assist sau ale altor funcții. Pozițiile și contururile sunt ilustrative. Ediția manualului nu confirmă automat toți anii de înmatriculare, toate piețele sau echipările. Alte generații și alte ediții de manual nu sunt confirmate; facelift-ul Superb III nu este extins automat.

Articolul original păstrează textul util și corecțiile de siguranță. Relatarea autorului despre bateria slabă și mesajul ACC rămâne o experiență personală, nu un diagnostic confirmat; verificarea mesajului și a meniurilor pe mașina autorului este încă necesară.

## Verificare

```sh
npm run build
node --test scripts/martori/check.test.mjs
```

Testele verifică integritatea datelor, prezența referințelor, existența ilustrațiilor, păstrarea formulărilor critice, diferențele dintre modelele adăugate, ancorele, șabloanele de explicații, mutarea metadatelor în subsol, eliminarea listei separate, sitemap-ul și evitarea unui link către draft în producție.

Revizuiește desktop și mobil: schimbarea modelelor și a sursei, focus cu Tab, selecție/Enter/atingere, Escape, căutare fără diacritice, culori, zero rezultate și resetare, reîncărcarea linkurilor de simbol și istoricul Înapoi/Înainte. Verificarea pe un telefon fizic și cu un cititor de ecran real rămâne distinctă de testarea în browser cu dimensiuni mobile.

Actualizarea cu trei modele a fost verificată în browser la 1440×1100, 390×844 și 320×740: schimbarea modelelor, sursele corecte, diferențele de conținut, „Mai multe detalii”, linkurile directe cu reîncărcare, istoricul Înapoi/Înainte, filtrele, căutarea după formă, resetarea și focusul cu Tab. Metadatele sunt în footer, lista separată lipsește și nu există depășire orizontală la dimensiunile mobile verificate. Build-ul de producție, toate cele șapte teste și verificarea diferențelor au trecut; fără erori în consola browserului.

## Extindere multi-marcă — 14.11.2026

La cererea utilizatorului: un model verificat per marcă majoră, păstrând cele trei Škoda existente. Sunt 22 mărci, 24 configurații și 290 intrări specifice vehiculului. Aceasta este prima tranșă multi-marcă; nu înseamnă toate mărcile sau toate modelele. Fiecare catalog este parțial, uneori doar 5–15 simboluri prioritare. Numai stările citate au fost verificate.

| Marcă | Model / ediție / piață | Intrări | Document și sursă |
| --- | --- | --- | --- |
| Audi | A4 · B9 · 2018 · SUA/Canada | 8 | [Audi A4 2018 · EN US · publicație originală Audi](https://manuals.startmycar.com/published/Audi-A4_2018_EN_US_8c22d5eedf.pdf) |
| BMW | Seria 3 Sedan · F30 · ediția X/2017 · SUA/Canada | 13 | [BMW AG 01402984107 – X/17](https://www.carmanualdb.com/files/BMW%203%20Series%202018%20%28F30%29%20Owners%20Manual.pdf) |
| Citroën | C3 · III · ediția 01/2017 · RO | 12 | [C3 · eGuide ed01-17 · ro-RO](https://service.citroen.com/ACddb/modeles/c3/eGuide_c3_c3n2_ed01-17/pdfs/9999_9999_045_ro-RO.pdf) |
| Dacia | Sandero / Stepway · III · manual oficial RO | 9 | [Dacia Sandero III · manual RO](https://cdn.group.renault.com/dac/ro/user-manuals/manual-utilizare-noul-sandero.pdf) |
| Fiat | 500 · 312 · ediția 06/2018 | 5 | [603.91.636 · 06.18](https://aftersales.fiat.com/eLumData/EN/00/150_500/00_150_500_603.91.636_EN_01_06.18_L_LG/00_150_500_603.91.636_EN_01_06.18_L_LG.pdf) |
| Ford | Focus · 2018 · SUA/Canada | 9 | [JM5J 19A321 AA · First Printing 201706](https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/2018-Ford-Focus-Owner-Manual-version-1_om_EN-US_09_2017.pdf) |
| Honda | Civic 5 uși Diesel · X · 2018 · Europa/UK | 9 | [32TGN6000 · 18 CIVIC 5D HUM DIESEL (KE KG)](https://www.honda.co.uk/content/dam/local/uk/cars/owners/manuals/2018%20Civic%205dr%20Diesel%20Owners%20Manual.pdf) |
| Hyundai | i30 · PD · manual 2025 · UK | 7 | [PDe 2025 en UK](https://dmassets.hyundai.com/is/content/hyundaiautoever/PDe_2025_en_UKpdf) |
| Kia | Sportage · NQ5 · 2026 · SUA | 8 | [Kia America ©2025 · Sportage 2026 NQ5](https://www.carmanualdb.com/files/Kia%20Sportage%202026%20%28NQ5%29%20Owners%20Manual.pdf) |
| Mazda | Mazda3 · III · manual 8FK1-EO-16E | 7 | [Mazda3 · 8FK1-EO-16E](https://owners-manual.mazda.com/gen/en/mazda3/mazda3_8fk1eo16e/contents/08070300.html) |
| Mercedes-Benz | Clasa C Sedan · W205 · 09/2018 · piața Germania | 15 | [Mercedes-Benz 2055844220Z102](https://static.oneweb.mercedes-benz.com/css-oom-assets/en-bd/pdf/mercedes-c-class-saloon-2018-september-w205-comand-owners-manual-1.pdf) |
| Nissan | Qashqai · J12 · 2024 · HR13DDT · UK | 7 | [Qashqai J12 E1 2024 · HR13DDT](https://www.nissan.co.uk/owners/car-repair/car-owner-manual/manuals/iom/qashqai/0j12/e1/2024/warning-lights-2.shtml) |
| Opel | Astra · K · ediția 03/2018 · EN | 7 | [ID-OASKOBSE1803-en · March 2018](https://public-servicebox.opel.com/OVddb/OV/en_AU/Astra_K/2016_2021/2018_75/manual_user/ID-OASKOBSE1803-en_17_online.pdf) |
| Peugeot | 308 · II (T9) · ediția 01/2018 | 8 | [308 · eGuide ed01-18 · en-GB](https://public.servicebox.peugeot.com/APddb/modeles/308n/eGuide_308n_308_ed01-18_dag/pdfs/9999_9999_226_en-GB.pdf) |
| Renault | Clio · V phase 2 · manual 1457-3 RO | 9 | [NU 1457-3 ROM](https://www.user-manual.renault.com/sites/renault/files/Clio_5_ph2_-_1457-3_ROM.pdf) |
| SEAT | Leon · III (5F) · MY18 · 11/2017 | 9 | [LEON 11 17 EN · MY18 W45](https://www.seat.com/datamanual-manual/leon/my18_w45/en-uk/LEON_11_17_EN.pdf) |
| Suzuki | Swift · manual 2018–2021 · Thailanda | 8 | [Swift · Suzuki Thailand · model year 2018–2021](https://www.suzuki.co.th/upload/file/manual/en/Suzuki_Swift_Model_year_2018-2021.pdf) |
| Tesla | Model 3 · manual online · UK · consultat 14.11.2026 | 8 | [Model 3 · Car Status · en_GB](https://www.tesla.com/ownersmanual/model3/en_gb/GUID-80B80D48-E3A9-4857-864B-F4CC9B56FD7E.html) |
| Toyota | Corolla · XI · 2018 · SUA/Canada | 8 | [OM02509U · COROLLA_TMMMS_TMMC_U](https://s3.amazonaws.com/toyota.site.p01/toyota/manuals/OM02509U/OM02509U.pdf) |
| Volkswagen | Golf · VIII · ghid 24.03.2025 · Irlanda | 8 | [Volkswagen Ireland · warning and indicator lamps · Golf 8 example](https://www.volkswagen.ie/en/owners-and-services/customer-information/warning-and-indicator-lamps/warning-and-indicator-lamps-for-combustion-vehicles.html) |
| Volvo | V40 · MY2018 · en-GB | 10 | [TP23288 · V40 MY18 en-GB](https://ldgsvccassets.blob.core.windows.net/pdfs/9c18fe608ce8c9acf22573f789cffd987ab726bc/V40_OwnersManual_MY18_en-GB_TP23288.pdf) |
| Škoda | Superb · III (3V) · manual 11/2018 | 38 | [3V0012714AJ](https://ownersmanuals.blob.core.windows.net/ownersmanuals/ro/Superb_3V/11-2018/OwnersManual.pdf) |
| Škoda | Fabia · III (NJ) · manual 11/2018 | 31 | [6V0012714AK](https://ownersmanuals.blob.core.windows.net/ownersmanuals/ro/Fabia_NJ/11-2018/OwnersManual.pdf) |
| Škoda | Octavia · III (5E) · manual 11/2018 | 37 | [5E0012714AQ](https://ownersmanuals.blob.core.windows.net/ownersmanuals/ro/Octavia_5E/11-2018/OwnersManual.pdf) |

Noile PDF-uri folosesc paginile din vizualizator (`pageNumbering: "pdf"`, offset 0), fără conversia necesară celor trei Škoda. Referințele fiecărui simbol sunt în `pages`. Manualele web au `format: "web"`, liste de pagini goale și `sourceUrl` pentru capitolul exact al simbolului; nu afișăm pagini inventate. `name` poate înlocui numele comun, de exemplu DSC, ESP sau VSC, fără a modifica simbolul împărțit cu alte modele.

Surse primare: publicații ale constructorilor, nu articole generale despre culori. BMW și Kia sunt copii ale manualelor producătorului pe CarManualDB; Audi este o copie pe StartMyCar. Proveniența și piața sunt indicate explicit. Volkswagen folosește ghidul oficial irlandez din 24.03.2025, care declară exemple bazate pe Golf 8; nu este prezentat drept manual complet sau acoperire a tuturor anilor Golf VIII. Tesla folosește manualul online en_GB, fără a deduce anul sau compatibilitatea tuturor versiunilor software. Mazda este legată de ediția 8FK1-EO-16E. Suzuki folosește ediția Thailanda, fără a confirma variantele europene. Honda este numai Civic diesel, Nissan este HR13DDT, iar avertizările E-tech Renault și HEV/PHEV Kia nu sunt extinse automat.

Diferențe păstrate în date și în teste: Honda cere reducerea consumatorilor și păstrarea motorului pornit la opriri temporare în avertizarea de încărcare; Opel cere oprirea motorului. Audi răcire distinge mesajul de nivel redus de mesajul care cere ralanti pentru răcire. Renault/Dacia răcire roșie cer ralanti 1–2 minute, apoi oprire dacă temperatura nu scade. Nissan MIL portocaliu continuu poate cere tractare sau deplasare limitată, în funcție de mesaj. La Suzuki, clipirea albastră a răcirii este o defecțiune; Volvo nu are simbol de presiune ulei pe toate motoarele. BMW confirmă explicit rateurile la check engine care clipește; instrucțiunea nu este transferată cataloagelor Škoda.

Pentru extindere: verifică sursa exactă și piața, citește și avertizările/combinațiile din capitol, inspectează reprezentarea simbolului, apoi creează fișierul vehiculului. Nu crea înregistrări dintr-o listă de mărci și nu copia automat `lights` de la un alt model. Pentru o sursă online care se actualizează, reconfirmă conținutul și data verificării. Recomandările de produse și afilierea rămân neadăugate.


Validarea extinderii multi-marcă: build de producție și 8 teste automate. Revizuire în browser la 1440×1100, 390×844 și 320×740; schimbarea tuturor celor 22 de mărci și verificarea sursei, numărului de simboluri și imaginilor; fără depășire orizontală. La 320 px, țintele simbolurilor măsurate sunt de cel puțin 59 px lățime. Au fost verificate tastatura (Tab/Enter/Escape), revenirea focusului, apăsarea pe mobil, reîncărcarea unui link Mercedes, căutarea „potcoava” la BMW, combinarea cu filtrul roșu, zero rezultate, resetarea și selecția neacoperită. Dispozitivele fizice și cititoarele de ecran reale rămân de verificat separat.

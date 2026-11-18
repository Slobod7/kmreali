# Mașini de familie 2026 — dosar de cercetare

Cercetare făcută pe 15 noiembrie 2026. Articol planificat: **Mașini de familie 2026 – cele mai bune alegeri sub 30.000 €**. Rândul 7 din planul de conținut (Best-X). Cuvinte-cheie: „masini de familie” (250/lună, TP 700) și „cea mai buna masina de familie” (20). Cifrele de volum vin din plan și nu au fost reverificate. Nota din plan: „Second list. Link Superb Combi / Kodiaq / Octavia Combi.”

Ruta propusă: `/topuri/masini-de-familie/`. Articolul continuă „Mașini fiabile” (`/topuri/masini-fiabile/`). Folosește aceleași surse de fiabilitate, aceeași metodă pentru prețurile de pe Autovit și același widget de căutare după buget.

Acesta e un dosar de lucru, nu articolul. Paginile surselor se pot schimba. Fișierul păstrează ce era publicat la data cercetării.

## 1. Regula de selecție (propunere)

Într-un articol despre mașini de familie, spațiul contează primul. Fiabilitatea servește doar ca filtru.

- **Lista:** model cu date din cel puțin două surse de fiabilitate și fără niciun rezultat slab.
- **Cu rezerve:** o singură sursă cu date pe model, sau o sursă slabă compensată de altele bune, sau o problemă de siguranță (Euro NCAP sub 4★).
- **Populare, dar slabe:** modele căutate de familii care ies slab într-o sursă fără compensare sau au un defect cunoscut și scump.
- **Ordinea în grup:** după spațiu (portbagaj și locuri), apoi după preț.

Regula e mai blândă decât la „Mașini fiabile”. Acolo un model avea nevoie de „bun” în cel puțin 2 surse. Diferența trebuie spusă în secțiunea „Cum am făcut lista”. Altfel, un cititor care vede Octavia aici, dar nu și în „Mașini fiabile”, nu înțelege de ce.

Praguri What Car? preluate din „Mașini fiabile”: în jur de 95% și peste înseamnă „bun”, 90–95% înseamnă „mediu”, iar ultimele locuri din clasă înseamnă „slab”. Pentru TÜV, „bun” sau „slab” înseamnă top 10 sau ultimele 10 la o grupă de vârstă. Altfel, compar cu media grupei de vârstă.

## 2. Surse și ce măsoară fiecare

| Sursă | Ce măsoară | Linkuri |
|---|---|---|
| TÜV-Report 2026 | defecte importante la ITP-ul german, pe grupe de vârstă | [TÜV SÜD: top/bottom pe vârste](https://www.tuvsud.com/de-de/publikationen/tuev-report/maengelzwerge-und-fehlerriesen), [TÜV Rheinland: metodă](https://www.tuv.com/press/en/press-releases/tuev_report_2026_en.html) |
| AUTO BILD, tabele TÜV 2026 pe model | același TÜV, procent pe model și pe vârstă + puncte slabe | [Octavia](https://www.autobild.de/artikel/skoda-octavia-gebraucht-tuev-report---schwachstellen-maengel-28080923.html), [Superb](https://www.autobild.de/artikel/skoda-superb-als-gebrauchtwagen-im-tuev-check-schwachstellen-maengel-staerken-28138413.html), [Kodiaq](https://www.autobild.de/artikel/skoda-kodiaq-tuev-report-2026-28172707.html), [Passat](https://www.autobild.de/artikel/vw-passat-tuev-check-2026--28274249.html), [Tiguan](https://www.autobild.de/artikel/vw-tiguan-im-tuev-check-2026--28280027.html), [Touran](https://www.autobild.de/artikel/vw-touran-im-tuev-check-2026--28264029.html) |
| ADAC Pannenstatistik 2026 | pane pe drum în 2025, mașini înmatriculate 2016–2023 | [raport](https://www.adac.de/rund-ums-fahrzeug/unfall-schaden-panne/adac-pannenstatistik-2026/), [comunicat](https://presse.adac.de/meldungen/adac-ev/technik/adac-pannenstatistik-2026.html) |
| What Car? Reliability Survey | defecte raportate de proprietari din UK, scor pe model | 2025 pe clase: [family cars](https://www.whatcar.com/news/most-reliable-cars-family-cars/n26149), [executive](https://www.whatcar.com/news/reliability-survey-most-reliable-executive-cars/n26150), [family SUVs](https://www.whatcar.com/news/reliability-survey-most-reliable-family-suvs/n26155), [large SUVs](https://www.whatcar.com/news/reliability-survey-most-reliable-large-suvs/n26156), [7 locuri](https://www.whatcar.com/news/reliability-survey-most-reliable-7-seaters/n26157); 2026: [mărci](https://www.whatcar.com/news/reliability-survey-most-reliable-cars-brands/n26159), [cele mai și cele mai puțin fiabile](https://www.whatcar.com/news/most-reliable-cars/n27337) |
| Euro NCAP | siguranță la impact, cu accent pe copii (scorul „child occupant”) | linkuri pe model în secțiunea 4 |
| Autovit | prețuri cerute în România, nu prețuri de vânzare | metoda în secțiunea 5 |
| Site-urile oficiale RO | prețuri de listă la mașini noi, cu TVA | secțiunea 6 |

**What Car?, anul ediției:** paginile pe clase sunt ediția 2025. Clasamentul pe mărci și lista „cele mai / cele mai puțin fiabile” (n27337) sunt ediția 2026, din septembrie–octombrie 2026. Fiecare cifră din articol trebuie etichetată cu anul corect. Vezi și problema din secțiunea 10.

**ADAC, cifre pe model:** articolul complet cere un cont gratuit, pe care nu l-am creat. Listele „cel mai bun / cel mai slab din clasă” sunt extrase din datele paginii publice. Pentru modelele care apar și în „Mașini fiabile” (Karoq, Ceed, Corolla, CX-5), cifrele pe model există deja în `masini-fiabile/date.json`.

**Euro NCAP:** ratingurile expiră după 6 ani. Expirat nu înseamnă nesigur, doar că testul e vechi și protocolul s-a înăsprit.

## 3. Fiabilitate pe model

Mediile TÜV 2026 pentru defecte importante, pe vârste: 2–3 ani 6,5%; 4–5 ani 10,0%; 6–7 ani 13,6%; 8–9 ani 18,3%; 10–11 ani 22,9%; 12–13 ani 28,4%.

### Tabel TÜV pe model (AUTO BILD, % defecte importante)

| Vârstă | Media | Octavia | Superb | Kodiaq | Passat | Tiguan | Touran |
|---|---|---|---|---|---|---|---|
| 2–3 | 6,5 | 6,9 | **9,6** | 6,6 | 6,9 | 5,7 | 6,8 |
| 4–5 | 10,0 | 10,1 | **12,1** | 8,1 | 11,9 | 7,3 | 8,3 |
| 6–7 | 13,6 | 12,4 | 13,4 | **8,7** | 13,2 | 9,6 | 11,4 |
| 8–9 | 18,3 | 16,5 | 17,3 | — | 17,8 | 19,7 | 14,2 |
| 10–11 | 22,9 | 20,6 | 24,8 | — | 28,6 | 24,0 | 24,2 |
| 12–13 | 28,4 | 31,5 | 29,6 | — | 32,2 | 27,0 | 27,2 |

Bugetul articolului acoperă în mare mașini de 2–9 ani.

### Matrice propusă (bun / mediu / slab / — fără date)

| Model | TÜV | ADAC | What Car? | Grup propus |
|---|---|---|---|---|
| Octavia Combi 4 (din 2020) | mediu (6,9 / 10,1, puțin peste media de vârstă) | — (în nicio listă) | mediu, 89,5% (2025) | lista, la limită |
| Octavia Combi 3 (2017–2019) | bun (12,4 la 6–7 ani, 16,5 la 8–9 ani, sub medie) | — | — | lista |
| Superb Combi 3 (2019–2023) | **slab** (loc 101/110 la 2–3 ani, 9,6%) | — | mediu, benzină 93,8%; diesel mai slab (33% cu defecte) (2025) | cu rezerve |
| Passat Variant B8 | mediu (6,9 / 11,9 / 13,2) | **bun** (pe lista celor mai bune din Mittelklasse) | mediu (loc 9 în clasa executive 2025, fără procent publicat; 82,2% în 2024) | lista |
| Corolla TS hibrid (din 2019) | — | mediu (anul 2023 pe lista slabă, bateria de 12 V) | bun, 96,5% (2025) | lista (ca în „Mașini fiabile”) |
| Ceed SW (2018–2025) | — (generația veche e slabă la 10–11 ani) | mediu | bun, 98,8% (2025) | lista, dar rară |
| Karoq | bun (loc 4 la 6–7 ani) | bun | bun, 95,5% | lista |
| Kodiaq 1 (2016–2024) | **bun** (loc 8 la 6–7 ani, 8,7%) | — | bun, diesel 97,8% (loc 2 la 7 locuri); benzină 92,2% (2025) | lista |
| Sportage 5 (din 2022) | bun (loc 8 la 2–3 ani, 4,0%) | — | bun, 96,5% benzină/hibrid (2025) | lista |
| Mazda CX-5 benzină | — | bun | bun, 98,4% | lista (portbagaj mic) |
| Tucson 4 (din 2021) | — | — | mediu, 94,3% (2025) | cu rezerve (o sursă) |
| Honda CR-V (2018–2023) | — | — | bun, 95,5% (2025) / 94,4% (2026) | cu rezerve (o sursă, puține anunțuri) |
| RAV4 hibrid (2019–) | — | **slab** (cel mai slab din Mittelklasse, 2017–2022, 12 V) | bun, 98,9% | cu rezerve |
| Tiguan 2 (2016–2024) | bun până la 7 ani (5,7 / 7,3 / 9,6), slab la 8–9 (19,7) | bun | **slab** în 2026: benzină 74,4%, al 8-lea cel mai slab model | cu rezerve |
| Hyundai Santa Fe 4 (2018–2024) | — | — | bun, 100% (2025) | cu rezerve (o sursă) |
| Touran 2 (din 2015) | bun (8,3 / 11,4 / 14,2) | bun | — | lista |
| Dacia Jogger (din 2022) | — (prea nouă) | — | mediu, 91,5%; 19% cu defecte, cutie/ambreiaj 14% (2025) | cu rezerve (Euro NCAP 1★) |
| Peugeot 5008 2 (2017–2024) | — | — | **slab** în 2026: 79,3%, 32% cu defecte, „cea mai slabă din gama Peugeot” | slabe |
| VW Sharan / Seat Alhambra | **slab** (loc 97 și 93 / 95 și 89 la 4–7 ani) | — | — | slabe |
| Ford S-Max | **slab** (loc 105 la 2–3 ani, 11,8%) | **slab** (2016–2018) | — | slabe |
| Citroën Berlingo | **slab** (locurile 86, 83, 75 la 6–11 ani) | — | — | slabe |
| Tiguan 3 (din 2024) | — | — | **slab**: 55,3%, ultimul în 2026 (64,2% în 2025) | slabe (prea nou pentru buget, dar merită spus) |
| Sportage 4 (2016–2021) | — | mediu | **slab**, 72,9% (2025) | slabe (ca în „Mașini fiabile”) |
| Dacia Duster | **slab** la 6–13 ani | — | — | slabe ca SH vechi; nouă e altă discuție |

Mărci, What Car? 2026: Suzuki 97,8 (loc 1), Honda 95,8, Kia 93,5 (7), Peugeot 92,8, Mazda 91,6, Dacia 91,2 (11), Skoda 90,6 (13), Hyundai 90,3, Toyota 89,7 (17), VW 85,9 (27).

### Ce verifici, pe model (pentru „**Atenție la:**”)

- **Octavia 3:** DSG cu 7 trepte la 1.4/1.5 TSI; consum de ulei la motoarele EA888 mai vechi. Mulți kilometri: mediana e 222.000 km.
- **Octavia 4:** sistemul multimedia (20% din defectele raportate la What Car?). Multe anunțuri sunt diesel foste de flotă sau ride-hailing, cu 160.000–300.000 km.
- **Superb 3:** arcuri, amortizoare și frâne (de aici vine scorul TÜV), plus pierderi de ulei. Toate se văd la o verificare înainte de cumpărare. Diesel: rata de defecte e mai mare la What Car?, iar reparațiile au fost mai scumpe.
- **Passat B8:** pierderi de ulei, discuri de frână, arcuri; ulei Haldex și DSG la 4Motion.
- **Kodiaq 1:** consum de ulei la 2.0 TSI; injectoare și turbo la diesel; brațe de suspensie. La primul ITP, pierderile de ulei sunt de două ori peste medie.
- **Tiguan 2:** DSG; dezactivarea cilindrilor la 1.5 TSI; cureaua de distribuție umedă la dieselul EA288.
- **Touran 2:** primele exemplare au cea mai bună impresie generală la AUTO BILD. Verifică rechemările pentru direcție, risc de incendiu și airbag după VIN.
- **Corolla / RAV4:** testul bateriei de 12 V (vezi secțiunea Toyota din „Mașini fiabile”). Remedierile Toyota din februarie 2024 nu se văd încă în datele ADAC pe 2025.
- **Jogger:** cutie și ambreiaj; 43% dintre mașinile cu defecte n-au mai putut fi conduse, iar 58% au stat în service peste o săptămână (What Car? 2025).
- **Sportage 5:** garanția Kia de 7 ani / 150.000 km poate fi încă activă. Verifică data primei înmatriculări și condițiile de transfer (neverificate aici).

## 4. Spațiu și siguranță

Portbagaj VDA, cu 5 locuri, spătarele ridicate. Am trecut sursa acolo unde cifra nu vine direct de la producător.

| Model | Portbagaj (L) | Cu 7 locuri (L) | Euro NCAP |
|---|---|---|---|
| Octavia Combi 3 | 610 | — | 5★ 2013 (neverificat aici), expirat |
| Octavia Combi 4 | 640 (1.700 max.) | — | [5★ 2019](https://www.euroncap.com/assessments/skoda/octavia/0785/): adult 92, copil 88; testată pe Combi; expirat 1.01.2026 |
| Superb Combi 3 | 660 (1.950) | — | 5★ (2015, expirat); generația nouă [5★](https://www.euroncap.com/assessments/skoda/superb/1022/) (93/87) |
| Passat Variant B8 | 650 (1.780) — VW Japonia, Motor1 | — | 5★ (2014, expirat) |
| Corolla Touring Sports | 598 (1.8) / 581 (2.0) | — | [5★ 2019](https://www.euroncap.com/assessments/toyota/corolla/0762/), expirat |
| Ceed SW | 625 (600 în comunicatul de lansare) — recenzii UK | — | [4★ standard / 5★ cu pachet](https://www.euroncap.com/assessments/kia/ceed/0757sp/) |
| Karoq | 521 (479–588 cu VarioFlex) | — | [5★ 2017](https://www.euroncap.com/assessments/skoda/karoq/0697/), expirat |
| Kodiaq 1 | 720 | 270 | [5★ 2017](https://www.euroncap.com/assessments/skoda/kodiaq/0669/), expirat; Kodiaq 2 [5★ 2024](https://www.euroncap.com/en/results/skoda/kodiaq/51924) |
| Sportage 5 | 591 (benzină); 540 PHEV | — | [5★ 2022](https://www.euroncap.com/assessments/kia/sportage/0951/), copil 86 |
| Tucson 4 | 620 (benzină); 577 hibrid — Carbuyer, Auto Express | — | [5★ 2021](https://www.euroncap.com/assessments/hyundai/tucson/0895/), copil 87 |
| Tiguan 2 | 520–615 (banchetă culisantă) — Parkers | — | 5★ 2016 (neverificat aici), expirat |
| RAV4 hibrid | ~580 (neverificat) | — | [5★ 2019](https://www.euroncap.com/assessments/toyota/rav4/0764/), expirat |
| Santa Fe 4 | ~625 cu rândul 3 pliat (sursele diferă) | ~130 (neconfirmat) | [5★ 2018](https://www.euroncap.com/assessments/hyundai/santa-fe/0731/), 94% adulți / 88% copii, expirat la 1 ian. 2025 |
| Touran 2 | 743 | 137 | 5★ 2015; [4★ la retestarea din 2022](https://www.euroncap.com/assessments/vw/touran/0914/), 77% adulți / 81% copii |
| Dacia Jogger | 708 | 160 | [**1★** 2021](https://www.euroncap.com/assessments/dacia/jogger/0947/): fără avertizare de centură pe rândul 3, frânarea automată nu vede pietoni și bicicliști |
| Dacia Bigster | 667 (mild hybrid 140); 546 (hybrid 155) | — | [3★ 2024](https://www.euroncap.com/assessments/dacia/bigster/1144/): adult 69, copil 85 |
| Dacia Duster 3 | — | — | [3★ 2024](https://www.euroncap.com/assessments/dacia/duster/0712/) |
| Peugeot 5008 (generația 2025) | — | — | [4★](https://www.euroncap.com/assessments/peugeot/5008/1191/) |

Surse pentru cifrele nepreluate de la producător: [Passat — Motor1](https://www.motor1.com/news/47901/2015-volkswagen-passat-officially-revealed/), [Sportage — Kia Europa](https://press.kia.com/eu/en/home/media-resouces/press-releases/2021/The-all-new-Sportage.html), [Tucson — Carbuyer](https://www.carbuyer.co.uk/hyundai/tucson/practicality), [Tiguan — Parkers](https://parkers.co.uk/volkswagen/tiguan/estate/review/practicality), [Ceed SW — lansare Kia](https://press.kia.com/eu/en/home/media-resouces/press-releases/2018/Kia_Ceed_Sportswagon_makes_world_debut.html) și [Honest John](https://www.honestjohn.co.uk/carbycar/kia/ceed-sw), [Santa Fe — CarAdvice](https://www.caradvice.com.au/news/2018-hyundai-santa-fe-revealed-2/).

Nu au fost verificate: ISOFIX pe rândul 3 și trei scaune de copil pe banchetă, pe fiecare model. Dacă articolul promite asta, trebuie verificat din manualele de utilizare.

## 5. Prețuri SH, Autovit (15 noiembrie 2026)

**Metoda:** anunțurile sunt ordonate după preț crescător, câte 32 pe pagină. Mediana e anunțul de pe poziția floor(N/2), iar P10 e cel de pe poziția floor(0,1·N). Kilometrajul median vine din aceeași poziție, cu ordonare după kilometraj. Sunt prețuri cerute, nu prețuri de vânzare.

| Model | Ani | Anunțuri | P10 € | Mediană € | Km median |
|---|---|---|---|---|---|
| Octavia Combi 4 | 2021–2023 | 149 | 12.450 | 15.780 | 162.000 |
| Octavia Combi 3 | 2017–2019 | 112 | 7.350 | 9.390 | 222.000 |
| Superb Combi 3 | 2019–2022 | 60 | 12.700 | 17.490 | 161.000 |
| Passat Variant B8 | 2019–2022 | 105 | 12.500 | 15.500 | 182.000 |
| Corolla TS hibrid | 2019–2022 | 79 | 14.990 | 16.974 | 128.000 |
| Ceed SW | 2018–2022 | 15 | 7.999 | 11.988 | 151.000 |
| Kodiaq 1 | 2018–2021 | 135 | 15.990 | 19.550 | 171.000 |
| Kodiaq 1, 7 locuri declarate | 2018–2021 | 18 | 15.950 | 19.370 | 193.000 |
| Tiguan 2 | 2018–2021 | 231 | 14.999 | 18.500 | 168.000 |
| Touran 2 | 2016–2020 | 25 | 7.699 | 11.890 | 213.000 |
| Dacia Jogger | 2022–2024 | 67 | 9.899 | 12.501 | 86.000 |
| Peugeot 5008 2 | 2018–2021 | 58 | 10.890 | 13.190 | 167.000 |
| Hyundai Santa Fe 4 | 2018–2020 | 23 | 16.490 | 19.990 | 158.000 |

Preluate din „Mașini fiabile” (Autovit, 31 octombrie – 10 noiembrie 2026):

| Model | Ani | Anunțuri | P10 € | Mediană € | Km median |
|---|---|---|---|---|---|
| Karoq | 2018–2021 | 90 (92 pe 15.11) | 13.500 | 16.990 | 155.000 |
| Sportage 5 | 2022–2024 | 116 | 16.990 | 22.290 | 103.000 |
| Tucson 4 | 2021–2023 | 217 | 17.890 | 22.491 | 100.000 |
| RAV4 hibrid | 2019–2021 | 50 | 19.900 | 24.999 | 149.000 |
| CX-5 benzină | 2017–2021 | 32 | 15.950 | 19.900 | 120.000 |
| CR-V | 2018–2022 | 25 | — | 22.850 | — |

**Observații:**

- **Kodiaq 7 locuri:** numai 18 anunțuri completează câmpul de locuri. Numărul real e probabil mai mare. Cititorul trebuie să verifice rândul 3 în poze.
- **Jogger:** aproape toate anunțurile sunt benzină sau GPL. Are cel mai mic kilometraj median din listă.
- **Octavia Combi 4 și Passat:** au kilometraje mari pentru vârstă. Merită o frază despre mașinile foste de flotă.

## 6. Mașini noi sub 30.000 € (prețuri oficiale cu TVA, 15 noiembrie 2026)

| Model | Preț de la | Notă | Sursă |
|---|---|---|---|
| Dacia Duster essential ECO-G 120 | 19.500 € | 3★ NCAP | [dacia.ro](https://www.dacia.ro/preturi-de-lista.html) |
| Dacia Jogger 5 locuri essential | 19.000 € | 1★ NCAP | idem |
| Dacia Jogger 7 locuri expression TCe 110 / ECO-G 120 | 20.950 € | după reducere de 500 € | idem |
| Dacia Jogger 7 locuri hybrid 155 | 26.150 € (expression) / 27.550 (extreme) / 28.050 (journey) | | idem |
| Dacia Bigster essential mild hybrid-G 140 | 23.350 € | după reducere de 369 €; 3★ NCAP | idem |
| Dacia Bigster hybrid 155 expression | 28.650 € | portbagaj 546 L | idem |
| Dacia Striker | de la 21.900 € | crossover break nou, ~600 L, livrări din 2027 | idem |
| Kia Sportage 1.6 T-GDI 6MT Urban | 26.308 € | după promoție de 6.000 € (listă 32.308), valabilă până pe 30.11.2026; DCT 27.806 € | [kia.ro](https://www.kia.ro/modele/sportage) |
| Toyota Corolla Touring Sports | 26.869 € | după promoție (listă 28.584) | [toyota.ro](https://www.toyota.ro/new-cars) |
| Skoda Octavia Combi | 27.933 € | | [skoda.ro](https://www.skoda.ro/models/overview) |
| Toyota Proace City Verso | 28.581 € | furgonetă cu locuri | toyota.ro |

Peste buget: Karoq 30.813 €, Corolla Cross 33.329 €, Sportage HEV de la 30.790 € (după promoție), Elroq 36.444 €, Superb Combi 37.756 €, Kodiaq 40.067 €, RAV4 43.128 €.

Nu am obținut: prețul Hyundai Tucson nou. Pe hyundai-motor.ro tabelele nu s-au încărcat, iar „noul Tucson 2027” e deja anunțat. Kia Ceed nu se mai vinde nouă în România (a fost înlocuită de K4).

**Promoția Sportage:** expiră pe 30 noiembrie. Dacă articolul apare după această dată, prețul trebuie reverificat sau scris ca preț de listă.

## 7. Lista scurtă propusă

### Break

1. **Superb Combi 3 (2019–2022), cu rezerve:** cel mai mare portbagaj (660 L) și cel mai mult loc în spate. Mediana e 17.490 €. Scorul slab la TÜV vine din suspensie și frâne, care se verifică la cumpărare. Aici se leagă recenzia autorului.
2. **Passat Variant B8 (2019–2022):** 650 L, mediana 15.500 €, ADAC bun. Mulți kilometri.
3. **Octavia Combi 4 (2021–2023):** 640 L, mediana 15.780 €. Fiabilitate medie, fără scoruri slabe.
4. **Octavia Combi 3 (2017–2019):** 610 L, mediana 9.390 €. Bună la TÜV la vârsta asta. Varianta cea mai ieftină.
5. **Corolla Touring Sports hibrid (2019–2022):** 598 L, mediana 16.974 €, cel mai mic kilometraj dintre breakuri. Verifică bateria de 12 V.
6. **Ceed SW (2018–2022):** 625 L, mediana 11.988 €, dar are doar 15 anunțuri.

### SUV de familie

1. **Kodiaq 1 (2018–2021):** 720 L, mediana 19.550 €. Bun la TÜV și la What Car?. Cel mai bun SUV de familie din buget.
2. **Sportage 5 (2022–2024):** 591 L, mediana 22.290 €. Garanția de 7 ani poate fi încă activă. Nou se vinde la 26.308 € cu promoție.
3. **Karoq (2018–2021):** 521 L, mediana 16.990 €. Bun în toate cele trei surse, dar portbagajul e mic pentru o familie cu cărucior.
4. **Cu rezerve:** Tiguan 2 (What Car? 2026), Tucson 4 (o singură sursă), RAV4 hibrid (ADAC, bateria de 12 V), CR-V (o sursă, puține anunțuri), CX-5 (fiabil, dar portbagaj ~506 L, neverificat).

### 7 locuri

1. **Kodiaq 1 cu 7 locuri:** 270 L cu toate locurile ocupate, mediana 19.370 €.
2. **Touran 2 (2016–2020):** 743 / 137 L, mediana 11.890 €. Bun la TÜV și ADAC. Cel mai practic monovolum.
3. **Jogger, cu rezerve:** cel mai ieftin cu 7 locuri, nou de la 20.950 €, SH 12.501 €. Euro NCAP 1★ trebuie spus clar.
4. **Santa Fe 4, cu rezerve:** 100% la What Car?, dar e singura sursă. Mediana 19.990 €.

### Populare, dar slabe

Peugeot 5008 2, VW Sharan / Seat Alhambra, Ford S-Max, Citroën Berlingo, Kia Sportage 2016–2021, Tiguan 3 (din 2024), Dacia Duster SH de peste 6 ani.

## 8. Ce trebuie schimbat pe site

- **`src/widgets-plugin.ts`, câmpul `tip` din `Offer`:** acum acceptă `'mica' | 'compacta' | 'suv'`. Pentru filtrele articolului trebuie adăugate `'break'` și `'7locuri'`. Altă variantă e un câmp separat `locuri: 7`, pentru că un Kodiaq e și SUV, și 7 locuri. Recomand câmpul separat: un filtru „7 locuri” care se poate combina cu tipul.
- **`date.json` nou** în folderul articolului, cu aceleași chei ca la „Mașini fiabile”. Modelele comune pot fi copiate cu tot cu sursele lor.
- **Fotografii de card:** `public/foto/masini-de-familie/`, 400×225, din Wikimedia Commons cu credit. Karoq, Sportage, Tucson, RAV4, CX-5 și CR-V există deja în `public/foto/masini-fiabile/` și pot fi refolosite.
- **Fotografii din recenzia Superb:** `skoda-superb-2020-portbagaj.webp` și `skoda-superb-2020-spatiu-spate.webp` pot ilustra secțiunea despre spațiu. Mașina autorului e liftback, nu Combi, iar asta trebuie scris în legendă.

## 9. Linkuri interne

- Recenzia Superb: `/recenzii/skoda-superb-2020-pareri-proprietar/`
- `skoda-superb-4x4` (iarna, munte)
- `skoda-superb-sportline-vs-laurin-klement-vs-style` (echipări)
- `/topuri/masini-fiabile/`
- `/verificare-masina-sh/` (checklistul de cumpărare)
- Recenzia Kodiaq: încă nu există, linkul se adaugă când apare.

## 10. Probleme deschise

- **De la autor:** experiența cu Superb-ul ca mașină de familie (scaune de copil, bagaje, drumuri lungi) și eventual fotografii proprii.
- **De decis:** Superb Combi în „cu rezerve” sau în „lista” cu o explicație. După regula de mai sus iese cu rezerve.
- **„Mașini fiabile”, etichetarea What Car?:** articolul publicat scrie „What Car? 2026 / octombrie 2026”, dar majoritatea scorurilor pe model vin din paginile pe clase din 2025. Exemplu: Vitara apare cu 95,4% (2025), iar în lista 2026 are 97,6%. Trebuie corectat separat, fie anul din etichete, fie cifrele.
- **Neverificate:** cifrele ADAC pe model pentru Octavia, Superb, Kodiaq, Passat, Touran, Tiguan; prețul Tucson nou; portbagajele RAV4, CX-5 și Santa Fe; analiza SERP (DuckDuckGo a cerut CAPTCHA, Bing a dat rezultate irelevante).
- **5008:** dacă articolul pomenește cureaua umedă PureTech, trebuie o sursă. Scorul What Car? ajunge singur pentru grupul „slabe”.

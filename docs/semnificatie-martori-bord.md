# Martorii de bord pe culori — dosar de cercetare

Cercetare făcută pe 28 noiembrie 2026 pentru articolul **Martorii de bord – ce înseamnă fiecare culoare și când trebuie să oprești** (`/ghiduri/semnificatie-martori-bord/`).

Acesta e un dosar de lucru, nu articolul.

## 1. De ce articolul

Ahrefs, Google România, 28 noiembrie 2026 (export în `docs/ahrefs-rezultate-2026-11-28.tsv`):

| Cuvânt cheie | Volum lunar | KD |
| --- | --- | --- |
| martori bord | 6.200 | 0 |
| semnificatie martori bord | 1.900 | 0 |
| martor bord | 900 | 0 |
| semne bord masina | 700 | 0 |
| poza cu toti martorii din bord | 700 | 0 |
| martor ulei | 400 (parent „martori bord ulei”, 1.200) | 0 |
| martor esp | 200 | 0 |
| toti martorii din bord, simboluri bord auto | 200 fiecare | 0 |
| martor epc, martor motor galben, martor airbag, martor baterie | 150 fiecare | 0 |

Slug-ul `semnificatie-martori-bord` ține articolul separat de căutătorul `/martori-bord/` (instrument, nu articol). Cererea anterioară a lui Bogdan rămâne respectată: lista lungă de simboluri nu se pune înapoi în căutător; articolul e o pagină separată.

## 2. Ce fac paginile care se clasează acum

Citite pe 28 noiembrie 2026 (autogedal.ro a refuzat cererea, HTTP 403):

- **autovit.ro**, „Martorii de bord - ce semnifică fiecare…” (11 noiembrie 2019): 55 de martori pe culori, câte o imagine pe simbol, fără surse; ABS, plăcuțele și airbagul trecute la roșu, fără diferența continuu / clipire.
- **ro.cebia.com**, „Martori bord ✅ Roșii, galbeni, verzi…” (14 octombrie 2026): ~20 de martori pe culori, explică clipirea (ESP normal în curbă), trimite la manualul Dacia; tabel parțial, CTA de vânzare.
- **vrom.ro**, „Semnificatie martori bord +30 de marci auto”: ~90 de intrări, dar tabelele sunt de Audi prezentate ca generale; „oprește imediat la orice roșu”; fără surse.

Ce nu face niciuna: o singură imagine cu toate simbolurile, o sursă pentru regulile de culoare, o comparație între manuale, diferența explicită „galben, dar oprești” (anvelope, motor care clipește).

## 3. Culorile: Regulamentul ONU nr. 121

Sursa citită: [EUR-Lex, CELEX 42016X0108(01)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:42016X0108(01)), JO L 5, 8.1.2016, „Incorporating all valid text up to: 01 series of amendments — Date of entry into force: 15 June 2015”. Pe unece.org PDF-urile au răspuns 403 la cererea automată.

- **5.3.5:** un martor nu se aprinde decât pentru defecțiunea sau starea pentru care e făcut sau „during a bulb check” → testul de la contact.
- **5.4.1:** culoarea fiecărui martor din tabel e cea din coloana 5.
- **5.4.2:** martorii care nu sunt în tabel pot avea orice culoare, după „paragraph 5 of standard ISO 2575:2004”.
- **Nota (20)** la tabel (faza lungă, combustibil, presiunea uleiului, temperatura lichidului de răcire, încărcarea): simbolul poate apărea și în alte culori „to convey different meanings according to the general colour coding” din ISO 2575 → termometrul albastru.
- **Clipirea:** textul nu definește ce înseamnă un martor care clipește (căutat „flash”: apare doar la flash-ul farurilor și la avarii/semnalizare).

Tabelul 1, coloana 5 (culoarea):

| Martor | Culoare |
| --- | --- |
| faza scurtă, poziții, parcare, semnalizare, proiectoare ceață față | verde |
| faza lungă | albastru |
| avarii | roșu |
| proiector ceață spate, combustibil, dezaburire parbriz/lunetă | galben |
| presiunea uleiului, temperatura lichidului de răcire, încărcarea, centura | roșu |
| defecțiune airbag, airbag lateral | galben și/sau roșu |
| airbag pasager dezactivat | galben |
| defecțiune frână, frâna de parcare | „See Regulation Nos 13-H and 13” (necitit) |
| ABS, motor (OBD), preîncălzire diesel, șoc, uzura plăcuțelor, presiune anvelope (și defecțiune TPMS), ESC, ESC OFF | galben |

Nu am citit: ISO 2575 (iso.org a cerut o verificare anti-bot în browser; standardul e oricum cu plată) și Regulamentele 13 / 13-H. Articolul nu citează sensul culorilor din ISO; regula „roșu / galben / verde” e descrisă din ce fac manualele.

## 4. Cifrele din manuale

Din cataloagele verificate din `src/data/martori/` (24 de manuale, 22 de mărci; Škoda are trei: Fabia, Octavia, Superb). Cataloagele cuprind o selecție din fiecare manual (5–38 de martori), deci „marca X nu apare” înseamnă „nu e în catalog”, nu „mașina nu are martorul”.

Numărătoarea s-a făcut cu:

```sh
python3 -I - <<'PY'
import json, glob, collections
per = collections.defaultdict(lambda: collections.defaultdict(set))
for f in glob.glob('src/data/martori/*.json'):
    if f.endswith('symbols.json'): continue
    d = json.load(open(f))
    if not d.get('verified'): continue
    for l in d['lights']:
        per[l['symbol']][l['color']].add(d['brand'])
for s, v in sorted(per.items()):
    print(s, {k: sorted(x) for k, x in v.items()})
PY
```

Ce folosește articolul:

- **Presiunea uleiului:** 19 manuale, 17 mărci; toate cer oprire, niciunul nu permite drumul până la service. Ford, SEAT, Škoda: nu continui nici cu nivelul bun; SEAT, Škoda: nici ralanti. Honda: verificarea nivelului după circa 3 minute; Mazda: după 5 minute.
- **Temperatura (roșu):** Dacia și Renault, 1–2 minute la ralanti înainte de oprire; Mercedes-Benz, cu semnal sonor peste 120 °C posibil.
- **Termometrul albastru:** Dacia, Renault, Suzuki, Volkswagen; Suzuki: albastru care clipește = problemă de sistem.
- **Frâna (roșu):** 23 de manuale, 21 de mărci. Aprins și cu frâna de parcare trasă: Fiat, Ford, Honda, Hyundai, Kia, Opel, Suzuki, Toyota (BMW: intrarea din catalog e chiar frâna aplicată). Mercedes-Benz W205: nu completa lichidul pentru această avertizare.
- **ABS + frână:** Citroën, Peugeot (repartitor electronic, oprește), Mazda (nu continua), Toyota (oprește); Hyundai, Kia (evită viteza mare și frânările bruște, verificare cât mai curând).
- **Încărcarea:** oprire și oprirea motorului: Hyundai, Kia, Nissan, Opel; Mazda: nu continua; Honda Civic: redu consumatorii, nu opri motorul la o oprire scurtă; cureaua: Hyundai, Kia, Nissan; Opel: răcirea sau asistarea frânei pot fi afectate. Restul: service cât mai curând / urmează mesajul.
- **Airbag:** roșu la 12 mărci (BMW, Fiat, Ford, Honda, Hyundai, Kia, Mazda, Mercedes-Benz, Opel, Tesla, Toyota, Volvo), galben la Citroën și Škoda. Lipsa testului la contact = defecțiune: Fiat, Ford, Honda, Mazda, Opel, Tesla. Durata testului: Hyundai ~6 s, Kia 3–6 s, Opel ~4 s.
- **Motor:** 21 de manuale, 19 mărci; clipirea descrisă separat (rateuri / catalizator): BMW, Citroën, Dacia, Ford, Opel, Peugeot, Renault, Volkswagen. Reducerea turației / accelerației până se oprește clipirea: Dacia, Renault, Opel. Mazda: la unele motoare, și cu rezervorul aproape gol.
- **ESP:** 9 mărci (BMW, Citroën, Ford, Mercedes-Benz, Opel, Suzuki, Tesla, Toyota, Škoda): clipire = intervenție, continuu = defecțiune.
- **Presiunea în anvelope:** oprește și verifică: BMW, Honda, Mercedes-Benz, Nissan, Toyota; Citroën, Peugeot: verifică rapid. Clipire circa un minut apoi continuu = monitorizare defectă: Honda, Mercedes-Benz, Toyota (Citroën, Peugeot, BMW descriu clipire urmată de lumină continuă).
- **Rezerva:** Audi A4 ~8 l, Toyota Corolla ~7,5 l, Honda Civic ~7 l, Citroën C3 ~5 l, Dacia Sandero 3 și Renault Clio 5 ~50 km; Suzuki: depinde de pantă și curbe; Kia: rateuri, risc pentru catalizator.
- **STOP:** Citroën, Dacia, Peugeot, Renault; Dacia și Renault: nu reporni motorul.
- **Triunghiul:** BMW (Check Control), SEAT.
- **Servodirecția roșie:** SEAT și Mercedes-Benz: nu continua; Škoda: repornești o dată, apoi ceri ajutor.
- **Frâna de parcare electrică care clipește:** Audi, Opel, Peugeot.
- **Centura:** clipire și sunet în mers (Fiat, Honda, Mercedes-Benz; Škoda peste ~30 km/h); obiecte pe scaun: BMW, Mercedes-Benz.

Din ghidul Škoda (manualul Superb III, 11/2018): EPC (benzină, regim de avarie), preîncălzirea, filtrul de particule (50–120 km/h, service dacă nu se stinge în 30 de minute), fulgul (+4 °C), cheia fixă, ventilatorul radiatorului, combinația baterie + temperatură.

Nesursate din manuale, cunoștințe generale, formulate prudent în articol: semnalizarea care clipește dublu = bec ars („de regulă”); cureaua de accesorii care antrenează și pompa de apă („poate”, „la multe motoare”).

## 5. Imagini

- `martori-bord-pe-culori.webp` (1200×2032): `node scripts/plansa-martori.mjs`. Icoanele sunt `martor-*.svg` din folderul ghidului Škoda (aceleași ca în căutător).
- Coperta: `node scripts/coperte.mjs semnificatie-martori-bord`.

## 6. De făcut

- Când se adaugă un catalog în căutător (Logan III, Duster): refă numărătoarea și cifrele din articol.
- Opțional: o fotografie reală a unui bord cu contactul pus (testul martorilor), cu licență liberă.

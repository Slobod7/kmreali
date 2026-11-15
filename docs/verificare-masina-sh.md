# Checklist de cumpărare SH

Prima versiune, 15 noiembrie 2026. Ruta `/verificare-masina-sh/`, accesibilă din Ghiduri (`src/components/CumparareRecomandare.astro`). Construită de ChatGPT, verificată față de surse și adaptată site-ului înainte de commit (vezi „Verificarea surselor” mai jos).

## Acoperire

10 modele în ordinea vizualizărilor unice din raportul Autovit din octombrie 2025 (tabelul „Top 10 modele mașini second-hand”, p. 14), plus Superb-ul autorului. Clasamentul nu reprezintă vânzările naționale sau un top 2026. Sursa clasamentului este în catalog și în pagină.

Generațiile inițiale sunt alegeri editoriale, nu o deducție despre popularitatea generațiilor: BMW F30/F31, Golf VII, BMW F10/F11, Audi A4 B9, Octavia III, Passat B8, Mercedes W205/S205 și W212/S212, Audi A6 C7, Mégane III. Sunt 1–2 puncte de atenție per model, din rapoartele ADAC pentru diesel, piața germană. Nu sunt cataloage complete, planuri oficiale de service sau diagnostice. Campaniile trebuie confirmate după VIN. C-Class folosește numai W205/S205 2014–2021 din raportul mai larg 2014–2023; nu extindem acoperirea la W206 sau la coupe/cabriolet. Au fost evitate cifrele ilizibile din unele PDF-uri.

Superb: 2.0 TSI 272 CP, automată și 4x4, anii 2019–2020 (cât a fost vândută versiunea, după recenzie). Dacă cutia sau tracțiunea nu sunt DSG și 4x4, pagina spune ce trebuie ales în loc de mesajul general. Articolele KM Reali au fost citite; pragurile de defectare din sursa secundară nu au fost transformate în reguli. Planul public Škoda indică 36 luni pentru Haldex; utilizatorul trebuie să confirme aplicabilitatea după VIN. Schimbul de ulei la DSG, 5.900 MDL (~295 EUR) cu kit ZF și manoperă, rămâne reper al autorului din Moldova și nu intră în totalul în lei. Oferta MGV 799 lei verificată în cercetare este pentru VW și un pachet compus; nu a fost transferată automat la Superb și nu este inclusă în total.

Pentru altă generație, alt motor sau an în afara intervalului, se afișează numai checklistul general cu avertizare explicită. O transmisie necunoscută nu primește verificări DSG. Dotările confort/sport sunt liste generale de funcții de probat dacă există; nu sunt niveluri de echipare garantate și nu dovedesc configurația de fabrică.

## Calcul

Scadența folosește kilometrajul curent, kilometrajul/data ultimei lucrări și intervalele confirmate de utilizator. Prima limită atinsă are prioritate; un istoric incomplet rămâne explicit incomplet. Nu există intervale universale pentru distribuție sau cutii automate.

Bugetul include doar lucrări selectate explicit. Pentru inspecții este necesară starea „Problemă observată”. La întreținere poate fi bugetată lipsa dovezii, starea „De făcut” sau o scadență calculată chiar dacă există factura ultimei lucrări. „Nu se aplică” exclude întotdeauna lucrarea. Costurile lipsă sunt numărate separat și marchează totalul parțial. Prețurile sunt devize introduse de cititor, în lei cu manoperă; nu reprezintă prețuri de piață publicate și nu garantează o reducere a prețului mașinii. Operațiile suprapuse trebuie excluse de utilizator.

## Date și confidențialitate

`catalog.mjs`: modele, verificări și surse. `cumparare-core.mjs`: filtrare, scadențe, buget și import/export cu câmpuri permise. `cumparare-ui.ts`: formulare și stocare în browser.

Salvare în localStorage sub `kmreali-cumparare-v1`, câte o fișă pentru combinația model/generație/motor/cutie/tracțiune/dotări. Nu este un gestionar de mai multe anunțuri pentru aceeași configurație. Linkul folosește un fragment `#fisa=` versionat, cu configurația, răspunsurile și sumele. Fragmentul nu este trimis în cererea HTTP; orice persoană cu linkul poate citi datele partajate. Notele libere nu intră în link sau imprimare. Fără cont, fără afiliere și fără serviciu extern de stocare.

Un link invalid sau o versiune necunoscută afișează un mesaj și o fișă nouă. Dacă localStorage sau clipboardul sunt indisponibile, pagina rămâne utilizabilă și oferă mesaj sau copiere manuală. Pentru linkuri externe funcționale, ruta trebuie publicată pe domeniul destinat; un link de preview localhost funcționează doar pe calculatorul respectiv.

## Verificare

`node --test scripts/cumparare/check.test.mjs` și `npm run build`.

Testele urmăresc separarea configurațiilor, limitele km/timp, date imposibile, costuri lipsă, condițiile includerii în buget, restaurarea stării și excluderea notelor. Verificarea în browser trebuie să acopere mobil/desktop, tastatura, schimbarea modelelor, calcule, reload, linkuri și imprimare.


### Validare efectuată · 15.11.2026

Build-ul de producție a trecut. Au trecut 7 teste pentru acest instrument și cele 8 teste existente pentru căutătorul de martori. În browser: toate cele 10 modele, transmisii, configurația Superb 4x4 și excluderea celei 2WD, motor neacoperit, calcul imediat la schimbarea kilometrilor, buget cu preț lipsă, link copiat/restaurat, păstrarea modificărilor după reload, resetare cu confirmare în pagină. Notele nu apar în link; notele deja existente în browser se păstrează la deschiderea unei fișe partajate pentru aceeași configurație.

Layout inspectat la 390×844, 320×740 și desktop (1280 px); fără depășire orizontală la dimensiunile mobile testate. Previzualizarea funcționează pe serverul local, fără publicare pe kmreali.ro. Acțiunea de imprimare a deschis dialogul nativ, dar paginarea PDF nu a putut fi inspectată cu instrumentele disponibile. CSS-ul de imprimare exclude notele și include rezumatul acoperirii. Confirmările de resetare/ștergere sunt în pagină, pentru a evita dialogurile native blocate în browserul integrat. Verificarea pe telefon fizic și cititor de ecran rămâne separată.

## Verificarea surselor · 15.11.2026

Fiecare punct specific modelului a fost recitit în raportul ADAC citat (secțiunile „Mängel und Rückrufe” și rezumatul de pe prima pagină). Toate 21 corespund: de exemplu „teils ruckartiges Anfahren mit DSG” la Golf VII, Octavia III și Passat B8 (Passat: „unharmonisches”), lanțurile alungite la BMW Seria 5 cu patru cilindri, campania OM651 din 1/2015 la Clasa C, „rostende Hinterachsträger” la Clasa E, evacuarea la A6. Ordinea celor 10 modele corespunde tabelului Autovit de la p. 14. Planul Škoda, p. 4: „Haldex clutch oil (4WD cars) and differential oil: every 3 years”. RAR: „Prețul RAR Auto-Pass este de 42 de lei”.

Corecturi față de prima versiune:

- Verificările de întreținere (ulei, distribuție, cutie automată) și cea a actelor citau pagina ADAC despre contractul de vânzare, care nu vorbește despre întreținere. Acum citează checklistul ADAC, care tratează carnetul de service lipsă sau incomplet și vânzătorul care nu e proprietarul din acte.
- Auto-Pass: certificatul privește kilometrajul; textul nu mai sugerează că ar spune ceva despre daune.
- Inspecția independentă: ADAC cere verificarea înainte de semnare („vor Unterschrift”), nu „înainte de plată”.
- Audi A6 folosește adresa obișnuită a rapoartelor ADAC; ambele rute servesc același fișier.
- Etichetele surselor spun ce document este (raport ADAC pentru model, checklist ADAC, contract ADAC, RAR, planul Škoda, articol KM Reali), nu „ADAC · raport / ghid” pentru toate.

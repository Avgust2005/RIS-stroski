# Uporabniške zgodbe (User Stories)

---

## UZ-02: Izvoz seznama stroškov v datoteke (CSV, XLSX, PDF)
* **ID:** UZ-02
* **Odgovorni član:** Rok Avguštinčič (GitHub: `@Avgust2005`)

### Opis zgodbe
> Kot uporabnik aplikacije za spremljanje stroškov želim seznam trenutno prikazanih stroškov izvoziti v datoteko formata CSV, XLSX ali PDF, *da lahko svoje finančne podatke arhiviram lokalno, jih nadalje obdelujem v preglednicah ali pripravim pregledno poročilo za tisk.

### Sprejemni kriteriji (Acceptance Criteria)

* **Kriterij 1 (Uspešen izvoz v CSV):**
  * **Given:** Uporabnik ima odprto aplikacijo, v tabeli pa je prikazan vsaj en zapis stroška.
  * **When:** Uporabnik klikne na gumb "Izvozi CSV".
  * **Then:** Brskalnik samodejno sproži prenos datoteke `stroski.csv`, ki vsebuje glavo stolpcev (ID, Naziv, Znesek, Kategorija, Datum) ter vse trenutno prikazane vrstice iz tabele, ločene s podpičjem.

* **Kriterij 2 (Uspešen izvoz v Excel / XLSX):**
  * **Given:** Uporabnik ima odprto aplikacijo in v tabeli so prikazani stroški.
  * **When:** Uporabnik klikne na gumb "Izvozi Excel".
  * **Then:** Brskalnik prenese preglednico `stroski.xlsx` z delovnim listom "Stroški", kjer so zneski shranjeni kot številske vrednosti in pripravljeni za takojšnje računanje.

* **Kriterij 3 (Uspešen izvoz v PDF poročilo):**
  * **Given:** Uporabnik ima na zaslonu prikazan seznam stroškov in izračunan skupni znesek.
  * **When:** Uporabnik klikne na gumb "Izvozi PDF".
  * **Then:** Brskalnik prenese dokument `stroski.pdf`, ki vsebuje naslov poročila, izpis skupnega zneska prikazanih stroškov ter oblikovano tabelo vseh prikazanih zapisov.

* **Kriterij 4 (Upoštevanje aktivnega filtra kategorij):**
  * **Given:** Uporabnik je v spustnem seznamu izbral določeno kategorijo (npr. "Hrana") in tabela prikazuje le filtrirane stroške.
  * **When:** Uporabnik klikne kateregakoli izmed gumbov za izvoz (CSV, Excel ali PDF).
  * **Then:** Prenesena datoteka vsebuje izključno zapise izbrane kategorije (in pripadajoči filtrirani skupni znesek v PDF-ju), ne pa vseh stroškov iz baze.

* **Kriterij 5 (Scenarij napake / prazen seznam stroškov):**
  * **Given:** V sistemu ni nobenega shranjenega stroška ali pa za izbrani filter kategorije ni zadetkov (tabela je prazna).
  * **When:** Uporabnik klikne na gumb za izvoz (CSV, Excel ali PDF).
  * **Then:** Prenos datoteke se ne sproži, sistem pa uporabniku prikaže opozorilno sporočilo *"Ni podatkov za izvoz."*

### Podrobnosti implementacije
* **Arhitekturni pristop:** Celotna logika za generiranje in prenos datotek je implementirana na strani odjemalca (Frontend – React v komponenti `App.jsx`), brez dodatnih zahtevkov na REST API zaledja, saj so vsi potrebni podatki že naloženi v stanju aplikacije (`prikazaniStroski`).
* **Uporabljene knjižnice:**
  * **CSV:** Izvedeno z nativnim JavaScript objektom `Blob` in začasnim elementom `<a>`. Na začetek datoteke je dodan znak `\uFEFF` (UTF-8 BOM), kot ločilo pa je uporabljeno podpičje (`;`), kar zagotavlja pravilen prikaz šumnikov (`č, š, ž`) in stolpcev ob odpiranju v slovenskem okolju Microsoft Excel.
  * **XLSX:** Uporabljena knjižnica `xlsx` (SheetJS) s funkcijama `XLSX.utils.json_to_sheet` in `XLSX.writeFile` za pretvorbo JSON objektov v pravi `.xlsx` format.
  * **PDF:** Uporabljeni knjižnici `jspdf` in `jspdf-autotable` za programsko risanje glave dokumenta, izpis skupnega zneska ter samodejno generiranje in prelamljanje tabele podatkov.
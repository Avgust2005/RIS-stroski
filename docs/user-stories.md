# Uporabniške zgodbe

## UZ-1: Nastavitev skupnega mesečnega proračuna

**Uporabniška zgodba:**
Kot uporabnik želim za izbrani mesec nastaviti in spremeniti skupni proračun, da si postavim jasno omejitev mesečne porabe.

**Odgovorni član:**  Vid Kovač

**Prioriteta:** Visoka

**Ocena zahtevnosti:** 3 / 5

### Sprejemni kriteriji
**SK-1: Nastavitev novega proračuna**

- **Given:** Za november 2026 proračun še ni nastavljen.
- **When:** Uporabnik izbere november 2026, vnese znesek 500€ in potrdi shranjevanje.
- **Then:** Aplikacija prikaže potrditev uspešnega shranjevanja in proračun 500€ za november 2026.

**SK-2: Sprememba obstoječega proračuna**

- **Given:** Za november 2026 je nastavljen proračun 500€.
- **When:** Uporabnik znesek spremeni na 600€ in potrdi shranjevanje.
- **Then:** Proračun za november znaša 600€, brez ustvarjanja dodatnega proračuna za isti mesec.

**SK-3: Neveljaven znesek**

- **Given:** Uporabnik ima odprt obrazec za nastavitev proračuna.
- **When:** Poskusi shraniti proračun s praznim zneskom, zneskom 0 ali negativnim zneskom.
- **Then:** Aplikacija shranjevanje zavrne in prikaže opozorilo, da je obvezen znesek, večji od nič. Morebitni obstoječi proračun ostane nespremenjen.

**SK-4: Ločene nastavitve po mesecih**

- **Given:** Za november 2026 je nastavljen proračun 500€.
- **When:** Uporabnik za december 2026 nastavi proračun 700€.
- **Then:** November ohrani proračun 500€, december pa ima proračun 700€.

**SK-5: Ohranitev nastavitve**

- **Given:** Uporabnik je za november 2026 shranil proračun 500€.
- **When:** Zapre aplikacijo, jo ponovno odpre in izbere november 2026.
- **Then:** Aplikacija prikaže predhodno shranjeni proračun 500€.

### Podrobnosti implementacije

V podatkovno bazo bomo dodali tabelo za mesečne proračune. Za vsak proračun bomo shranili mesec, leto in znesek v evrih. Za isto kombinacijo meseca in leta bo lahko obstajal samo en proračun. Če uporabnik spremeni njegov znesek, bomo posodobili obstoječi zapis.

V uporabniškem vmesniku in zaledju bomo preverili, ali je znesek izpolnjen in večji od nič. Če vnos ni veljaven, bomo prikazali opozorilo in preprečili shranjevanje. Morebitni obstoječi proračun bo ostal nespremenjen.

V uporabniški vmesnik bomo dodali obrazec za izbiro meseca in leta, vnos zneska ter gumb »Shrani«. Ob izbiri meseca bomo prikazali njegov shranjeni proračun. Če proračun še ni nastavljen, bo polje za znesek prazno in prikazano bo ustrezno obvestilo. Po uspešnem shranjevanju bomo prikazali potrditveno sporočilo.

Obrazec bomo povezali z zaledjem prek zahtev GET in PUT. Zahtevo GET bomo uporabili za pridobivanje proračuna, zahtevo PUT pa za njegovo nastavitev ali spremembo. Zaledje bo preverilo prejete podatke, jih shranilo v bazo in obrazcu vrnilo rezultat. Ob neuspešnem shranjevanju bo obrazec prikazal napako in ohranil uporabnikov vnos.

### Naloge

#### N-1: Shranjevanje in pridobivanje mesečnega proračuna

**Odgovorni član:** Vid Kovač

**Opis:**  
V zaledju pripraviti tabelo s podatki o mesecu, letu in znesku ter omogočiti pridobivanje in shranjevanje proračuna prek zahtev GET in PUT. Preveriti veljavnost zneska in zagotoviti, da se ob ponovnem shranjevanju za isti mesec posodobi obstoječi zapis. Preizkusiti shranjevanje, spreminjanje in zavrnitev neveljavnega vnosa.

#### N-2: Obrazec za nastavitev mesečnega proračuna

**Odgovorni član:** Vid Kovač

**Opis:**  
V uporabniški vmesnik dodati obrazec za izbiro meseca in leta, vnos zneska ter gumb »Shrani«. Obrazec povezati z zaledjem, da prikaže obstoječi proračun in omogoča njegovo spremembo. Dodati preverjanje vnosa ter prikaz potrditve ali napake. Po povezavi z zaledjem preveriti delovanje.

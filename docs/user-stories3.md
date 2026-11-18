# Uporabniške zgodbe (User Stories)

## UZ-3: Statistika porabe z grafi

**Uporabniška zgodba:**
Kot uporabnik želim za izbrani mesec videti graf dnevne porabe in tortni graf porabe po kategorijah, da hitro vidim, kdaj in za kaj porabim največ denarja.

**Odgovorni član:** Mark Karpov 

**Prioriteta:** Srednja

**Ocena zahtevnosti:** 3 / 5

### Sprejemni kriteriji

**SK-1: Prikaz dnevne porabe**

- **Given:** V novembru 2026 so vneseni stroški: 3. 11. 12,50 € (Hrana), 3. 11. 7,50 € (Prevoz) in 10. 11. 40,00 € (Zabava).
- **When:** Uporabnik odpre statistiko in izbere november 2026.
- **Then:** Stolpčni graf prikaže vse dni novembra 2026. Stolpec za 3. 11. znaša 20,00 €, stolpec za 10. 11. znaša 40,00 €, ostali dnevi znašajo 0,00 €.
  
**SK-2: Prikaz porabe po kategorijah**

- **Given:** V novembru 2026 so vneseni enaki stroški kot pri SK-1 (skupaj 60,00 €).
- **When:** Uporabnik izbere november 2026.
- **Then:** Tortni graf prikaže tri dele: Zabava 40,00 € (66,7 %), Hrana 12,50 € (20,8 %) in Prevoz 7,50 € (12,5 %).
  
**SK-3: Upoštevani so samo stroški izbranega meseca**

- **Given:** V novembru 2026 so vneseni stroški v skupni vrednosti 60,00 €, 1. 12. 2026 pa strošek 100,00 €.
- **When:** Uporabnik izbere november 2026.
- **Then:** Oba grafa prikazujeta samo novembrske stroške v skupni vrednosti 60,00 €. Strošek iz decembra ni prikazan.
  
**SK-4: Naknadno dodan strošek za pretekli mesec**

- **Given:** Za oktober 2026 je vnesenih 30,00 € stroškov, uporabnik pa je pozabil vnesti strošek 15,00 € (Hrana) z dne 20. 10. 2026.
- **When:** Uporabnik doda ta strošek z datumom 20. 10. 2026 in nato v statistiki izbere oktober 2026.
- **Then:** Stolpec za 20. 10. se poveča za 15,00 €, tortni graf za oktober pa prikazuje skupno porabo 45,00 €.
  **SK-5: Enake kategorije, zapisane z različnimi velikimi črkami**

- **Given:** V novembru 2026 sta vnesena strošek 10,00 € s kategorijo »Hrana« in strošek 5,00 € s kategorijo »hrana«.
- **When:** Uporabnik izbere november 2026.
- **Then:** Tortni graf prikaže en del »Hrana« z zneskom 15,00 €.
  
**SK-6: Mesec brez stroškov**

- **Given:** V januarju 2026 ni vnesenih stroškov.
- **When:** Uporabnik izbere januar 2026.
- **Then:** Namesto grafov aplikacija prikaže sporočilo »Za januar 2026 ni podatkov o porabi.«
  
**SK-7: Podatkov ni mogoče pridobiti**

- **Given:** Strežnik aplikacije ni dosegljiv.
- **When:** Uporabnik odpre statistiko.
- **Then:** Aplikacija prikaže sporočilo »Statistike trenutno ni mogoče prikazati. Poskusite znova pozneje.« in ne prikaže praznih ali napačnih grafov.

### Podrobnosti implementacije

V uporabniški vmesnik bomo dodali zavihek »Statistika«, ki ga uporabnik odpre z gumbom nad tabelo stroškov. V zavihku bo izbira meseca in leta, privzeto trenutni mesec, ter dva grafa za izbrani mesec: stolpčni graf dnevne porabe in tortni graf porabe po kategorijah. Grafe bomo izrisali s knjižnico Recharts. Statistika bo v ločeni komponenti `Statistika.jsx`, v `App.jsx` pa bomo dodali samo gumb za preklop.

V zaledje bomo dodali zahtevo GET `/api/statistika?leto=2026&mesec=11`. Zaledje bo upoštevalo samo stroške z datumom med prvim in zadnjim dnem izbranega meseca. Vrnilo bo seznam vseh dni v mesecu z vsoto stroškov (dnevi brez stroškov z vrednostjo 0), seznam kategorij z vsoto in deležem ter skupno vsoto. Pri združevanju po kategorijah bomo prezrli velike in male črke ter presledke na začetku in koncu, kategorijo pa prikazali z veliko začetnico. Zneske bomo zaokrožili na dve decimalni mesti, deleže na eno decimalno mesto.

Če v izbranem mesecu ni stroškov, bo zaledje vrnilo prazne sezname, vmesnik pa bo namesto grafov prikazal sporočilo. Če zahteva ne uspe, bo vmesnik prikazal sporočilo o napaki.

Obrazec za dodajanje stroška že omogoča izbiro poljubnega datuma, zato lahko uporabnik naknadno doda pozabljene stroške za pretekle mesece brez dodatnih sprememb. Statistika ob vsakem odprtju in ob vsaki izbiri meseca podatke pridobi znova, zato vedno upošteva tudi naknadno dodane stroške.

Zgodba ni odvisna od drugih zgodb (UZ-1, UZ-2), saj uporablja samo že obstoječe stroške.

### Naloge

#### N-5: Izračun statistike porabe za izbrani mesec

**Odgovorni član:** Mark Karpov

**Opis:**
V zaledju dodati zahtevo GET `/api/statistika`, ki za izbrano leto in mesec vrne vsote po dnevih (vključno z dnevi brez stroškov), vsote in deleže po kategorijah ter skupno vsoto. Kategorije, ki se razlikujejo samo po velikih in malih črkah ali presledkih, združiti. Preizkusiti prek Swaggerja s podatki iz SK-1, SK-2, SK-3, SK-5 in SK-6.

#### N-6: Zavihek Statistika in stolpčni graf dnevne porabe

**Odgovorni član:** Mark Karpov

**Opis:**
V uporabniški vmesnik dodati zavihek »Statistika« z izbiro meseca in leta ter stolpčni graf porabe po dnevih. Ob izbiri meseca pridobiti podatke iz zaledja. Prikazati sporočilo za mesec brez stroškov in za neuspešno pridobivanje podatkov. Preveriti SK-1, SK-3, SK-4, SK-6 in SK-7.

#### N-7: Tortni graf porabe po kategorijah

**Odgovorni član:** Mark Karpov

**Opis:**
V zavihek »Statistika« dodati tortni graf, ki za izbrani mesec prikaže porabo po kategorijah z zneski in deleži ter legendo. Preveriti SK-2 in SK-5.

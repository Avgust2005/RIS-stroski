# Aplikacija za spremljanje stroškov

Ta repozitorij vsebuje celotno kodo za spletno aplikacijo za spremljanje osebnih financ, ki je bila razvita v okviru predmeta **Razvoj informacijskih sistemov (RIS)**.

---

## 1. O projektu
Aplikacija je namenjena preglednemu spremljanju osebnih izdatkov in boljšemu razumevanju vsakodnevne porabe. Poudarek je na preprosti uporabi in jasni predstavitvi podatkov, ki uporabniku pomagata ohranjati pregled nad njegovimi stroški.

---

## 2. Uporabljene tehnologije
Sistem sledi industrijskemu standardu ločenega zaledja (Backend) in obličja (Frontend).

### Zaledje (Backend)
* **Jezik:** Java 17 (ali 21)
* **Ogrodje:** Spring Boot (v3.x.x)
* **Podatkovni dostop:** Spring Data JPA (Hibernate)
* **Podatkovna baza:** PostgreSQL (v produkciji/razvoju) / H2 (za hitro testiranje v spominu)
* **API Dokumentacija:** Swagger / Springdoc OpenAPI (v2.3.0)
* **Upravljanje odvisnosti:** Maven (ali Gradle)

### Obličje (Frontend)
* **Orodje za gradnjo:** Node.js & npm
* **Ogrodje / Knjižnica:** React (v18.x) preko Vite orodja
* **Protokol komunikacije:** REST API (HTTP klici preko `fetch` API-ja)

---

## 3. Struktura projekta
Projekt je strogo razdeljen na dve neodvisni mapi:

```text
RIS/
├── backend/                         # Spring Boot zaledni sistem
│   ├── src/
│   │   └── main/
│   │       ├── java/si/faks/stroski/
│   │       │   ├── controller/      # REST API kontrolerji (@RestController)
│   │       │   ├── model/           # JPA Entitete / Tabele (@Entity)
│   │       │   ├── repository/      # JPA Repozitoriji za dostop do baze
│   │       │   └── service/         # Poslovna logika aplikacije (@Service)
│   │       └── resources/
│   │           └── application.properties # Konfiguracija baze in strežnika
│   └── pom.xml                      # Maven konfiguracija in odvisnosti
│
├── frontend/                        # React uporabniški vmesnik
│   ├── src/
│   │   ├── App.jsx                  # Glavna React komponenta (UI + CRUD logika)
│   │   └── main.jsx                 # Vstopna točka React aplikacije
│   ├── package.json                 # Seznam Node.js odvisnosti
│   └── vite.config.js               # Konfiguracija Vite strežnika
│
└── README.md                        # Glavna dokumentacija projekta
```

---

## 4. Navodila za nameščanje in zagon

### Predpogoji
Preden začnete z nameščanjem, se prepričajte, da imate na računalniku nameščeno sledečo opremo:
1. **Java JDK 17** ali novejšo (`java -version`).
2. **Node.js (v18+)** in **npm** (`node -version`, `npm -version`).
3. **PostgreSQL** strežnik in orodje za upravljanje baze (pgAdmin ali `psql`).

---

### Korak 1: Vzpostavitev podatkovne baze PostgreSQL

#### Na sistemu Arch Linux:
1. Inicializirajte bazo (če tega še niste storili):
   ```bash
   sudo -u postgres initdb -D /var/lib/postgres/data
   ```
2. Zaženite storitev PostgreSQL:
   ```bash
   sudo systemctl start postgresql
   ```
3. Ustvarite bazo podatkov `stroskidb`:
   ```bash
   sudo -u postgres createdb stroskidb
   ```
4. Nastavite geslo za uporabnika `postgres`:
   ```bash
   sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'tvoje_geslo';"
   ```

#### Na sistemih Windows / macOS:
1. Odprite **pgAdmin** ali svoj SQL odjemalec.
2. Ustvarite novo prazno bazo podatkov z imenom **`stroskidb`**.

---

### Korak 2: Konfiguracija in zagon Zaledja (Backend)

1. Odprite terminal in se premaknite v mapo `backend`:
   ```bash
   cd backend
   ```
2. Preverite datoteko `src/main/resources/application.properties` in prilagodite podatke za povezavo z bazo:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/stroskidb
   spring.datasource.username=postgres
   spring.datasource.password=tvoje_geslo

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```
3. Zaženite Spring Boot aplikacijo:
   * **Preko IntelliJ IDEA:** Odprite razred `StroskiApplication.java` in klikni **Run**.
   * **Preko terminala (Maven):**
     ```bash
     ./mvnw spring-boot:run
     ```
4. Zaledje teče na: **`http://localhost:8080`**.
5. **Swagger OpenAPI dokumentacija** je dostopna na: **`http://localhost:8080/swagger-ui/index.html`**.

---

### Korak 3: Zagon Obličja (Frontend)

1. Odprite nov terminal in se premaknite v mapo `frontend`:
   ```bash
   cd frontend
   ```
2. Namestite vse potrebne odvisnosti:
   ```bash
   npm install
   ```
3. Zaženite razvojni strežnik Vite:
   ```bash
   npm run dev
   ```
4. Aplikacija se bo odprla na naslovu: **`http://localhost:5173`**.

---

## 5. Navodila za razvijalce (GitHub Workflow)

Pri razvoju in prispevanju k repozitoriju upoštevajte naslednji delovni potek:

1. **Kloniranje repozitorija:**
   ```bash
   git clone https://github.com/TVOJE_UPORABNISKO_IME/RIS-SpremljanjeStroskov.git
   ```
2. **Delo z vejami (Branching):**
   Za vsako novo funkcionalnost ustvarite svojo vejo:
   ```bash
   git checkout -b feature/ime-funkcionalnosti
   ```
3. **Shranjevanje in potiskanje sprememb:**
   ```bash
   git add .
   git commit -m "Opis opravljenega dela"
   git push origin feature/ime-funkcionalnosti
   ```
4. **Spajanje (Pull Request):**
   Na GitHubu odprite Pull Request (PR) v glavno vejo (`main`). Koda mora biti pred spajanjem preizkušena in brez napak.

---

## 6. Standardi kodiranja

Da zagotovimo čisto in vzdrževano kodo, se držimo naslednjih pravil:

* **Splošna pravila:**
  * Vse spremenljivke, metode in razredi uporabljajo **`camelCase`** ali **`PascalCase`** (razredi).
  * Koda in komentarji morajo biti konsistentni in razumljivi.

* **Backend (Spring Boot):**
  * Uporablja se stroga tristopenjska arhitektura: `Controller` -> `Service` -> `Repository`.
  * `Controller` obravnava izključno HTTP zahteve in ne vsebuje poslovne logike ali neposrednih klicev do baze.
  * Entitete imajo ustrezno definirane JPA anotacije (`@Entity`, `@Id`, `@GeneratedValue`).
  * Omogočen mora biti CORS podpora (`@CrossOrigin`) za komunikacijo s frontendom.

* **Frontend (React):**
  * Uporabljajo se funkcijske komponente z React Hooki (`useState`, `useEffect`).
  * Vsi API klici (`fetch`) morajo biti zaviti v `try/catch` bloke za varno obravnavo napak.
  * Komponente morajo biti odzivne in imeti ustrezno obravnavo stanja ob praznih podatkih.

---

## 7. Vizija projekta

### Opis rešitve

Vizija projekta je razviti preprosto spletno aplikacijo, ki predvsem študentom in drugim uporabnikom pomaga ohranjati pregled nad vsakodnevnimi izdatki brez potrebe po plačljivih in zapletenih računovodskih programih. Stroški so zbrani v enotni evidenci z nazivom, zneskom, kategorijo in datumom, uporabnik pa jih lahko sproti dopolnjuje, popravlja in pregleduje ter tako lažje spremlja svojo porabo.

#### Ključne funkcionalnosti

   * **Dodajanje stroškov:** vnos naziva, zneska, kategorije in datuma posameznega izdatka.
   * **Pregled stroškov:** prikaz vnesenih stroškov v pregledni tabeli.
   * **Urejanje stroškov:** popravljanje napačnih ali dopolnjevanje obstoječih podatkov.
   * **Brisanje stroškov:** odstranjevanje nepotrebnih ali pomotoma dodanih zapisov.
   * **Razvrščanje in filtriranje po kategorijah:** označevanje stroškov s kategorijami ter prikaz izdatkov izbrane kategorije.
   * **Izračun skupne porabe:** samodejni prikaz vsote vseh stroškov oziroma stroškov trenutno izbrane kategorije.
   * **Trajno shranjevanje:** ohranjanje vnesenih podatkov za poznejši pregled in urejanje.

### Obseg rešitve in morebitne omejitve

Obseg rešitve zajema ročno beleženje osebnih stroškov, njihovo urejanje ter pregled porabe po kategorijah. Aplikacija je namenjena uporabi v spletnem brskalniku in se osredotoča na spremljanje izdatkov, ne na celovito računovodstvo.

Pravilnost in popolnost evidence sta odvisni od uporabnikovih vnosov. Aplikacija ne pridobiva transakcij iz bančnih računov, ne prepoznava podatkov s fotografij računov in ne izvaja pretvorb med valutami.


---

## 9. Podroben opis primerov uporabe

### Spodaj so podrobno opisani primeri uporabe, ki so dejansko implementirani v trenutni različici aplikacije za spremljanje stroškov.

---

### Primer uporabe: Dodajanje novega stroška
* **ID:** PU-01
* **Cilj:** Uporabnik želi vnesti in shraniti nov strošek v sistem, da bo zabeležen v podatkovni bazi in prikazan na seznamu.
* **Akterji:** Uporabnik (glavni akter), Sistem (sekundarni akter)
* **Predpogoji:** Uporabnik ima odprto spletno aplikacijo v brskalniku, zaledni sistem (Spring Boot) in podatkovna baza (PostgreSQL) pa delujeta.
* **Stanje sistema po PU:** Nov zapis o strošku je shranjen v tabeli `stroski` v podatkovni bazi z dodeljenim unikatnim ID-jem, tabela na zaslonu se osveži, obrazec za vnos pa se izprazni.
* **Scenarij:**
    1. Uporabnik v zgornjem obrazcu izpolni polja za naziv, znesek, kategorijo in izbere datum stroška.
    2. Uporabnik klikne na gumb "Dodaj".
    3. Obličje (React) pošlje HTTP `POST` zahtevek s podatki v obliki JSON na zaledni sistem (`/api/stroski`).
    4. Zaledni sistem podatke shrani v podatkovno bazo PostgreSQL.
    5. Aplikacija ponovno pridobi posodobljen seznam stroškov in izprazni vnosna polja obrazca.
* **Alternativni tokovi:**
    * **1a. Manjkajoči podatki v obrazcu:** Če uporabnik pusti katerokoli polje prazno in klikne "Dodaj", brskalnik zaradi atributa `required` prepreči oddajo obrazca in uporabnika opozori, naj izpolni manjkajoče polje.
    * **1b. Vnos neveljavnega zneska:** Če uporabnik v polje za znesek poskuša vnesti besedilo namesto številke, polje tipa `number` tega vnosa ne dovoli.
* **Izjeme:**
    * **E1. Zaledni sistem ali baza ni dosegljiva:** Če strežnik ne odgovarja, se strošek ne shrani, napaka pa se zabeleži v konzolo brskalnika (*"Napaka pri shranjevanju"*).

---

### Primer uporabe: Pregled seznama vseh stroškov
* **ID:** PU-02
* **Cilj:** Uporabnik želi videti pregledno tabelo vseh svojih doslej shranjenih stroškov skupaj z njihovimi podrobnostmi (ID, naziv, znesek, kategorija, datum).
* **Akterji:** Uporabnik, Sistem
* **Predpogoji:** Aplikacija je odprta v brskalniku in povezava z zalednim sistemom deluje.
* **Stanje sistema po PU:** Stanje podatkovne baze ostane nespremenjeno. Na zaslonu je prikazana tabela s trenutnimi zapisi iz baze.
* **Scenarij:**
    1. Uporabnik odpre spletno aplikacijo v brskalniku (ali izvede spremembo podatkov).
    2. Obličje samodejno sproži HTTP `GET` zahtevek na končno točko `/api/stroski`.
    3. Zaledni sistem iz podatkovne baze prebere vse zapise iz tabele `stroski` in jih vrne v formatu JSON.
    4. Obličje prejete podatke izriše v pregledni HTML tabeli.
* **Alternativni tokovi:**
    * **4a. V bazi ni shranjenih stroškov:** Če zaledni sistem vrne prazen seznam, aplikacija namesto vrstic s podatki v tabeli prikaže sporočilo *"Ni najdenih stroškov za ta filter."*
* **Izjeme:**
    * **E1. Napaka pri pridobivanju podatkov:** Če zaledni sistem vrne napako ali ni zagnan, tabela ostane prazna, v konzolo pa se izpiše *"Napaka pri pridobivanju podatkov"*.

---

### Primer uporabe: Urejanje obstoječega stroška
* **ID:** PU-03
* **Cilj:** Uporabnik želi spremeniti podatke (naziv, znesek, kategorijo ali datum) že obstoječega stroška v sistemu.
* **Akterji:** Uporabnik, Sistem
* **Predpogoji:** V sistemu obstaja vsaj en shranjen strošek, ki je viden v tabeli na zaslonu.
* **Stanje sistema po PU:** Obstoječi zapis v podatkovni bazi je posodobljen z novimi vrednostmi (njegov ID ostane enak), tabela in skupni znesek na zaslonu pa se ustrezno posodobita.
* **Scenarij:**
    1. Uporabnik v tabeli v vrstici želenega stroška klikne na gumb "Uredi".
    2. Sistem podatke izbrane vrstice prenese v zgornji obrazec, gumb za potrditev pa se preimenuje iz "Dodaj" v "Posodobi".
    3. Uporabnik v obrazcu popravi želene vrednosti (npr. spremeni znesek ali kategorijo).
    4. Uporabnik klikne na gumb "Posodobi".
    5. Obličje pošlje HTTP `PUT` zahtevek na `/api/stroski/{id}` s popravljenimi podatki.
    6. Zaledni sistem posodobi zapis v bazi, obličje pa izprazni obrazec in osveži prikazano tabelo.
* **Alternativni tokovi:**
    * **3a. Uporabnik ne spremeni nobenega podatka:** Če uporabnik klikne "Posodobi" brez sprememb, sistem vseeno izvede posodobitev z enakimi vrednostmi in ponastavi obrazec v prvotno stanje.
* **Izjeme:**
    * **E1. Zapis v bazi ne obstaja več:** Če je bil zapis medtem izbrisan, zaledni sistem vrne izjemo (*"Strošek ni najden!"*), posodobitev pa se ne izvede.

---

### Primer uporabe: Brisanje stroška
* **ID:** PU-04
* **Cilj:** Uporabnik želi trajno odstraniti določen zapis stroška iz sistema.
* **Akterji:** Uporabnik, Sistem
* **Predpogoji:** V tabeli je prikazan vsaj en strošek.
* **Stanje sistema po PU:** Izbrani zapis je trajno izbrisan iz podatkovne baze PostgreSQL, vrstica izgine iz tabele na zaslonu, skupni seštevek pa se zmanjša za vrednost izbrisanega stroška.
* **Scenarij:**
    1. Uporabnik v tabeli poišče strošek, ki ga želi odstraniti, in v njegovi vrstici klikne rdeč gumb "Izbriši".
    2. Obličje pošlje HTTP `DELETE` zahtevek na zaledni sistem z ID-jem izbranega stroška (`/api/stroski/{id}`).
    3. Zaledni sistem izbriše zapis iz podatkovne baze.
    4. Obličje ponovno pridobi seznam stroškov in izriše osveženo tabelo brez izbrisanega zapisa.
* **Alternativni tokovi:**
    * Ni alternativnih tokov (brisanje se izvede neposredno ob kliku brez vmesnega potrditvenega okna).
* **Izjeme:**
    * **E1. Napaka pri brisanju:** Če povezava s strežnikom med zahtevo pade, se zapis ne izbriše, v konzolo brskalnika pa se izpiše *"Napaka pri brisanju"*.

---

### Primer uporabe: Filtriranje stroškov po kategoriji
* **ID:** PU-05
* **Cilj:** Uporabnik želi na zaslonu prikazati samo stroške, ki spadajo v določeno kategorijo (npr. samo "Hrana"), da ima boljši pregled nad posamezno vrsto izdatkov.
* **Akterji:** Uporabnik
* **Predpogoji:** V sistemu so shranjeni stroški z vnesenimi kategorijami.
* **Stanje sistema po PU:** Stanje podatkovne baze ostane nespremenjeno. Tabela na zaslonu prikazuje le stroške izbrane kategorije, izračunan skupni znesek pa odraža vsoto samo teh filtriranih stroškov.
* **Scenarij:**
    1. Uporabnik klikne na spustni seznam (dropdown) z oznako "Filtriraj po kategoriji", ki ga sistem samodejno napolni z unikatnimi kategorijami iz obstoječih stroškov.
    2. Uporabnik izbere želeno kategorijo s seznama.
    3. Obličje lokalno filtrira seznam stroškov in v tabeli prikaže le vrstice, katerih kategorija se ujema z izbrano.
    4. Sistem samodejno preračuna in posodobi prikazani skupni znesek za filtrirane stroške.
* **Alternativni tokovi:**
    * **2a. Ponastavitev filtra:** Uporabnik v spustnem seznamu ponovno izbere možnost *"-- Vse kategorije --"*. Sistem odstrani filter in v tabeli znova prikaže vse stroške iz baze.
* **Izjeme:**
    * **E1. Zadnji strošek izbrane kategorije je izbrisan:** Če uporabnik izbriše edini strošek v aktivni filtrirani kategoriji, tabela prikaže sporočilo *"Ni najdenih stroškov za ta filter."*

---

### Primer uporabe: Izračun skupnega zneska stroškov
* **ID:** PU-06
* **Cilj:** Uporabnik želi takoj videti skupno vsoto vseh trenutno prikazanih stroškov v evrih.
* **Akterji:** Sistem (glavni akter), Uporabnik (sekundarni akter)
* **Predpogoji:** Aplikacija je naložena v brskalniku.
* **Stanje sistema po PU:** Stanje podatkovne baze ostane nespremenjeno. Na zaslonu (desno nad tabelo) je izpisan točen seštevek prikazanih stroškov na dve decimalni mesti natančno.
* **Scenarij:**
    1. Sistem pridobi seznam stroškov iz baze ali pa uporabnik izvede spremembo (dodajanje, urejanje, brisanje ali filtriranje).
    2. Obličje samodejno sešteje vrednosti polja `znesek` vseh stroškov, ki so trenutno vidni v tabeli.
    3. Sistem izračunani znesek oblikuje na dve decimalni mesti in ga izpiše v zeleni barvi z oznako *"Skupaj: X.XX €"*.
* **Alternativni tokovi:**
    * **2a. Seznam prikazanih stroškov je prazen:** Če v bazi ni stroškov ali za izbrani filter ni zadetkov, sistem izpiše *"Skupaj: 0.00 €"*.
* **Izjeme:**
    * Ni specifičnih izjem (izračun poteka lokalno v pomnilniku brskalnika).
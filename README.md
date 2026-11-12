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

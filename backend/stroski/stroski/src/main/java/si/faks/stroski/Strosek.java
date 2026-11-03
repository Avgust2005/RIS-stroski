package si.faks.stroski;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity // Pove Springu, da je ta razred tabela v bazi podatkov.
@Table(name = "stroski")
public class Strosek {

    @Id // Označuje primarni ključ.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Baza sama povečuje ID (1, 2, 3...).
    private Long id;

    private String naziv;
    private Double znesek;
    private String kategorija;
    private LocalDate datum;

    // Prazen konstruktor je obvezen za JPA
    public Strosek() {}

    public Strosek(String naziv, Double znesek, String kategorija, LocalDate datum) {
        this.naziv = naziv;
        this.znesek = znesek;
        this.kategorija = kategorija;
        this.datum = datum;
    }

    // Dodaj vse Getterje in Setterje (za id, naziv, znesek, kategorijo, datum)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNaziv() { return naziv; }
    public void setNaziv(String naziv) { this.naziv = naziv; }
    public Double getZnesek() { return znesek; }
    public void setZnesek(Double znesek) { this.znesek = znesek; }
    public String getKategorija() { return kategorija; }
    public void setKategorija(String kategorija) { this.kategorija = kategorija; }
    public LocalDate getDatum() { return datum; }
    public void setDatum(LocalDate datum) { this.datum = datum; }
}
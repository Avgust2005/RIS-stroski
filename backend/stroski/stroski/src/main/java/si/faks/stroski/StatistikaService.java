package si.faks.stroski;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatistikaService {

    private final StrosekRepository strosekRepository;

    public StatistikaService(StrosekRepository strosekRepository) {
        this.strosekRepository = strosekRepository;
    }

    public StatistikaDto izracunaj(int leto, int mesec) {
        YearMonth izbraniMesec = YearMonth.of(leto, mesec);
        LocalDate prviDan = izbraniMesec.atDay(1);
        LocalDate zadnjiDan = izbraniMesec.atEndOfMonth();

        // 1. Iz baze preberemo samo stroške izbranega meseca
        List<Strosek> stroski = strosekRepository.findByDatumBetween(prviDan, zadnjiDan);

        // 2. Skupna vsota vseh stroškov v mesecu
        double skupaj = 0;
        for (Strosek s : stroski) {
            skupaj = skupaj + s.getZnesek();
        }

        // 3. Vsota za vsak dan v mesecu (dan brez stroškov ima vsoto 0)
        List<StatistikaDto.DnevnaPoraba> dnevi = new ArrayList<>();
        for (int dan = 1; dan <= izbraniMesec.lengthOfMonth(); dan++) {
            double vsotaDneva = 0;
            for (Strosek s : stroski) {
                if (s.getDatum().getDayOfMonth() == dan) {
                    vsotaDneva = vsotaDneva + s.getZnesek();
                }
            }
            dnevi.add(new StatistikaDto.DnevnaPoraba(dan, naDveDecimalki(vsotaDneva)));
        }

        // 4. Vsota za vsako kategorijo (ključ = ime kategorije, vrednost = vsota)
        Map<String, Double> vsotePoKategorijah = new HashMap<>();
        for (Strosek s : stroski) {
            String kategorija = urediIme(s.getKategorija());
            double dosedanjaVsota = vsotePoKategorijah.getOrDefault(kategorija, 0.0);
            vsotePoKategorijah.put(kategorija, dosedanjaVsota + s.getZnesek());
        }

        // 5. Za vsako kategorijo izračunamo še delež v odstotkih
        List<StatistikaDto.PorabaKategorije> kategorije = new ArrayList<>();
        for (String kategorija : vsotePoKategorijah.keySet()) {
            double znesek = vsotePoKategorijah.get(kategorija);
            double delez = znesek / skupaj * 100;
            kategorije.add(new StatistikaDto.PorabaKategorije(
                    kategorija, naDveDecimalki(znesek), naEnoDecimalko(delez)));
        }

        return new StatistikaDto(leto, mesec, naDveDecimalki(skupaj), dnevi, kategorije);
    }

    // "  hrana " in "Hrana" postaneta isto ime: "Hrana"
    private String urediIme(String kategorija) {
        if (kategorija == null || kategorija.isBlank()) {
            return "Brez kategorije";
        }
        String ime = kategorija.trim().toLowerCase();
        return ime.substring(0, 1).toUpperCase() + ime.substring(1);
    }

    private double naDveDecimalki(double vrednost) {
        return Math.round(vrednost * 100) / 100.0;   // 12.345 -> 12.35
    }

    private double naEnoDecimalko(double vrednost) {
        return Math.round(vrednost * 10) / 10.0;     // 66.666 -> 66.7
    }
}

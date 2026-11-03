package si.faks.stroski;

import org.springframework.stereotype.Service;
import java.util.List;

@Service // Pove Springu, da ta razred vsebuje poslovno logiko.
public class StrosekService {

    private final StrosekRepository strosekRepository;

    // Odvisnost injiciramo preko konstruktorja (najboljša praksa).
    public StrosekService(StrosekRepository strosekRepository) {
        this.strosekRepository = strosekRepository;
    }

    // CREATE (Dodajanje)
    public Strosek dodajStrosek(Strosek strosek) {
        return strosekRepository.save(strosek);
    }

    // READ (Pridobivanje vseh)
    public List<Strosek> vrniVseStroske() {
        return strosekRepository.findAll();
    }

    // READ (Pridobivanje enega)
    public Strosek vrniStrosekPoIdu(Long id) {
        // Obravnava napake, če podatek ne obstaja
        return strosekRepository.findById(id).orElseThrow(() -> new RuntimeException("Strošek ni najden!"));
    }

    // UPDATE (Posodabljanje)
    public Strosek posodobiStrosek(Long id, Strosek posodobljenStrosek) {
        Strosek obstojeci = vrniStrosekPoIdu(id); // Najprej preverimo, če obstaja
        obstojeci.setNaziv(posodobljenStrosek.getNaziv());
        obstojeci.setZnesek(posodobljenStrosek.getZnesek());
        obstojeci.setKategorija(posodobljenStrosek.getKategorija());
        obstojeci.setDatum(posodobljenStrosek.getDatum());
        return strosekRepository.save(obstojeci);
    }

    // DELETE (Brisanje)
    public void izbrisiStrosek(Long id) {
        strosekRepository.deleteById(id);
    }
}
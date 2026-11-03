package si.faks.stroski;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController // Pove, da je to REST API in bo vračal podatke (v formatu JSON).
@RequestMapping("/api/stroski") // Osnovna pot za vse končne točke v tem razredu.
@CrossOrigin(origins = "*")
public class StrosekController {

    private final StrosekService strosekService;

    public StrosekController(StrosekService strosekService) {
        this.strosekService = strosekService;
    }

    // CREATE: POST http://localhost:8080/api/stroski
    @PostMapping
    public ResponseEntity<Strosek> dodajStrosek(@RequestBody Strosek strosek) {
        // @RequestBody pove Springu, naj pretvori dohodni JSON v objekt Strosek.
        Strosek novStrosek = strosekService.dodajStrosek(strosek);
        return new ResponseEntity<>(novStrosek, HttpStatus.CREATED);
    }

    // READ (Vsi): GET http://localhost:8080/api/stroski
    @GetMapping
    public List<Strosek> vrniVse() {
        return strosekService.vrniVseStroske();
    }

    // READ (Posamezen): GET http://localhost:8080/api/stroski/1
    @GetMapping("/{id}")
    public ResponseEntity<Strosek> vrniEnega(@PathVariable Long id) {
        // @PathVariable izlušči "id" iz URL-ja.
        return ResponseEntity.ok(strosekService.vrniStrosekPoIdu(id));
    }

    // UPDATE: PUT http://localhost:8080/api/stroski/1
    @PutMapping("/{id}")
    public ResponseEntity<Strosek> posodobi(@PathVariable Long id, @RequestBody Strosek strosek) {
        return ResponseEntity.ok(strosekService.posodobiStrosek(id, strosek));
    }

    // DELETE: DELETE http://localhost:8080/api/stroski/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> izbrisi(@PathVariable Long id) {
        strosekService.izbrisiStrosek(id);
        return ResponseEntity.noContent().build();
    }
}
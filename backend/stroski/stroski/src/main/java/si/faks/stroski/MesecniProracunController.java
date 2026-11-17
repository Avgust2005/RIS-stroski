package si.faks.stroski;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestController
@RequestMapping("/api/proracuni")
@CrossOrigin(origins = "*")
public class MesecniProracunController {

    private final MesecniProracunService proracunService;

    public MesecniProracunController(MesecniProracunService proracunService) {
        this.proracunService = proracunService;
    }

    @GetMapping("/{leto}/{mesec}")
    public ResponseEntity<MesecniProracun> pridobi(@PathVariable Integer leto, @PathVariable Integer mesec) {

        preveriObdobje(leto, mesec);

        MesecniProracun proracun = proracunService.pridobi(leto, mesec).orElse(null);

        if (proracun == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(proracun);
    }

    @PutMapping("/{leto}/{mesec}")
    public ResponseEntity<MesecniProracun> shrani(@PathVariable Integer leto, @PathVariable Integer mesec,
        @Valid @RequestBody MesecniProracunZahteva zahteva) {

        preveriObdobje(leto, mesec);

        boolean obstaja = proracunService.pridobi(leto, mesec).isPresent();

        MesecniProracun proracun = proracunService.shrani(leto, mesec, zahteva.getZnesek());

        if (obstaja) {
            return ResponseEntity.ok(proracun);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(proracun);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> neveljavenVnos(MethodArgumentNotValidException napaka) {

        String sporocilo = napaka.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        return ResponseEntity.badRequest().body(Map.of("sporocilo", sporocilo));
    }

    private void preveriObdobje(Integer leto, Integer mesec) {
        if (leto < 1 || leto > 9999 || mesec < 1 || mesec > 12) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Neveljavno leto ali mesec.");
        }
    }
}
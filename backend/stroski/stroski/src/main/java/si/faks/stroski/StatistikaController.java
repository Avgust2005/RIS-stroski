package si.faks.stroski;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/statistika")
@CrossOrigin(origins = "*")
public class StatistikaController {

    private final StatistikaService statistikaService;

    public StatistikaController(StatistikaService statistikaService) {
        this.statistikaService = statistikaService;
    }

    // GET http://localhost:8080/api/statistika?leto=2026&mesec=11
    @GetMapping
    public StatistikaDto vrniStatistiko(@RequestParam int leto, @RequestParam int mesec) {
        if (mesec < 1 || mesec > 12) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mesec mora biti med 1 in 12.");
        }
        return statistikaService.izracunaj(leto, mesec);
    }
}

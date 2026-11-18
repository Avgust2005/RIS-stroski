package si.faks.stroski;

import java.math.BigDecimal;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MesecniProracunService {

    private final MesecniProracunRepository proracunRepository;

    public MesecniProracunService(MesecniProracunRepository proracunRepository) {
        this.proracunRepository = proracunRepository;
    }

    public Optional<MesecniProracun> pridobi(Integer leto, Integer mesec) {
        return proracunRepository.findByLetoAndMesec(leto, mesec);
    }

    @Transactional
    public MesecniProracun shrani(Integer leto, Integer mesec, BigDecimal znesek) {

        MesecniProracun proracun = proracunRepository.findByLetoAndMesec(leto, mesec).orElse(null);

        if (proracun == null) {
            proracun = new MesecniProracun();
            proracun.setLeto(leto);
            proracun.setMesec(mesec);
        }

        proracun.setZnesek(znesek);

        return proracunRepository.save(proracun);
    }
}
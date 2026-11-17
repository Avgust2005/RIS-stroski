package si.faks.stroski;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MesecniProracunRepository
        extends JpaRepository<MesecniProracun, Long> {

    Optional<MesecniProracun> findByLetoAndMesec(Integer leto, Integer mesec);
}
package si.faks.stroski;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StrosekRepository extends JpaRepository<Strosek, Long> {

    // Spring iz imena metode sam sestavi SQL:
    // SELECT * FROM stroski WHERE datum BETWEEN ? AND ?
    List<Strosek> findByDatumBetween(LocalDate zacetek, LocalDate konec);
}
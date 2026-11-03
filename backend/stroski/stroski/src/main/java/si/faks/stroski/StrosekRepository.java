package si.faks.stroski;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Oznaka, da gre za komponento, ki dostopa do podatkov.
// JpaRepository<T, ID> -> T je naš model (Strosek), ID je tip primarnega ključa
// (Long).
public interface StrosekRepository extends JpaRepository<Strosek, Long> {
    // Spring bo samodejno implementiral metode kot so save(), findAll(),
    // findById(), deleteById().
}
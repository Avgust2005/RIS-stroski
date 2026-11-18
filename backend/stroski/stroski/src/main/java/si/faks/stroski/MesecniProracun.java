package si.faks.stroski;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "mesecni_proracuni",
    uniqueConstraints = @UniqueConstraint(columnNames = {"leto", "mesec"})
)

public class MesecniProracun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer leto;

    @Column(nullable = false)
    private Integer mesec;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal znesek;

    public MesecniProracun() {
    }

    public Long getId() {
        return id;
    }

    public Integer getLeto() {
        return leto;
    }

    public void setLeto(Integer leto) {
        this.leto = leto;
    }

    public Integer getMesec() {
        return mesec;
    }

    public void setMesec(Integer mesec) {
        this.mesec = mesec;
    }

    public BigDecimal getZnesek() {
        return znesek;
    }

    public void setZnesek(BigDecimal znesek) {
        this.znesek = znesek;
    }

}

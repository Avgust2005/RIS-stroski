package si.faks.stroski;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Digits;

public class MesecniProracunZahteva {

    @NotNull(message = "Znesek je obvezen in mora biti večji od nič.")

    @Positive(message = "Znesek je obvezen in mora biti večji od nič.")

    @Digits(
        integer = 10,
        fraction = 2,
        message = "Znesek ima lahko največ 10 števk pred decimalno vejico in 2 za njo."
    )

    
    private BigDecimal znesek;

    public BigDecimal getZnesek() {
        return znesek;
    }

    public void setZnesek(BigDecimal znesek) {
        this.znesek = znesek;
    }
}
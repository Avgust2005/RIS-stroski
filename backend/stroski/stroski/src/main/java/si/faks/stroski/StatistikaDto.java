package si.faks.stroski;

import java.util.List;

// To backend pošlje frontendu kot JSON.
public record StatistikaDto(
        int leto,
        int mesec,
        double skupaj,
        List<DnevnaPoraba> dnevi,
        List<PorabaKategorije> kategorije
) {
    // En stolpec v stolpčnem grafu: dan v mesecu in vsota tega dne
    public record DnevnaPoraba(int dan, double znesek) {}

    // En kos torte: kategorija, vsota in delež v %
    public record PorabaKategorije(String kategorija, double znesek, double delez) {}
}
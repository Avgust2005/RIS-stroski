import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const IMENA_MESECEV = ['januar', 'februar', 'marec', 'april', 'maj', 'junij',
    'julij', 'avgust', 'september', 'oktober', 'november', 'december'];

const BARVE = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#17a2b8', '#fd7e14', '#6c757d'];

function Statistika({ stroski }) {
    // Trenutni mesec v obliki "2026-11" (prvih 7 znakov iz "2026-11-17T...")
    const [izbraniMesec, setIzbraniMesec] = useState(new Date().toISOString().slice(0, 7));
    const [podatki, setPodatki] = useState(null);
    const [napaka, setNapaka] = useState(false);

    const leto = izbraniMesec.slice(0, 4);            // "2026"
    const mesec = Number(izbraniMesec.slice(5, 7));   // 11

    // Ko se spremeni izbrani mesec ali seznam stroškov, ponovno naložimo statistiko
    useEffect(() => {
        pridobiStatistiko();
    }, [izbraniMesec, stroski]);

    const pridobiStatistiko = async () => {
        try {
            const odgovor = await fetch(`http://localhost:8080/api/statistika?leto=${leto}&mesec=${mesec}`);
            if (!odgovor.ok) {
                throw new Error('Strežnik je vrnil napako');
            }
            const json = await odgovor.json();
            setPodatki(json);
            setNapaka(false);
        } catch (error) {
            console.error("Napaka pri pridobivanju statistike:", error);
            setNapaka(true);
        }
    };

    // Za tortni graf vsaki kategoriji dodamo napis, npr. "Hrana (20,8 %)"
    const kategorijeZaGraf = [];
    if (podatki) {
        for (const k of podatki.kategorije) {
            const delez = String(k.delez).replace('.', ',');
            kategorijeZaGraf.push({ znesek: k.znesek, oznaka: k.kategorija + ' (' + delez + ' %)' });
        }
    }

    const imeMeseca = IMENA_MESECEV[mesec - 1] + ' ' + leto;   // "november 2026"
    const niStroskov = podatki !== null && podatki.skupaj === 0;
    const imaStroske = podatki !== null && podatki.skupaj > 0;

    return (
        <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h2>Statistika porabe</h2>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Mesec:</label>
            <input type="month" value={izbraniMesec} onChange={(e) => setIzbraniMesec(e.target.value)} />

            {/* SK-7: strežnik ni dosegljiv */}
            {napaka && (
                <p style={{ color: 'red' }}>Statistike trenutno ni mogoče prikazati. Poskusite znova pozneje.</p>
            )}

            {/* SK-6: v mesecu ni stroškov */}
            {!napaka && niStroskov && (
                <p>Za {imeMeseca} ni podatkov o porabi.</p>
            )}

            {/* SK-1 do SK-5: oba grafa */}
            {!napaka && imaStroske && (
                <div>
                    <p><strong>Skupaj: {podatki.skupaj.toFixed(2)} €</strong></p>

                    <h3>Poraba po dnevih</h3>
                    <BarChart width={800} height={300} data={podatki.dnevi}>
                        <XAxis dataKey="dan" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="znesek" name="Poraba (€)" fill="#007bff" />
                    </BarChart>

                    <h3>Poraba po kategorijah</h3>
                    <PieChart width={800} height={350}>
                        <Pie data={kategorijeZaGraf} dataKey="znesek" nameKey="oznaka" label={(kos) => kos.name}>
                            {kategorijeZaGraf.map((k, i) => (
                                <Cell key={i} fill={BARVE[i % BARVE.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            )}
        </div>
    );
}

export default Statistika;
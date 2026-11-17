import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/proracuni';

function MesecniProracun() {
const danes = new Date();
const leto = danes.getFullYear();
const mesec = String(danes.getMonth() + 1).padStart(2, '0');

const [obdobje, setObdobje] = useState(`${leto}-${mesec}`);
const [znesek, setZnesek] = useState('');

const [sporocilo, setSporocilo] = useState('');
const [nalozenoObdobje, setNalozenoObdobje] = useState('');

const [shranjevanje, setShranjevanje] = useState(false);

useEffect(() => {
    let prezriOdgovor = false;

    setZnesek('');
    setNalozenoObdobje('');

    if (!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(obdobje) || obdobje.startsWith('0000')) {
    setSporocilo('Vnesi veljavno leto in mesec, na primer 2026-11.');
    return;
    }

    setSporocilo('Nalaganje proračuna...');

    async function naloziProracun() {
    const [izbranoLeto, izbraniMesec] = obdobje.split('-');

    try {
        const odgovor = await fetch(
        `${API_URL}/${izbranoLeto}/${izbraniMesec}`
        );

        if (odgovor.status === 404) {
        if (!prezriOdgovor) {
            setSporocilo('Za izbrano obdobje proračun še ni nastavljen.');
            setNalozenoObdobje(obdobje);
        }
        return;
        }

        if (!odgovor.ok) {
        throw new Error('Napaka pri pridobivanju proračuna.');
        }

        const proracun = await odgovor.json();

        if (!prezriOdgovor) {
        setZnesek(String(proracun.znesek));
        setSporocilo('');
        setNalozenoObdobje(obdobje);
        }
    } catch {
        if (!prezriOdgovor) {
        setSporocilo('Proračuna ni bilo mogoče naložiti. Poskusi osvežiti stran.');
        }
    }
    }

    naloziProracun();

    return () => {
    prezriOdgovor = true;
    };
}, [obdobje]);

async function shraniProracun(dogodek) {
    dogodek.preventDefault();

    if (shranjevanje || !obdobje || nalozenoObdobje !== obdobje) {
    return;
    }

    const znesekStevilo = Number(znesek);

    if (znesek.trim() === ''
        || !Number.isFinite(znesekStevilo)
        || znesekStevilo <= 0) {
    setSporocilo('Znesek je obvezen in mora biti večji od nič.');
    return;
    }

    const [izbranoLeto, izbraniMesec] = obdobje.split('-');

    setShranjevanje(true);
    setSporocilo('Shranjevanje proračuna...');

    try {
    const odgovor = await fetch(
        `${API_URL}/${izbranoLeto}/${izbraniMesec}`,
        {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ znesek: znesekStevilo })
        }
    );

    const podatki = await odgovor.json();

    if (!odgovor.ok) {
        setSporocilo(
        podatki.sporocilo || 'Proračuna ni bilo mogoče shraniti.'
        );
        return;
    }

    setZnesek(String(podatki.znesek));
    setSporocilo(
        `Proračun za ${obdobje} je uspešno shranjen: ${Number(podatki.znesek).toFixed(2)} €.`
    );
    } catch {
    setSporocilo('Shranjevanja ni bilo mogoče potrditi. Poskusi znova.');
    } finally {
    setShranjevanje(false);
    }
}

return (
    <section style={{
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #888',
    borderRadius: '6px',
    textAlign: 'left'
    }}>
    <h2>Skupni mesečni proračun</h2>

    <form
        noValidate
        onSubmit={shraniProracun}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'end' }}
    >
        <label>
        Leto in mesec
        <br />
        <input
            type="month"
            min="0001-01"
            max="9999-12"
            value={obdobje}
            onChange={(dogodek) => setObdobje(dogodek.target.value)}
            disabled={shranjevanje}
            required
        />
        </label>

        <label>
        Proračun (€)
        <br />
        <input
            type="number"
            min="0.01"
            max="9999999999.99"
            step="0.01"
            value={znesek}
            onChange={(dogodek) => setZnesek(dogodek.target.value)}
            disabled={nalozenoObdobje !== obdobje || !obdobje || shranjevanje}
            required
        />
        </label>

        <button type="submit" disabled={nalozenoObdobje !== obdobje || !obdobje || shranjevanje}>
            {shranjevanje ? 'Shranjujem...' : 'Shrani'}
        </button>
        </form>
        <p role="status" style={{ marginTop: '12px' }}>
            {sporocilo}
        </p>
    </section>
);
}

export default MesecniProracun;
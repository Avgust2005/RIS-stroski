import { useState, useEffect } from 'react';
import MesecniProracun from './MesecniProracun.jsx';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [stroski, setStroski] = useState([]);
  const [form, setForm] = useState({ naziv: '', znesek: '', kategorija: '', datum: '' });
  const [editId, setEditId] = useState(null);

  // Novo stanje za shranjevanje izbrane kategorije
  const [filterKategorija, setFilterKategorija] = useState('');

  const API_URL = 'http://localhost:8080/api/stroski';

  // R - READ (Pridobivanje vseh stroškov)
  useEffect(() => {
    fetchStroski();
  }, []);

  const fetchStroski = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStroski(data);
    } catch (error) {
      console.error("Napaka pri pridobivanju podatkov:", error);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // C & U - CREATE & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    try {
      await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ naziv: '', znesek: '', kategorija: '', datum: '' });
      setEditId(null);
      fetchStroski();
    } catch (error) {
      console.error("Napaka pri shranjevanju:", error);
    }
  };

  // D - DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchStroski();
    } catch (error) {
      console.error("Napaka pri brisanju:", error);
    }
  };

  const startEdit = (strosek) => {
    setEditId(strosek.id);
    setForm({
      naziv: strosek.naziv,
      znesek: strosek.znesek,
      kategorija: strosek.kategorija,
      datum: strosek.datum
    });
  };

  // --- NOVA LOGIKA ZA FILTRIRANJE IN SEŠTEVEK ---

  // 1. Dinamično pridobivanje unikatnih kategorij iz vseh stroškov za Dropdown meni
  const unikatneKategorije = [...new Set(stroski.map(s => s.kategorija))];

  // 2. Filtriranje: Če je izbrana kategorija, vrni le ujemajoče, sicer vrni vse
  const prikazaniStroski = filterKategorija
      ? stroski.filter(s => s.kategorija === filterKategorija)
      : stroski;

  // 3. Izračun vsote: Seštejemo zneske samo tistih stroškov, ki so trenutno prikazani
  const skupniZnesek = prikazaniStroski.reduce((vsota, strosek) => vsota + Number(strosek.znesek), 0);


  // 1. Izvoz v CSV
  const izvoziCSV = () => {
    if (prikazaniStroski.length === 0) return alert("Ni podatkov za izvoz.");

    const glava = ["ID", "Naziv", "Znesek (EUR)", "Kategorija", "Datum"];
    const vrstice = prikazaniStroski.map(s => [
      s.id,
      `"${s.naziv}"`,
      Number(s.znesek).toFixed(2),
      `"${s.kategorija}"`,
      s.datum
    ]);

    const csvVsebina = [glava.join(";"), ...vrstice.map(e => e.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csvVsebina], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "stroski.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Izvoz v XLSX (Excel)
  const izvoziXLSX = () => {
    if (prikazaniStroski.length === 0) return alert("Ni podatkov za izvoz.");

    const podatkiZaExcel = prikazaniStroski.map(s => ({
      ID: s.id,
      Naziv: s.naziv,
      "Znesek (€)": Number(s.znesek),
      Kategorija: s.kategorija,
      Datum: s.datum
    }));

    const delovniList = XLSX.utils.json_to_sheet(podatkiZaExcel);
    const delovniZvezek = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(delovniZvezek, delovniList, "Stroški");
    XLSX.writeFile(delovniZvezek, "stroski.xlsx");
  };

  // 3. Izvoz v PDF
  const izvoziPDF = () => {
    if (prikazaniStroski.length === 0) return alert("Ni podatkov za izvoz.");

    const doc = new jsPDF();
    doc.text("Porocilo o stroskih", 14, 15);
    doc.setFontSize(11);
    doc.text(`Skupni znesek: ${skupniZnesek.toFixed(2)} EUR`, 14, 22);

    const stolpci = ["ID", "Naziv", "Znesek (EUR)", "Kategorija", "Datum"];
    const vrstice = prikazaniStroski.map(s => [
      s.id,
      s.naziv,
      Number(s.znesek).toFixed(2),
      s.kategorija,
      s.datum
    ]);

    autoTable(doc, {
      head: [stolpci],
      body: vrstice,
      startY: 28,
    });

    doc.save("stroski.pdf");
  };

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', margin: '0 auto' }}>
        <h1>Aplikacija za spremljanje stroškov</h1>
        <MesecniProracun />

        {/* Obrazec za vnos in urejanje */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input name="naziv" value={form.naziv} onChange={handleInputChange} placeholder="Naziv" required />
          <input name="znesek" type="number" step="0.01" value={form.znesek} onChange={handleInputChange} placeholder="Znesek (€)" required />
          <input name="kategorija" value={form.kategorija} onChange={handleInputChange} placeholder="Kategorija (npr. Hrana)" required />
          <input name="datum" type="date" value={form.datum} onChange={handleInputChange} required />
          <button type="submit" style={{ cursor: 'pointer', padding: '5px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            {editId ? 'Posodobi' : 'Dodaj'}
          </button>
        </form>

        {/* Vrstica s filtrom in skupnim zneskom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <div>
            <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filtriraj po kategoriji:</label>
            <select
                value={filterKategorija}
                onChange={(e) => setFilterKategorija(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">-- Vse kategorije --</option>
              {unikatneKategorije.map(kat => (
                  <option key={kat} value={kat}>{kat}</option>
              ))}
            </select>
          </div>
          <h3 style={{ margin: 0, color: '#28a745' }}>Skupaj: {skupniZnesek.toFixed(2)} €</h3>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={izvoziCSV} style={{ cursor: 'pointer', padding: '6px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
            Izvozi CSV
          </button>
          <button onClick={izvoziXLSX} style={{ cursor: 'pointer', padding: '6px 10px', backgroundColor: '#217346', color: 'white', border: 'none', borderRadius: '4px' }}>
            Izvozi Excel
          </button>
          <button onClick={izvoziPDF} style={{ cursor: 'pointer', padding: '6px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
            Izvozi PDF
          </button>
        </div>

        {/* Tabela za prikaz podatkov */}
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Znesek (€)</th>
            <th>Kategorija</th>
            <th>Datum</th>
            <th>Akcije</th>
          </tr>
          </thead>
          <tbody>
          {prikazaniStroski.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Ni najdenih stroškov za ta filter.</td></tr>
          ) : (
              prikazaniStroski.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.naziv}</td>
                    <td>{Number(s.znesek).toFixed(2)}</td>
                    <td>{s.kategorija}</td>
                    <td>{s.datum}</td>
                    <td>
                      <button onClick={() => startEdit(s)} style={{ marginRight: '10px', cursor: 'pointer' }}>Uredi</button>
                      <button onClick={() => handleDelete(s.id)} style={{ cursor: 'pointer', color: 'red' }}>Izbriši</button>
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  )
}

export default App
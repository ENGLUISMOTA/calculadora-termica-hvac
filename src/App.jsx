import { useState } from 'react'
import './App.css'

function App() {
  // Estados para as variáveis de engenharia
  const [area, setArea] = useState('')
  const [pessoas, setPessoas] = useState('')
  const [aparelhos, setAparelhos] = useState('')
  const [sol, setSol] = useState(false) // false = Manhã/Noite, true = Tarde
  const [resultado, setResultado] = useState(null)

  const calcularCarga = (e) => {
    e.preventDefault()
    
    // Fator base: 600 BTU/m² (padrão) ou 800 BTU/m² (sol forte)
    const fatorBase = sol ? 800 : 600
    
    const cargaArea = Number(area) * fatorBase
    // A primeira pessoa não conta (já está no fator m²), adicionamos 600 por pessoa extra
    const cargaPessoas = Number(pessoas) > 1 ? (Number(pessoas) - 1) * 600 : 0
    const cargaAparelhos = Number(aparelhos) * 600
    
    setResultado(cargaArea + cargaPessoas + cargaAparelhos)
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Dimensionamento HVAC</h1>
        
        <form onSubmit={calcularCarga}>
          <div className="input-group">
            <label>Área do Ambiente (m²)</label>
            <input type="number" value={area} onChange={(e) => setArea(e.target.value)} placeholder="0" required />
          </div>

          <div className="input-group">
            <label>Nº de Ocupantes</label>
            <input type="number" value={pessoas} onChange={(e) => setPessoas(e.target.value)} placeholder="1" />
          </div>

          <div className="input-group">
            <label>Eletrônicos (TV, PC, etc)</label>
            <input type="number" value={aparelhos} onChange={(e) => setAparelhos(e.target.value)} placeholder="0" />
          </div>

          <div className="toggle-group">
            <label>Incidência Solar Forte?</label>
            <input type="checkbox" checked={sol} onChange={(e) => setSol(e.target.checked)} />
          </div>

          <button type="submit" className="btn-calc">Calcular Projeto</button>
        </form>

        {resultado && (
          <div className="result-area">
            <span>Capacidade Térmica Total</span>
            <p>{resultado.toLocaleString()} BTU/h</p>
            <small>{(resultado / 12000).toFixed(1)} TR</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
import { useState } from 'react'
import './App.css'

function App() {
  // Estados para as variáveis do cálculo
  const [area, setArea] = useState('')
  const [pessoas, setPessoas] = useState('')
  const [aparelhos, setAparelhos] = useState('')
  const [sol, setSol] = useState(false) 
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)

  // URL do Webhook de Teste do seu n8n no Render
  const N8N_WEBHOOK_URL = 'https://n8n-zz8g.onrender.com/webhook-test/calculo-hvac'

  const calcularCarga = async (e) => {
    e.preventDefault()
    setCarregando(true)
    
    // Preparando o payload para o n8n
    const dadosParaN8n = {
      area: Number(area),
      ocupantes: Number(pessoas),
      eletronicos: Number(aparelhos),
      Sol_forte: sol ? 1 : 0 
    }

    try {
      // Requisição POST para o servidor n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaN8n)
      })

      if (!response.ok) {
        throw new Error(`Erro na conexão: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      // Atualiza o estado com a chave exata que o n8n vai devolver
      setResultado(data.resultado_btu)

    } catch (error) {
      console.error("Erro ao calcular:", error)
      alert("Erro ao conectar com a API do n8n. Verifique se o webhook de teste está 'ouvindo' (Listen for Test Event) no Render.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Dimensionamento HVAC</h1>
        
        <form onSubmit={calcularCarga}>
          <div className="input-group">
            <label>Área do Ambiente (m²)</label>
            <input 
              type="number" 
              value={area} 
              onChange={(e) => setArea(e.target.value)} 
              placeholder="0" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Nº de Ocupantes</label>
            <input 
              type="number" 
              value={pessoas} 
              onChange={(e) => setPessoas(e.target.value)} 
              placeholder="1" 
            />
          </div>

          <div className="input-group">
            <label>Eletrônicos (TV, PC, etc)</label>
            <input 
              type="number" 
              value={aparelhos} 
              onChange={(e) => setAparelhos(e.target.value)} 
              placeholder="0" 
            />
          </div>

          <div className="toggle-group">
            <label>Incidência Solar Forte?</label>
            <input 
              type="checkbox" 
              checked={sol} 
              onChange={(e) => setSol(e.target.checked)} 
            />
          </div>

          <button type="submit" className="btn-calc" disabled={carregando}>
            {carregando ? 'Calculando no n8n...' : 'Calcular Projeto'}
          </button>
        </form>

        {resultado && (
          <div className="result-area">
            <span>Capacidade Térmica Total</span>
            <p>{resultado.toLocaleString('pt-BR')} BTU/h</p>
            <small>{(resultado / 12000).toFixed(1)} TR</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
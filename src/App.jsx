import { useState } from 'react'
import './App.css'

function App() {
  // Estados para as variáveis de engenharia
  const [area, setArea] = useState('')
  const [pessoas, setPessoas] = useState('')
  const [aparelhos, setAparelhos] = useState('')
  const [sol, setSol] = useState(false) 
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false) // Estado para feedback visual

  const calcularCarga = async (e) => {
    e.preventDefault()
    setCarregando(true)
    
    // 1. Preparamos o objeto exatamente como o n8n espera receber
    const dadosParaN8n = {
      area: Number(area),
      ocupantes: Number(pessoas),
      eletronicos: Number(aparelhos),
      Sol_forte: sol ? 1 : 0 // Enviando como 1 ou 0 para facilitar no n8n
    }

    try {
      // 2. Chamada para o seu Webhook do n8n no Docker
      // IMPORTANTE: Use a 'Test URL' do seu nó Webhook enquanto estiver desenvolvendo
      const response = await fetch('http://localhost:5678/webhook-test/calculo-hvac', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaN8n)
      })

      if (!response.ok) throw new Error('Erro na conexão com n8n')

      const data = await response.json()

      // 3. Atualizamos o estado com o valor que o n8n calculou
      // Nota: 'resultado_btu' deve ser o nome da chave que você colocou no 'return' do nó Code
      setResultado(data.resultado_btu)

    } catch (error) {
      console.error("Erro ao calcular:", error)
      alert("Erro ao conectar com o servidor de cálculo (n8n). Verifique se o Docker está rodando.")
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

          <button type="submit" className="btn-calc" disabled={carregando}>
            {carregando ? 'Calculando no n8n...' : 'Calcular Projeto'}
          </button>
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
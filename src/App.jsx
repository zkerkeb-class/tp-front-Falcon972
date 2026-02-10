import './App.css'
import Pokelist from './components/pokelist'

function App() {
  return (
    <div>
      <h1 className='retro-title' style={{ textAlign: 'center', marginTop: '20px' }}>POKEDEX</h1>
      <Pokelist />
    </div>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router";
import PokemonDetails from './screens/pokemonDetails.jsx';
import PokemonCreate from './screens/PokemonCreate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pokemonDetails/:id" element={<PokemonDetails />} />
        <Route path="/create" element={<PokemonCreate />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)

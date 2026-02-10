import { useState, useEffect } from 'react';
import './App.css';
import Pokelist from './components/pokelist';

function App() {
  const [team, setTeam] = useState([]);

  // Charge l'équipe depuis le localStorage
  const loadTeam = () => {
    const savedTeam = JSON.parse(localStorage.getItem('myPokemonTeam') || '[]');
    setTeam(savedTeam);
  };

  useEffect(() => {
    loadTeam();
    // Écoute l'événement pour mettre à jour l'affichage en temps réel si on ajoute/supprime
    window.addEventListener('teamUpdated', loadTeam);
    return () => window.removeEventListener('teamUpdated', loadTeam);
  }, []);

  return (
    <div>
      <h1 className='retro-title'>POKEDEX</h1>
      
      {/* --- DASHBOARD ÉQUIPE (Non cliquable) --- */}
      <div className="team-dashboard">
        <h2 className="team-title">
          MON ÉQUIPE ({team.length}/6)
        </h2>
        
        {team.length === 0 ? (
          <p className="team-empty-message">Aucun Pokémon. Sélectionnez-en un dans les détails !</p>
        ) : (
          <div className="team-grid">
            {team.map((member) => (
              /* Pas de Link ici, juste la div */
              <div key={member.id} className="team-member-card">
                <div className="team-member-img-wrapper">
                  <img src={member.image} alt={member.name?.french} className="team-member-img" />
                </div>
                <span className="team-member-name">
                  {member.name?.french}
                </span>
              </div>
            ))}
            
            {/* Slots vides pour compléter jusqu'à 6 */}
            {Array.from({ length: 6 - team.length }).map((_, i) => (
                <div key={`empty-${i}`} className="team-slot-empty">
                     <div className="team-slot-placeholder">?</div>
                </div>
            ))}
          </div>
        )}
      </div>

      <Pokelist />
    </div>
  )
}

export default App;
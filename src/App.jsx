import { useState, useEffect } from 'react';
import './App.css';
import Pokelist from './components/pokelist';

function App() {
  const [team, setTeam] = useState([]);

  const loadTeam = () => {
    const savedTeam = JSON.parse(localStorage.getItem('myPokemonTeam') || '[]');
    setTeam(savedTeam);
  };

  useEffect(() => {
    loadTeam();
    window.addEventListener('teamUpdated', loadTeam);
    return () => window.removeEventListener('teamUpdated', loadTeam);
  }, []);

  return (
    <div>
      <h1 className='retro-title'>POKEDEX</h1>
      
      <div className="team-dashboard">
        <h2 className="team-title">
          MON ÉQUIPE ({team.length}/6)
        </h2>
        
        {team.length === 0 ? (
          <p className="team-empty-message">Aucun Pokémon. Sélectionnez-en un dans les détails !</p>
        ) : (
          <div className="team-grid">
            {team.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="team-member-img-wrapper">
                  <img src={member.image} alt={member.name?.french} className="team-member-img" />
                </div>
                <span className="team-member-name">
                  {member.name?.french}
                </span>
              </div>
            ))}
            
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
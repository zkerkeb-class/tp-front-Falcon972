import { Link } from "react-router";
import './index.css';
import PokeImage from "./pokeImage";

const PokeCard = ({ pokemon }) => {
    const imageUrl = pokemon.image || "https://via.placeholder.com/150";
    const type = pokemon.type?.[0] || 'Normal';

    return (
        <Link to={`/pokemonDetails/${pokemon.id}`} className="card-link">
            <div className="retro-card-border">
                <div className={`retro-card-inner type-bg-${type.toLowerCase()}`}>
                    <div className="retro-header">
                        <span className="retro-name">{pokemon.name?.french}</span>
                        <span className="retro-hp">
                            <small>PV</small>{pokemon.base?.HP}
                        </span>
                    </div>
                    
                    <div className="retro-image-frame">
                        <PokeImage imageUrl={imageUrl} />
                    </div>

                    <div className="retro-flavor-bar">
                        Pokémon #{pokemon.id}
                    </div>

                    <div className="retro-stats-box">
                        <div className="stat-line">
                            <strong>ATK:</strong> {pokemon.base?.Attack}
                        </div>
                        <div className="stat-line">
                            <strong>DEF:</strong> {pokemon.base?.Defense}
                        </div>
                        <div className="stat-line">
                            <strong>VIT:</strong> {pokemon.base?.Speed}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PokeCard;
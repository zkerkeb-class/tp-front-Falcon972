import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import './index.css';
import { Link } from "react-router";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/pokemons?page=${page}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemons(data.data); 
                setTotalPages(data.totalPages); 
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults(null);
        } else {
            try {
                const response = await fetch(`http://localhost:3000/pokemons/search?q=${encodeURIComponent(query)}`);
                const results = await response.json();
                setSearchResults(results);
            } catch (error) {
                console.error("Erreur recherche:", error);
                setSearchResults([]);
            }
        }
    };

    if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Chargement du Pokedex...</p>;

    const displayPokemons = searchResults !== null ? searchResults : pokemons;

    return (
        <div className="poke-list-container">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '10px' }}>
                <Link to="/create">
                    <button className="retro-btn" style={{ backgroundColor: '#44aa44', borderColor: '#2e7d32', fontSize: '1.2em' }}>
                        + Ajouter un Pokémon
                    </button>
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="🔍 Rechercher un Pokémon par nom..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                        padding: '10px 15px',
                        fontSize: '1em',
                        width: '300px',
                        border: '2px solid #ffcc00',
                        borderRadius: '5px',
                        backgroundColor: '#333',
                        color: '#fff',
                        boxShadow: '0 0 10px rgba(255, 204, 0, 0.3)'
                    }}
                />
            </div>

            {searchResults === null && (
                <div className="top-nav">
                    <button 
                        onClick={() => handlePageChange(page - 1)} 
                        disabled={page === 1}
                        className="retro-btn"
                    >
                        ◀ Précédent
                    </button>
                    
                    <h2 className="retro-title">PAGE {page} / {totalPages}</h2>

                    <button 
                        onClick={() => handlePageChange(page + 1)} 
                        disabled={page === totalPages}
                        className="retro-btn"
                    >
                        Suivant ▶
                    </button>
                </div>
            )}
            
            <ul className="poke-list">
                {displayPokemons.length > 0 ? (
                    displayPokemons.map((pokemon) => (
                        <PokeCard key={pokemon.id} pokemon={pokemon} />
                    ))
                ) : (
                    <p style={{ color: 'white', textAlign: 'center', gridColumn: '1 / -1', padding: '20px' }}>
                        Aucun Pokémon trouvé{searchQuery ? ` pour "${searchQuery}"` : ''}
                    </p>
                )}
            </ul>

            {searchResults === null && (
                <div className="pagination-bottom">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`page-number ${page === pageNum ? 'active' : ''}`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PokeList;
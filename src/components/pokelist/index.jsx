import { useState, useEffect } from "react";
import PokeCard from "../pokeCard";
import './index.css';
import { Link } from "react-router";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p style={{ color: 'white', textAlign: 'center' }}>Chargement du Pokedex...</p>;

    return (
        <div className="poke-list-container">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Link to="/create">
                    <button className="retro-btn" style={{ backgroundColor: '#44aa44', borderColor: '#2e7d32', fontSize: '1.2em' }}>
                        + Ajouter un Pokémon
                    </button>
                </Link>
            </div>

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
            
            <ul className="poke-list">
                {pokemons.map((pokemon) => (
                    <PokeCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </ul>

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
        </div>
    );
};

export default PokeList;
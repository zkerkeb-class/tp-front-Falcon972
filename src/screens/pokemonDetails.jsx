import { useEffect, useState, useMemo } from 'react'; 
import { Link, useParams, useNavigate } from 'react-router'; 
import './PokemonDetails.css'; 
import '../components/pokelist/index.css'; 

// Couleurs associées aux types
const TYPE_COLORS = {
    Normal: '#A8A77A', Fire: '#EE8130', Water: '#6390F0', Electric: '#F7D02C',
    Grass: '#7AC74C', Ice: '#96D9D6', Fighting: '#C22E28', Poison: '#A33EA1',
    Ground: '#E2BF65', Flying: '#A98FF3', Psychic: '#F95587', Bug: '#A6B91A',
    Rock: '#B6A136', Ghost: '#735797', Dragon: '#6F35FC', Steel: '#B7B7CE',
    Fairy: '#D685AD'
};

const POKEMON_TYPES = Object.keys(TYPE_COLORS);

const getRandom = (min, max) => Math.random() * (max - min) + min;

const PokemonDetails = () => { 
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // --- LOGIQUE D'ANIMATION AMÉLIORÉE ---
    const backgroundFloaters = useMemo(() => {
        // On génère 20 éléments pour assurer un flux continu
        return Array.from({ length: 20 }).map((_, index) => {
            const duration = getRandom(15, 35); // Durée entre 15 et 35 secondes
            
            return {
                id: index,
                style: {
                    // Position verticale aléatoire sur toute la hauteur (0% à 95%)
                    top: `${getRandom(0, 95)}%`,
                    
                    // Vitesse aléatoire
                    animationDuration: `${duration}s`,
                    
                    // Délai négatif important : permet aux pokémons d'être déjà un peu partout sur l'écran au chargement
                    // On prend un délai négatif jusqu'à la durée max pour qu'ils soient bien répartis
                    animationDelay: `-${getRandom(0, 35)}s`,
                    
                    // Taille variable
                    transform: `scale(${getRandom(0.6, 1.4)})`,
                    
                    // Opacité légèrement variable pour la profondeur
                    opacity: getRandom(0.3, 0.7)
                }
            };
        });
    }, []);

    useEffect(() => {
        fetch(`http://localhost:3000/pokemons/${id}`)
            .then(res => res.json())
            .then(data => {
                setPokemon(data);
                const types = data.type || [];
                setEditForm({
                    name: data.name?.french,
                    type1: types[0] || 'Normal',
                    type2: types[1] || '',
                    hp: data.base?.HP,
                    attack: data.base?.Attack,
                    defense: data.base?.Defense,
                    specialAttack: data.base?.SpecialAttack,
                    specialDefense: data.base?.SpecialDefense,
                    speed: data.base?.Speed,
                });
                setPreview(data.image);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [id]);

    // ... (Le reste des fonctions handleImageChange, handleUpdate, etc. reste identique) ...
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    const handleCancel = () => { setIsEditing(false); setImageFile(null); setPreview(pokemon.image); };
    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('name.french', editForm.name);
        const finalType = editForm.type2 ? `${editForm.type1},${editForm.type2}` : editForm.type1;
        formData.append('type', finalType);
        formData.append('base.HP', editForm.hp);
        formData.append('base.Attack', editForm.attack);
        formData.append('base.Defense', editForm.defense);
        formData.append('base.SpecialAttack', editForm.specialAttack);
        formData.append('base.SpecialDefense', editForm.specialDefense);
        formData.append('base.Speed', editForm.speed);
        if (imageFile) formData.append('image', imageFile);

        const res = await fetch(`http://localhost:3000/pokemons/${id}`, { method: 'PUT', body: formData });
        const data = await res.json();
        setPokemon(data);
        setImageFile(null);
        setPreview(data.image);
        setIsEditing(false);
    };
    const handleChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
    const handleDelete = async () => {
        if (window.confirm("Vraiment supprimer ?")) {
            await fetch(`http://localhost:3000/pokemons/${id}`, { method: 'DELETE' });
            navigate('/');
        }
    };

    if (loading || !pokemon) return <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Chargement...</p>;

    const renderStat = (label, key, val) => (
        <div className="stat-row">
            <span className="stat-label">{label} :</span>
            {isEditing ? (
                <div className="slider-container">
                    <input type="range" min="0" max="255" name={key} value={editForm[key]} onChange={handleChange} className="stat-slider" />
                    <span className="slider-value">{editForm[key]}</span>
                </div>
            ) : (
                <>
                    <div className="stat-bar-container"><div className="stat-bar-fill" style={{ width: `${Math.min(val, 255) / 2.55}%` }}></div></div>
                    <span className="stat-val-text">{val}</span>
                </>
            )}
        </div>
    );

    const mainType = pokemon.type && pokemon.type.length > 0 ? pokemon.type[0] : 'Normal';
    const cardBackgroundColor = TYPE_COLORS[mainType] || '#fcd144';

    return (
        <div className="details-page">
            
            {/* --- ARRIÈRE-PLAN ANIMÉ --- */}
            {pokemon && pokemon.image && (
                <div className="animated-background-container">
                    {backgroundFloaters.map((floater) => (
                        <img
                            key={floater.id}
                            src={pokemon.image}
                            alt="" 
                            className="floating-pokemon"
                            style={floater.style} 
                        />
                    ))}
                </div>
            )}
            {/* --------------------------- */}

            <Link to="/" className="back-nav">← Retour</Link>
            
            <div className="jumbo-card" style={{ backgroundColor: cardBackgroundColor, transition: 'background-color 0.5s ease' }}>
                <div className="card-header">
                    <div className="header-left">
                        {isEditing ? (
                            <>
                                <input type="text" name="name" value={editForm.name} onChange={handleChange} className="input-name" placeholder="Nom" />
                                <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                    <select name="type1" value={editForm.type1} onChange={handleChange} className="input-type">
                                        {POKEMON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <select name="type2" value={editForm.type2} onChange={handleChange} className="input-type">
                                        <option value="">-</option>
                                        {POKEMON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="card-name">{pokemon.name?.french}</h1>
                                <span className="card-type">{pokemon.type?.join(', ')}</span>
                            </>
                        )}
                    </div>
                    <div className="card-id">#{pokemon.id}</div>
                </div>

                <div 
                    className="card-image-box" 
                    style={{ cursor: isEditing ? 'pointer' : 'default', position: 'relative' }}
                    onClick={() => isEditing && document.getElementById('editFileInput').click()}
                >
                    <img src={preview || "https://via.placeholder.com/150"} alt="Pokemon" className="card-img" />
                    {isEditing && (
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.6)', color: 'white', textAlign: 'center', fontSize: '0.8em', padding: '5px', zIndex: 10 }}>
                            Clique pour changer 📷
                        </div>
                    )}
                    <input id="editFileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} disabled={!isEditing} />
                </div>

                <div className="card-stats">
                    <h3 className="stats-title">Statistiques</h3>
                    {renderStat("PV (HP)", "hp", pokemon.base?.HP)}
                    {renderStat("Attaque", "attack", pokemon.base?.Attack)}
                    {renderStat("Défense", "defense", pokemon.base?.Defense)}
                    {renderStat("Att. Spé", "specialAttack", pokemon.base?.SpecialAttack)}
                    {renderStat("Déf. Spé", "specialDefense", pokemon.base?.SpecialDefense)}
                    {renderStat("Vitesse", "speed", pokemon.base?.Speed)}
                </div>

                <div className="card-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="retro-btn retro-btn-small" style={{ backgroundColor: '#666' }}>Annuler</button>
                            <button onClick={handleUpdate} className="retro-btn retro-btn-small" style={{ backgroundColor: '#44aa44' }}>Sauvegarder</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleDelete} className="retro-btn retro-btn-small" style={{ backgroundColor: '#ff4444' }}>Supprimer</button>
                            <button onClick={() => setIsEditing(true)} className="retro-btn retro-btn-small">Modifier</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PokemonDetails;
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router'; 
import './PokemonDetails.css'; 
import '../components/pokelist/index.css'; 

const PokemonDetails = () => { 
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/pokemons/${id}`)
            .then(res => res.json())
            .then(data => {
                setPokemon(data);
                setEditForm({
                    name: data.name?.french,
                    type: data.type?.join(', '), 
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

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setImageFile(null);
        setPreview(pokemon.image);
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('name.french', editForm.name);
        formData.append('type', editForm.type);
        formData.append('base.HP', editForm.hp);
        formData.append('base.Attack', editForm.attack);
        formData.append('base.Defense', editForm.defense);
        formData.append('base.SpecialAttack', editForm.specialAttack);
        formData.append('base.SpecialDefense', editForm.specialDefense);
        formData.append('base.Speed', editForm.speed);

        if (imageFile) {
            formData.append('image', imageFile);
        }

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

    return (
        <div className="details-page">
            <Link to="/" className="back-nav">← Retour</Link>
            
            <div className="jumbo-card">
                <div className="card-header">
                    <div className="header-left">
                        {isEditing ? (
                            <>
                                <input type="text" name="name" value={editForm.name} onChange={handleChange} className="input-name" placeholder="Nom" />
                                <input type="text" name="type" value={editForm.type} onChange={handleChange} className="input-type" placeholder="Types" />
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
                        <div style={{
                            position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.6)', 
                            color: 'white', textAlign: 'center', fontSize: '0.8em', padding: '5px', zIndex: 10
                        }}>
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
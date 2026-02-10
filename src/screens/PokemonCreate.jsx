import { useState } from 'react';
import { Link, useNavigate } from 'react-router'; 
import './PokemonCreate.css'; 
import '../components/pokelist/index.css'; 

// Liste des types Pokémon
const POKEMON_TYPES = [
    "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", 
    "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Steel", "Fairy"
];

const PokemonCreate = () => { 
    const navigate = useNavigate();
    
    // On sépare type1 et type2 dans le state pour les gérer via les <select>
    const [form, setForm] = useState({
        name: '', type1: 'Normal', type2: '', 
        hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    
    const handleImageChange = (e) => { 
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name.french', form.name);
            
            // On combine les deux types pour l'envoi au backend
            const finalType = form.type2 ? `${form.type1},${form.type2}` : form.type1;
            formData.append('type', finalType);

            formData.append('base.HP', form.hp);
            formData.append('base.Attack', form.attack);
            formData.append('base.Defense', form.defense);
            formData.append('base.SpecialAttack', form.specialAttack);
            formData.append('base.SpecialDefense', form.specialDefense);
            formData.append('base.Speed', form.speed);
            
            if (imageFile) formData.append('image', imageFile);

            const res = await fetch('http://localhost:3000/pokemons', { method: 'POST', body: formData });
            if (res.ok) navigate('/');
        } catch (error) { 
            console.error(error); 
        }
    };

    const renderStatInput = (label, key) => (
        <div className="stat-row">
            <span className="stat-label">{label} :</span>
            <div className="slider-container">
                <input type="range" min="0" max="255" name={key} value={form[key]} onChange={handleChange} className="stat-slider" />
                <span className="slider-value">{form[key]}</span>
            </div>
        </div>
    );

    return (
        <div className="create-page">
            <Link to="/" style={{ color: '#ccc', marginBottom: '10px', display: 'inline-block', alignSelf: 'flex-start', marginLeft: 'calc(50% - 180px)' }}>← Annuler</Link>

            <form onSubmit={handleSubmit} className="jumbo-card" autoComplete="off">
                <div className="card-header">
                    <div className="header-left">
                        <input required type="text" name="name" value={form.name} onChange={handleChange} className="input-name" placeholder="NOM DU POKÉMON" />
                        
                        {/* Sélection du Type 1 */}
                        <select name="type1" value={form.type1} onChange={handleChange} className="input-type" style={{ marginBottom: '5px' }}>
                            {POKEMON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        
                        {/* Sélection du Type 2 (Optionnel) */}
                        <select name="type2" value={form.type2} onChange={handleChange} className="input-type">
                            <option value="">(Aucun type secondaire)</option>
                            {POKEMON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ fontSize: '1em', fontWeight: 'bold', color: '#44aa44', border: '2px solid #44aa44', padding: '2px 5px', borderRadius: '5px', transform: 'rotate(-10deg)' }}>
                        NEW
                    </div>
                </div>

                <div className="upload-box" onClick={() => document.getElementById('fileInput').click()}>
                    {preview ? (
                        <img src={preview} alt="Aperçu" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                    ) : (
                        <>
                            <span style={{ fontSize: '2em' }}>📷</span>
                            <p style={{ fontSize: '0.9em' }}>Ajouter une image</p>
                        </>
                    )}
                    <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>

                <div className="card-stats">
                    <h3 style={{ margin: '0 0 8px 0', borderBottom: '2px solid #ccc', paddingBottom: '3px', color: '#666', fontSize: '0.8em', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Statistiques
                    </h3>
                    {renderStatInput("PV (HP)", "hp")}
                    {renderStatInput("Attaque", "attack")}
                    {renderStatInput("Défense", "defense")}
                    {renderStatInput("Att. Spé", "specialAttack")}
                    {renderStatInput("Déf. Spé", "specialDefense")}
                    {renderStatInput("Vitesse", "speed")}
                </div>

                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className="retro-btn" style={{ width: '100%', fontSize: '1.1em', padding: '10px' }}>
                        VALIDER LA CRÉATION
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PokemonCreate;
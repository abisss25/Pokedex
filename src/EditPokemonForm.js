import React, { useState } from 'react';
import axios from 'axios';

// URL base de tu API
const API_BASE_URL = 'http://localhost/pokedex_api/';
const UPDATE_URL = API_BASE_URL + 'update.php';

function EditPokemonForm({ pokemon, onClose, onPokemonUpdated }) {
    
    // Función auxiliar para asegurarse de que los valores nulos o 'N/A' se traten
    const getInitialValue = (key, isNumber = false) => {
        const value = pokemon[key];
        
        if (value === null || value === undefined || String(value).trim() === '' || String(value) === 'N/A') {
            return isNumber ? 0 : '';
        }
        
        if (isNumber) {
            return parseInt(value) || 0; 
        }
        
        return value;
    };
    
    // Inicializamos el estado del formulario
    const [formData, setFormData] = useState({
        id: pokemon.id,
        nombre: getInitialValue('nombre'),
        tipo1: getInitialValue('tipo1'),
        hp: getInitialValue('hp', true),
        ataque: getInitialValue('ataque', true),
        defensa: getInitialValue('defensa', true),
        ataque_esp: getInitialValue('ataque_esp', true),
        defensa_esp: getInitialValue('defensa_esp', true),
        velocidad: getInitialValue('velocidad', true),
        descripcion: getInitialValue('descripcion'),
        habilidad: getInitialValue('habilidad'),
        altura: getInitialValue('altura'),
        peso: getInitialValue('peso'),
    });
    
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' && value !== '' ? parseInt(value) : value;
        setFormData({ ...formData, [name]: newValue });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        
        for (const key in formData) {
            data.append(key, formData[key] === null ? '' : formData[key]);
        }
        
        if (file) {
            data.append('imagen_nueva', file); 
        }
        
        data.append('imagen_actual_nombre', pokemon.imagen_nombre);
        
        try {
            const response = await axios.post(UPDATE_URL, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            alert(response.data.message);
            setLoading(false);
            onPokemonUpdated();
            onClose();
            
        } catch (error) {
            console.error("Error al modificar Pokémon:", error);
            alert(`Error al modificar Pokémon: ${error.response?.data?.message || 'Error de red.'}`);
            setLoading(false);
        }
    };

    return (
        <div className="edit-form-container">
            <h3 className="edit-form-title">✏️ Modificar: {pokemon.nombre}</h3>
            
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input 
                            type="text" 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Tipo *</label>
                        <input 
                            type="text" 
                            name="tipo1" 
                            value={formData.tipo1} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>HP *</label>
                        <input 
                            type="number" 
                            name="hp" 
                            value={formData.hp} 
                            onChange={handleChange} 
                            min="0" 
                            max="255" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Ataque *</label>
                        <input 
                            type="number" 
                            name="ataque" 
                            value={formData.ataque} 
                            onChange={handleChange} 
                            min="0" 
                            max="255" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Defensa *</label>
                        <input 
                            type="number" 
                            name="defensa" 
                            value={formData.defensa} 
                            onChange={handleChange} 
                            min="0" 
                            max="255" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Velocidad *</label>
                        <input 
                            type="number" 
                            name="velocidad" 
                            value={formData.velocidad} 
                            onChange={handleChange} 
                            min="0" 
                            max="255" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Ataque Esp. *</label>
                        <input 
                            type="number" 
                            name="ataque_esp" 
                            value={formData.ataque_esp} 
                            onChange={handleChange} 
                            min="0" 
                            max="255" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Defensa Esp. *</label>
                        <input 
                            type="number" 
                            name="defensa_esp" 
                            value={formData.defensa_esp} 
                            onChange={handleChange} 
                            min="0" 
                            max="255" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Habilidad</label>
                        <input 
                            type="text" 
                            name="habilidad" 
                            value={formData.habilidad} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Altura</label>
                        <input 
                            type="text" 
                            name="altura" 
                            placeholder="Ej: 0.5 m"
                            value={formData.altura} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Peso</label>
                        <input 
                            type="text" 
                            name="peso" 
                            placeholder="Ej: 9.0 kg"
                            value={formData.peso} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                <div className="form-group-full">
                    <label>Descripción *</label>
                    <textarea 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        rows="3"
                        required
                    ></textarea>
                </div>

                <div className="form-group-full">
                    <label>Imagen actual: <strong>{pokemon.imagen_nombre}</strong></label>
                    <input 
                        type="file" 
                        name="imagen_nueva" 
                        onChange={handleFileChange} 
                        accept="image/*"
                        className="file-input"
                    />
                </div>
                
                <div className="form-actions-edit">
                    <button type="submit" className="btn-save" disabled={loading}>
                        {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
                    </button>
                    <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                        ❌ Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditPokemonForm;
import React, { useState } from 'react';
import axios from 'axios';

// URL base de tu API
const API_BASE_URL = 'http://localhost/pokedex_api/';
const CREATE_URL = API_BASE_URL + 'create.php';

// 1. Definición de los campos iniciales del formulario (SIN tipo2, CON nuevos campos)
const initialFormState = {
    nombre: '',
    tipo1: '',
    // ELIMINADO: tipo2: '',
    hp: 50,
    ataque: 50,
    defensa: 54, // Valor inicial ajustado
    ataque_esp: 50,
    defensa_esp: 50,
    velocidad: 50,
    descripcion: '',
    // ** NUEVOS CAMPOS **
    habilidad: '', 
    altura: '', 
    peso: '',
};

function AddPokemonForm({ onClose, onPokemonAdded }) {
    const [formData, setFormData] = useState(initialFormState);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // 2. Maneja el cambio en los inputs de texto/número
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Convertimos a número solo si es un campo numérico
        const newValue = type === 'number' ? parseInt(value) || 0 : value;
        
        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    // 3. Maneja el cambio en el input de archivo (imagen)
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // 4. Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!file) {
            alert("Por favor, selecciona una imagen para el Pokémon.");
            setLoading(false);
            return;
        }
        
        // Crear el objeto FormData
        const data = new FormData();
        
        // Agregar todos los campos de texto/número/nuevos
        for (const key in formData) {
            // Se envía la clave 'imagen' solo con el objeto File, no con la cadena null
            if (key !== 'imagen') { 
                data.append(key, formData[key]);
            }
        }
        
        // Agregar el archivo de imagen. 
        data.append('imagen', file); 

        try {
            const response = await axios.post(CREATE_URL, data, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            
            alert(response.data.message);
            setLoading(false);
            
            onPokemonAdded(); // Recarga la lista
            onClose(); // Cierra el modal
            
        } catch (error) {
            console.error("Error al registrar Pokémon:", error);
            alert(`Error al registrar Pokémon: ${error.response?.data?.message || 'Error de red.'}`); 
            setLoading(false);
        }
    };


    return (
        <div className="add-form-modal">
            <div className="modal-content">
                <h3>Añadir Nuevo Pokémon</h3>
                <form onSubmit={handleSubmit}>
                    
                    {/* Campos de texto generales (SIN tipo2) */}
                    <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                    <input type="text" name="tipo1" placeholder="Tipo (Ej: Fuego)" value={formData.tipo1} onChange={handleChange} required />
                    {/* input tipo2 ELIMINADO */}
                    
                    {/* Stats de combate - Tipo 'number' */}
                    <input type="number" name="hp" placeholder="HP" value={formData.hp} onChange={handleChange} min="0" max="255" required />
                    <input type="number" name="ataque" placeholder="Ataque" value={formData.ataque} onChange={handleChange} min="0" max="255" required />
                    <input type="number" name="defensa" placeholder="Defensa" value={formData.defensa} onChange={handleChange} min="0" max="255" required />
                    <input type="number" name="ataque_esp" placeholder="Ataque Especial" value={formData.ataque_esp} onChange={handleChange} min="0" max="255" required />
                    <input type="number" name="defensa_esp" placeholder="Defensa Especial" value={formData.defensa_esp} onChange={handleChange} min="0" max="255" required />
                    <input type="number" name="velocidad" placeholder="Velocidad" value={formData.velocidad} onChange={handleChange} min="0" max="255" required />
                    
                    {/* Campos de texto nuevos (Habilidad, Altura, Peso) */}
                    <input type="text" name="habilidad" placeholder="Habilidad (Ej: Torrente)" value={formData.habilidad} onChange={handleChange} />
                    <input type="text" name="altura" placeholder="Altura (Ej: 0.5 m)" value={formData.altura} onChange={handleChange} />
                    <input type="text" name="peso" placeholder="Peso (Ej: 9.0 kg)" value={formData.peso} onChange={handleChange} />

                    <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} required></textarea>

                    {/* Input de archivo para la imagen */}
                    <label className="file-label">Imagen del Pokémon:</label>
                    <input type="file" name="imagen" onChange={handleFileChange} accept="image/*" required />
                    
                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrar Pokémon'}
                        </button>
                        <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPokemonForm;
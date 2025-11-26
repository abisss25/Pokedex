import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
import "./App.css";
import AddPokemonForm from './AddPokemonForm';
import EditPokemonForm from './EditPokemonForm';

import { FaCog } from 'react-icons/fa'; 

// 1. Configuración de URLs de la API y constantes
const API_BASE_URL = 'http://localhost/pokedex_api/';
const GET_ALL_URL = API_BASE_URL + 'get_all.php';
const DELETE_URL = API_BASE_URL + 'delete.php';
const IMAGE_BASE_URL = API_BASE_URL + 'images/';

// Constantes del carrusel
const ITEM_WIDTH = 78; 
const CLONE_COUNT = 3; 

// VALORES ORIGINALES (DEFAULT) - Incluye Colores, Bordes, Fuente y Tamaño
const DEFAULT_STYLES = {
    cardBgColor: '#FFFFFF',
    appBgColor: '#64b5f6', // Azul claro original
    borderRadius: '15px',
    fontFamily: '"Verdana", sans-serif', 
    fontSize: '1.0', // Tamaño base (1.0 = 100%)
};

// NUEVA CONSTANTE: Opciones de fuente para el selector
const FONT_OPTIONS = [
    { name: 'Verdana (Original)', value: '"Verdana", sans-serif' },
    { name: 'Retro Monospace', value: '"Courier New", monospace' },
    { name: 'Modern Sans', value: '"Helvetica Neue", Arial, sans-serif' },
    { name: 'Clásico Serif', value: '"Georgia", serif' },
    { name: 'Cómico Casual', value: 'cursive' },
];


// Mapeo de colores y iconos
const TYPE_COLORS = {
    'Planta': '#4CAF50', 'Fuego': '#F44336', 'Agua': '#2196F3', 'Eléctrico': '#FFEB3B', 
    'Normal': '#BDBDBD', 'Veneno': '#9C27B0', 'Tierra': '#795548', 'Roca': '#6D4C41', 
    'Bicho': '#8BC34A', 'Fantasma': '#673AB7', 'Acero': '#607D8B', 'Lucha': '#FF9800', 
    'Hada': '#E91E63', 'Psíquico': '#9C27B0', 'Hielo': '#03A9F4', 'Dragón': '#4A148C', 
    'Volador': '#03A9F4', 'Siniestro': '#212121', 
};
const getTypeColor = (type) => TYPE_COLORS[type] || '#BDBDBD';

const getTypeIcon = (type) => {
    switch (type) {
        case 'Agua': return '💧'; case 'Fuego': return '🔥'; case 'Planta': return '🌿';
        case 'Eléctrico': return '⚡'; case 'Veneno': return '💀'; case 'Normal': return '⭐';
        case 'Roca': return '🪨'; case 'Tierra': return '🌍';
        case 'Bicho': return '🐛'; case 'Fantasma': return '👻'; case 'Acero': return '🛡️'; 
        case 'Lucha': return '👊'; case 'Hada': return '✨'; case 'Psíquico': return '🧠'; 
        case 'Hielo': return '🧊'; case 'Dragón': return '🐉'; case 'Volador': return '☁️'; 
        case 'Siniestro': return '🌑'; default: return '⚪';
    }
};

// FUNCIÓN PARA CARGAR ESTILOS DEL LOCALSTORAGE O VALORES POR DEFECTO
const getInitialStyles = () => {
    try {
        const savedStyles = localStorage.getItem('pokedexCardStyles');
        // Si no hay estilos guardados, devuelve los estilos por defecto
        const parsedStyles = savedStyles ? JSON.parse(savedStyles) : {};
        
        // Combina los estilos guardados con los DEFAULT para asegurar que las nuevas props existan
        return { ...DEFAULT_STYLES, ...parsedStyles };
    } catch (e) {
        console.error("Error al cargar estilos de localStorage", e);
        return DEFAULT_STYLES;
    }
};


// NUEVO COMPONENTE: Panel de Personalización (Modal)
const PersonalizationPanel = ({ setIsPanelOpen, currentActiveStyles, setCurrentActiveStyles }) => {
    
    // Estado TEMPORAL para los cambios dentro del modal
    const [tempStyles, setTempStyles] = useState(currentActiveStyles);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempStyles(prevStyles => ({
            ...prevStyles,
            // Conversión de valores de rango a string con unidad si es necesario
            [name]: 
                name === 'borderRadius' ? `${e.target.value}px` : 
                name === 'fontSize' ? `${e.target.value}` : 
                value,
        }));
    };
    
    // Función: Guarda los estilos TEMPORALES en el estado activo y localStorage
    const handleSaveChanges = () => {
        setCurrentActiveStyles(tempStyles); // Aplica los estilos en el App.js
        setIsPanelOpen(false);
    };

    // Función: Descarta los cambios (cierra y revierte al estado activo anterior)
    const handleDiscardChanges = () => {
        // Simplemente cerramos el modal, el estado 'currentActiveStyles' no se toca.
        setIsPanelOpen(false);
    };

    // Función: Restablece a los valores originales (DEFAULT_STYLES)
    const handleResetToOriginal = () => {
        // 1. Restablece el estado temporal
        setTempStyles(DEFAULT_STYLES);
        // 2. Aplica inmediatamente los estilos por defecto al estado activo y al localStorage
        setCurrentActiveStyles(DEFAULT_STYLES);
    };

    // Obtenemos el valor numérico del borde para el input range
    const borderRadiusNum = parseInt(tempStyles.borderRadius);

    return (
        <div className="custom-modal-backdrop">
            <div 
                className="custom-modal-content" 
                style={{
                    borderRadius: tempStyles.borderRadius, 
                    // Vista previa de la fuente y tamaño en el propio modal
                    fontFamily: tempStyles.fontFamily,
                    fontSize: `${tempStyles.fontSize}rem` 
                }}
            >
                <h2>⚙️ Personalizar Pokédex</h2>
                <p style={{fontSize: '0.8rem', color: '#BDBDBD', textAlign: 'center'}}>Los cambios se verán en tiempo real antes de guardar.</p>
                
                {/* CONTROL 1: FONDO DE LA TARJETA */}
                <div className="custom-control-group">
                    <label>Fondo de la Tarjeta:</label>
                    <input
                        type="color"
                        name="cardBgColor"
                        value={tempStyles.cardBgColor}
                        onChange={handleChange}
                    />
                </div>
                {/* CONTROL 2: FONDO DE LA APLICACIÓN */}
                <div className="custom-control-group">
                    <label>Fondo de la Aplicación:</label>
                    <input
                        type="color"
                        name="appBgColor"
                        value={tempStyles.appBgColor}
                        onChange={handleChange}
                    />
                </div>
                {/* CONTROL 3: BORDES */}
                <div className="custom-control-group">
                    <label>Bordes redondeados (px):</label>
                    <input
                        type="range"
                        min="0"
                        max="30"
                        name="borderRadius"
                        value={borderRadiusNum} 
                        onChange={handleChange}
                    />
                    <span>{tempStyles.borderRadius}</span>
                </div>
                {/* CONTROL 4: TIPO DE LETRA */}
                <div className="custom-control-group">
                    <label>Tipo de Letra:</label>
                    <select
                        name="fontFamily"
                        value={tempStyles.fontFamily}
                        onChange={handleChange}
                        className="font-selector"
                    >
                        {FONT_OPTIONS.map(option => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                style={{ fontFamily: option.value, fontSize: '1.05rem' }} 
                            >
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* CONTROL 5: TAMAÑO DE LETRA */}
                <div className="custom-control-group">
                    <label>Tamaño de Letra (em):</label>
                    <input
                        type="range"
                        min="0.8"
                        max="1.2"
                        step="0.05"
                        name="fontSize"
                        // El valor debe ser numérico para el input range
                        value={parseFloat(tempStyles.fontSize)} 
                        onChange={handleChange}
                    />
                    {/* Mostramos el porcentaje para el usuario */}
                    <span>{`${(parseFloat(tempStyles.fontSize) * 100).toFixed(0)}%`}</span>
                </div>

                <div className="form-actions-edit modal-actions">
                    <button className="btn-save" onClick={handleSaveChanges}>Guardar Cambios</button>
                    <button className="btn-cancel" onClick={handleDiscardChanges}>Descartar</button>
                    <button className="btn-reset" onClick={handleResetToOriginal}>Restablecer Originales</button>
                </div>
            </div>
        </div>
    );
};
// -------------------------------------------------------------


function App() {
    // 2. Estados principales
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allPokemon, setAllPokemon] = useState([]);      
    const [currentPokemon, setCurrentPokemon] = useState(null);
    const [loading, setLoading] = useState(true);           
    const [searchTerm, setSearchTerm] = useState('');       
    const [activeSearchTerm, setActiveSearchTerm] = useState(''); 
    
    // ESTADOS CLAVE PARA EL CARRUSEL
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0); 
    const [isTransitioning, setIsTransitioning] = useState(true); 
    // Usamos useRef para mantener el ID del Pokémon seleccionado incluso después de recargar
    const selectedPokemonId = useRef(null); 
    const autoPlayActive = useRef(true); 

    // NUEVOS ESTADOS DE PERSONALIZACIÓN
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [currentActiveStyles, setCurrentActiveStyles] = useState(getInitialStyles);
    // ------------------------------------

    // 3. Función para cargar datos (CRUD: READ)
    // Es clave que esta función no tenga dependencias para que se pueda llamar libremente
    const fetchPokemon = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(GET_ALL_URL);
            const data = Array.isArray(response.data) ? response.data : [];
            
            setAllPokemon(data);
            setLoading(false);
            
            // Si es la primera carga y no hay un Pokémon seleccionado, selecciona el primero.
            if (!selectedPokemonId.current && data.length > 0) {
                 selectedPokemonId.current = data[0].id;
            }

        } catch (error) {
            console.error("Error al cargar la Pokédex:", error);
            setLoading(false);
            setAllPokemon([]);
        }
    }, []); 

    // 4. Función para ELIMINAR (CRUD: DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar este Pokémon (ID: ${id})?`)) {
            return;
        }

        try {
            const response = await axios.delete(DELETE_URL, { data: { id: id } });
            alert(response.data.message);
            if (response.status === 200) {
                // Después de eliminar, limpiamos la referencia y recargamos
                selectedPokemonId.current = null;
                await fetchPokemon(); 
            }
        } catch (error) {
            console.error("Error al eliminar Pokémon:", error);
            alert(`Error al intentar eliminar el Pokémon. Detalles: ${error.response?.data?.message || 'Error de red.'}`);
        }
    };
    
    // Función de búsqueda
    const handleSearch = () => {
        setActiveSearchTerm(searchTerm);
    };

    // 7. Lógica de Filtrado (Lista base de miniaturas)
    const filteredPokemon = allPokemon.filter(p =>
        p.nombre.toLowerCase().includes(activeSearchTerm.toLowerCase())
    );
    
    // 8. CONSTRUCCIÓN DE LA LISTA INFINITA (Clones)
    const carruselClones = (() => {
        if (filteredPokemon.length === 0) return [];
        
        // Si hay muy pocos items, solo mostramos los items reales sin clones
        if (filteredPokemon.length <= CLONE_COUNT * 2) {
            return filteredPokemon.map((p, idx) => ({...p, key: p.id, isClone: false, realIndex: idx})); 
        } 

        const realItems = filteredPokemon.map((p, idx) => ({...p, key: p.id, isClone: false, realIndex: idx}));
        const clonesBefore = realItems.slice(-CLONE_COUNT).map(p => ({ ...p, isClone: true, key: `clone-before-${p.id}-${Math.random()}` }));
        const clonesAfter = realItems.slice(0, CLONE_COUNT).map(p => ({ ...p, isClone: true, key: `clone-after-${p.id}-${Math.random()}` }));

        return [...clonesBefore, ...realItems, ...clonesAfter];
    })();
    
    // Índices de la lista de clones
    const REAL_START_INDEX = CLONE_COUNT;
    const TOTAL_REAL_ITEMS = filteredPokemon.length;
    const REAL_END_INDEX = REAL_START_INDEX + TOTAL_REAL_ITEMS;


    // 5. LÓGICA CLAVE: FUNCIÓN PARA EL CLIC MANUAL
    const handlePokemonClick = useCallback((pokemon, index) => {

        setCurrentSlideIndex(index);
        
        if (!pokemon.isClone) {
            setCurrentPokemon(pokemon);
            selectedPokemonId.current = pokemon.id;
        }
    }, []); 

    // 6. Se ejecuta fetchPokemon una sola vez al montar el componente
    useEffect(() => {
        fetchPokemon();
    }, [fetchPokemon]); 
    
    // 9. EFECTO DE SELECCIÓN/FILTRADO/INICIALIZACIÓN (¡CORREGIDO!)
  // App.js - Bloque 9. EFECTO DE SELECCIÓN/FILTRADO/INICIALIZACIÓN (VERSIÓN MEJORADA)
useEffect(() => {
    if (filteredPokemon.length === 0) {
        setCurrentPokemon(null);
        setCurrentSlideIndex(0);
        return;
    }

    let nextPokemon = filteredPokemon.find(p => p.id === selectedPokemonId.current);
    
    if (!nextPokemon) {
        nextPokemon = filteredPokemon[0];
        selectedPokemonId.current = nextPokemon.id;
    }
    
    setCurrentPokemon(nextPokemon);
    
    // 1. Calcular la posición real
    const realIndex = filteredPokemon.findIndex(p => p.id === nextPokemon.id);
    const targetSlideIndex = realIndex > -1 ? realIndex + REAL_START_INDEX : REAL_START_INDEX; 
    
    // 2. Aplicar la posición instantáneamente sin transición.
    // Esto se ejecutará cada vez que la lista o la búsqueda cambie.
    setIsTransitioning(false); 
    setCurrentSlideIndex(targetSlideIndex);
    
    // 3. Restaurar la transición poco después para permitir el autoplay.
    const restoreTransition = setTimeout(() => {
         setIsTransitioning(true);
    }, 50);

    return () => clearTimeout(restoreTransition);

// El cambio de 'allPokemon' forzará la re-ejecución tras Añadir/Editar/Eliminar
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSearchTerm, allPokemon]); // <--- Esta dependencia es clave para la actualización!
    
    // EFECTO PRINCIPAL: Guardar estilos de personalización y aplicar variables CSS
    useEffect(() => {
        try {
            // 1. Guardar los estilos activos en localStorage
            localStorage.setItem('pokedexCardStyles', JSON.stringify(currentActiveStyles));
        } catch (e) {
            console.error("Error al guardar estilos en localStorage", e);
        }

        // 2. Aplicar la fuente y el tamaño activo al documento (globalmente)
        document.documentElement.style.setProperty('--pokedex-font', currentActiveStyles.fontFamily);
        document.documentElement.style.setProperty('--pokedex-font-size', `${currentActiveStyles.fontSize}rem`);

    }, [currentActiveStyles]);
    // -----------------------------------------------------------------


    // 10. LÓGICA CLAVE: SALTO INSTANTÁNEO CÍCLICO
    useEffect(() => {
        if (TOTAL_REAL_ITEMS === 0 || TOTAL_REAL_ITEMS <= CLONE_COUNT * 2) return;
        
        let jumpTo = null;
        
        if (currentSlideIndex >= REAL_END_INDEX) {
            jumpTo = currentSlideIndex - TOTAL_REAL_ITEMS;
        } 
        
        if (currentSlideIndex < REAL_START_INDEX) {
            jumpTo = currentSlideIndex + TOTAL_REAL_ITEMS;
        }

        if (jumpTo !== null) {
            setTimeout(() => {
                setIsTransitioning(false); 
                setCurrentSlideIndex(jumpTo);
                
                const newRealIndex = jumpTo - REAL_START_INDEX;
                if (filteredPokemon[newRealIndex]) {
                    setCurrentPokemon(filteredPokemon[newRealIndex]);
                    selectedPokemonId.current = filteredPokemon[newRealIndex].id;
                }
            }, 500); 
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSlideIndex, TOTAL_REAL_ITEMS]);
    
    // 11. Restaurar transición después del salto
    useEffect(() => {
        if (!isTransitioning) {
            const timeout = setTimeout(() => setIsTransitioning(true), 50); 
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);


    // 12. NAVEGACIÓN MANUAL (Usado también por el Autoplay)
    const goToNext = useCallback(() => {
        if (currentSlideIndex < carruselClones.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        }
    }, [currentSlideIndex, carruselClones.length]);

    const goToPrev = useCallback(() => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    }, [currentSlideIndex]);


    // 13. EFECTO DE AUTOPLAY (Activado)
    useEffect(() => {
        if (TOTAL_REAL_ITEMS === 0 || TOTAL_REAL_ITEMS <= CLONE_COUNT * 2) return;
        
        const interval = setInterval(() => {
            if (isTransitioning && autoPlayActive.current) {
                 goToNext(); 
            }
        }, 3000); // 3 segundos

        return () => clearInterval(interval);
        
    }, [TOTAL_REAL_ITEMS, goToNext, isTransitioning]);

    
    if (loading) return <div className="pokedex-container">Cargando datos de la Pokédex...</div>;
    
    
    // LÓGICA DE TRANSFORMACIÓN DEL CARRUSEL
    const transformValue = `translateX(-${currentSlideIndex * ITEM_WIDTH}px)`;


    // Renderizado cuando no hay Pokémon 
    if (!currentPokemon || filteredPokemon.length === 0) {
        return (
            <main className="pokedex-container" style={{ backgroundColor: currentActiveStyles.appBgColor }}>
                <header>
                    <h1>POKÉDEX</h1>
                    <div className="search-panel">
                        <input type="text" placeholder="Buscar Pokémon por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="search-btn" title="Buscar Pokémon" onClick={handleSearch}>🔍</button>
                        <button className="add-btn" onClick={() => setShowAddForm(true)}>Añadir</button>
                        {/* BOTÓN DE PERSONALIZACIÓN */}
                        <button className="settings-btn" title="Personalizar" onClick={() => setIsPanelOpen(true)}>
                            <FaCog />
                        </button>
                    </div>
                </header>
                <div style={{color: 'white', marginTop: '20px', fontSize: '1.2em', textAlign: 'center'}}>
                    No hay Pokémon registrados o no se encontraron resultados.
                </div>
                {/* 🔑 AddPokemonForm debe ser un modal para evitar problemas de visualización */}
                {showAddForm && (
                    <AddPokemonForm
                        onClose={() => setShowAddForm(false)}
                        onPokemonAdded={fetchPokemon}
                    />
                )}
                 {isPanelOpen && (
                    <PersonalizationPanel 
                        setIsPanelOpen={setIsPanelOpen} 
                        currentActiveStyles={currentActiveStyles} 
                        setCurrentActiveStyles={setCurrentActiveStyles} 
                    />
                )}
            </main>
        );
    }

    // 14. Mapeo de datos y Color Dinámico 
    const p = currentPokemon;
    const displayPokemon = {
        id: p.id,
        nombre: p.nombre || 'Desconocido',
        numero: `#${(p.id || 0).toString().padStart(3, '0')}`,
        tipo: p.tipo1 || 'Normal', 
        tipo2: p.tipo2,
        hp: p.hp || 50,
        ataque: p.ataque || 50,
        defensa: p.defensa || 50,
        ataque_esp: p.ataque_esp || 50,
        defensa_esp: p.defensa_esp || 50,
        velocidad: p.velocidad || 50, 
        
        imagen_nombre: p.imagen_nombre || 'default.png', 
        imagen: IMAGE_BASE_URL + (p.imagen_nombre || 'default.png'),
        descripcion: p.descripcion || 'No hay descripción disponible.',
        
        habilidad: p.habilidad || "N/A", 
        altura: p.altura || "N/A",
        peso: p.peso || "N/A",
    };

    const mainColor = getTypeColor(displayPokemon.tipo);

    return (
        // APLICACIÓN DEL FONDO DINÁMICO DE LA APP
        <main className="pokedex-container" style={{ backgroundColor: currentActiveStyles.appBgColor }}>
            
            {/* ** ENCABEZADO Y BÚSQUEDA ** */}
            <header>
                <h1>POKÉDEX</h1>
                <div className="search-panel">
                    <input
                        type="text"
                        placeholder="Buscar Pokémon por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                    />
                    <button className="search-btn" title="Buscar Pokémon" onClick={handleSearch}>🔍</button>
                    <button className="add-btn" title="Añadir Nuevo Pokémon" onClick={() => setShowAddForm(true)}>Añadir</button>
                    {/* BOTÓN DE PERSONALIZACIÓN */}
                    <button className="settings-btn" title="Personalizar" onClick={() => setIsPanelOpen(true)}>
                        <FaCog />
                    </button>
                </div>
                <div className="pokemon-name">{displayPokemon.nombre}</div>
            </header>


            {/* Contenido principal */}
            <section className="pokedex-main">
                <div className="pokemon-image-container" style={{ borderColor: mainColor }}>
                    <img src={displayPokemon.imagen} alt={displayPokemon.nombre} />
                </div>

                {/* APLICACIÓN DE ESTILOS DINÁMICOS A LA TARJETA */}
                <div 
                    className="pokemon-details-card" 
                    style={{ 
                        borderColor: mainColor, 
                        backgroundColor: currentActiveStyles.cardBgColor, 
                        borderRadius: currentActiveStyles.borderRadius,
                        // El tamaño de fuente se aplica a todo el contenedor
                        fontSize: `var(--pokedex-font-size)` 
                    }}
                >
                    <span className="led" style={{ background: mainColor }}></span>
                    
                    <div className="pokemon-details">
                        <p><strong style={{ color: mainColor }}>No.:</strong> <span>{displayPokemon.numero}</span></p>
                        <p><strong style={{ color: mainColor }}>HP:</strong> <span>{displayPokemon.hp}</span></p>
                        
                        <p>
                            <strong style={{ color: mainColor }}>Tipo 1:</strong> 
                            <span>
                                {displayPokemon.tipo}
                                <span className="pokemon-type-icon">{getTypeIcon(displayPokemon.tipo)}</span>
                            </span>
                        </p>
                        
                        {displayPokemon.tipo2 && (
                            <p>
                                <strong style={{ color: getTypeColor(displayPokemon.tipo2) }}>Tipo 2:</strong>
                                <span>{displayPokemon.tipo2}</span>
                            </p>
                        )}

                        <p><strong style={{ color: mainColor }}>Ataque:</strong> <span>{displayPokemon.ataque}</span></p>
                        <p><strong style={{ color: mainColor }}>Defensa:</strong> <span>{displayPokemon.defensa}</span></p>
                        <p><strong style={{ color: mainColor }}>Veloc.:</strong> <span>{displayPokemon.velocidad}</span></p>
                        <p><strong style={{ color: mainColor }}>Ataque Esp.:</strong> <span>{displayPokemon.ataque_esp}</span></p>
                        <p><strong style={{ color: mainColor }}>Defensa Esp.:</strong> <span>{displayPokemon.defensa_esp}</span></p>
                        <p><strong style={{ color: mainColor }}>Habilidad:</strong> <span>{displayPokemon.habilidad}</span></p>
                        <p><strong style={{ color: mainColor }}>Altura:</strong> <span>{displayPokemon.altura}</span></p>
                        <p><strong style={{ color: mainColor }}>Peso:</strong> <span>{displayPokemon.peso}</span></p>
                    </div>
                    
                    {/* Barra de HP */}
                    <div className="level-bar">
                        <div
                            className="level-bar-fill"
                            style={{
                                width: `${Math.min(displayPokemon.hp, 100)}%`,
                                backgroundColor: mainColor
                            }}
                        ></div>
                    </div>

                    <div className="pokemon-description">{displayPokemon.descripcion}</div>

                    <div className="form-actions">
                        <button
                            className="evolution-btn"
                            title="Modificar este Pokémon"
                            style={{ background: mainColor, boxShadow: `0 2px 8px ${mainColor}66` }}
                            onClick={() => setShowEditForm(true)}
                        >Modificar</button>
                        <button
                            className="delete-button"
                            title="Eliminar este Pokémon"
                            onClick={() => handleDelete(currentPokemon.id)}
                        >Eliminar</button>
                    </div>
                </div>
            </section>


            {/* ** LISTA DE RESULTADOS / CARRUSEL ** */}
            <footer className="pokedex-results">
                <h3>RESULTADOS ({filteredPokemon.length})</h3>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: '10px', gap: '15px'}}>
                    <button onClick={goToPrev} disabled={TOTAL_REAL_ITEMS === 0} style={{padding: '5px 10px', backgroundColor: '#64b5f6', color: 'white', border: 'none', borderRadius: '5px'}}>Anterior</button>
                    <button onClick={goToNext} disabled={TOTAL_REAL_ITEMS === 0} style={{padding: '5px 10px', backgroundColor: '#64b5f6', color: 'white', border: 'none', borderRadius: '5px'}}>Siguiente</button>
                </div>

                <div 
                    className="results-list"
                >
                    <div 
                        className="carrusel-inner" 
                        style={{ 
                            transform: transformValue,
                            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
                        }}
                    >
                        {carruselClones.map((p, index) => {
                            const isActive = currentPokemon && p.id === currentPokemon.id && !p.isClone;
                            
                            return (
                                <button
                                    key={p.key} 
                                    className={`result-item ${isActive ? 'active' : ''}`}
                                    onClick={() => handlePokemonClick(p, index)} 
                                    title={p.nombre}
                                >
                                    <img src={IMAGE_BASE_URL + p.imagen_nombre} alt={p.nombre} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </footer>


            {/* RENDERIZADO CONDICIONAL DE MODALES (Añadido/Editado/Personalización) */}

            {isPanelOpen && (
                <PersonalizationPanel 
                    setIsPanelOpen={setIsPanelOpen} 
                    currentActiveStyles={currentActiveStyles}
                    setCurrentActiveStyles={setCurrentActiveStyles}
                />
            )}
            
            {/* AddPokemonForm - Asumimos que AddPokemonForm también fue envuelto en modal */}
            {showAddForm && (
                <AddPokemonForm
                    onClose={() => setShowAddForm(false)}
                    onPokemonAdded={fetchPokemon}
                />
            )}
            
            {/* EditPokemonForm - ¡Ahora será un modal gracias a la modificación! */}
            {showEditForm && (
                <EditPokemonForm
                    pokemon={currentPokemon}
                    onClose={() => setShowEditForm(false)}
                    onPokemonUpdated={fetchPokemon}
                />
            )}
        </main>
    );
}

export default App;
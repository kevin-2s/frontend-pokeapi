import { useEffect, useState } from 'react';
import { Search, Sparkles, CheckCircle2 } from 'lucide-react';
import './App.css';

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

interface DiscoveredPokemon {
  _id?: string;
  no: number;
  name: string;
}

const PokemonCard = ({ 
  pokemon, 
  isDiscovered, 
  onDiscover,
  isDiscovering
}: { 
  pokemon: Pokemon; 
  isDiscovered: boolean; 
  onDiscover: (p: Pokemon) => void;
  isDiscovering: boolean;
}) => {
  const [description, setDescription] = useState<string | null>(null);

  useEffect(() => {
    if (isDiscovered && !description) {
      // Obtenemos la descripción desde la API de especies (preferencia en español)
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
        .then(res => res.json())
        .then(data => {
          const entry = data.flavor_text_entries.find((e: any) => e.language.name === 'es') || 
                        data.flavor_text_entries.find((e: any) => e.language.name === 'en');
          if (entry) {
            setDescription(entry.flavor_text.replace(/[\n\f]/g, ' '));
          }
        })
        .catch(console.error);
    }
  }, [isDiscovered, pokemon.id, description]);

  return (
    <div className={`pokemon-card ${isDiscovered ? 'discovered' : ''}`}>
      <div className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</div>
      
      <div className="image-container">
        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          className={isDiscovered ? 'pokemon-image-discovered' : 'pokemon-image-unknown'}
        />
      </div>

      <div className="pokemon-info">
        <div className="pokemon-name">
          {isDiscovered ? pokemon.name : '???'}
        </div>

        {isDiscovered && description && (
          <div className="pokemon-desc">
            "{description}"
          </div>
        )}

        {!isDiscovered ? (
          <button 
            className="discover-btn" 
            onClick={() => onDiscover(pokemon)}
            disabled={isDiscovering}
          >
            <Sparkles size={18} />
            {isDiscovering ? 'Descubriendo...' : 'Descubrir'}
          </button>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="discovered-badge">
              <CheckCircle2 size={16} />
              ¡Descubierto!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [discoveredIds, setDiscoveredIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [discoveringId, setDiscoveringId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch from PokeAPI
        const pokeRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const pokeData = await pokeRes.json();
        
        const loadedPokemons = pokeData.results.map((p: any, index: number) => {
          const id = index + 1;
          return {
            id,
            name: p.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });

        // 2. Fetch from Backend
        const backRes = await fetch('/api/pokemon');
        const backData: DiscoveredPokemon[] = await backRes.json();
        
        const discSet = new Set<number>();
        if (Array.isArray(backData)) {
            backData.forEach(p => discSet.add(p.no));
        }

        setPokemons(loadedPokemons);
        setDiscoveredIds(discSet);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDiscover = async (pokemon: Pokemon) => {
    setDiscoveringId(pokemon.id);
    try {
      const res = await fetch('/api/pokemon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ no: pokemon.id, name: pokemon.name }),
      });
      
      if (res.ok) {
        const newSet = new Set(discoveredIds);
        newSet.add(pokemon.id);
        setDiscoveredIds(newSet);
      } else {
        console.error("Failed to discover pokemon");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDiscoveringId(null);
    }
  };

  const filteredPokemons = pokemons.filter(pokemon => {
    const term = searchTerm.toLowerCase();
    return pokemon.name.toLowerCase().includes(term) || String(pokemon.id).includes(term);
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Cargando Pokédex...</h2>
      </div>
    );
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
          alt="Pokeball" 
          style={{ width: '48px', opacity: 0.8 }} 
        />
      </div>
      <h1>Pokédex Secreta</h1>
      <p className="subtitle">Descubre los primeros 150 Pokémon y regístralos en tu backend</p>

      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          className="search-input"
          placeholder="Busca por nombre o número (ej. Pikachu o 25)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="pokedex-grid">
        {filteredPokemons.map(pokemon => (
          <PokemonCard 
            key={pokemon.id}
            pokemon={pokemon}
            isDiscovered={discoveredIds.has(pokemon.id)}
            isDiscovering={discoveringId === pokemon.id}
            onDiscover={handleDiscover}
          />
        ))}
      </div>
      
      {filteredPokemons.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8' }}>
          <h3>No se encontró ningún Pokémon con "{searchTerm}"</h3>
        </div>
      )}
    </>
  );
}

export default App;

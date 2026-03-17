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

function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [discoveredIds, setDiscoveredIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [discoveringId, setDiscoveringId] = useState<number | null>(null);

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
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <Search size={40} color="#38bdf8" />
      </div>
      <h1>Pokédex</h1>
      <p className="subtitle">Descubre los 150 pokemons</p>

      <div className="pokedex-grid">
        {pokemons.map(pokemon => {
          const isDiscovered = discoveredIds.has(pokemon.id);
          const isDiscovering = discoveringId === pokemon.id;

          return (
            <div key={pokemon.id} className={`pokemon-card ${isDiscovered ? 'discovered' : ''}`}>
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

                {!isDiscovered ? (
                  <button
                    className="discover-btn"
                    onClick={() => handleDiscover(pokemon)}
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
        })}
      </div>
    </>
  );
}

export default App;

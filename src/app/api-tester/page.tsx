'use client'
import { useEffect, useState } from 'react'

// using React way to fetch data
const pokemon_url = 'https://pokeapi.co/api/v2/pokemon/ditto'

export default function ApiTester() {
  const [pokemon, setPokemon] = useState<any>(null)

  const fetchPokemon = async () => {
    try {
      const res = await fetch(pokemon_url)
      if (!res.ok) {
        throw new Error('Failed to fetch pokemon')
      }
      const data = await res.json()
      setPokemon(data)
    } catch (error) {
      console.error('Error fetching pokemon:', error)
    }
  }

  useEffect(() => {
    fetchPokemon()
  }, [])

  if (!pokemon) return <div>Loading...</div>

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h1>{pokemon.name.toUpperCase()}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />

      <h2>Type:</h2>
      <ul>
        {pokemon.types.map((typeInfo: any) => (
          <li key={typeInfo.slot}>{typeInfo.type.name}</li>
        ))}
      </ul>

      <h2>Abilities:</h2>
      <ul>
        {pokemon.abilities.map((a: any) => (
          <li key={a.ability.name}>
            {a.ability.name} {a.is_hidden && '(Hidden)'}
          </li>
        ))}
      </ul>

      <h2>Stats:</h2>
      <ul>
        {pokemon.stats.map((s: any) => (
          <li key={s.stat.name}>
            {s.stat.name}: {s.base_stat}
          </li>
        ))}
      </ul>
    </div>
  )
}

import { useEffect, useState } from 'react';
import styles from './Asteroids.module.css';

interface CloseApproachData {
  close_approach_date: string;
  relative_velocity: {
    kilometers_per_hour: string;
  };
  miss_distance: {
    kilometers: string;
  };
}

interface Asteroid {
  id: string;
  name: string;
  close_approach_data: CloseApproachData[];
  is_potentially_hazardous_asteroid: boolean;
}

export default function Asteroids() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAsteroids = async () => {
      const today = new Date().toISOString().split('T')[0];
      const API_KEY = 'DEMO_KEY'; 
      const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const asteroidsToday: Asteroid[] = data?.near_earth_objects?.[today] || [];
        setAsteroids(asteroidsToday);
      } catch (error) {
        console.error('Erro ao buscar asteroides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, []);

  const renderAsteroidCard = (asteroid: Asteroid) => {
    const approach = asteroid.close_approach_data?.[0];
    if (!approach) return null;

    const velocity = Number(approach.relative_velocity.kilometers_per_hour).toFixed(0);
    const distance = Number(approach.miss_distance.kilometers).toFixed(0);
    const isDangerous = asteroid.is_potentially_hazardous_asteroid;

    return (
      <div
        key={asteroid.id}
        className={`${styles.card} ${isDangerous ? styles.dangerous : ''}`}
      >
        <h3>{asteroid.name}</h3>
        <p><strong>Data:</strong> {approach.close_approach_date}</p>
        <p><strong>Velocidade:</strong> {velocity} km/h</p>
        <p><strong>Distância:</strong> {distance} km</p>
        <p><strong>Perigoso?</strong> {isDangerous ? 'Sim' : 'Não'}</p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>☄️ Asteroides Próximos da Terra</h2>
      <p className={styles.info}>Mostrando aproximações do dia atual:</p>

      <div className={styles.list}>
        {loading ? (
          <p>Carregando dados...</p>
        ) : asteroids.length === 0 ? (
          <p>Nenhum asteroide encontrado para hoje.</p>
        ) : (
          asteroids.map(renderAsteroidCard)
        )}
      </div>
    </div>
  );
}

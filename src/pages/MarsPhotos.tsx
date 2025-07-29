import { useEffect, useState } from 'react';
import styles from './MarsPhotos.module.css';

interface Photo {
  id: number;
  img_src: string;
  camera: {
    full_name: string;
  };
  rover: {
    name: string;
  };
  earth_date: string;
}

export default function MarsPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [sol, setSol] = useState<number>(1000); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const fetchPhotos = async (solNumber: number): Promise<void> => {
    setLoading(true);
    setError(null);
    setPhotos([]);

    try {
      const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solNumber}&api_key=DEMO_KEY`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

      const data = await res.json();
      setPhotos(data.photos.slice(0, 10)); 
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(sol);
  }, [sol]);


  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setSol(value);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🪐 Fotos de Marte - Rovers</h2>

      <div className={styles.filterBar}>
        <label htmlFor="solInput">Escolha um sol (dia marciano):</label>
        <input
          type="number"
          id="solInput"
          min={0}
          value={sol}
          onChange={handleSolChange}
        />
      </div>

      <div className={styles.gallery}>
        {loading && <p>Carregando fotos...</p>}
        {error && <p className={styles.error}>Erro: {error}</p>}
        {!loading && !error && photos.length === 0 && (
          <p>Nenhuma foto encontrada para esse sol.</p>
        )}
        {!loading &&
          !error &&
          photos.map((photo) => (
            <div key={photo.id} className={styles.card}>
              <img
                src={photo.img_src}
                alt={`Foto tirada pela câmera ${photo.camera.full_name}`}
                className={styles.image}
              />
              <p><strong>Câmera:</strong> {photo.camera.full_name}</p>
              <p><strong>Rover:</strong> {photo.rover.name}</p>
              <p><strong>Data:</strong> {photo.earth_date}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

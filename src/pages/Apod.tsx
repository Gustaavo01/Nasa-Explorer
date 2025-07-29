import { useEffect, useState } from 'react';
import './Apod.module.css';

type ApodData = {
  title: string;
  date: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
};

const API_KEY = 'DEMO_KEY'; 

export default function Apod() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async function fetchApodWithFallback(daysBack = 0): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    const formattedDate = formatDate(date);

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${formattedDate}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar data ${formattedDate}: status ${response.status}`);
      }

      const json: ApodData = await response.json();

      if (json.media_type !== 'image') {
        if (daysBack >= 5) {
          throw new Error('Não foi possível encontrar uma imagem nos últimos 5 dias.');
        }
        return fetchApodWithFallback(daysBack + 1);
      }

      const imageUrl = json.hdurl ?? json.url;
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `https://apod.nasa.gov/apod/${imageUrl}`;

      setData({ ...json, url: fullUrl });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApodWithFallback();
  }, []);

  if (loading) return <p>Carregando imagem do dia...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;
  if (!data) return <p>Sem imagem para mostrar.</p>;

  return (
    <div className="apod-container">
      <h1 className="apod-title">{data.title}</h1>

      <img
        src={data.url}
        alt={data.title}
        className="apod-image"
      />

      <p className="apod-explanation">{data.explanation}</p>
      <p className="apod-date">{data.date}</p>
    </div>
  );
}

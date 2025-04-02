import '@/app/globals.css';
import { useParams } from 'next/navigation';

export default function PokemonId() {
  const params = useParams<{ id: string; }>()
  return (
    <div>
      { params?.id }
    </div>
  );
}

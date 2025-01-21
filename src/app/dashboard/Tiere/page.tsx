'use server';
import { getTiere, getPfleger, getTierart } from './getTiere';
import TiereTable from './TierTable';

async function Tiere() {
  const tiere = await getTiere(); // Server-side function
  const pfleger = await getPfleger(); // Server-side function
  const tierart = await getTierart(); // Server-side function

  return <TiereTable tiere={tiere} pfleger={pfleger} tierart={tierart} />;
}

export default Tiere;

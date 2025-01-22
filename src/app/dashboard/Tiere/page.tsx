'use server';
import { getTiere, getPfleger, getTierart } from './getTiere';
import TiereTable from './TierTable';
import { PflegerToken } from '../PflegerToken';
import { Box } from '@mui/material';
async function Tiere() {
  const tiere = await getTiere(); // Server-side function
  const pfleger = await getPfleger(); // Server-side function
  const tierart = await getTierart(); // Server-side function

  return (
    <Box>
      <PflegerToken />
      <TiereTable tiere={tiere} pfleger={pfleger} tierart={tierart} />
    </Box>
  );
}

export default Tiere;

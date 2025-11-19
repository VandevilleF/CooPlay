import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const DeleteAccount = ({ onDeleteClick }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{
        p: 3,
        border: '1px solid #ef4444',
        borderRadius: 1,
        bgcolor: '#1a1a1a'
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Suppression de compte
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#999' }}>
          Une fois votre compte supprimé, il n'y a pas de retour en arrière.
        </Typography>
        <Button
        variant="outlined"
        color="error"
        onClick={onDeleteClick}>
          Supprimer mon compte
        </Button>
      </Box>
    </Box>
  );
}


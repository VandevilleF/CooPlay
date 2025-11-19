import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { userService } from '../../services/userService';

export const DeleteAccountModal = ({ open, onClose }) => {
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmText !== 'SUPPRIMER') {
      setError('Veuillez taper "SUPPRIMER" pour confirmer');
      return;
    }
    if (!password) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }
    setLoading(true);
    try {
      await userService.deleteUserCompletely(password);
      navigate('/');
    } catch (error) {
      setError('Erreur lors de la suppression du compte');
      setLoading(false);
    }
  };

  const needsCurrentPassword = confirmText == 'SUPPRIMER';

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: '#1a1a1a',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#ef4444' }}>
          <WarningAmberIcon sx={{ mr: 1, fontSize: 30 }} />
          <Typography variant="h5">
            Supprimer le compte
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
        </Typography>

        <Alert severity="warning" sx={{ mb: 3 }}>
          Toutes vos données seront définitivement supprimées.
        </Alert>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="body2" sx={{ mb: 1 }}>
          Pour confirmer, tapez SUPPRIMER ci-dessous :
        </Typography>

        <TextField
          fullWidth
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="SUPPRIMER"
          variant="outlined"
          sx={{ mb: 3 }}
        />

        {needsCurrentPassword && (
            <TextField
              fullWidth
              label="Mot de passe actuel (requis)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password'
              margin="normal"
              variant="outlined"
              required
              helperText="Nécessaire pour supprimer le compte"
            />
          )}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="error"
            onClick={handleDelete}
            disabled={loading || confirmText !== 'SUPPRIMER'}
          >
            {loading ? 'Suppression...' : 'Supprimer définitivement'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

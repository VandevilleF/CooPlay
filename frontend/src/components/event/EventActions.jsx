import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../../hooks/useEvent';

export const EventActions = () => {
  const navigate = useNavigate();
  const {
    leaveOrCancelEvent,
    isUserCreator,
    isUserParticipant,
    actionButtonText,
    actionButtonColor,
    loading,
    event,
    participants,
    user
  } = useEvent();

  console.log('Debug EventActions:', {
    loading,
    user,
    event,
    participants,
    isUserCreator,
    isUserParticipant
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  const handleLeaveOrCancel = async () => {
    setActionLoading(true);

    try {
      const result = await leaveOrCancelEvent(false);

      if (result.needsConfirmation) {
        // Demander confirmation pour la suppression
        setConfirmDialog({
          open: true,
          title: 'Confirmer l\'annulation',
          message: result.message
        });
      } else if (result.success) {
        // Action réussie - rediriger dans tous les cas
        navigate('/events');
      } else if (result.error) {
        // Gérer l'erreur
        console.error('Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setActionLoading(true);

    try {
      const result = await leaveOrCancelEvent(true); // Confirmer la suppression

      if (result.success) {
        navigate('/events'); // Rediriger après suppression
      } else if (result.error) {
        console.error('Erreur:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setActionLoading(false);
      setConfirmDialog({ open: false, title: '', message: '' });
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, title: '', message: '' });
  };

  // Ne pas afficher si l'utilisateur n'est ni créateur ni participant
  if (!isUserCreator && !isUserParticipant) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton onClick={handleBack} sx={{ color: '#9ca3af' }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <IconButton onClick={handleBack} sx={{ color: '#9ca3af' }}>
          <ArrowBackIcon />
        </IconButton>

        <Button
          variant="outlined"
          color={actionButtonColor}
          onClick={handleLeaveOrCancel}
          disabled={loading || actionLoading}
          startIcon={isUserCreator ? <DeleteIcon /> : <ExitToAppIcon />}
          size="small"
          sx={{
            color: isUserCreator ? '#ef4444' : '#f59e0b',
            borderColor: isUserCreator ? '#ef4444' : '#f59e0b',
            '&:hover': {
              borderColor: isUserCreator ? '#dc2626' : '#d97706',
              backgroundColor: isUserCreator ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'
            }
          }}
        >
          {actionLoading ? 'Chargement...' : actionButtonText}
        </Button>
      </Box>

      {/* Dialog de confirmation pour la suppression */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { backgroundColor: '#1a1a1a', color: '#fff' }
        }}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#9ca3af' }}>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: '#9ca3af' }}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? 'Suppression...' : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

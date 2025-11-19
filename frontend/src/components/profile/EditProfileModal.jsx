import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ProfileAvatar } from '../avatar/ProfilAvatar';
import { userService } from '../../services/userService';

export const EditProfileModal = ({ open, onClose, userData }) => {
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [formData, setFormData] = useState({
    username: userData?.username || '',
    describe: userData?.describe || '',
    email: userData?.email || '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const needsReauth = formData.email !== userData.email || formData.password;

      // Réauthentification nécessaire avant modification email ou mot de passe
      if (needsReauth) {
        if (!currentPassword) {
          setError("Veuillez entrer votre mot de passe actuel pour modifier l'email ou le mot de passe");
          setLoading(false);
          return;
        }
        await userService.reauthenticate(currentPassword);
      }

      // Mettre à jour Firebase Auth
      if (formData.email !== userData.email) {
        await userService.updateUserEmailWithVerification(formData.email);
        setSuccess('Un email de vérification a été envoyé à votre nouvelle adresse. Veuillez vérifier votre boîte mail avant que le changement ne soit effectif.');
      }
      if (formData.password) {
        await userService.updateUserPassword(formData.password);
      }

      if (formData.username !== userData.username || formData.describe !== userData.describe || formData.email !== userData.email) {
        await userService.updateUserProfile(formData.username, formData.describe, formData.email);
      }

      // Reset des champs de mot de passe
      setFormData({
        ...formData,
        password: ''
      });
      setCurrentPassword('');

      setSuccess('Profil mis à jour avec succès !');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Erreur:', error);

      switch (error.code) {
        case 'auth/wrong-password':
          setError('Mot de passe actuel incorrect');
          break;
        case 'auth/weak-password':
          setError('Le nouveau mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 caractère spécial et 1 nombre');
          break;
        case 'auth/email-already-in-use':
          setError('Cette adresse email est déjà utilisée');
          break;
        case 'auth/invalid-email':
          setError('Adresse email invalide');
          break;
        case 'auth/requires-recent-login':
          setError('Pour des raisons de sécurité, veuillez vous reconnecter');
          break;
        default:
          setError(error.message || 'Une erreur est survenue lors de la mise à jour');
      }
    } finally {
      setLoading(false);
    }
  };

  const needsCurrentPassword = formData.email !== userData.email || formData.password;

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
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={style}>
        {/* En-tête avec bouton fermer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Modifier le profil
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Avatar (optionnel) */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ProfileAvatar user={userData} size={60}/>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Description"
            name="describe"
            value={formData.describe}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type='email'
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Mot de passe"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type='password'
            margin="normal"
            variant="outlined"
          />

          {needsCurrentPassword && (
            <TextField
              fullWidth
              label="Mot de passe actuel (requis)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type='password'
              margin="normal"
              variant="outlined"
              required
              helperText="Nécessaire pour modifier l'email ou le mot de passe"
            />
          )}

          {/* Boutons d'action */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' } }}
            >
              Enregistrer
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

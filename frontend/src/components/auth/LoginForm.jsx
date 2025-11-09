import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";
import httpClient from '../../services/httpClient';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Authentification Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential) {
        console.error('userCredential est undefined');
        throw new Error('Authentification échouée - userCredential undefined');
      }

      if (!userCredential.user) {
        console.error('userCredential.user est undefined');
        throw new Error('Authentification échouée - user undefined');
      }

      if (!userCredential.user.emailVerified) {
        setErrors({
          general: 'Veuillez vérifier votre email avant de vous connecter. Vérifiez votre boîte de réception.'
        });
        // Déconnecter l'utilisateur
        await auth.signOut();
        setLoading(false);
        return;
      }

      // Continue seulement si tout est OK
      const idToken = await userCredential.user.getIdToken();
      await httpClient.post('/auth/login', { idToken });

      handleHomePage();

    } catch (error) {
      console.error('Erreur détaillée:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setErrors({ general: 'Email ou mot de passe incorrect.' });
      } else if (error.code === 'auth/user-not-found') {
        setErrors({ general: 'Aucun compte trouvé avec cet email.' });
      } else {
        setErrors({ general: `Erreur: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectRegister= () => {
    navigate('/register');
  };

  const handleHomePage = () => {
    navigate('/events');
  }

  return (
    <Container className="auth-card">
      <Typography variant="h2">CooPlay</Typography>
      <Typography variant="h6">Rejoint ta communauté gaming</Typography>

      {errors.general && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {errors.general}
        </Typography>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          className="auth-input"
          label="Adresse e-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="JohnDoe@gmail.com"
          required
          disabled={loading}
        />

        <TextField
          className="auth-input"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <Typography className="auth-forgot">
          Mot de passe oublié ?
        </Typography>

        <Button
          type="submit"
          className="auth-button"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <Typography className="auth-divider">ou</Typography>

      <Button
      className="auth-link"
      onClick={handleRedirectRegister}
      disabled={loading}
      >
        Créer un compte
      </Button>
    </Container>
  );
};

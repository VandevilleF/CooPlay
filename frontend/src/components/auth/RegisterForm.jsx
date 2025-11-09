import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { auth } from '../../services/firebase/config';
import { validatePassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Effect pour gérer la redirection
  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        handleRedirectLogin();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [shouldRedirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (password !== confirmPassword) {
        setErrors({ confirm: 'Les mots de passe ne correspondent pas' });
        return;
      }
      const status = await validatePassword(auth, password);

      if (!status.isValid) {
        const passwordErrors = [];
        if (status.containsLowercaseLetter === false) passwordErrors.push('minuscule');
        if (status.containsUppercaseLetter === false) passwordErrors.push('majuscule');
        if (status.containsNumericCharacter === false) passwordErrors.push('chiffre');
        if (status.containsNonAlphanumericCharacter === false) passwordErrors.push('caractère spécial');
        if (status.meetsMinPasswordLength === false) passwordErrors.push('longueur minimale');

        setErrors({ password: `Le mot de passe doit contenir: ${passwordErrors.join(', ')}` });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Envoyer l'email de vérification
      await sendEmailVerification(userCredential.user, {
        url: 'http://localhost:5173',
        handleCodeInApp: false
      });

      setSuccessMessage('Compte créé ! Un email de vérification a été envoyé à votre adresse.');
      setShouldRedirect(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirectLogin = () => {
    navigate('/');
  }

  return (
    <Container className="auth-card">
      <Typography variant="h2">CooPlay</Typography>
      <Typography variant="h6">Rejoint ta communauté gaming</Typography>

      {errors.general && (
        <Typography color="error" sx={{ mb: 2 }}>{errors.general}</Typography>
      )}

      {successMessage && (
        <Typography color="success" sx={{ mb: 2, textAlign: 'center', color: 'green' }}>
          {successMessage}
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
        />

        <TextField
          className="auth-input"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          required
        />

        <TextField
          className="auth-input"
          label="Confirmation"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirm}
          helperText={errors.confirm}
          required
        />

        <Button
          type="submit"
          className="auth-button"
          variant="contained"
        >
          Créer un compte
        </Button>
      </form>

      <Typography className="auth-divider">ou</Typography>

      <Button
      className="auth-link"
      onClick={handleRedirectLogin}
      >
        Se connecter
      </Button>
    </Container>
  );
};

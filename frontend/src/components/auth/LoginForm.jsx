import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion ici
    console.log({ email, password });
  };

  return (
    <Container className="auth-card">
      <Typography variant="h2">CooPlay</Typography>
      <Typography variant="h6">Rejoint ta communauté gaming</Typography>

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
          placeholder="••••••••"
          required
        />

        <Typography className="auth-forgot">
          Mot de passe oublié ?
        </Typography>

        <Button
          type="submit"
          className="auth-button"
          variant="contained"
        >
          Se connecter
        </Button>
      </form>

      <Typography className="auth-divider">ou</Typography>

      <Button className="auth-link">
        Créer un compte
      </Button>
    </Container>
  );
};

import { AuthLayout } from '../../components/layout/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

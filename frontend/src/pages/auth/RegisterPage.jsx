import { AuthLayout } from '../../components/layout/AuthLayout.jsx';
import { RegisterForm } from '../../components/auth/RegisterForm.jsx';

export const RegisterPage = () => {
	return (
		<AuthLayout>
			<RegisterForm />
		</AuthLayout>
	);
}

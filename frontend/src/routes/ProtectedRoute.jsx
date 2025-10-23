import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export const PrivateRoutes = () => {
	const { isAuthenticated, authReady } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// Rediriger seulement quand authReady est true et que l'utilisateur n'est pas authentifié
		if (authReady && !isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [authReady, isAuthenticated, navigate]);

	if (!authReady) {
		return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<p>Chargement...</p>
		</div>
		);
	}

	return <Outlet />
}

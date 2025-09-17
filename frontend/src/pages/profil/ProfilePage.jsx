import { MainLayout } from "../../components/layout/MainLayout";
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { FavoritesGame } from '../../components/profile/FavoriteGame';
import { RecentActivity } from "../../components/profile/RecentActivity";
import { TrophyGrid } from '../../components/profile/TrophyGrid';
import Typography from '@mui/material/Typography';

export const ProfilePage = () => {
	return (
		<>
		<MainLayout>
			{({ user, currentUserId, authReady }) => (
				<>
					{authReady && user ? (
						<>
							<ProfileHeader user={user} />
							<TrophyGrid />
							<FavoritesGame />
							<RecentActivity />
						</>
					) : (
					<Typography>Chargement du profil...</Typography>
					)}
				</>
			)}
		</MainLayout>
		</>
	);
}

import { MainLayout } from "../../components/layout/MainLayout";
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { FavoritesGame } from '../../components/profile/FavoriteGame';
import { RecentActivity } from "../../components/profile/RecentActivity";
import { TrophyGrid } from '../../components/profile/TrophyGrid';
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import { DeleteAccount } from "../../components/profile/DeleteAccount";
import { DeleteAccountModal } from "../../components/profile/DeleteAccountModal";
import Typography from '@mui/material/Typography';
import { useState } from "react";

export const ProfilePage = () => {
	const [openModal, setOpenModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	return (
		<>
		<MainLayout>
			{({ user, currentUserId, authReady }) => (
				<>
					{authReady && user ? (
						<>
							<ProfileHeader user={user} onEditClick={() => setOpenModal(true)} />
							<TrophyGrid />
							<FavoritesGame />
							<RecentActivity />
							<DeleteAccount onDeleteClick={() => setOpenDeleteModal(true)} />

							<EditProfileModal
							open={openModal}
							onClose={() => setOpenModal(false)}
							userData={user}
							/>
							<DeleteAccountModal
							open={openDeleteModal}
							onClose={() => setOpenDeleteModal(false)}
							/>
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

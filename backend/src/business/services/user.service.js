export class UserService {
	constructor(userRepository, authService) {
		this.userRepository = userRepository;
		this.authService = authService;
	}
	async getUserByFirebaseUid(uid) {
		return this.userRepository.findByFirebaseUid(uid);
	}
	async createUser({ firebase_uid, username, email }) {
		return this.userRepository.create({ firebase_uid, username, email });
	}
	async updateUser( userId, data ) {
		return this.userRepository.update( userId, data );
	}
	async deleteUserByFirebaseUid(uid) {
		await this.userRepository.delete(uid);

		await this.authService.deleteUser(uid);
		return
	}
}

export class UserService {
	constructor(userRepository) {
		this.userRepository = userRepository;
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
}

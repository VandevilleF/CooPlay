export class CreateUserUseCase {
	constructor(userService) {
		this.userService = userService;
	}

	async execute({ firebase_uid, email, username }) {
		let user = await this.userService.getUserByFirebaseUid(firebase_uid);
		if (!user) {
		user = await this.userService.createUser({ firebase_uid, email, username });
		}
		return user;
	}
}

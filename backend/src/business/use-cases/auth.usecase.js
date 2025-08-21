export class AuthenticateUserUseCase {
	constructor(authService, userService) {
		this.authService = authService;
		this.userService = userService;
	}

	async execute(idToken) {
		const decodedToken = await this.authService.verifyIdToken(idToken);

		let user = await this.userService.getUserByFirebaseUid(decodedToken.uid);
		if (!user) {
		user = await this.userService.createUser({
			firebase_uid: decodedToken.uid,
			email: decodedToken.email,
			username: decodedToken.email.split("@")[0],
		});
		}

		return user;
	}
}

import { auth } from "../../infrastructure/firebaseAdmin.js";

export class AuthService {
	async verifyIdToken(idToken) {
		try {
		const decodedToken = await auth.verifyIdToken(idToken);
		return decodedToken;
		} catch (err) {
		throw new Error("Invalid Firebase token");
		}
	}
}

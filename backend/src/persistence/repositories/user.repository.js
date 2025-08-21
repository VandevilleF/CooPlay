import { prisma } from '../../shared/prismaClient.js'

export class UserRepository {
	constructor(prismaClient = prisma) {
		this.prisma = prismaClient;
	}
	async findByFirebaseUid (uid) {
		return this.prisma.user.findUnique({
			where: { firebase_uid: uid},
		});
	}
	async findByEmail (email) {
		return this.prisma.user.findUnique({
			where: { email },
		});
	}
	async create ({ firebase_uid, username, email }) {
		return this.prisma.user.create({
			data: {
				firebase_uid,
				username,
				email,
			},
		});
	}
	async update (id, data) {
		return this.prisma.user.update({
			where: { id },
			data,
		})
	}
	async delete (id) {
		return this.prisma.user.delete({
			where: { id },
		});
	}
}

import { prisma } from '../../shared/prismaClient.js'

export class GameRepository {
	constructor(prismaClient = prisma) {
		this.prisma = prismaClient;
	}

	async searchByName(searchTerm, options = {}) {
		const { limit = 10, offset = 0 } = options;

		return await this.prisma.game.findMany({
			where: {
				name: {
					contains: searchTerm,
					mode: 'insensitive'
				}
			},
			select: {
				id: true,
				name: true,
				cover_url: true
			},
			orderBy: {
				name: 'asc'
			},
			take: limit,
			skip: offset
		});
	}
}

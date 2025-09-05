export class SendMessage {
	constructor(chatService) {
		this.chatService = chatService;
	}

	async execute(userId, eventId, content) {
		try {
			const message = await this.chatService.createMessage(userId, eventId, content);

			return {
				success: true,
				message
			};
		} catch (error) {
			return {
				success: false,
				error: error.message
			}
		}
	}
}

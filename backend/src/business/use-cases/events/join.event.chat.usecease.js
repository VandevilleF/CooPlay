export class JoinEventChatUseCase {
	constructor( chatService) {
		this.chatService = chatService;
	}
	async execute(userId, eventId) {
		try {
			await this.chatService.canJoinChat(userId, eventId);

			const messages = await this.chatService.getMessages(eventId, userId);

			return {
				success: true,
				messages
			};
		} catch (error) {
			return {
				success: false,
				error: error.messages
			}
		}
	}
}

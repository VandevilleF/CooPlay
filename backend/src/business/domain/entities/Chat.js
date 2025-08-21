class Chat {
	constructor({ id, event_id, user_id, message, created_at }) {
		this.id = id;
		this.event_id = event_id;
		this.user_id = user_id;
		this.message = message;
		this.created_at = created_at;
	}

	isValidMessage() {
		return typeof this.message === "string" && this.message.trim().length > 0 && this.message.length <= 500;
	}
}

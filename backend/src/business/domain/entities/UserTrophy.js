class UserTrophy {
	constructor({ user_id, trophy_id, earned_at }) {
		this.user_id = user_id;
		this.trophy_id = trophy_id;
		this.earned_at = earned_at;
	}

	isEarnedBy(userId) {
		return this.user_id === userId;
	}
}

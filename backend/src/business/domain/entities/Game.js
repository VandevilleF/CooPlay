class Game {
	constructor({id, rawg_id, name, genres, cover_url, released, cached_at, updated_at, popularity_score}) {
		this.id = id;
		this.rawg_id = rawg_id;
		this.name = name;
		this.genres = genres;
		this.cover_url = cover_url;
		this.released = released;
		this.cached_at = cached_at;
		this.updated_at = updated_at;
		this.popularity_score = popularity_score;

		this.favorited_by = [];
		this.events = [];
	}
	increasePopularity(points = 1) { this.popularity_score += points; }
}

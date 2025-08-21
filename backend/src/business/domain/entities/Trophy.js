class Trophy {
	constructor({ id, name, description = null, icon = null }) {
		if (!name || name.trim() === "") {
			throw new Error("Un trophée doit avoir un nom");
		}
		this.id = id;
		this.name = name;
		this.description = description;
		this.icon = icon;
	}
}
export default Trophy;

import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

class EncryptionService {
	constructor() {
		this.eventKeys = new Map();
	}

	setEventKey(eventId, keyBase64) {
		// Décode en Uint8 pour tweetnacl
		const key = util.decodeBase64(keyBase64);
		// Enregistre la clé
		this.eventKeys.set(eventId, key);
	}

	hasKey(eventId) {
		// Vérifie que la clé soit présente
		return this.eventKeys.has(eventId);
	}

	encryptMessage(eventId, message) {
		const key = this.eventKeys.get(eventId);
		if (!key) throw new Error('Clé manquante');

		// Génère le nonce différent à chaque message
		const nonce = nacl.randomBytes(24);
		// Convertis le message en Uint8 pour tweetnacl
		const messageUint8 = util.decodeUTF8(message);
		// Encrypte le message
		const encrypted = nacl.secretbox(messageUint8, nonce, key);

		// Retourne le message et le nonce chiffré en base64
		return {
			encrypted: util.encodeBase64(encrypted),
			nonce: util.encodeBase64(nonce)
		};
	}

	decryptMessage(eventId, encryptedData) {
		const key = this.eventKeys.get(eventId);
		if (!key) return null;

		try {
			const encrypted = util.decodeBase64(encryptedData.encrypted);
			const nonce = util.decodeBase64(encryptedData.nonce);
			// Décrypte le message
			const decrypted = nacl.secretbox.open(encrypted, nonce, key);

			// Retourne le message si succès
			return decrypted ? util.encodeUTF8(decrypted) : null;
		} catch {
			return null;
		}
	}

	clearEventKey(eventId) {
		// Clean la clé
		this.eventKeys.delete(eventId);
	}
}

export const encryptionService = new EncryptionService();

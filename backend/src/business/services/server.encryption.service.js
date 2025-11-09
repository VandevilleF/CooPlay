import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import { config } from '../../config/environment.js'

class ServerEncryptionService {
	constructor() {
		// Master key chargée depuis .env
		this.masterKey = util.decodeBase64(config.masterKey);
	}

	// Génération d'une clé unique pour chaque événement
	generateEventKey() {
		return nacl.randomBytes(32);
	}

	// Chiffrement de la clé d'événement avec la master key
	encryptEventKey(eventKey) {
		const nonce = nacl.randomBytes(24);
		const encrypted = nacl.secretbox(eventKey, nonce, this.masterKey);

		return JSON.stringify({
			nonce: util.encodeBase64(nonce),
			key: util.encodeBase64(encrypted)
		});
	}

	// Déchiffrement impossible sans la master key du .env
	decryptEventKey(encryptedData) {
		const data = JSON.parse(encryptedData);
		const nonce = util.decodeBase64(data.nonce);
		const encryptedKey = util.decodeBase64(data.key);

		const decrypted = nacl.secretbox.open(encryptedKey, nonce, this.masterKey);

		if (!decrypted) {
			throw new Error('Impossible de déchiffrer la clé (master key invalide?)');
		}
		return util.encodeBase64(decrypted);
	}
}

export const serverEncryptionService = new ServerEncryptionService();

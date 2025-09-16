// Génère une couleur hexadécimale unique basée sur une chaîne de caractères
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  // Génère un hash numérique à partir de la chaîne
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convertit le hash en couleur RGB hexadécimale
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color; // Couleur hexadécimale (#rrggbb)
}

// Crée un avatar avec couleur de fond générée et initiales
export function stringAvatar(name) {
  const nameParts = name.split(' ');
  let initials;

  if (nameParts.length === 1) {
    // Un seul mot : prend les 2 premières lettres ("Jean" → "JE")
    initials = nameParts[0].slice(0, 2).toUpperCase();
  } else {
    // Plusieurs mots : première lettre de chaque mot ("Jean Dupont" → "JD")
    initials = nameParts
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

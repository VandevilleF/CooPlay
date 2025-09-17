export const getTimeDifference = (createdAt) => {
  const now = new Date();
  let diffInSeconds = Math.floor((now - createdAt) / 1000);

  const units = [
    { label: "année", seconds: 365 * 24 * 60 * 60 },
    { label: "mois", seconds: 30 * 24 * 60 * 60 },
    { label: "semaine", seconds: 7 * 24 * 60 * 60 },
    { label: "jour", seconds: 24 * 60 * 60 },
    { label: "heure", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
    { label: "seconde", seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value > 0) {
      return `${value} ${unit.label}${value > 1 ? "s" : ""}`;
    }
  }

  return "0 seconde";
};

export const creditFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const xpFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export const formatMemberSince = (value?: string) => {
  if (!value) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

export const getLevelProgressPercent = ({
  xpForCurrentLevel,
  xpForNextLevel,
  xpIntoCurrentLevel,
}: {
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
}) => {
  const range = xpForNextLevel - xpForCurrentLevel;

  if (range <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (xpIntoCurrentLevel / range) * 100));
};

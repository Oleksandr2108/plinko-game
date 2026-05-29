export const setCookie = (
  name: string,
  value: string,
  maxAge = 60 * 60 * 24 * 7,
) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

export const getCookie = (name: string) => {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;

  for (const cookie of document.cookie.split("; ")) {
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }

  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

const MINIMAL_UNITS_PER_CREDIT = 1_000_000;

export const fromMinimalUnits = (value: string | number) => {
  const numericValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return numericValue / MINIMAL_UNITS_PER_CREDIT;
};

export const toMinimalUnits = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return String(Math.round(value * MINIMAL_UNITS_PER_CREDIT));
};

export {
  playBallTickSound,
  playBetSound,
  playProfitSound,
  primeGameSounds,
} from "./audio";

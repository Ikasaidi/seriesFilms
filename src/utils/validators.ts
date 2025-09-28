export const reTitre = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ]+$/;

export const plateforme = /^[a-zA-Z]+$/;

export const reDuration = /^[1-9]\d*$/;

export const reStatut = /^(en_cours|terminee)$/;

export function currentYear(): number {
  return new Date().getFullYear();
}

export const normalizeStatus = (s: any) =>
  String(s ?? "").toLowerCase().replace(/\s+/g, "_");

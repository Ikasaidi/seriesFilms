// ===========================================================
// REGEX VALIDATION
// - Regexp centralisées pour email/username/name/password
// ===========================================================
// Email 
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username (3–30 caractères alphanumériques + " . _ - )
export const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;

// Nom alphabétique (lettres, espaces, apostrophes)
export const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

// Mot de passe : min 8 caracteres, 1 maj, 1 min, 1 chiffre, 1 spécial
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

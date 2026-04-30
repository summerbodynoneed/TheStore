/* ============================================================
   PANIER.JS — Gestion du panier d'achat
   Stockage : localStorage (clé "maboutique_panier")
   Fonctions globales :
     obtenirPanier()
     ajouterItem(produit, taille, quantite)
     supprimerItem(index)
     mettreAJourQuantite(index, nouvelleQty)
     viderPanier()
     calculerTotal()
   ============================================================ */

const PANIER_KEY = 'maboutique_panier';

// ── Lire le panier depuis localStorage ──────────────────────
function obtenirPanier() {
  try {
    const data = localStorage.getItem(PANIER_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Erreur lecture panier :', e);
    return [];
  }
}

// ── Sauvegarder le panier dans localStorage ──────────────────
function sauvegarderPanier(items) {
  try {
    localStorage.setItem(PANIER_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Erreur sauvegarde panier :', e);
  }
}

// ── Ajouter un article ───────────────────────────────────────
function ajouterItem(produit, taille, quantite) {
  quantite = parseInt(quantite) || 1;
  const items = obtenirPanier();

  // Chercher si le même produit + même taille existe déjà
  const existant = items.find(i => i.id === produit.id && i.taille === taille);

  if (existant) {
    existant.quantite = Math.min(existant.quantite + quantite, 10);
  } else {
    items.push({
      id:       produit.id,
      nom:      produit.nom,
      prix:     produit.prix,
      taille:   taille,
      quantite: quantite,
      image:    (produit.images && produit.images.length > 0) ? produit.images[0] : ''
    });
  }

  sauvegarderPanier(items);
  mettreAJourCompteur();
}

// ── Supprimer un article par index ───────────────────────────
function supprimerItem(index) {
  const items = obtenirPanier();
  if (index < 0 || index >= items.length) return;
  items.splice(index, 1);
  sauvegarderPanier(items);
  mettreAJourCompteur();

  // Si on est sur la page panier, rafraîchir l'affichage
  if (typeof afficherPanier === 'function') afficherPanier();
}

// ── Mettre à jour la quantité d'un article ───────────────────
function mettreAJourQuantite(index, nouvelleQty) {
  nouvelleQty = parseInt(nouvelleQty);
  if (isNaN(nouvelleQty) || nouvelleQty < 1) nouvelleQty = 1;
  if (nouvelleQty > 10) nouvelleQty = 10;

  const items = obtenirPanier();
  if (index < 0 || index >= items.length) return;
  items[index].quantite = nouvelleQty;
  sauvegarderPanier(items);
  mettreAJourCompteur();

  if (typeof afficherPanier === 'function') afficherPanier();
}

// ── Vider entièrement le panier ──────────────────────────────
function viderPanier() {
  if (!confirm('Voulez-vous vraiment vider votre panier ?')) return;
  sauvegarderPanier([]);
  mettreAJourCompteur();
  if (typeof afficherPanier === 'function') afficherPanier();
}

// ── Calculer le total du panier (hors livraison) ─────────────
function calculerTotal() {
  return obtenirPanier().reduce((sum, item) => sum + item.prix * item.quantite, 0);
}

// ── Compter le nombre total d'articles (somme des quantités) ─
function compterArticles() {
  return obtenirPanier().reduce((sum, item) => sum + item.quantite, 0);
}

// ── Mettre à jour le badge compteur dans la bannière ─────────
function mettreAJourCompteur() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const nb = compterArticles();
  el.textContent = nb;
  el.style.backgroundColor = nb > 0 ? '#cc0000' : '#888888';
}

// ── Init au chargement ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  mettreAJourCompteur();
});
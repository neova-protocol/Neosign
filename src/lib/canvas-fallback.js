// Fallback pour canvas côté client
// Ce module est utilisé pour remplacer canvas qui ne peut pas fonctionner côté client

// Export par défaut
const canvasFallback = null;

// Export nommés pour les cas où canvas exporte des fonctions spécifiques
const createCanvas = () => null;
const loadImage = () => null;
const Image = null;
const ImageData = null;

// Export pour les différents types d'import
module.exports = canvasFallback;
module.exports.default = canvasFallback;
module.exports.createCanvas = createCanvas;
module.exports.loadImage = loadImage;
module.exports.Image = Image;
module.exports.ImageData = ImageData;

// Export ES6 pour compatibilité
export default canvasFallback;
export { createCanvas, loadImage, Image, ImageData }; 
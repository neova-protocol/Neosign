// Test script pour vérifier la modification d'avatar
const fetch = require("node-fetch");

async function testEditAvatar() {
  try {
    console.log("🔍 Test de la modification d'avatar...");

    // Test de l'API de suppression d'avatar
    console.log("\n1. Test de l'API DELETE /api/user/avatar");
    
    const deleteResponse = await fetch("http://localhost:3000/api/user/avatar", {
      method: "DELETE",
    });

    if (deleteResponse.status === 401) {
      console.log("ℹ️  API DELETE accessible mais nécessite une authentification (normal)");
    } else if (deleteResponse.ok) {
      console.log("✅ API DELETE d'avatar fonctionne");
    } else {
      console.log(`⚠️  API DELETE retourne le statut: ${deleteResponse.status}`);
    }

    // Test de l'API d'upload d'avatar
    console.log("\n2. Test de l'API POST /api/user/avatar");
    
    const formData = new FormData();
    // Créer un fichier de test (simulation)
    const testFile = new Blob(['test'], { type: 'image/jpeg' });
    formData.append('file', testFile, 'test.jpg');

    const uploadResponse = await fetch("http://localhost:3000/api/user/avatar", {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.status === 401) {
      console.log("ℹ️  API POST accessible mais nécessite une authentification (normal)");
    } else if (uploadResponse.ok) {
      console.log("✅ API POST d'avatar fonctionne");
    } else {
      console.log(`⚠️  API POST retourne le statut: ${uploadResponse.status}`);
    }

    // Test de la page de profil
    console.log("\n3. Test de la page de profil");
    const profileResponse = await fetch("http://localhost:3000/dashboard/settings/profile");
    const profileHtml = await profileResponse.text();

    if (profileHtml.includes("Changer l'avatar")) {
      console.log("✅ Bouton 'Changer l'avatar' présent sur la page");
    } else {
      console.log("❌ Bouton 'Changer l'avatar' non trouvé");
    }

    if (profileHtml.includes("EditAvatarForm")) {
      console.log("✅ Composant EditAvatarForm intégré");
    } else {
      console.log("ℹ️  Composant EditAvatarForm non détecté (normal si minifié)");
    }

    console.log("\n📋 Pour tester complètement :");
    console.log("1. Connectez-vous sur l'application");
    console.log("2. Allez sur /dashboard/settings/profile");
    console.log("3. Cliquez sur 'Changer l'avatar'");
    console.log("4. Sélectionnez une image (JPG, PNG, GIF, WebP, max 5MB)");
    console.log("5. Vérifiez la prévisualisation");
    console.log("6. Cliquez sur 'Sauvegarder' pour uploader");
    console.log("7. Vérifiez que l'avatar est mis à jour dans l'interface");
    console.log("8. Testez aussi le bouton 'Supprimer' pour retirer l'avatar");

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

testEditAvatar(); 
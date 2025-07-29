// Test script pour vérifier la modification du nom complet
const fetch = require("node-fetch");

async function testEditName() {
  try {
    console.log("🔍 Test de la modification du nom complet...");

    // Test de l'API de mise à jour du nom
    console.log("\n1. Test de l'API /api/user/name");
    
    const testName = "Nouveau Nom Test";
    const response = await fetch("http://localhost:3000/api/user/name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: testName }),
    });

    if (response.status === 401) {
      console.log("ℹ️  API accessible mais nécessite une authentification (normal)");
    } else if (response.ok) {
      console.log("✅ API de mise à jour du nom fonctionne");
    } else {
      console.log(`⚠️  API retourne le statut: ${response.status}`);
    }

    // Test de la page de profil
    console.log("\n2. Test de la page de profil");
    const profileResponse = await fetch("http://localhost:3000/dashboard/settings/profile");
    const profileHtml = await profileResponse.text();

    if (profileHtml.includes("Nom complet")) {
      console.log("✅ Champ 'Nom complet' présent sur la page");
    } else {
      console.log("❌ Champ 'Nom complet' non trouvé");
    }

    if (profileHtml.includes("EditNameForm")) {
      console.log("✅ Composant EditNameForm intégré");
    } else {
      console.log("ℹ️  Composant EditNameForm non détecté (normal si minifié)");
    }

    console.log("\n📋 Pour tester complètement :");
    console.log("1. Connectez-vous sur l'application");
    console.log("2. Allez sur /dashboard/settings/profile");
    console.log("3. Cliquez sur l'icône d'édition à côté du nom");
    console.log("4. Modifiez le nom et cliquez sur ✓ pour sauvegarder");
    console.log("5. Vérifiez que le nom est mis à jour dans l'interface");

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

testEditName(); 
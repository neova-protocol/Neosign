// Test script pour vérifier l'authentification optimisée
const fetch = require("node-fetch");

async function testOptimizedAuth() {
  try {
    console.log("🔍 Test de l'authentification optimisée...");

    // Test 1: Vérifier que la page de login est accessible
    console.log("\n1. Test de la page de login...");
    const loginResponse = await fetch("http://localhost:3000/login");
    if (loginResponse.ok) {
      console.log("✅ Page de login accessible");
    } else {
      console.log("❌ Page de login inaccessible");
    }

    // Test 2: Vérifier que la page ZK login est accessible
    console.log("\n2. Test de la page ZK login...");
    const zkLoginResponse = await fetch("http://localhost:3000/zk-login");
    if (zkLoginResponse.ok) {
      console.log("✅ Page ZK login accessible");
    } else {
      console.log("❌ Page ZK login inaccessible");
    }

    // Test 3: Vérifier que la page de profil est accessible (sans auth)
    console.log("\n3. Test de la page de profil (sans auth)...");
    const profileResponse = await fetch("http://localhost:3000/dashboard/settings/profile");
    if (profileResponse.status === 401 || profileResponse.status === 302) {
      console.log("✅ Page de profil protégée (redirection vers login)");
    } else {
      console.log("⚠️  Page de profil accessible sans auth");
    }

    console.log("\n📋 Instructions pour tester complètement :");
    console.log("1. Allez sur http://localhost:3000/zk-login");
    console.log("2. Créez une identité ZK et connectez-vous");
    console.log("3. Allez sur http://localhost:3000/dashboard/settings/profile");
    console.log("4. Vérifiez que les deux méthodes d'auth sont visibles");
    console.log("5. Vérifiez que les données utilisateur sont correctement affichées");
    console.log("6. Vérifiez dans les DevTools (Application > Cookies) que le cookie de session est petit");

  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

testOptimizedAuth(); 
1.
✅ Contact -> Suppression manque le dialog de suppression
✅  Profile summary à repenser en logique
✅  Suspension et suppression de compte (à tester)
✅ 2FA email fix
✅ 2FA auth fix
✅ menubar a changer
✅ 2FA SMS (twilio) --> ❌  ENV.LOCAL MODIFIE donc à update en prod

2.
✅ Add overview new status (cancelled)
✅  Page subscription et layout settings dynamique
🛠️  (done en mock up) Settings advanced à changer (en data avec un graphique de l'usage + export de tous les fichiers stockés + connexion neodrive)
🛠️ (done en mock up) settings billing a modifier pour intégrer plan actuel / avantages actuels + bloc factures 
✅ Bug pdf name -> Randomiser le nom pour upload en DB
✅ Session timeout management
 Modifier les signatures AES et QES et SES pour request le 2FA propre pas un envoi automatique
 Template perso avec modif possible live

3.
 Proteger les pages
🛠️ Landing Neosign
 Paraphes à ajouter
 settings contact -> connecter avec un récepteur + faire FAQs / Learn more (Demander à Guillaume de le faire)
 settings signature à modifier en logique aussi pour utiliser ses propres infos + fonts
 Notifications en dynamique
 Settings notifications à adapter
 View & download signed doc avec la signature dessus

4.
 Keycloak auth
 Test E2E : playwright
 thème shadcn + modif front
 langues
 verif resend

5.
 API NeoDrive


**Sécurité & Authentification**

 Rate limiting sur les APIs
 Audit trail complet (logs de toutes les actions)
 Backup automatique des données utilisateur
 Chiffrement des documents au repos

**Performances & Scalabilité**
 Lazy loading des documents
 Pagination pour les listes longues
 Cache Redis pour les sessions
 CDN pour les assets statiques
 Monitoring et alerting

**Fonctionnalités Business**
 Workflow templates prédéfinis
 Intégration calendrier (notifications)
 Export des données (GDPR compliance)
 API publique pour développeurs
 Webhooks pour intégrations

**UI/UX**
 Dark mode toggle
 Raccourcis clavier
 Drag & drop pour les documents
 Preview en temps réel des signatures
 Tour guidé pour nouveaux utilisateurs

**Analytics & Insights:**
 Dashboard analytics pour admins
 Métriques d'usage par utilisateur
 A/B testing framework
 Heatmaps pour UX
 Conversion funnel tracking

**Intégrations:**
 Google Workspace / Microsoft 365
 CRM (Salesforce, HubSpot)
 Storage (AWS S3, Google Cloud)
 Payment gateways (Stripe, PayPal)
 SSO (SAML, OAuth)

**Compliant:**
 GDPR data export/delete
 Cookie consent management
 Terms of service versioning
 Legal document templates
 Compliance reporting

**Infra:**
✅ CI/CD pipeline complet
 Infrastructure as Code (Terraform)
 Monitoring (Prometheus/Grafana)
 Log aggregation (ELK stack)
 Disaster recovery plan
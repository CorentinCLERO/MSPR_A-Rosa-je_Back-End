module.exports = {
  'env': {
    'es2021': true, // Active la syntaxe ECMAScript 2021, permettant les dernières fonctionnalités JavaScript
    'node': true, // Signale que le code s'exécute dans un environnement Node.js
    'jest': true, // Inclut Jest
  },
  'extends': 'eslint:recommended', // Étend les règles recommandées par ESLint, offrant un bon ensemble de pratiques par défaut
  'parserOptions': {
    'ecmaVersion': 'latest', // Utilise la dernière version de la syntaxe ECMAScript disponible
    'sourceType': 'module' // Permet l'utilisation de modules ES6 (import/export)
  },
  'rules': {
    // Définit des règles personnalisées pour améliorer la qualité et la cohérence du code

    'no-unused-vars': 'warn', // Avertit si des variables sont déclarées mais non utilisées, aidant à réduire le code mort
    'eqeqeq': ['error', 'always'], // Exige l'utilisation de === et !== pour prévenir les erreurs de comparaison de type
    'no-console': 'warn', // Suggère de limiter l'utilisation de console.log pour un code prêt pour la production
    'no-redeclare': 'error', // Interdit la redéclaration de variables, ce qui peut prévenir les erreurs de portée
    'no-shadow': 'warn', // Avertit lorsqu'une variable dans une portée locale masque une variable dans une portée englobante
    'indent': ['error', 2], // Enforce une indentation de 2 espaces pour la lisibilité
    'quotes': ['error', 'single'], // Exige l'utilisation de guillemets simples pour la cohérence
    'semi': ['error', 'always'], // Exige l'utilisation de points-virgules à la fin des instructions
    'no-eval': 'error', // Interdit l'utilisation de la fonction eval() pour des raisons de sécurité

    // Règles supplémentaires importantes pour Node.js/Sequelize
    'no-implicit-globals': 'error', // Interdit les déclarations qui créent des variables globales implicites
    'no-var': 'error', // Encourage l'utilisation de let/const au lieu de var pour la déclaration de variables
    'prefer-const': 'error', // Encourage l'utilisation de const pour les variables qui ne sont pas réassignées
    'no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true }], // Interdit les expressions inutilisées, tout en permettant certaines exceptions utiles
    'no-use-before-define': ['error', { 'functions': false, 'classes': true }], // Interdit l'utilisation des variables avant qu'elles ne soient définies, avec des exceptions pour les fonctions
    'callback-return': 'warn', // Encourage le retour après les callbacks pour éviter des exécutions inattendues dans des fonctions asynchrones
    'handle-callback-err': 'warn', // Encourage la gestion des erreurs dans les callbacks pour des opérations asynchrones
  }
};

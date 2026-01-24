import { Translation } from '@jsverse/transloco';

export const frTranslations: Translation = {
  nav: {
    home: 'Accueil',
  },
  home: {
    title: 'Bienvenue sur Patrimoine360',
    subtitle: 'Visualisez et gérez votre patrimoine en toute simplicité',
    total_patrimoine: 'Patrimoine total',
    breakdown_title: 'Répartition par catégorie',
    assets_title: 'Détail des actifs',
    features: {
      visualization: {
        title: 'Visualisation',
        description: "Visualisez l'ensemble de votre patrimoine avec des graphiques clairs et intuitifs.",
      },
      analysis: {
        title: 'Analyse',
        description: 'Analysez la répartition de vos actifs et identifiez les opportunités.',
      },
      tracking: {
        title: 'Suivi',
        description: "Suivez l'évolution de votre patrimoine dans le temps.",
      },
    },
  },
  assets: {
    types: {
      real_estate: 'Immobilier',
      stocks: 'Actions',
      bonds: 'Obligations',
      cash: 'Liquidités',
      crypto: 'Crypto-monnaies',
      life_insurance: 'Assurance-vie',
      retirement: 'Épargne retraite',
      other: 'Autres',
    },
  },
  common: {
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
  },
};

# 🗓️ Timeline Design - Actions de votre gestionnaire

## Vue d'ensemble

La vue "Actions de votre gestionnaire" a été transformée en une **timeline immersive** qui permet de parcourir l'année écoulée comme un voyage graphique dans le temps.

## 🎨 Concept de Design

### Inspiration

- **Voyage temporel** : Parcours visuel de l'historique des actions
- **Timeline verticale** : Ligne centrale avec markers chronologiques
- **Disposition alternée** : Cartes positionnées gauche/droite pour dynamisme
- **Design Private Banking** : Élégance, clarté et professionnalisme

## 🏗️ Architecture Visuelle

### 1. Header Immersif

```
┌─────────────────────────────────────────────────────┐
│  🧭  Actions de votre gestionnaire                   │
│     Découvrez les actions réalisées par Sophie      │
│                                                      │
│  ● Réalisées  ● En cours  ● Planifiées              │
└─────────────────────────────────────────────────────┘
```

- **Gradient bleu marine** (#1a237e → #3949ab → #5c6bc0)
- **Icône animée** (rotation continue)
- **Légende des statuts** avec dots colorés
- **Effets de radial-gradient** pour profondeur

### 2. Timeline Centrale

```
                    ┌────┐
                    │ 15 │ DEC
                    │2025│
                    └────┘
                      ●━━━━━━━━━━━━━━[ Carte Action ]
                      │
                    ┌────┐
                    │ 20 │ NOV
                    │2025│
                    └────┘
[ Carte Action ]━━━━━━━━━━━━━━●
                      │
                    ┌────┐
                    │ 10 │ OCT
                    │2025│
                    └────┘
                      ●━━━━━━━━━━━━━━[ Carte Action ]
                      │
                      🏁
```

**Composants :**

- **Ligne verticale centrale** : Gradient bleu avec glow effect
- **Markers circulaires** : 60px avec icône d'action
- **Date markers** : Jour/Mois/Année dans un badge blanc
- **Connecteurs** : Lignes horizontales vers les cartes
- **End marker** : Drapeau final avec message

### 3. Cartes d'Actions

#### Structure

```
┌─────────────────────────────────────┐ [Ribbon: Réalisée]
│  [Icône]  Titre de l'action         │
│           📋 Catégorie • Type       │
│                                     │
│  Description détaillée de l'action  │
│  et de son contexte...              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💡 Impact                   │   │
│  │ Détails de l'impact         │   │
│  │ ➕ +9 000 €                 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Caractéristiques :**

- **Ribbon de statut** : Coin supérieur droit avec icône
- **Icône de catégorie** : Badge coloré 56px
- **Chips de métadonnées** : Catégorie et type
- **Section Impact** : Zone dédiée avec gradient et icône
- **Border colorée** : Selon le statut (vert/orange/gris)
- **Background gradient** : Subtil selon le statut

## 🎭 États et Statuts

### Completed (Réalisé) ✅

- **Couleur** : Vert (#4caf50)
- **Marker** : Gradient vert avec glow
- **Carte** : Border verte, background blanc→vert clair
- **Ribbon** : Fond vert avec checkmark

### In Progress (En cours) 🔄

- **Couleur** : Orange (#ff9800)
- **Marker** : Gradient orange avec animation pulse
- **Carte** : Border orange, background blanc→orange clair
- **Ribbon** : Fond orange avec hourglass

### Planned (Planifié) 📅

- **Couleur** : Gris (#9e9e9e)
- **Marker** : Gradient gris
- **Carte** : Border grise, background blanc→gris clair
- **Ribbon** : Fond gris avec event icon

## ✨ Animations

### 1. Entrée Progressive

```scss
@keyframes fadeInUp {
  from: opacity 0, translateY(30px)
  to: opacity 1, translateY(0)
}
```

- Délai échelonné : 0.1s par item
- Durée : 0.6s
- Easing : ease

### 2. Cartes Alternées

```scss
// Gauche
@keyframes slideInLeft {
  from: opacity 0, translateX(-50px)
  to: opacity 1, translateX(0)
}

// Droite
@keyframes slideInRight {
  from: opacity 0, translateX(50px)
  to: opacity 1, translateX(0)
}
```

### 3. Marker "En cours"

```scss
@keyframes pulse {
  0%, 100%: scale(1)
  50%: scale(1.05) + glow effect
}
```

- Durée : 2s
- Répétition : infinie
- Attire l'attention sur les actions en cours

### 4. Icône Header

```scss
@keyframes rotate {
  from: rotate(0deg)
  to: rotate(360deg)
}
```

- Durée : 20s
- Rotation continue lente

## 🎯 Interactions

### Hover Carte

```scss
&:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}
```

- Élévation + légère mise à l'échelle
- Ombre portée accentuée
- Transition douce 0.3s

### Responsive (Desktop only)

- Max-width : 1200px
- Grid : 1fr auto 1fr (carte | marker | carte)
- Gap : 2rem entre colonnes
- Padding : 4rem vertical, 2rem horizontal

## 📊 Hiérarchie Visuelle

### Niveaux d'importance

1. **Markers centraux** - Point focal de la timeline
2. **Titres des cartes** - 1.125rem, font-weight 600
3. **Sections Impact** - Mise en valeur avec gradient
4. **Descriptions** - 0.9375rem, line-height 1.6
5. **Métadonnées** - Chips 0.75rem

### Couleurs Hiérarchiques

```
Primaire : #1a237e (Navy)
Secondaire : #3949ab (Indigo)
Accent : #5c6bc0 (Light Indigo)

Status :
- Success : #4caf50 (Green)
- Warning : #ff9800 (Orange)
- Neutral : #9e9e9e (Grey)

Impact :
- Positive : #e8f5e9 → #c8e6c9 (Green gradient)
- Neutral : #e3f2fd → #bbdefb (Blue gradient)
```

## 🔍 Détails Techniques

### Spacing

- Margin items : 4rem
- Padding cartes : 1.5rem
- Gap header : 2rem
- Timeline width : 4px

### Shadows

```scss
// Marker
box-shadow:
  0 0 0 4px white,          // Anneau blanc
  0 0 0 6px currentColor,   // Anneau coloré
  0 4px 12px rgba(0,0,0,.2) // Ombre portée

// Carte hover
box-shadow: 0 12px 32px rgba(0,0,0,.15)

// Ribbon
box-shadow: -2px 2px 6px rgba(0,0,0,.15)
```

### Borders

- Cartes : 2px selon statut
- Radius : 16px (cartes), 12px (sections)
- Impact : border-left 4px selon statut

## 🎨 Palette Complète

### Gradients Background

```scss
Timeline BG: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)
Header BG: linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)
Track: linear-gradient(to bottom, #e0e0e0, #3949ab, #5c6bc0, #3949ab, #e0e0e0)
```

### Cards par Statut

```scss
Completed: linear-gradient(to bottom right, #ffffff, #f1f8f4)
In Progress: linear-gradient(to bottom right, #ffffff, #fff8f0)
Planned: linear-gradient(to bottom right, #ffffff, #f5f5f5)
```

## 📱 Accessibilité

- **Contraste** : WCAG AA compliant
- **Focus** : Visible sur tous les éléments interactifs
- **Screen readers** : Semantic HTML avec ARIA labels
- **Keyboard nav** : Tab order logique

## 💡 Améliorations Futures

### Phase 1

- [ ] Filtrage par statut/type
- [ ] Recherche dans les actions
- [ ] Tri chronologique inversé

### Phase 2

- [ ] Animation de scroll progressif
- [ ] Zoom sur carte au clic
- [ ] Vue détaillée en modal

### Phase 3

- [ ] Export PDF de la timeline
- [ ] Partage par email
- [ ] Notes du gestionnaire

---

**Design créé le** : 24 janvier 2026
**Version** : 1.0
**Designer** : Private Banking 2026 Design System

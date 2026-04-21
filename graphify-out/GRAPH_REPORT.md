# Graph Report - .  (2026-04-21)

## Corpus Check
- Corpus is ~3,401 words - fits in a single context window. You may not need a graph.

## Summary
- 44 nodes · 38 edges · 16 communities detected
- Extraction: 61% EXTRACTED · 39% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_ReactVite Template Docs|React/Vite Template Docs]]
- [[_COMMUNITY_Social & Community Icons|Social & Community Icons]]
- [[_COMMUNITY_Vite Plugin Alternatives|Vite Plugin Alternatives]]
- [[_COMMUNITY_Visual Brand & Hero Assets|Visual Brand & Hero Assets]]
- [[_COMMUNITY_TypeScript Lint Stack|TypeScript Lint Stack]]
- [[_COMMUNITY_App Root Component|App Root Component]]
- [[_COMMUNITY_Home Page|Home Page]]
- [[_COMMUNITY_Landing Page|Landing Page]]
- [[_COMMUNITY_Login Page|Login Page]]
- [[_COMMUNITY_Signup Page|Signup Page]]
- [[_COMMUNITY_Backend Server|Backend Server]]
- [[_COMMUNITY_User Model|User Model]]
- [[_COMMUNITY_Auth Middleware|Auth Middleware]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Vite Config|Vite Config]]
- [[_COMMUNITY_Frontend Entry|Frontend Entry]]

## God Nodes (most connected - your core abstractions)
1. `SVG Icon Sprite Sheet` - 7 edges
2. `React + Vite Frontend Template` - 6 edges
3. `Vite Build Tool` - 4 edges
4. `Rationale: TypeScript + type-aware lint for production apps` - 4 edges
5. `@vitejs/plugin-react (Oxc-based)` - 3 edges
6. `@vitejs/plugin-react-swc (SWC-based)` - 3 edges
7. `SheetVision Favicon (purple geometric logo)` - 3 edges
8. `Bluesky Social Icon` - 3 edges
9. `Discord Icon` - 3 edges
10. `Vite Logo (lightning bolt with parentheses)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Hero Image: Two Stacked 3D Rounded Squares` --conceptually_related_to--> `React + Vite Frontend Template`  [INFERRED]
  frontend/src/assets/hero.png → frontend/README.md
- `Vite Logo (lightning bolt with parentheses)` --references--> `Vite Build Tool`  [INFERRED]
  frontend/src/assets/vite.svg → frontend/README.md
- `React Logo (atom-style)` --references--> `React Framework`  [INFERRED]
  frontend/src/assets/react.svg → frontend/README.md
- `SheetVision Favicon (purple geometric logo)` --semantically_similar_to--> `Vite Logo (lightning bolt with parentheses)`  [INFERRED] [semantically similar]
  frontend/public/favicon.svg → frontend/src/assets/vite.svg
- `SVG Icon Sprite Sheet` --shares_data_with--> `Purple Brand Color System (#863bff, #aa3bff, #7e14ff)`  [INFERRED]
  frontend/public/icons.svg → frontend/public/favicon.svg

## Hyperedges (group relationships)
- **Vite + React Frontend Scaffold** — readme_frontend_template, readme_vite, readme_react, readme_hmr, readme_eslint [EXTRACTED 1.00]
- **Official Vite React Plugin Alternatives** — readme_plugin_react_oxc, readme_plugin_react_swc, readme_oxc, readme_swc [EXTRACTED 1.00]
- **Community / Social Link Icon Set** — icon_bluesky, icon_discord, icon_github, icon_x, icon_social [EXTRACTED 1.00]

## Communities

### Community 0 - "React/Vite Template Docs"
Cohesion: 0.29
Nodes (7): React Logo (atom-style), ESLint, React + Vite Frontend Template, Hot Module Replacement (HMR), React Framework, React Compiler, Rationale: React Compiler disabled for dev/build perf

### Community 1 - "Social & Community Icons"
Cohesion: 0.43
Nodes (7): Bluesky Social Icon, Discord Icon, Documentation Icon, GitHub Icon, Social/Community Icon, X (Twitter) Icon, SVG Icon Sprite Sheet

### Community 2 - "Vite Plugin Alternatives"
Cohesion: 0.5
Nodes (5): Oxc JavaScript Toolchain, @vitejs/plugin-react (Oxc-based), @vitejs/plugin-react-swc (SWC-based), SWC JavaScript Compiler, Vite Build Tool

### Community 3 - "Visual Brand & Hero Assets"
Cohesion: 0.5
Nodes (5): Lightning Bolt Motif (speed/performance), Purple Brand Color System (#863bff, #aa3bff, #7e14ff), SheetVision Favicon (purple geometric logo), Hero Image: Two Stacked 3D Rounded Squares, Vite Logo (lightning bolt with parentheses)

### Community 4 - "TypeScript Lint Stack"
Cohesion: 0.5
Nodes (4): Rationale: TypeScript + type-aware lint for production apps, Vite React-TS Template, TypeScript, typescript-eslint

### Community 5 - "App Root Component"
Cohesion: 1.0
Nodes (0): 

### Community 6 - "Home Page"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Landing Page"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Login Page"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Signup Page"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Backend Server"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "User Model"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Auth Middleware"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "ESLint Config"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Vite Config"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Frontend Entry"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **10 isolated node(s):** `Hot Module Replacement (HMR)`, `Oxc JavaScript Toolchain`, `SWC JavaScript Compiler`, `Rationale: React Compiler disabled for dev/build perf`, `TypeScript` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `App Root Component`** (2 nodes): `App()`, `App.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home Page`** (2 nodes): `Home.jsx`, `Home()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Landing Page`** (2 nodes): `Landing.jsx`, `Landing()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login Page`** (2 nodes): `Login.jsx`, `Login()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Signup Page`** (2 nodes): `Signup.jsx`, `Signup()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Backend Server`** (1 nodes): `server.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Model`** (1 nodes): `User.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Middleware`** (1 nodes): `auth.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ESLint Config`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend Entry`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React + Vite Frontend Template` connect `React/Vite Template Docs` to `Vite Plugin Alternatives`, `Visual Brand & Hero Assets`?**
  _High betweenness centrality (0.253) - this node is a cross-community bridge._
- **Why does `Purple Brand Color System (#863bff, #aa3bff, #7e14ff)` connect `Visual Brand & Hero Assets` to `Social & Community Icons`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `SVG Icon Sprite Sheet` connect `Social & Community Icons` to `Visual Brand & Hero Assets`?**
  _High betweenness centrality (0.152) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `Vite Build Tool` (e.g. with `@vitejs/plugin-react (Oxc-based)` and `@vitejs/plugin-react-swc (SWC-based)`) actually correct?**
  _`Vite Build Tool` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `@vitejs/plugin-react (Oxc-based)` (e.g. with `Vite Build Tool` and `@vitejs/plugin-react-swc (SWC-based)`) actually correct?**
  _`@vitejs/plugin-react (Oxc-based)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Hot Module Replacement (HMR)`, `Oxc JavaScript Toolchain`, `SWC JavaScript Compiler` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
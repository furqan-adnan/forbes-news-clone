 # Forbes-Inspired React News Portal


This is one of my first web applicaiton projects.

A premium, Forbes-inspired news web application built with React, featuring a live news feed API integration, smooth Framer Motion animations, and an interactive HTML5 Canvas background.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![HTML5 Canvas](https://img.shields.io/badge/HTML5_Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

 

##  Preview

![App Preview](assets/F2.png)

---

##  Features

* **Dynamic News Feed:** Integrates with a live news API to fetch real-time business, technology, and leadership articles structured into a clean, 3-column editorial grid.
* **Interactive Canvas Background:** Built a custom `GridCursorBackground` using the native HTML5 2D Context Canvas API to track mouse positions dynamically with seamless resizing support.
* **Glassmorphism Navigation Drawer:** A production-grade sliding sidebar navigation menu utilizing `framer-motion`'s `AnimatePresence` and backdrop-blur filters for a fluid user experience.
* **Premium Dark Theme:** Designed with a high-end, editorial low-light aesthetic featuring sharp typography, clear layouts, and iconic crimson accents mimicking the Forbes design language.
* **Responsive Layout:** Adaptive styling optimized across different device breakpoints, managing clean layout scaling for both desktop and mobile views.

---

##  Tech Stack

* **Core Frontend:** React.js (Functional components & Hooks: `useState`, `useEffect`, `useRef`)
* **Animations:** Framer Motion (Hardware-accelerated interface transitions)
* **Graphics Loop:** HTML5 Canvas API (Custom animation frames for background effects)
* **Iconography:** React Icons (`react-icons/ios5` and `react-icons/gi`)
* **Styles:** Scalable, component-scoped CSS architecture

---

##  Key Project Structure

```text
forbes-news-clone/
├── assets/                  # Core design assets and images
├── public/                  # Deployment templates and manifest configurations
└── src/
    ├── App.css              # Global layout rules and editorial color tokens
    ├── App.js               # Primary application engine and state routing
    ├── GridCursorBackground.css # Layering and structural rules for the background
    ├── GridCursorBackground.js  # HTML5 Canvas mouse-tracking logic
    ├── index.css            # Standard typography and global CSS resets
    └── index.js             # React application mounting target





Getting Started

Ensure you have Node.js and npm installed.

1- Clone the repository:

git clone [https://github.com/furqan-adnan/forbes-news-clone.git](https://github.com/furqan-adnan/forbes-news-clone.git)
   cd forbes-news-clone

2- Install project dependencies:
npm install

3- Launch the development server:
npm start
# 🚀 COSMIC DRIFT

**20.471. Desenvolupament d'aplicacions interactives**  
Universitat Oberta de Catalunya — Curs 2025-26/2  
**PR1. <<Intro Capacitor>>**  
Jose López Sender

---

## Descripció

COSMIC DRIFT és una app mòbil creada amb Capacitor i p5.js.  
L'usuari controla un cohet espacial inclinant el dispositiu gràcies a l'acceleròmetre.  
El cohet ha d'esquivar asteroides que apareixen des dels quatre costats de la pantalla.  
En col·lisió s'activa la vibració del dispositiu i es guarda el record al LocalStorage.

---

## Tecnologies utilitzades

- [Capacitor](https://capacitorjs.com/) — empaquetament de l'app per Android
- [p5.js](https://p5js.org/) — canvas generatiu i animacions
- HTML5 / CSS3 / JavaScript
- Web API DeviceMotion — acceleròmetre
- LocalStorage — persistència de les dades

---


## Instal·lació i execució

### Prerequisits
- Node.js v18 o superior
- Java JDK 17 o superior
- Android Studio

### Passos

```bash
# Instal·lar dependències
npm install

# Sincronitzar amb Android
npx cap sync android

# Obrir Android Studio
npx cap open android
```

Un cop a Android Studio:

1. Espera que Gradle acabi de carregar
2. Selecciona un dispositiu (emulador o real)
3. Clica ▶ Play

---

## Com jugar

1. Obre l'app
2. Toca la pantalla per començar
3. Inclina el dispositiu per moure el coet 🚀
4. Esquiva els asteroides 🪨☄️🌑
5. Aguanta el màxim temps possible!

---

## Configuració

Clica el botó ⚙️ per obrir el panell de configuració:

- **Velocitat de la nau** — ajusta la sensibilitat de l'acceleròmetre (1-5)
- **Densitat d'asteroides** — ajusta la quantitat d'asteroides (1-10)

La configuració es guarda automàticament al LocalStorage.

---

## Proves

Provat amb:

- **Emulador**: Pixel 8 — Android 17 (API 37)
- **Android Studio**: Panda 4

---

## Llicència

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)


# 🚀 COSMIC DRIFT 

**20.471. Desenvolupament d'aplicacions interactives**  
Universitat Oberta de Catalunya — Curs 2025-26/2  
**PR2. <<Capacitor App>>**  
Jose López Sender

---

## Descripció

App mòbil creada amb Capacitor i p5.js. Joc espacial on l'usuari controla
un coet inclinant el dispositiu per esquivar asteroides reals obtinguts
de la NASA NeoWs API.

---

## Tecnologies utilitzades

- [Capacitor](https://capacitorjs.com/) — empaquetament de l'app per Android
- [p5.js](https://p5js.org/) — canvas generatiu i animacions
- [@capacitor/motion](https://capacitorjs.com/docs/apis/motion) — acceleròmetre natiu
- [@capacitor/haptics](https://capacitorjs.com/docs/apis/haptics) — vibració nativa
- [NASA NeoWs API](https://api.nasa.gov/) — dades reals d'asteroides
- HTML5 / CSS3 / JavaScript
- LocalStorage — persistència de les dades
- Google Fonts Orbitron — tipografia espacial

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

## API Key

Aquest projecte utilitza la NASA NeoWs API amb `DEMO_KEY` al repositori.
Per substituir-la per una clau personal (1000 crides/hora), edita `www/js/app.js`
a la funció `carregarAsteroidesNASA()`.

La clau personal es pot obtenir gratuïtament a: https://api.nasa.gov/

---

## Crèdits de la música

- **Música de fons**: "Pixel High Score" — generada amb [Suno AI](https://suno.com)

---

## Com jugar

1. Obre l'app
2. Toca la pantalla per començar
3. Inclina el dispositiu per moure el coet 🚀
4. Esquiva els asteroides 🪨☄️
5. Aguanta el màxim temps possible!
6. En col·lisionar, descobreix el nom real de l'asteroide!

---

## Configuració

Clica el botó ⚙️ per obrir el panell de configuració (el joc es posa en pausa):

- **Velocitat de la nau** — ajusta la sensibilitat de l'acceleròmetre (1-5)
- **Densitat d'asteroides** — ajusta la quantitat d'asteroides (1-10)

La configuració es guarda automàticament al LocalStorage.

---

## Proves

Provat amb:

- **Emulador**: Pixel 8 — Android 17 (API 37)
- **Dispositiu real**: Xiaomi Android
- **Android Studio**: Panda 4

---

## Llicència

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
La música de fons "Pixel High Score" ha estat generada amb Suno AI.


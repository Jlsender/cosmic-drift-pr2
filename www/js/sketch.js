// *** 20.471. Desenvolupament d'aplicacions interactives - Universitat Oberta de Catalunya - Curs 2025-26/2 ***
// ***                                      PR1. <<Intro Capacitor>>                                         ***
// ***                                         José López Sender                                             ***
// ***                                             sketch.js                                                 ***

// *************************************************************************************************************
//                                       DESCRIPCIÓ DEL PROGRAMA
// *************************************************************************************************************

// COSMIC DRIFT és una app móbil creada amb Capacitor i p5.js
// L'usuari controla una cohet inclinant el dispositiu fent servir l'acceleròmetre.
// El cohet ha d'esquivar asteroides que apareixen des dels costats de la pantalla.
// Quan col·lisionem amb un asteroide s'activa la vibració del dispositiu i es guarda l'esdeveniment al LocalStorage.


// *** COSMIC DRIFT - SKETCH P5.JS ***

new p5(function(p) {


// *************************************************************************************************************
//                                       VARIABLES PRINCIPALS
// *************************************************************************************************************

  let estrelles = [];                 // Array per emmagatzemar les estrelles del fons
  let asteroides = [];                // Array per emmagatzemar els asteroides actius al canvas
  let nau;                            // Objecte que representa el cohet
  let enJoc = false;                  // Variable per controlar si la partida es troba en actiu
  let tempsSuperviencia = 0;          // Temps en segons que l'usuari esta jugant
  let ultimTemps = 0;                 // Comptador del temps en mil·lisegons de de l'inici de la partida



// *************************************************************************************************************
//                    SETUP — CONFIGURACIÓ INICIAL DEL PROGRAMA (s'executa una sola vegada)
// *************************************************************************************************************


  p.setup = function() {
    let canvas = p.createCanvas(p.windowWidth, p.windowHeight);         // Creem el canvas a pantalla complerta
    canvas.parent('contenidor-canvas');                                 // Insertem el canvas dins del contenidor HTML
    inicialitzarEstrelles();                                            // Generem les estrelles del fons amb posicions aleatòries
    nau = new Nau(p.width / 2, p.height / 2);                           // Insertem el cohet al centre de la pantalla
  };



// *************************************************************************************************************
//                                  DRAW - BUCLE PRINCIPAL DEL PROGRAMA
// *************************************************************************************************************

 
  p.draw = function() {
    p.background(0, 0, 16, 25);           // Fons semitransparent

    dibuixarEstrelles();                  // Dibuixem les estrelles del fons a cada farem

    if (enJoc) {

      // ACTUALITZEM EL TEMPS DE SUPERVIVÈNCIA

      tempsSuperviencia = Math.floor((p.millis() - ultimTemps) / 1000);     // Calculem els segons que han passat des de l'inici de la partida

      // GESTIÓ DELS ASTEROIDES

      gestionarAsteroides();          // Genera, mou i comprova les col·lisions dels asteriodes 

      // DIBUIXEM EL COHET

      nau.dibuixar();                 // Dibuixem la nau a la posició actual

      // MOSTREM EL TEMPS EN PANTALLA

      p.fill(255);                                      
      p.noStroke();
      p.textSize(18);
      p.textAlign(p.LEFT);
      p.text('⏱ ' + tempsSuperviencia + 's', 20, 40);       // Mostrem le temps de supervivencia
    } else {
      
      // PANTALLA D'INICI

      p.fill(0, 255, 255);
      p.noStroke();
      p.textSize(32);
      p.textAlign(p.CENTER);
      p.text('COSMIC DRIFT', p.width / 2, p.height / 2 - 40);                                // Insertem el títol del joc
      p.fill(255);
      p.textSize(18);
      p.text('Inclina el dispositiu per moure la nau', p.width / 2, p.height / 2 + 10);      // Instruccions de control
      p.text('Toca la pantalla per començar', p.width / 2, p.height / 2 + 40);               // Instruccions d'inci del joc
    }
  };



/*******************           INTERACCIÓ TÀCTIL          **************************/

  p.touchStarted = function(event) {

    /* Comprovem si la interacció ve del botó o del panell de configuració */

    if (event && event.target) {
      const id = event.target.id || '';                                         // Obtenim el id del element que hem tocat
      const pare = event.target.closest('#panell-config, #boto-config');        // Comprovem si l'element tocat es del panell o el botó
      if (id === 'boto-config' || pare) return true;                            // Si es el botó o el panell deixem passar l'event
    }
    if (!enJoc) {
      enJoc = true;                       // Activem el mode joc
      ultimTemps = p.millis();            // Guardem el temps des de l'inici de la partida
      asteroides = [];                    // Buidem l'array dels asteroides
    }
    return false;
  };



  /*******************           FONS ESTEL·LAR          **************************/

  function inicialitzarEstrelles() {
    for (let i = 0; i < 200; i++) {             // Generem 200 estrelles aleatòries
      estrelles.push({                
        x: p.random(p.width),                   // Posició X aleatòria
        y: p.random(p.height),                  // Posició Y aleatòria
        mida: p.random(0.5, 2.5),               // Mida aleatòria 
        brillantor: p.random(100, 255)          // Brillantor aleatòria
      });
    }
  }



  /*******************         DIBUIXEM LES ESTRELLES        **************************/

  function dibuixarEstrelles() {
    for (let e of estrelles) {                // Recorrem totes les estrelles de l'array
      p.fill(e.brillantor);                   // Apliquem la brillantor a cada estrella         
      p.noStroke();                           // Sense contonr
      p.ellipse(e.x, e.y, e.mida);            // Dibuixem l'estrella com un cercle
    }
  }



  /*******************         GESTIÓ DELS ASTEROIDES        **************************/

  function gestionarAsteroides() {
    let densitat = window.configApp ? window.configApp.densitat : 5;      // Comprovem la densitat de la configuració o fem servir 5 per defecte

    if (p.frameCount % Math.max(1, 60 - densitat * 5) === 0) {            // Generem un nou asteroide segons la densitat configurada
      asteroides.push(new Asteroide());                                   // Afegim un nou asteroide a l'array
    }

    for (let i = asteroides.length - 1; i >= 0; i--) {                    // Recorrem els asteroides des del final fins a l'inici per poder eliminar-los
      asteroides[i].actualitzar();                                        // Actualitzem la posició de cada asteriodei
      asteroides[i].dibuixar();                                           // Dibuixem l'asteriode al canvas


     // COMPROVEM LA COL·LISIÓ AMB LA NAU

      if (nau.col·lideixAb(asteroides[i])) {         // Si la nau toca un asteriode
        colisio();                                   // Activem la col·lisió
        return;                                      // Sortim del bucle
      }

      if (asteroides[i].foraCanvas()) {              // Si l'asteroide ha sortit dels límits de la pantalla
        asteroides.splice(i, 1);                     // Eliminem l'asteroide de l'array
      }
    }
  }



  /*******************         GESTIÓ DE LES COL·LISIONS       **************************/

  function colisio() {
    enJoc = false;                                   // Aturem el joc
    window.colisioDetectada(tempsSuperviencia);      // Notifiquem la col·lisió a app.js amb el temps transcorregut
    asteroides = [];                                 // Buidem l'array dels asteroides per reiniciar el joc
  }



  /*******************        FUNCIONS ACCESSIBLES DES DE APP.JS       **************************/
  
  /* Aquesta funció reb les dades de l'acceleròmetre des de app.js i mou el cohet */

  window.actualitzarNau = function(x, y) {
    if (nau && enJoc) {                       // Només movem el cohet si existeix i el joc està en curs
      nau.mouAb(x, y);                        // Cridem el mètode pel moviment del cochet amb les dades de l'acceleròmetre
    }
  };



  /*******************        CLASSE NAU       **************************/
  
  class Nau {
    constructor(x, y) {
      this.x = x;                 // Posició X inicial del cohet
      this.y = y;                 // Posició Y inicial del cohet
      this.velocitat = 3;         // Velocitat incial del cohet
    }


    // MOVEM EL COHET SEGONS LES DADES DE L'ACCELERÒMETRE

    mouAb(dx, dy) {
      let vel = window.configApp ? window.configApp.velocitat : 3;      // Llegim la velocitat de la configuració o fem servir 3 
      this.x = p.constrain(this.x + dx * vel, 20, p.width - 20);        // Movem el cohet en X i el limitem als marges de la pantalla
      this.y = p.constrain(this.y + dy * vel, 20, p.height - 20);       // Movem el cohet en Y i el limitem als marges de la pantalla
    }



    // DIBUIXEM EL COHET

    dibuixar() {
      p.push();
      p.translate(this.x, this.y);          // Posicionem el sistema de coordenades al centre del cohet
      p.rotate(-p.PI / 4);                  // Rotem el cohet per fer que apunti cap a dalt
      p.textSize(48);                       // Mida del cohet
      p.textAlign(p.CENTER, p.CENTER);      // Centrem el cohet
      p.text('🚀', 0, 0);                   // Mostrem l'emoji del cohet
      p.pop();                            
}


    // DETECTEM LA COL·LISCIÓ AMB L'ASTEROIDE

    col·lideixAb(asteroide) {
      let d = p.dist(this.x, this.y, asteroide.x, asteroide.y);       // Calculem la distància entre la nau i el cohet
      return d < asteroide.radi + 12;                                 // Si la distància entre el radi de l'asteroide i el marge de la nau vol dir que em col·lisionat
    }
  }



  /*******************        CLASSE ASTEROIDE       **************************/

  class Asteroide {

    constructor() {

      /* Apareixen aleatòriament pels costats de la pantalla */

      let costat = Math.floor(p.random(4));                                               // Triem un dels costats aleatòris de la pantalla
      if (costat === 0) { this.x = p.random(p.width); this.y = -30; }                     // Costat superior
      else if (costat === 1) { this.x = p.width + 30; this.y = p.random(p.height); }      // Costat dret
      else if (costat === 2) { this.x = p.random(p.width); this.y = p.height + 30; }      // Costat inferior
      else { this.x = -30; this.y = p.random(p.height); }                                 // Costat esquerra

      this.radi = p.random(15, 40);                           // Radi aleatòri entre 15 i 40 píxels
      this.velX = p.random(-2, 2);                            // Velocitat horitzontal aleatòria
      this.velY = p.random(-2, 2);                            // Velocitat vertical aleatòria

      /* Garantim una velocitat mínima per evitar asteroides estàtics */

      if (Math.abs(this.velX) < 0.5) this.velX = 0.5;         
      if (Math.abs(this.velY) < 0.5) this.velY = 0.5;

      /* Assignem un emoji aleatòri a cada asteriode */

      const emojis = ['🪨', '☄️', '🌑'];
      this.emoji = emojis[Math.floor(p.random(emojis.length))];   // Triem un emoji aleatori de la llista
    }

    /* Actualitzem la posició de l'asteriode */

    actualitzar() {
      this.x += this.velX;            // Desplaçem l'asteroide en horitzontal
      this.y += this.velY;            // Desplaçem l'asteroide en vertical
    }


    /* Dibuixem l'asteroide */

    dibuixar() {
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(this.radi * 2);                    // La mida de l'emoji depèn del radi de l'asteroide
      p.text(this.emoji, this.x, this.y);           // Dibuixem l'emoji assignat a aquest asteroide
    }

    /* Comprovem si l'asteroide ha sortit del canvas */

    foraCanvas() {
      return this.x < -100 || this.x > p.width + 100 ||
             this.y < -100 || this.y > p.height + 100;          // Apliquem un marge de 100px per evitar desaparicions brusques
    }
  }



  /*******************        REDIMENSIONEM EL CANVAS       **************************/

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);             // Adaptem el canvas a la nova mida de la finestra
  };

});
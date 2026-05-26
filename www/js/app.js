// *** 20.471. Desenvolupament d'aplicacions interactives - Universitat Oberta de Catalunya - Curs 2025-26/2 ***
// ***                                      PR1. <<Intro Capacitor>>                                         ***
// ***                                         José López Sender                                             ***
// ***                                              app.js                                                   ***

// *************************************************************************************************************
//                                       DESCRIPCIÓ DEL PROGRAMA
// *************************************************************************************************************

// app.js gestiona la lògica principal de l'aplicació fora del canvas p5.js:

//  - Configuració de l'usuari (velocitat i densitat) i guardat al LocalStorage
//  - Mostra i oculta el panell de configuració
//  - Gestiona les col·lisions rebudes des de sketch.js activant la vibració del dispositiu
//  - Llegiex les dades de l'acceleròmetre i les envia a sketch.js per poder moure el cohet
//  - Guarda i recupera el record de supervivencia del LocalStorage



// *************************************************************************************************************
//                                       CONFIGURACIÓ PER DEFECTE
// *************************************************************************************************************

// Objecte global accessible des de sketch.js amb els valors de configuració de l'usuari

window.configApp = {
  velocitat: 3,               // Velocitat inicial del cohet
  densitat: 5,                // Densitat inicial dels asteroides
};




// *************************************************************************************************************
//                                        CÀRREGA DE LA CONFIGURACIÓ
// *************************************************************************************************************

function carregarConfig() {
  const configGuardada = localStorage.getItem('cosmicdrift-config');                  // Llegim la configuració guardada al LocalStorage
  if (configGuardada) {

    window.configApp = JSON.parse(configGuardada);                                    // Parsegem el JSON i l'assignem al objecte global
    document.getElementById('velocitat').value = window.configApp.velocitat;          // Sincronitzem el slider de la velocitat
    document.getElementById('densitat').value = window.configApp.densitat;            // Sincronitzem el slider de la densitat 
  }
  
  const record = localStorage.getItem('cosmicdrift-record') || 0;                     // Llegim el record guardat o 0 si no existeix
  document.getElementById('record-text').textContent = 'Rècord: ' + record + 's';     // Mostrem el record al panell
}



// *************************************************************************************************************
//                                        GUARDEM LA CONFIGURACIÓ
// *************************************************************************************************************

function guardarConfig() {
  window.configApp.velocitat = parseInt(document.getElementById('velocitat').value);      // Llegim el valor del slider de la velocitat
  window.configApp.densitat = parseInt(document.getElementById('densitat').value);        // Llegim el valor del slider de la densitat
  localStorage.setItem('cosmicdrift-config', JSON.stringify(window.configApp));           // Guardem la configuració al LocalStorage
  toggleConfig();                                                                         // Tanquem el panell de configuració
}



// *************************************************************************************************************
//                                 MOSTREM O AMAGUEM EL PANELL DE CONFIGURACIÓ
// *************************************************************************************************************

function toggleConfig() {
  const panell = document.getElementById('panell-config');        // Obtenim la referència al panell de configuració
  panell.classList.toggle('ocult');                               // Alternem la classe "ocult" per poder mostrar o amagar el panell
}



// *************************************************************************************************************
//                                               COL·LISIÓ DETECTADA
// *************************************************************************************************************

/* Funció que la cridem des de sketch.js quan el cohet col·lisiona amb un asteroide */

window.colisioDetectada = function(temps) {
  

  /* VIBRACIÓ DEL DISPOSITIU */
  
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);       // Patro de vibració: 200 ms vibra, 100 ms para i 200 ms vibra
  }

  /* ACTUALITZEM EL RECORD */

  const recordAntic = parseInt(localStorage.getItem('cosmicdrift-record') || 0);          // Llegim el record anterior del LocalStorage
  if (temps > recordAntic) {                                                              // Si el temps actual supera el record anterior
    localStorage.setItem('cosmicdrift-record', temps);                                    // Guardem el nou record al LocalStorage
    document.getElementById('record-text').textContent = 'Rècord: ' + temps + 's';        // Actualitzem el record al panell
  }

  alert('💥 Has xocat! Temps: ' + temps + 's\nToca per tornar a jugar.');                 // Mostrem el missatge de final de la partida
};



// *************************************************************************************************************
//                                               ACCELERÒMETRE
// *************************************************************************************************************

function iniciarAccelerometreWeb() {

  if (window.DeviceMotionEvent) {                                     // Comprovem que el dispositiu tingui acceleròmetre
    window.addEventListener('devicemotion', function(event) {         // Escoltem els esdeveniments del moviment del dispositiu   

      const x = event.accelerationIncludingGravity.x * -1;            // Llegim l'eix X i invertim el signe per adaptar-lo a la pantalla
      const y = event.accelerationIncludingGravity.y;                 // Llegim l'eix Y
      
      if (window.actualitzarNau) {
        window.actualitzarNau(x * 0.3, y * 0.3);                      // Enviem les dades a sketch.js amb un factor de suavitzat
      }
    });
  }
}



// *************************************************************************************************************
//                                               INICIALITZACIÓ
// *************************************************************************************************************

/* Quan el DOOM està llest iniciem la configuració i l'acceleròmetre */

document.addEventListener('DOMContentLoaded', function() {
  carregarConfig();                                                // Carregem la configuració guardada al LocalStorage
  iniciarAccelerometreWeb();                                       // Iniciem l'accelerometre
});
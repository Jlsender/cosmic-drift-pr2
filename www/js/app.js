// *** 20.471. Desenvolupament d'aplicacions interactives - Universitat Oberta de Catalunya - Curs 2025-26/2 ***
// ***                                       PR2. <<Capacitor App>>                                          ***
// ***                                         José López Sender                                             ***
// ***                                              app.js                                                   ***

// *************************************************************************************************************
//                                       DESCRIPCIÓ DEL PROGRAMA
// *************************************************************************************************************

// app.js gestiona la lògica principal de l'aplicació fora del canvas p5.js:

//  - Configuració de l'usuari (velocitat i densitat) i guardat al LocalStorage
//  - Mostra i oculta el panell de configuració
//  - Cridem a la NASA NewWs API per carregar els asteroides
//  - Gestiona les col·lisions rebudes des de sketch.js activant la vibració del dispositiu
//  - Mostrem la fitxa informativa de l'asteroide amb que hem impactat amb el seu nom i la seva perillositat
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
//                                              CRIDA A LA NASA NEOWS API
// *************************************************************************************************************

// Carreguem els asteroides reals des de la NASA NeoWs API i els emmagatzemem a window.dadesNASA per fer-los
// accessibles des de sketch.js

async function carregarAsteroidesNASA(){

  try {

    const avui = new Date().toISOString().split('T')[0];                                                              // Obtenim la data actual en format YYYY-MM-DD
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${avui}&end_date=${avui}&api_key=DEMO_KEY`;
    


    const resposta = await fetch(url);                                                                                // Fem la crida a l'API

    if (!resposta.ok) throw new Error('Error a al resposta de la API de la NASA');                                    // COntrol d'erors de la respota de l'API

    const dades = await resposta.json();
    const llista = dades.near_earth_objects[avui] || [];                                                              // Obtemin els asteroides del dia


    // Transformem les dades al format en que les necessitem

    window.dadesNASA = llista.map(a => ({
      nom: a.name,                                                                                                    // Nom real de l'asteroide
      radi: Math.min(40, Math.max(15,                                                                                 // Limitem el radi en pixels entre 15 i 40
        a.estimated_diameter.meters.estimated_diameter_max / 10                                                       // Convertim el diàmetre a pixels   
      )),

      perillos: a.is_potentially_hazardous_asteroid                                                                   // Identifique si l'asteroide és molt perillós
    }));


    console.log('Asteroides de la NASA carregats: ' + window.dadesNASA.length) ;                                      // Mostrem a la consola quans asteroides hem carregat
    
  } catch (error){

    console.warn('Error al carregar la API de la NASA, farem servir el mode local: ', error);                         // Si hi ha un error mostrem el missatge a la consola
    window.dadesNASA = [];                                                                                            // Buidem l'array per activar el mode aleatori                                                            
  }       

}



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
  const panell = document.getElementById('panell-config');        // Obtenim la referència al panell
  panell.classList.toggle('ocult');                               // Alternem la classe ocult
  const visible = !panell.classList.contains('ocult');            // Comprovem si el panell és visible
  if (window.setPausa) window.setPausa(visible);                  // Pausem o reprenent el joc
}



// *************************************************************************************************************
//                                               COL·LISIÓ DETECTADA
// *************************************************************************************************************

/* Funció que la cridem des de sketch.js quan el cohet col·lisiona amb un asteroide */

window.colisioDetectada = function(temps, asteroide) {


/* VIBRACIÓ DEL DISPOSITIU */
if (navigator.vibrate) {
  navigator.vibrate([200, 100, 200]);       // Patró de vibració: 200ms vibra, 100ms para, 200ms vibra
}



  /* ACTUALITZEM EL RECORD */

  const recordAntic = parseInt(localStorage.getItem('cosmicdrift-record') || 0);          // Llegim el record anterior del LocalStorage
  if (temps > recordAntic) {                                                              // Si el temps actual supera el record anterior
    localStorage.setItem('cosmicdrift-record', temps);                                    // Guardem el nou record al LocalStorage
    document.getElementById('record-text').textContent = 'Rècord: ' + temps + 's';        // Actualitzem el record al panell
  }

  
  /* MOSTEM LA FITXA DE L'ASTEROIDE */

  const nom = asteroide ? asteroide.nom : 'Asteroide desconegut';                         // Nom de l'asteroide o un nom genèric si no tenim dades
  const perillos = asteroide ? asteroide.perillos : false;                                // Identifiquem si es perillos o no
  const emoji = perillos ? '☄️ PERILLOS' : '🪨 No perillós';                              // Missatge si es o no perillos
  
  document.getElementById('fitxa-nom').textContent = nom;                                // A la fitxa mostrem el nom
  document.getElementById('fitxa-perillos').textContent = emoji;                         // A la fitxa mostrem la perillositat 
  document.getElementById('fitxa-temps').textContent = 'Temps: ' + temps + 's';          // Mostrem el temps de supervivencia
  document.getElementById('panell-fitxa').classList.remove('ocult');                     // Mostrem el panell de la fitxa

};



/// *************************************************************************************************************
//                              ACCELERÒMETRE amb @capacitor/motion - Correcció PR1
// *************************************************************************************************************

async function iniciarAccelerometreNatiu() {
  try {
    const { Motion } = await import('@capacitor/motion');           // Importem el plugin natiu

    // Sol·licitem permís per als sensors
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof DeviceMotionEvent.requestPermission === 'function') {
      await DeviceMotionEvent.requestPermission();                  // Demanem permís si cal
    }

    await Motion.addListener('accel', function(event) {            // Escoltem l'acceleròmetre natiu
      const x = event.accelerationIncludingGravity.x * -1;         // Llegim l'eix X
      const y = event.accelerationIncludingGravity.y;              // Llegim l'eix Y

      if (window.actualitzarNau) {
        window.actualitzarNau(x * 0.3, y * 0.3);                   // Enviem les dades a sketch.js
      }
    });

    console.log('Acceleròmetre natiu iniciat correctament');

  } catch (error) {
    console.warn('Error iniciant @capacitor/motion, fent servir DeviceMotionEvent: ', error);


    // FALLBACK — si falla el plugin natiu, fem servir la Web API

    window.addEventListener('devicemotion', function(event) {
      const x = event.accelerationIncludingGravity.x * -1;
      const y = event.accelerationIncludingGravity.y;
      if (window.actualitzarNau) {
        window.actualitzarNau(x * 0.3, y * 0.3);
      }
    });
  }
}



/// *************************************************************************************************************
//                                               MÚSICA DE FONS
// *************************************************************************************************************

function iniciarMusica() {
  const musica = document.getElementById('musica-fons');              // Obtenim la referència a l'element d'àudio
  musica.volume = 0.4;                                                // Volum al 40%
  musica.play().catch(() => {                                         // Iniciem la reproducció
    console.log('Música pendent d\'interacció de l\'usuari');
  });
}

document.addEventListener('visibilitychange', function() {
  const musica = document.getElementById('musica-fons');
  if (document.hidden) {
    musica.pause();                                                   // Pausem la música en minimitzar
  } else {
    musica.play();                                                    // Reprentem la música en tornar
  }
});



// *************************************************************************************************************
//                                               MODE IMMERSIU
// *************************************************************************************************************

document.addEventListener('click', function() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();          // Sol·licitem pantalla complerta
  }
});



// *************************************************************************************************************
//                                               INICIALITZACIÓ
// *************************************************************************************************************

/* Quan el DOOM està llest iniciem la configuració i l'acceleròmetre */

document.addEventListener('DOMContentLoaded', function() {
  carregarConfig();
  iniciarAccelerometreNatiu();
  carregarAsteroidesNASA();
  iniciarMusica();

  // Amaguem la barra de navegació inferior en mode immersiu
  if (window.AndroidFullScreen) {
    window.AndroidFullScreen.immersiveMode();
  }
});



// *************************************************************************************************************
//                                               TANQUEM LA FITXA
// *************************************************************************************************************

function tancarFitxa() {
  document.getElementById('panell-fitxa').classList.add('ocult');               // Amaguem el panell de la fitxa
}

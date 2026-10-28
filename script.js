/*
  GUÍA PARA EDITAR LAS FUNCIONES (JAVASCRIPT)
  - Este archivo controla la navegación entre secciones, el carrusel, el quiz y la sopa de letras.
  - Puedes cambiar mensajes que aparecen en pantalla editando los textos entre comillas.
  - Si cambias la cantidad de preguntas del quiz, revisa también el puntaje y el texto que muestra el total.
  - Para la sopa de letras, las palabras deben coincidir con las que aparecen en la lista del HTML y en la lógica del juego.
  - Evita cambiar nombres de funciones que se llaman desde el HTML mediante onclick="...", a menos que actualices ambos lugares.
*/

/* NAVEGACIÓN: oculta las demás secciones y muestra la pestaña seleccionada. */
function mostrar(id){
const pagina=document.getElementById(id);
if(!pagina || !pagina.classList.contains("pagina")) return;
document.querySelectorAll(".pagina").forEach(p=>p.classList.remove("activa"));
pagina.classList.add("activa");
window.scrollTo({top:0,behavior:"smooth"});
}
/* CARRUSEL DE LA PORTADA: cambia automáticamente de tarjeta cada 4 segundos. */
let diapositiva=0;
const slides=document.querySelectorAll(".slide");
setInterval(()=>{
slides.forEach(s=>s.classList.remove("activo"));
diapositiva=(diapositiva+1)%slides.length;
slides[diapositiva].classList.add("activo");
},4000);

/* QUIZ: guarda el puntaje y evalúa las respuestas seleccionadas. */
let puntaje=0;
function responder(boton,correcta){
const pregunta=boton.parentElement;
if(pregunta.dataset.respondida==="true")return;
pregunta.dataset.respondida="true";
pregunta.querySelectorAll(".respuesta").forEach(b=>b.disabled=true);
if(correcta){boton.classList.add("correcta");puntaje++}
else boton.classList.add("incorrecta");
const explicaciones = [
 "Colombia se divide tradicionalmente en seis regiones naturales: Caribe, Insular, Pacífica, Andina, Orinoquía y Amazonía.",
 "El 20 de julio de 1810 es una fecha fundamental del proceso de independencia.",
 "El joropo se relaciona con las tradiciones musicales de los Llanos Orientales.",
 "El ajiaco santafereño es una preparación tradicional de Bogotá.",
 "Gabriel García Márquez recibió el Premio Nobel de Literatura en 1982."
];
let indice=[...document.querySelectorAll(".pregunta")].indexOf(pregunta);
let aviso=pregunta.querySelector(".retroalimentacion");
if(!aviso){aviso=document.createElement("p");aviso.className="retroalimentacion";aviso.style.marginTop="12px";aviso.style.fontWeight="bold";pregunta.appendChild(aviso);}
aviso.textContent=(correcta?"¡Correcto! ":"Repasa esta información. ")+explicaciones[indice];
document.getElementById("resultado").textContent="Puntaje: "+puntaje+" / 5";
}
/* REINICIAR QUIZ: permite volver a responder todas las preguntas desde cero. */
function reiniciarQuiz(){
puntaje=0;
document.querySelectorAll(".pregunta").forEach(p=>{
delete p.dataset.respondida;
p.querySelectorAll(".respuesta").forEach(b=>{
b.disabled=false;b.classList.remove("correcta","incorrecta");
});
const aviso=p.querySelector(".retroalimentacion");if(aviso)aviso.remove();
});
document.getElementById("resultado").textContent="Puntaje: 0 / 5";
}

/* SOPA DE LETRAS: letras que forman la cuadrícula del juego. Puedes cambiar la cuadrícula con cuidado. */
const letras=[
"C","O","L","O","M","B","I","A","X","P",
"A","N","D","E","S","Q","R","T","U","V",
"A","M","A","Z","O","N","A","S","B","C",
"C","U","M","B","I","A","E","F","G","H",
"K","L","M","N","O","P","Q","R","S","T",
"A","B","C","D","E","F","G","H","I","J",
"C","A","R","I","B","E","U","V","W","X",
"A","B","C","D","E","F","G","H","I","J",
"J","O","R","O","P","O","K","L","M","N",
"A","B","C","D","E","F","G","H","I","J"];
const palabrasSopa=["COLOMBIA","CUMBIA","ANDES","AMAZONAS","CARIBE","JOROPO"];
const palabrasEncontradas=new Set();
let seleccionActual=[];
const sopa=document.getElementById("sopa");
const mensajeSopa=document.getElementById("mensajeSopa");

function limpiarSeleccionActual(){
  seleccionActual.forEach(item=>{
    if(!item.boton.classList.contains("encontrada")) item.boton.classList.remove("seleccionada");
  });
  seleccionActual=[];
}

/* SELECCIÓN DE LETRAS: comprueba si las letras elegidas forman una palabra válida. */
function seleccionarLetraSopa(boton){
  if(boton.classList.contains("encontrada")) return;
  const fila=Number(boton.dataset.fila);
  const columna=Number(boton.dataset.columna);
  const ultima=seleccionActual[seleccionActual.length-1];

  if(ultima && ultima.boton===boton){
    limpiarSeleccionActual();
    mensajeSopa.textContent=`Selección cancelada. Palabras encontradas: ${palabrasEncontradas.size} de ${palabrasSopa.length}.`;
    return;
  }

  if(ultima && (fila!==ultima.fila || columna!==ultima.columna+1)){
    limpiarSeleccionActual();
  }

  const letra=boton.textContent;
  const posibleTexto=seleccionActual.map(item=>item.boton.textContent).join("")+letra;
  const hayCoincidencia=palabrasSopa.some(p=>p.startsWith(posibleTexto) && !palabrasEncontradas.has(p));
  if(!hayCoincidencia){
    limpiarSeleccionActual();
    const puedeEmpezar=palabrasSopa.some(p=>p.startsWith(letra) && !palabrasEncontradas.has(p));
    if(puedeEmpezar){
      seleccionActual.push({boton,fila,columna});
      boton.classList.add("seleccionada");
      mensajeSopa.textContent=`Letra ${letra} seleccionada. Continúa hacia la derecha.`;
    }else{
      mensajeSopa.textContent=`La letra ${letra} no inicia una palabra pendiente. Intenta con otra.`;
    }
    return;
  }

  seleccionActual.push({boton,fila,columna});
  boton.classList.add("seleccionada");
  const texto=seleccionActual.map(item=>item.boton.textContent).join("");
  const palabra=palabrasSopa.find(p=>p===texto && !palabrasEncontradas.has(p));

  if(palabra){
    palabrasEncontradas.add(palabra);
    seleccionActual.forEach(item=>{
      item.boton.classList.remove("seleccionada");
      item.boton.classList.add("encontrada");
    });
    const etiqueta=document.querySelector(`#listaPalabras [data-palabra="${palabra}"]`);
    if(etiqueta) etiqueta.classList.add("encontrada");
    seleccionActual=[];
    if(palabrasEncontradas.size===palabrasSopa.length){
      mensajeSopa.textContent=`¡Excelente! Encontraste todas las palabras (${palabrasEncontradas.size} de ${palabrasSopa.length}).`;
    }else{
      mensajeSopa.textContent=`¡Encontraste ${palabra}! Palabras encontradas: ${palabrasEncontradas.size} de ${palabrasSopa.length}.`;
    }
  }else{
    mensajeSopa.textContent=`Vas bien: ${texto}. Continúa seleccionando letras hacia la derecha.`;
  }
}

letras.forEach((letra,indice)=>{
  const boton=document.createElement("button");
  const fila=Math.floor(indice/10);
  const columna=indice%10;
  boton.type="button";
  boton.className="letra";
  boton.textContent=letra;
  boton.dataset.fila=String(fila);
  boton.dataset.columna=String(columna);
  boton.setAttribute("aria-label",`Letra ${letra}, fila ${fila+1}, columna ${columna+1}`);
  boton.onclick=()=>seleccionarLetraSopa(boton);
  sopa.appendChild(boton);
});

/* REINICIAR SOPA: borra los aciertos y permite comenzar de nuevo. */
function reiniciarSopa(){
  palabrasEncontradas.clear();
  limpiarSeleccionActual();
  sopa.querySelectorAll(".letra").forEach(b=>b.classList.remove("seleccionada","encontrada"));
  document.querySelectorAll("#listaPalabras [data-palabra]").forEach(li=>li.classList.remove("encontrada"));
  mensajeSopa.textContent=`Palabras encontradas: 0 de ${palabrasSopa.length}. Selecciona las letras de izquierda a derecha.`;
}

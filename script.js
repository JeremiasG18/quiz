// Funciones
// Inicializar número de pregunta y contadores
const creacionDeAlmacenamiento = ()=>{
    localStorage.setItem('respuestas_correctas', 0);
    localStorage.setItem('respuestas_incorrectas', 0);
    localStorage.setItem('respondidas', 0);
    localStorage.setItem('numero_pregunta', 0);
    localStorage.setItem('preguntas_no_respondidas', 0);
}

// Obtener datos del archivo JSON
const obtenerDatos = async (indice) => {
    const peticion = await fetch("quiz.json");
    const resultado = await peticion.json();
    localStorage.setItem('total_preguntas', resultado.length);
    const pregunta = resultado[indice]["question"];
    const opciones = [];
    const respuestaCorrecta = resultado[indice]["answer"];
    for (let i = 0; i < resultado[indice]["choices"].length; i++) {
        opciones.push(resultado[indice]["choices"][i]);
    }
    const datos = [pregunta, opciones, respuestaCorrecta];
    return datos;
}

// Mostrar preguntas y respuestas
const mostrarDatos = async (indice) => {
    const resultado = await obtenerDatos(indice);
    let opcionesElemento = "";    
    for (let i = 0; i < resultado[1].length; i++) {
        opcionesElemento += `
            <div class="choice">
                <div class="choice__text">${resultado[1][i]}</div>
            </div>
        `;
    }
    let titulo = `<p>${resultado[0]}</p>`;
    document.querySelector(".question").innerHTML = titulo;
    document.querySelector(".choices").innerHTML = opcionesElemento;
    verificarOpcionSeleccionada();
}

// Mostrar respuesta
const mostrarContenidoRespuesta = (respuestaCorrecta, tituloRespuesta, colorRespuesta, respuestasCorrectas, respuestasIncorrectas, respondidas) => {
    let total_preguntas = localStorage.getItem('total_preguntas')
    let datos = `
        <div class="answer">
            <div class="answer__title ${colorRespuesta}">${tituloRespuesta}</div>
            <div class="answer__true">Respuesta Correcta: ${respuestaCorrecta}</div>
            <div class="">
                <div class="true__title green">Correctas</div>
                <div class="true__text">${respuestasCorrectas}</div>
            </div>
            <div class="">
                <div class="true__title red">Incorrectas</div>
                <div class="true__text">${respuestasIncorrectas}</div>
            </div>
            <div class="">
                <div class="true__title">No respondidas</div>
                <div class="true__text">${localStorage.getItem('preguntas_no_respondidas')}</div>
            </div>
            <div class="replied">
                Respondidas ${respondidas}/${total_preguntas}
            </div>
            <div class="btn__next">
                <button id="btnNext">Siguiente Pregunta</button>
            </div>
            <div>By: Gonzalez Jeremias</div>
        </div>
    `;
    contenidoRespuesta.innerHTML = datos;
    contenidoRespuesta.style.display = "flex";
    const btnNext = document.getElementById("btnNext");
    btnNext.addEventListener("click", () => {
        siguientePregunta();
    })
}

// Pasar a la siguiente pregunta
const siguientePregunta = () => {
    let numeroPregunta = parseInt(localStorage.getItem('numero_pregunta'));
    if (parseInt(localStorage.getItem('total_preguntas')) > (numeroPregunta + 1)) {
        numeroPregunta++;
        localStorage.setItem('numero_pregunta', numeroPregunta);
        mostrarDatos(numeroPregunta);
        cronometro();
        contenidoRespuesta.style.display = "none";
    } else {
        mostrarResultadoFinal();
    }
}

// Mostrar resultado final
const mostrarResultadoFinal = () => {
    let respuestasCorrectas = parseInt(localStorage.getItem('respuestas_correctas'));
    let respuestasIncorrectas = parseInt(localStorage.getItem('respuestas_incorrectas'));
    let datos = `
        <div class="answer">
            <div class="answer__title">Final del Quiz</div>
            <div class="">
                <div class="true__title green">Respuestas Correctas</div>
                <div class="true__text">${respuestasCorrectas}</div>
            </div>
            <div class="">
                <div class="true__title red">Respuestas Incorrectas</div>
                <div class="true__text">${respuestasIncorrectas}</div>
            </div>
            <div class="">
                <div class="true__title">No respondidas</div>
                <div class="true__text">${localStorage.getItem('preguntas_no_respondidas')}</div>
            </div>
            <div class="btn__next">
                <button id="btnTryAgain">Volver a Jugar</button>
            </div>
            <div>By: Gonzalez Jeremias</div>
        </div>
    `;
    contenidoRespuesta.innerHTML = datos;
    contenidoRespuesta.style.display = "flex";
    const btnTryAgain = document.getElementById("btnTryAgain");
    btnTryAgain.addEventListener("click", () => {
        localStorage.clear();
        creacionDeAlmacenamiento();
        location.reload();
    })
}

// Cronometro
const cronometro = () => {
    let tiempo = 15;
    contenedorTiempo.innerHTML = tiempo;
    barraDeProgreso.style.width = '100%'
    let intervalo = setInterval(() => {
        tiempo--;
        contenedorTiempo.innerHTML = tiempo;
        barraDeProgreso.style.width = (tiempo / 15) * 100 + '%';
        if (estadoDeOpcion == true) {
            estadoDeOpcion = false;            
            clearInterval(intervalo);
        }else if (tiempo === 0){
            clearInterval(intervalo);
            let preguntasNoRespondidas = parseInt(localStorage.getItem('preguntas_no_respondidas'));
            preguntasNoRespondidas++;
            let respondidas = parseInt(localStorage.getItem('respondidas'));
            respondidas++;
            localStorage.setItem('preguntas_no_respondidas',preguntasNoRespondidas);
            localStorage.setItem('respondidas', respondidas);
            siguientePregunta();
        }

    }, 1000)
};

const verificarOpcionSeleccionada = ()=>{
    const opciones = document.querySelectorAll('.choice');
    opciones.forEach(opcion => {
        opcion.addEventListener("click", async (e) => {
            e.preventDefault();
            estadoDeOpcion = true;
            let textoOpcion = opcion.querySelector(".choice__text").textContent;
            let numeroPregunta = parseInt(localStorage.getItem('numero_pregunta'));
            let respuestaCorrecta = await obtenerDatos(numeroPregunta);
            respuestaCorrecta = respuestaCorrecta[2];
            let tituloRespuesta, colorRespuesta;
            let estadoRespuesta;
            if (textoOpcion === respuestaCorrecta) {
                estadoRespuesta = `
                    <div class="state state--true"></div>
                    <div class="choice__text">${textoOpcion}</div>
                `;
                opcion.classList.add('true');
                opcion.innerHTML = estadoRespuesta;
                tituloRespuesta = "Respuesta Correcta";
                colorRespuesta = "green";
                let respuestasCorrectas = parseInt(localStorage.getItem('respuestas_correctas'));
                respuestasCorrectas++;
                localStorage.setItem('respuestas_correctas', respuestasCorrectas);
                let respuestasIncorrectas = parseInt(localStorage.getItem('respuestas_incorrectas'));
                let respondidas = parseInt(localStorage.getItem('respondidas'));
                respondidas++;
                localStorage.setItem('respondidas', respondidas);
                mostrarContenidoRespuesta(respuestaCorrecta, tituloRespuesta, colorRespuesta, respuestasCorrectas, respuestasIncorrectas, respondidas);
            }else{
                estadoRespuesta = `
                    <div class="state state--false"></div>
                    <div class="choice__text">${textoOpcion}</div>
                `;
                opcion.classList.add('false');
                opcion.innerHTML = estadoRespuesta;
                tituloRespuesta = "Respuesta Incorrecta";
                colorRespuesta = "red";
                let respuestasIncorrectas = parseInt(localStorage.getItem('respuestas_incorrectas'));
                respuestasIncorrectas++;
                localStorage.setItem('respuestas_incorrectas', respuestasIncorrectas);
                let respuestasCorrectas = parseInt(localStorage.getItem('respuestas_correctas'));
                let respondidas = parseInt(localStorage.getItem('respondidas'));
                respondidas++;
                localStorage.setItem('respondidas', respondidas);
                mostrarContenidoRespuesta(respuestaCorrecta, tituloRespuesta, colorRespuesta, respuestasCorrectas, respuestasIncorrectas, respondidas);
            }         
        }) ;
    });   
}

// Declaracion de variables y constantes
let indice = localStorage.getItem('numero_pregunta');
const contenedorTiempo = document.querySelector(".time");
const barraDeProgreso = document.querySelector(".bar-progress");
const btnEnviar = document.getElementById("send");
const contenidoRespuesta = document.querySelector(".content__answer");
let estadoDeOpcion;

// Llamamiento de funciones
creacionDeAlmacenamiento();
mostrarDatos(indice);
cronometro();
// Inicializar número de pregunta y contadores
const creacionDeAlmacenamiento = ()=>{
    localStorage.setItem('respuestas_correctas', 0);
    localStorage.setItem('respuestas_incorrectas', 0);
    localStorage.setItem('respondidas', 0);
    localStorage.setItem('numero_pregunta', 0);
    localStorage.setItem('respuestas_no_respondidas', 0);
}

creacionDeAlmacenamiento();

let indice = localStorage.getItem('numero_pregunta');

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
                <input type="checkbox" class="choice__checkbox">
                <div class="choice__text">${resultado[1][i]}</div>
            </div>
        `;
    }
    let titulo = `<p>${resultado[0]}</p>`;
    document.querySelector(".question").innerHTML = titulo;
    document.querySelector(".choices").innerHTML = opcionesElemento;
    configurarCheckbox();
}

// Llamar a la función mostrar datos
mostrarDatos(indice);

// Configurar checkboxes
const configurarCheckbox = () => {
    const opciones = document.querySelectorAll(".choice");
    opciones.forEach(opcion => {
        opcion.addEventListener("click", () => {
            const checkbox = opcion.querySelector(".choice__checkbox");
            opciones.forEach(opcion => {                
                const checkbox = opcion.querySelector(".choice__checkbox");
                if (checkbox.checked === true) {
                    checkbox.checked = false;
                }
            });
            checkbox.checked = true;
        });
    });
}

// Enviar y comprobar respuestas
const btnEnviar = document.getElementById("send");
const contenidoRespuesta = document.querySelector(".content__answer");
btnEnviar.addEventListener("click", async (e) => {
    e.preventDefault();
    const opciones = document.querySelectorAll(".choice");
    let numeroPregunta = localStorage.getItem('numero_pregunta');
    let respuestaCorrecta = await obtenerDatos(numeroPregunta);
    respuestaCorrecta = respuestaCorrecta[2];
    let tituloRespuesta, colorRespuesta;
    opciones.forEach(opcion => {
        if (opcion.querySelector(".choice__checkbox").checked) {
            let textoOpcion = opcion.querySelector(".choice__text").textContent;
            if (textoOpcion === respuestaCorrecta) {
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
            } else {
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
        }
    });
})

// Mostrar feedback de la respuesta
const mostrarContenidoRespuesta = (respuestaCorrecta, tituloRespuesta, colorRespuesta, respuestasCorrectas, respuestasIncorrectas, respondidas) => {

    let datos = `
        <div class="answer bold">
            <div class="answer__title ${colorRespuesta}">${tituloRespuesta}</div>
            <div class="answer__true">Respuesta Correcta: ${respuestaCorrecta}</div>
            <div class="true">
                <div class="true__title green">Correctas</div>
                <div class="true__text">${respuestasCorrectas}</div>
            </div>
            <div class="false">
                <div class="true__title red">Incorrectas</div>
                <div class="true__text">${respuestasIncorrectas}</div>
            </div>
            <div class="">
                <div class="true__title">No respondidas</div>
                <div class="true__text">${localStorage.getItem('respuestas_no_respondidas')}</div>
            </div>
            <div class="replied">
                Respondidas ${respondidas}/75
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
        <div class="answer bold">
            <div class="answer__title bold">Final del Quiz</div>
            <div class="true">
                <div class="true__title green">Respuestas Correctas</div>
                <div class="true__text">${respuestasCorrectas}</div>
            </div>
            <div class="false">
                <div class="true__title red">Respuestas Incorrectas</div>
                <div class="true__text">${respuestasIncorrectas}</div>
            </div>
            <div class="">
                <div class="true__title">No respondidas</div>
                <div class="true__text">${localStorage.getItem('respuestas_no_respondidas')}</div>
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
const contenidoCronometro = document.querySelector(".chronometer");
const cronometro = () => {
    let tiempo = 10;
    contenidoCronometro.innerHTML = tiempo;
    let intervalo = setInterval(() => {
        tiempo--;
        contenidoCronometro.innerHTML = tiempo;
        btnEnviar.addEventListener("click",()=>{
            clearInterval(intervalo)
        })
        if (tiempo === 0) {
            clearInterval(intervalo);
            let tiempo = parseInt(localStorage.getItem('respuestas_no_respondidas'));
            tiempo++;
            localStorage.setItem('respuestas_no_respondidas',tiempo);
            console.log(localStorage.getItem('respuestas_no_respondidas'));
            siguientePregunta();
        }
    }, 1000);
}

cronometro();
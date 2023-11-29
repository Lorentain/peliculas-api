var contadorPage = 1;
var isSeries = false;
var isPeliculas = false;
var idPelicula;
window.onload = () => {
    const contenedorPeliculas = document.getElementById("contenedor__peliculas");
    const campoBuscar = document.getElementById("campo__buscar");
    const portadaInicio = document.getElementById("portada__inicio");
    const enlaceInicio = document.getElementById("inicio");
    const enlaceSeries = document.getElementById("series");
    const enlacePeliculas = document.getElementById("peliculas");
    var scroll = true;

    contenedorPeliculas.style.display = "none";
    
    buscarPelicula(contenedorPeliculas, campoBuscar, portadaInicio, enlaceInicio);

    verEnlaceInicio(contenedorPeliculas,portadaInicio,enlaceInicio,enlaceSeries, enlacePeliculas);
    verEnlaceSeries(contenedorPeliculas,portadaInicio,enlaceInicio,enlaceSeries, enlacePeliculas);
    verEnlacePeliculas(contenedorPeliculas,portadaInicio,enlaceInicio,enlaceSeries, enlacePeliculas);

    window.addEventListener('scroll',() => {
        const scrollPorcentaje = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if(scrollPorcentaje > 90 && scroll == true) {
            contadorPage++;
            scrollInfinito(contenedorPeliculas, campoBuscar, scroll);
            scroll = false;
        }else if((scrollPorcentaje < 90) && scroll == false) {
            scroll = true;
        }
    });
};

function buscarPelicula(contenedorPeliculas, campoBuscar, portadaInicio,enlaceInicio) {
    campoBuscar.addEventListener("keyup", (e) => {
        portadaInicio.style.display = "none";
        contenedorPeliculas.style.display = "flex";
        contenedorPeliculas.style.backgroundImage = "url(./img/imagen_fondo_busqueda.jpg);"
        contenedorPeliculas.style.width = "100%";
        contenedorPeliculas.style.height = "100vh";

        enlaceInicio.style.textDecoration = "none";
        
        if (e.target.value.length >= 3) {
            contadorPage = 1;
            let peliculaPaBuscar = e.target.value;
            contenedorPeliculas.innerHTML = "";
            ajax(contenedorPeliculas, peliculaPaBuscar);
        } else {
            contenedorPeliculas.innerHTML = "";
        }
    });
}

function ajax(contenedorPeliculas, peliculaPaBuscar) {
            console.log(contadorPage);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    respuesta = JSON.parse(this.responseText);
                    if (respuesta.Response == 'True') {
                        contenedorPeliculas.id = "contenedor__peliculas";
                        maquetarPelicula(contenedorPeliculas);
                    } else {
                        contenedorPeliculas.innerHTML = "No hay resultados en la búsqueda";
                        contenedorPeliculas.id.remove;
                        contenedorPeliculas.id = "contenedor__noresultados";
                    }
                    console.log();
                }
            };
            if(isSeries) {
                xhttp.open("GET", "https://www.omdbapi.com/?s=" + peliculaPaBuscar + "&type=" + "series" + "&page=" + contadorPage + "&apikey=7a12ca1f", true);
            }else if(isPeliculas) {
                xhttp.open("GET", "https://www.omdbapi.com/?s=" + peliculaPaBuscar + "&type=" + "movie" + "&page=" + contadorPage + "&apikey=7a12ca1f", true);
            }else {
                xhttp.open("GET", "https://www.omdbapi.com/?s=" + peliculaPaBuscar + "&type=" + "" + "&page=" + contadorPage + "&apikey=7a12ca1f", true);

            }
            xhttp.send();
}

function ajaxDetallao(e) {
    idPelicula = e.target.id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            respuesta = JSON.parse(this.responseText);
            console.log(respuesta);
            if (respuesta.Response == 'True') {
                div = document.createElement("div");
                div2 = document.createElement("div");
                divImagen = document.createElement("div");
                div.className = "zoomPelicula";
                div2.className = "zoomPelicula__parrafo";
                divImagen.className = "zoomPelicula__imagen"

                let imagen = document.createElement("img");
                let textoDirector = document.createElement("p");
                let textoActores = document.createElement("p");
                let textoSinopsis = document.createElement("p");
                let textoEstreno = document.createElement("p");

                imagen.src = respuesta.Poster;
                textoDirector.innerHTML = "<b>Director: </b>" + respuesta.Director;
                textoActores.innerHTML = "<b>Actores: </b>" + respuesta.Actors;
                textoSinopsis.innerHTML = "<b>Sinopsis: </b>" + respuesta.Plot;
                textoEstreno.innerHTML = "<b>Estreno: </b>" + respuesta.Year;

                document.addEventListener("click", (e) => {
                    if(!div.contains(e.target)) {
                        div.remove();
                    }
                    isActivo = false;
                });

                div.appendChild(div2);
                div.appendChild(divImagen);
                divImagen.appendChild(imagen);
                div2.appendChild(textoDirector);
                div2.appendChild(textoActores);
                div2.appendChild(textoSinopsis);
                div2.appendChild(textoEstreno);
                document.body.appendChild(div);
            }
        }
    };
    xhttp.open("GET", "https://www.omdbapi.com/?" + "i=" + idPelicula + "&apikey=7a12ca1f", true);
    xhttp.send();
}

function maquetarPelicula(contenedorPeliculas) {
    console.log(respuesta.Search);
    respuesta.Search.forEach(elemento => {

        let pelicula = document.createElement("div");
        contenedorPeliculas.appendChild(pelicula);
        pelicula.className = "pelicula";
        pelicula.id = elemento.imdbID; 

        let peliculaTitle = document.createElement("div");
        pelicula.appendChild(peliculaTitle);
        peliculaTitle.className = "pelicula__title";
        peliculaTitle.innerHTML = elemento.Title;
        peliculaTitle.id = elemento.imdbID;

        let peliculaYear = document.createElement("div");
        pelicula.appendChild(peliculaYear);
        peliculaYear.className = "pelicula__year";
        peliculaYear.innerHTML = elemento.Year;
        peliculaYear.id = elemento.imdbID;

        let peliculaTipo = document.createElement("div");
        pelicula.appendChild(peliculaTipo);
        peliculaTipo.className = "pelicula__tipo";
        peliculaTipo.innerHTML = elemento.Type;
        peliculaTipo.id = elemento.imdbID;

        let peliculaImg = document.createElement("img");
        pelicula.appendChild(peliculaImg);
        peliculaImg.className = "pelicula__img";
        peliculaImg.id = elemento.imdbID;

        if(elemento.Poster != "N/A") {
            peliculaImg.src = elemento.Poster;
        }else {
            peliculaImg.src = "./img/imagen.png";
        }
    });

    verPelicula();
}

function verPelicula() {
    let peliculas = document.querySelectorAll(".pelicula");
    let peliculasImg = document.querySelector(".pelicula__img");
    let peliculaTitle = document.querySelector(".pelicula__title");
    let peliculaYear = document.querySelector(".pelicula__year");
    let isActivo  = false;

    peliculas.forEach(pelicula => {
        pelicula.addEventListener("click", (e) => {
            ajaxDetallao(e);
        });
    });

    peliculasImg.forEach(elementoImg => {
        elementoImg.addEventListener("click",(e) => {
            ajaxDetallao(e);
        });
    });

    peliculaTitle.forEach(elementoTitle => {
        elementoTitle.addEventListener("click",(e) => {
            ajaxDetallao(e);
        });
    });

    peliculaYear.forEach(elementoYear => {
        elementoYear.addEventListener("click",(e) => {
            ajaxDetallao(e);
        });
    });
}

function scrollInfinito(contenedorPeliculas, campoBuscar, scroll){

    if(scroll == true) {
        ajax(contenedorPeliculas, campoBuscar.value);
    }
}

function verEnlaceInicio(contenedorPeliculas,portadaInicio,enlaceInicio,enlaceSeries, enlacePeliculas) {
    enlaceInicio.addEventListener("click",() => {
        enlaceSeries.style.textDecoration = "none";
        enlacePeliculas.style.textDecoration = "none";
        contenedorPeliculas.style.display = "none";
        portadaInicio.style.display = "flex";
        enlaceInicio.style.textDecoration = "underline 2px rgb(131, 255, 8)";
        isSeries = false;
        isPeliculas = false;
    });
}

function verEnlaceSeries(contenedorPeliculas,portadaInicio,enlaceInicio,enlaceSeries, enlacePeliculas) {
    enlaceSeries.addEventListener("click",() => {
        enlaceInicio.style.textDecoration = "none";
        enlacePeliculas.style.textDecoration = "none";
        contenedorPeliculas.style.display = "none";
        portadaInicio.style.display = "flex";
        enlaceSeries.style.textDecoration = "underline 2px rgb(131, 255, 8)";
        isPeliculas = false;
        isSeries = true;
    });
}

function verEnlacePeliculas(contenedorPeliculas,portadaInicio,enlaceInicio,enlaceSeries, enlacePeliculas) {
    enlacePeliculas.addEventListener("click",() => {
        enlaceInicio.style.textDecoration = "none";
        enlaceSeries.style.textDecoration = "none";
        contenedorPeliculas.style.display = "none";
        portadaInicio.style.display = "flex";
        enlacePeliculas.style.textDecoration = "underline 2px rgb(131, 255, 8)";
        isPeliculas = true;
        isSeries = false;
    });
}

const carritoBox = document.querySelector('#carrito-box');
const agregarCarrito = document.getElementsByClassName('agregar-carrito');
const divCarrito = document.querySelector('#tabla-carrito tbody');
const img = document.getElementsByClassName("imagen-producto")
const contenedoresScroll = document.getElementsByClassName("contenedor-producto")
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
let nombre ;
let error ;
let totalElements ;
let totalCarrito = 0;
let articulos = [];
let localArticulos= [];
let articuloId ;
let articuloNombre ;


const productoJSON = "data/productos.json";
$.ajax({
	url: productoJSON
  }).done( function( jqXHR, textStatus, errorThrown ) {
	$.getJSON(productoJSON, function (respuesta, textStatus) {
		if(textStatus === "success"){
			for(let i=0; i<respuesta.length; i++){
				let misDatos = respuesta[i];
					for (let dato of misDatos) {
						$(`#${dato.section}`).append(`
						<div class="producto" data-id="${dato.id}">
						<img src=${dato.imagen} class="imagen-producto" alt="">
						<div class = "producto-info">
							<p>${dato.nombre}</p>
							<div class="flex-producto">
								<button class="btn-class agregar-carrito">Agregar al carrito</button>
								<p class ="alinear-final">$<span>${dato.precio}</span></p>
							</div>
						</div>
						</div>`)
					} 
			}	
		}
	});

  });

$.ajax({
	url: productoJSON
  }).fail( function( jqXHR, textStatus, errorThrown ) {
	switch(jqXHR.status){

		case 0:
			$('#cargar').remove();
			error = "<div class='error'> <img class='error-image' src='./img/error1.png' alt='imagen de error'> <p class='error-text'>Verifique su conexión a internet</p> <a class='error-button' href='index.html'>Volver al inicio</a> </div>"
			$(`${error}`).insertAfter('header')
			break;

		case 404:
			$('#cargar').remove();
			error = "<div class='error'> <img class='error-image' src='./img/error1.png' alt='imagen de error'> <p class='error-text'>No se encuentra </p> <p class='error-text'>disponible la página</p> <a class='error-button' href='index.html'>Volver al inicio</a> </div>"
			$(`${error}`).insertAfter('header')
			break;

		case 500:
			$('#cargar').remove();
			error = "<div class='error'> <img class='error-image' src='./img/error1.png' alt='imagen de error'> <p class='error-text'>Error interneto del servidor</p> <a class='error-button' href='index.html'>Volver al inicio</a> </div>"
			$(`${error}`).insertAfter('header')
			break;

		case 'parseerror':
			$('#cargar').remove();
			error = "<div class='error'> <img class='error-image' src='./img/error1.png' alt='imagen de error'> <p class='error-text'>Fallo intentando convertir la información de JSON</p> <a class='error-button' href='index.html'>Volver al inicio</a> </div>"
			$(`${error}`).insertAfter('header')
			break;

		case 'timeout':
			$('#cargar').remove();
			error = "<div class='error'> <img class='error-image' src='./img/error1.png' alt='imagen de error'> <p class='error-text'>Timeout error</p> <a class='error-button' href='index.html'>Volver al inicio</a> </div>"
			$(`${error}`).insertAfter('header')
			break;

		case 'abort':
			$('#cargar').remove();
			error = "<div class='error'> <img class='error-image' src='./img/error1.png' alt='imagen de error'> <p class='error-text'>Pedido de AJAX abortado</p> <a class='error-button' href='index.html'>Volver al inicio</a> </div>"
			$(`${error}`).insertAfter('header')
			break;
		
		default:
			alert('Uncaught Error: ' + jqXHR.responseText);
			break;

	}

 });




window.onload = function(){
	evitarClick();

    $(".btn-carrito").click(function(){
		total();
		oscurecer();
		disableScroll();
		vaciarHTML();
		agregarCarritoHTML();
		comprobarStorage();
		btnVaciar();
		evitarClick();
		$("#total").show();
		$('#cerrar-carrito').show();
		$(".carrito-box").animate({
            width: "toggle",
        }, 600);
		console.log(document.querySelector(".div-tabla").offsetHeight)
    });

	$('#cerrar-carrito').click(function(){
		aclarar();
		enableScroll();		
		vaciarHTML();
		evitarClick();
		document.getElementsByClassName("div-tabla")[0].style.overflowY="hidden";
		$("#total").hide();
		$("#vaciar-carrito").hide();
		$('#cerrar-carrito').hide();
		$(".carrito-box").animate({
            width: "toggle"
        });
    });

	$('#vaciar-carrito').click(function(){
		vaciarCarrito();
		vaciarHTML();
		comprobarStorage();
		evitarClick();
	});


	$("#toggle-menu").click(function(){
		if(screen.width<800){
			$("#menu").animate({
				width:"100%", margin:"0", minWidth:"220px"
			}, 600);
			$("#toggle-menu").animate({width:"0", margin:"50px 0 0 -200px"});
			document.getElementById("btn-carrito").disabled = true;
		}
		else {
			$("#menu").animate({
			width:"20vw", margin:"0", minWidth:"220px"
			}, 600);
			$("#toggle-menu").animate({width:"0", margin:"50px 0 0 -200px"});
			document.getElementById("btn-carrito").disabled = true;
		}
	});

	$("#closebtn").click(function(){
		if(screen.width<800){
			$("#menu").animate({
				width:"0", margin:"0 0 0 -1000px", overflow:"scroll"
			}, 600);
			$("#toggle-menu").animate({width:"150px", margin:"50px 0 0 0"});
			document.getElementById("btn-carrito").disabled = false;
		}
		else {
			$("#menu").animate({
			width:"0", margin:"0 0 0 -500px"
			}, 600);
			$("#toggle-menu").animate({width:"50px", margin:"50px 0 0 0"});
			document.getElementById("btn-carrito").disabled = false;
		}
	});
	function scrollCarrito(){
		if (JSON.parse(localStorage.getItem("articulos")) !==null){
			if (screen.width > 1000){
				if(JSON.parse(localStorage.getItem("articulos")).length*102> vh*0.85){
				document.getElementsByClassName("div-tabla")[0].style.overflowY="scroll";
				}
				else {
					document.getElementsByClassName("div-tabla")[0].style.overflowY="hidden";
				}			
			}
			else {
				if(JSON.parse(localStorage.getItem("articulos")).length*362> vh*0.6){
					document.getElementsByClassName("div-tabla")[0].style.overflowY="scroll";
				}
				else {
					document.getElementsByClassName("div-tabla")[0].style.overflowY="hidden";
				}
			}
		}
	
	}
	function total(){
		let local = JSON.parse(localStorage.getItem("articulos"))
		if (local !== null){
			for(let i=0; i<local.length; i++){
				totalCarrito = totalCarrito + (local[i].cantidad * local[i].precio);
			}
			document.querySelector("#total span").innerHTML=`${totalCarrito}`
			totalCarrito = 0;
		}
	}
	function oscurecer(){
		document.getElementById("toggle-menu").style.backgroundColor="rgba(0, 0, 0, 0.1)";
		document.getElementById("toggle-menu").disabled = true;
		document.querySelector("body").style.backgroundColor="rgba(0, 0, 0, 0.7)";
		document.querySelector("header").style.background="#262626";
		document.querySelector("#btn-carrito").style.background="rgba(0, 0, 0, 0)";
		document.querySelector("#logo").style.opacity="10%"
		document.getElementsByClassName("footer")[0].style.background="rgba(0, 0, 0, 0.01)";
		for(let i=0; i<img.length; i++){
			img[i].style.opacity = "30%"
		}
		for(let i=0; i<agregarCarrito.length; i++){
			agregarCarrito[i].style.opacity = "30%";
			agregarCarrito[i].disabled = true;
		}
	}
	function aclarar(){
		document.getElementById("toggle-menu").style.backgroundColor="#325cb9";
		document.getElementById("toggle-menu").disabled = false;
		document.querySelector("body").style.backgroundColor="#ffffff";
		document.querySelector("header").style.background="rgb(50,93,189)";
		document.querySelector("header").style.background="linear-gradient(90deg, rgba(50,93,189,1) 52%, rgba(55,59,68,1) 100%)";
		document.querySelector("#btn-carrito").style.background="none";
		document.querySelector("#logo").style.opacity="100%"
		document.getElementsByClassName("footer")[0].style.background="rgb(50,93,189)";
		document.getElementsByClassName("footer")[0].style.background="linear-gradient(180deg, rgba(50,93,189,1) 0%, rgba(59,80,117,1) 57%)";
		for(let i=0; i<img.length; i++){
			img[i].style.opacity = "100%";
		}
		for(let i=0; i<agregarCarrito.length; i++){
			agregarCarrito[i].style.opacity = "100%";
			agregarCarrito[i].disabled = false;
		}
	}
	function disableScroll() {
		var x = window.scrollX;
		var y = window.scrollY;
		window.onscroll = function(){ window.scrollTo(x, y) };
		for(let i=0; i<contenedoresScroll.length; i++){
			var xx = contenedoresScroll[i].scrollX;
			var yy = contenedoresScroll[i].scrollY;
			contenedoresScroll[i].onscroll = function(){ contenedoresScroll[i].scrollTo(xx, yy) };
		}
	}
		
	function enableScroll() {
		window.onscroll = null;
		for(let i=0; i<contenedoresScroll.length; i++){
			contenedoresScroll[i].onscroll = null;
		}
	}
	carritoBox.addEventListener("click", (e) => {
		localArticulos = JSON.parse(localStorage.getItem('articulos'));
		if (e.target.classList.contains('btn-modificador-suma')) {
			articuloNombre = e.target.parentElement.parentElement.parentElement.children[1].children[0].textContent;
			if (JSON.parse(localStorage.getItem("articulos")).some(element => element.nombre == articuloNombre)){
				localArticulos.map(data=>{
					if(articuloNombre == data.nombre){
						data.cantidad = data.cantidad + 1;
						localStorage.setItem('articulos', JSON.stringify(localArticulos));
						let cantidadCarrito = e.target.parentElement.parentElement.parentElement.children[3].children[0].textContent;
						cantidadCarrito.innerHTML = `${data.cantidad}`;
						let cantidadPrecio = e.target.parentElement.parentElement.parentElement.children[2].children[0].textContent;
						cantidadPrecio.innerHTML = `${data.precio*data.cantidad}`

					}
				});
			}
			btnVaciar();
			comprobarStorage();
			evitarClick();
			scrollCarrito();
		}
		if (e.target.classList.contains('btn-modificador-resta')) {
			articuloNombre = e.target.parentElement.parentElement.parentElement.children[1].children[0].textContent;
				if (JSON.parse(localStorage.getItem("articulos")).some(element => element.nombre == articuloNombre)){
					localArticulos.map(data=>{
						if(articuloNombre == data.nombre){
							if (data.cantidad > 1){
								data.cantidad = data.cantidad - 1;
								localStorage.setItem('articulos', JSON.stringify(localArticulos));
								let cantidadCarrito = e.target.parentElement.parentElement.parentElement.children[3].children[0].textContent;
								cantidadCarrito.innerHTML = `${data.cantidad}`;
								let cantidadPrecio = e.target.parentElement.parentElement.parentElement.children[2].children[0].textContent;
								cantidadPrecio.innerHTML = `${data.precio*data.cantidad}`
							}
						
							else {
								articuloId = e.target.parentElement.parentElement.parentElement.children[4].children[0].getAttribute('data-id');
								articulos = JSON.parse(localStorage.getItem('articulos'));
								articulos = articulos.filter(articulo => articulo.id != articuloId);
								if(articulos.length == false){ //un array vacio devuelve el booleano false
									localStorage.setItem('articulos', JSON.stringify(articulos));
									vaciarHTML();
								}
								else{
									localStorage.setItem('articulos', JSON.stringify(articulos));
									vaciarHTML();
									agregarCarritoHTML();
								}
							}
						}
					});
					articulos = [];
					btnVaciar();
					comprobarStorage();
					evitarClick();
					scrollCarrito();
				}
		}
		if (e.target.classList.contains('borrar-producto')) {
			articuloId = e.target.getAttribute('data-id');
			articulos = JSON.parse(localStorage.getItem('articulos'));
			articulos = articulos.filter(articulo => articulo.id != articuloId);
			if(articulos.length == false){ 
				localStorage.setItem('articulos', JSON.stringify(articulos));
				vaciarHTML();
			}
			else{
				localStorage.setItem('articulos', JSON.stringify(articulos));
				vaciarHTML();
				agregarCarritoHTML();
			}
			articulos = [];
			btnVaciar();
			comprobarStorage();
			evitarClick();
			scrollCarrito();
		}
		total();
		scrollCarrito();
	});	

	for(let i=0; i<agregarCarrito.length; i++){
		agregarCarrito[i].addEventListener("click",function(e){
			let articulo = { 
				imagen: e.target.parentElement.parentElement.parentElement.children[0].src,
				id:e.target.parentElement.parentElement.parentElement.getAttribute('data-id'),
				nombre:e.target.parentElement.parentElement.children[0].textContent,
				precio:e.target.parentElement.children[1].children[0].textContent,
				cantidad:1
			};
			if(JSON.parse(localStorage.getItem('articulos')) === null){ 
				articulos.push(articulo); 
				localStorage.setItem("articulos",JSON.stringify(articulos));
				articulos = [];
				productoAgregado()
			}
			else {
				if (JSON.parse(localStorage.getItem("articulos")).some(element => element.nombre == articulo.nombre) === false || JSON.parse(localStorage.getItem("articulos")).length === 0){
					productoAgregado();
					localArticulos = JSON.parse(localStorage.getItem("articulos"));
					localArticulos.map(data=>{ 
						if(articulo.id !== data.id){
							articulos.push(data);
						}
						else {
							articulo.cantidad = data.cantidad;
						}
					});
					articulos.push(articulo);
					localStorage.setItem('articulos',JSON.stringify(articulos));
					articulos = [];
					localArticulos = [];
				}
				else{
					localArticulos = JSON.parse(localStorage.getItem("articulos"));
					localArticulos.map(data=>{ 
						if(articulo.id !== data.id){
							articulos.push(data);
						}
						else {
							articulo.cantidad = data.cantidad;
							productoExistente();
						}
					});
					articulos.push(articulo);
					localStorage.setItem('articulos',JSON.stringify(articulos));
					articulos = [];
					localArticulos = [];
				}
			}
			vaciarHTML();
			agregarCarritoHTML();
			btnVaciar();
		});
	}

	function agregarCarritoHTML (){
		let articulosStorage = JSON.parse(localStorage.getItem("articulos"))
		if (articulosStorage !== null){
			const thead = document.createElement('tr');
			thead.innerHTML = `
				<th class="tabla-estilo">Imagen</th>
              	<th class="tabla-estilo">Nombre</th>
              	<th class="tabla-estilo">Precio</th>
              	<th class="tabla-estilo">Cantidad</th>
              	<th class="tabla-estilo">Eliminar</th>
				`
			divCarrito.appendChild(thead);

			articulosStorage.forEach(producto => {
				
				const { nombre, imagen, precio, cantidad, id } = producto;
		
				const row = document.createElement('tr');
				row.innerHTML = `
					<td>
						<img src="${imagen}" id="img-carrito">
					</td>
					<td class="tabla-estilo">
						<p>${nombre}</p>
					</td>
					<td class="tabla-estilo">
						<p class="precio">${precio*cantidad}</p>
					</td>
					<td class="tabla-estilo">
						<div class="btn-div">
						<button class="btn-modificador-resta">-</button>
						<p class="cantidad">${cantidad}</p>
						<button class="btn-modificador-suma">+</button>
						</div>
					</td>
					<td class="tabla-estilo">
						<button class="borrar-producto" data-id="${id}"> X </button>
					</td>
					
				`
				divCarrito.appendChild(row);
				articulosStorage = [];
			});
		}
		else {
			comprobarStorage();
		}
	}
	function vaciarCarrito() {
		articulos = [];
		localStorage.setItem('articulos', JSON.stringify(articulos));
		vaciarHTML();
		btnVaciar();
	}
	function vaciarHTML () {
		while (divCarrito.firstChild) {
			divCarrito.removeChild(divCarrito.firstChild);
		}
		$(".carrito-vacio").remove();
	}
	function btnVaciar (){
		if (JSON.parse(localStorage.getItem('articulos')) === null){
			$("#vaciar-carrito").hide();
		}
		else {
			if(JSON.parse(localStorage.getItem('articulos')) == false){
				$("#vaciar-carrito").hide();
			}
			else{
				$("#vaciar-carrito").show();
			}
		}
	}
	function comprobarStorage (){
		if (screen.width > 1000){
			document.getElementsByClassName("div-tabla")[0].style.overflowX="hidden";
		}
		if (JSON.parse(localStorage.getItem('articulos')) === null){
			document.getElementsByClassName("div-tabla")[0].style.overflowY="hidden";
			document.getElementsByClassName("div-tabla")[0].style.overflowX="hidden";
			document.getElementsByClassName("div-tabla")[0].style.minHeight="0";
			document.querySelector("#div-total").style.display="none"
			vaciarHTML();
			const carritoVacio = document.createElement("div")
			carritoVacio.innerHTML = `
				<img id="exclamation-image" src="./img/exclamation-mark.png">
				<p id="exclamation-text">Tu carrito está vacio</p>
				`
			carritoBox.appendChild(carritoVacio);
			carritoVacio.setAttribute("class", "carrito-vacio")
		}
		else if(JSON.parse(localStorage.getItem('articulos')).length == false){ //un array vacio devuelve el booleano false
			document.getElementsByClassName("div-tabla")[0].style.overflowY="hidden";
			document.getElementsByClassName("div-tabla")[0].style.overflowX="hidden";
			document.getElementsByClassName("div-tabla")[0].style.minHeight="0";
			document.querySelector("#div-total").style.display="none"
			vaciarHTML();
			const carritoVacio = document.createElement("div")
			carritoVacio.innerHTML = `
				<img id="exclamation-image" src="./img/exclamation-mark.png">
				<p id="exclamation-text">Tu carrito está vacio</p>
				`
			carritoBox.appendChild(carritoVacio);
			carritoVacio.setAttribute("class", "carrito-vacio")
		}
		else{
			document.getElementsByClassName("div-tabla")[0].style.overflowY="scroll";
			document.getElementsByClassName("div-tabla")[0].style.minHeight="85vh";
			document.querySelector("#div-total").style.display="block"
			if (screen.width < 1000) {
				document.getElementsByClassName("div-tabla")[0].style.minHeight="70vh";
			}
			vaciarHTML();
			agregarCarritoHTML();
			scrollCarrito();
		}
	}
	function evitarClick (){
		$("img").on("contextmenu",function(e){
			return false;
		});
	}
	function productoAgregado(){
		let section = document.querySelector('body').children[1];
		let animacionAgregado = document.createElement('div')
		animacionAgregado.innerHTML = `
		<img class="img-animacion" src="./img/ok.png" alt="aprobado-agregado">
		<p>¡Tu producto fue agregado al carrito!</p>
		`
		animacionAgregado.setAttribute("class", "producto-agregado");
		section.appendChild(animacionAgregado);
		$(".producto-agregado").fadeIn ("slow", function (){
			$(".producto-agregado").fadeOut(3000, function (){
				this.remove();
			});
		});		
	}
	function productoExistente(){
		let section = document.querySelector('body').children[1];
		let animacionExistente = document.createElement('div')
		animacionExistente.innerHTML = `
        <img class="img-animacion" src="./img/error.png" alt="error-existencia">
        <p>¡Tu producto ya existe en el carrito!</p>
		`
		animacionExistente.setAttribute("class", "producto-existente");
		section.appendChild(animacionExistente);
		$(".producto-existente").fadeIn ("slow", function (){
			$(".producto-existente").fadeOut(3000, function (){
				this.remove();
			});
		});	
	}

}

"use strict";

/* =========================================================
   1. CONFIGURACIÓN Y DATOS PRINCIPALES
========================================================= */

const CLAVE_USUARIOS = "autocare_usuarios";
const CLAVE_SOLICITUDES = "autocare_solicitudes";
const CLAVE_SESION = "autocare_sesion";

const MARCAS = [
    "Chevrolet", "Toyota", "Hyundai", "Kia", "Nissan",
    "Mazda", "Ford", "Volkswagen", "Renault", "Suzuki",
    "Honda", "Mitsubishi", "Otro"
];

const MODELOS_POR_MARCA = {
    Chevrolet: [
        "Aveo", "Sail", "Spark", "Cruze", "Captiva",
        "Tracker", "D-Max", "Onix", "Otro"
    ],
    Toyota: [
        "Corolla", "Yaris", "Hilux", "Fortuner", "RAV4",
        "Prado", "Prius", "Otro"
    ],
    Hyundai: [
        "Accent", "Tucson", "Elantra", "Santa Fe",
        "i10", "i20", "Creta", "Otro"
    ],
    Kia: [
        "Rio", "Sportage", "Picanto", "Cerato",
        "Sorento", "Seltos", "Otro"
    ],
    Nissan: [
        "Sentra", "Versa", "X-Trail", "Frontier",
        "Kicks", "Qashqai", "Otro"
    ],
    Mazda: [
        "Mazda 2", "Mazda 3", "Mazda 6",
        "CX-3", "CX-5", "BT-50", "Otro"
    ],
    Ford: [
        "Escape", "Explorer", "Ranger", "EcoSport",
        "Fiesta", "Focus", "Otro"
    ],
    Volkswagen: [
        "Gol", "Jetta", "Tiguan", "Polo",
        "Amarok", "T-Cross", "Otro"
    ],
    Renault: [
        "Logan", "Sandero", "Duster", "Kwid",
        "Stepway", "Otro"
    ],
    Suzuki: [
        "Swift", "Vitara", "Jimny", "S-Cross",
        "Grand Vitara", "Otro"
    ],
    Honda: [
        "Civic", "CR-V", "Accord", "Fit",
        "HR-V", "Otro"
    ],
    Mitsubishi: [
        "Lancer", "Montero", "L200", "ASX",
        "Outlander", "Otro"
    ],
    Otro: ["Otro"]
};

const SERVICIOS = [
    "Cambio de aceite",
    "Revisión de frenos",
    "Alineación y balanceo",
    "Diagnóstico general",
    "Mantenimiento preventivo",
    "Revisión de batería"
];

const EXTRAS = [
    "Lavado exterior",
    "Recojo a domicilio",
    "Auto de cortesía",
    "Informe fotográfico"
];

const ESTADOS = [
    "Pendiente",
    "En revisión",
    "En proceso",
    "Completada",
    "Cancelada"
];

/*
   Diccionario de usuarios de demostración.
*/
const usuariosIniciales = {
    cliente1: {
        username: "cliente1",
        password: "1234",
        nombre: "Carlos Pérez",
        cedula: "1712345675",
        telefono: "0991234567",
        correo: "carlos@gmail.com",
        rol: "cliente",
        activo: true
    },

    cliente2: {
        username: "cliente2",
        password: "1234",
        nombre: "María López",
        cedula: "1723456784",
        telefono: "0981234567",
        correo: "maria@gmail.com",
        rol: "cliente",
        activo: true
    },

    /* Cuenta deshabilitada: sirve para la prueba N.º 2 de la rúbrica. */
    cliente3: {
        username: "cliente3",
        password: "1234",
        nombre: "Luis Vera",
        cedula: "1734567892",
        telefono: "0971234567",
        correo: "luis@gmail.com",
        rol: "cliente",
        activo: false
    },

    admin: {
        username: "admin",
        password: "admin123",
        nombre: "Administrador AutoCare",
        cedula: "1700000001",
        telefono: "0990000000",
        correo: "admin@autocare.com",
        rol: "admin",
        activo: true
    }
};

/* =========================================================
   2. CARGA Y ALMACENAMIENTO DE DATOS
   ---------------------------------------------------------
   IMPORTANTE:
   - No se utiliza JSON, JSON.parse() ni JSON.stringify().
   - Cada dato se guarda en una clave independiente de localStorage.
   - Los usuarios se conservan como un diccionario en memoria.
   - Las solicitudes se conservan como un arreglo en memoria.
========================================================= */

const PREFIJO_USUARIOS = "autocare_usuario_";
const INDICE_USUARIOS = "autocare_usuarios_indice";
const PREFIJO_SOLICITUDES = "autocare_solicitud_";
const INDICE_SOLICITUDES = "autocare_solicitudes_indice";

function obtenerListaPersistida(clave) {
    const contenido = localStorage.getItem(clave);

    if (!contenido || contenido.trim() === "") {
        return [];
    }

    return contenido
        .split("|")
        .map(valor => valor.trim())
        .filter(Boolean);
}

function guardarListaPersistida(clave, lista) {
    localStorage.setItem(clave, lista.join("|"));
}

function eliminarClavesPorPrefijo(prefijo) {
    const clavesEliminar = [];

    for (let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i);

        if (clave && clave.startsWith(prefijo)) {
            clavesEliminar.push(clave);
        }
    }

    clavesEliminar.forEach(clave => localStorage.removeItem(clave));
}

function cargarUsuarios() {
    const usuariosCargados = {};
    const usernames = obtenerListaPersistida(INDICE_USUARIOS);

    usernames.forEach(username => {
        const prefijo = PREFIJO_USUARIOS + username + "_";
        const nombre = localStorage.getItem(prefijo + "nombre");

        if (!nombre) return;

        usuariosCargados[username] = {
            username,
            password: localStorage.getItem(prefijo + "password") || "",
            nombre,
            cedula: localStorage.getItem(prefijo + "cedula") || "",
            telefono: localStorage.getItem(prefijo + "telefono") || "",
            correo: localStorage.getItem(prefijo + "correo") || "",
            rol: localStorage.getItem(prefijo + "rol") || "cliente",
            activo: localStorage.getItem(prefijo + "activo") !== "false"
        };
    });

    return usuariosCargados;
}

function guardarUsuarios() {
    const usernames = Object.keys(usuarios);

    guardarListaPersistida(INDICE_USUARIOS, usernames);

    usernames.forEach(username => {
        const usuario = usuarios[username];
        const prefijo = PREFIJO_USUARIOS + username + "_";

        localStorage.setItem(prefijo + "password", usuario.password || "");
        localStorage.setItem(prefijo + "nombre", usuario.nombre || "");
        localStorage.setItem(prefijo + "cedula", usuario.cedula || "");
        localStorage.setItem(prefijo + "telefono", usuario.telefono || "");
        localStorage.setItem(prefijo + "correo", usuario.correo || "");
        localStorage.setItem(prefijo + "rol", usuario.rol || "cliente");
        localStorage.setItem(prefijo + "activo", usuario.activo !== false ? "true" : "false");
    });
}

function guardarSolicitudPersistida(solicitud) {
    const prefijo = PREFIJO_SOLICITUDES + solicitud.id + "_";

    localStorage.setItem(prefijo + "username", solicitud.username || "");
    localStorage.setItem(prefijo + "nombre", solicitud.nombre || "");
    localStorage.setItem(prefijo + "cedula", solicitud.cedula || "");
    localStorage.setItem(prefijo + "telefono", solicitud.telefono || "");
    localStorage.setItem(prefijo + "correo", solicitud.correo || "");
    localStorage.setItem(prefijo + "marca", solicitud.marca || "");
    localStorage.setItem(prefijo + "modelo", solicitud.modelo || "");
    localStorage.setItem(prefijo + "placa", solicitud.placa || "");
    localStorage.setItem(prefijo + "anio", String(solicitud.anio ?? ""));
    localStorage.setItem(prefijo + "kilometraje", String(solicitud.kilometraje ?? ""));
    localStorage.setItem(prefijo + "servicio", solicitud.servicio || "");
    localStorage.setItem(prefijo + "fecha", solicitud.fecha || "");
    localStorage.setItem(prefijo + "hora", solicitud.hora || "");
    localStorage.setItem(prefijo + "modalidad", solicitud.modalidad || "");
    localStorage.setItem(prefijo + "extras", Array.isArray(solicitud.extras) ? solicitud.extras.join("|") : "");
    localStorage.setItem(prefijo + "descripcion", solicitud.descripcion || "");
    localStorage.setItem(prefijo + "estado", solicitud.estado || "Pendiente");
    localStorage.setItem(prefijo + "fechaRegistro", solicitud.fechaRegistro || "");
    localStorage.setItem(prefijo + "aceptaCondiciones", solicitud.aceptaCondiciones ? "true" : "false");
}

function cargarSolicitudes() {
    const solicitudesCargadas = [];
    const ids = obtenerListaPersistida(INDICE_SOLICITUDES);

    ids.forEach(id => {
        const prefijo = PREFIJO_SOLICITUDES + id + "_";
        const username = localStorage.getItem(prefijo + "username");

        if (!username) return;

        const extrasGuardados = localStorage.getItem(prefijo + "extras") || "";

        solicitudesCargadas.push({
            id,
            username,
            nombre: localStorage.getItem(prefijo + "nombre") || "",
            cedula: localStorage.getItem(prefijo + "cedula") || "",
            telefono: localStorage.getItem(prefijo + "telefono") || "",
            correo: localStorage.getItem(prefijo + "correo") || "",
            marca: localStorage.getItem(prefijo + "marca") || "",
            modelo: localStorage.getItem(prefijo + "modelo") || "",
            placa: localStorage.getItem(prefijo + "placa") || "",
            anio: Number(localStorage.getItem(prefijo + "anio") || 0),
            kilometraje: Number(localStorage.getItem(prefijo + "kilometraje") || 0),
            servicio: localStorage.getItem(prefijo + "servicio") || "",
            fecha: localStorage.getItem(prefijo + "fecha") || "",
            hora: localStorage.getItem(prefijo + "hora") || "",
            modalidad: localStorage.getItem(prefijo + "modalidad") || "",
            extras: extrasGuardados ? extrasGuardados.split("|") : [],
            descripcion: localStorage.getItem(prefijo + "descripcion") || "",
            estado: localStorage.getItem(prefijo + "estado") || "Pendiente",
            fechaRegistro: localStorage.getItem(prefijo + "fechaRegistro") || "",
            aceptaCondiciones: localStorage.getItem(prefijo + "aceptaCondiciones") === "true"
        });
    });

    return solicitudesCargadas;
}

function guardarSolicitudes() {
    const idsActuales = solicitudes.map(solicitud => solicitud.id);
    const idsAnteriores = obtenerListaPersistida(INDICE_SOLICITUDES);

    /* Elimina de localStorage las solicitudes que ya no existen en memoria. */
    idsAnteriores
        .filter(id => !idsActuales.includes(id))
        .forEach(id => {
            const prefijo = PREFIJO_SOLICITUDES + id + "_";

            for (let i = 0; i < localStorage.length; i++) {
                const clave = localStorage.key(i);

                if (clave && clave.startsWith(prefijo)) {
                    localStorage.removeItem(clave);
                    i--;
                }
            }
        });

    solicitudes.forEach(guardarSolicitudPersistida);
    guardarListaPersistida(INDICE_SOLICITUDES, idsActuales);
}

/*
   Los usuarios iniciales se mantienen exactamente como cuentas de prueba.
*/
let usuarios = cargarUsuarios();

if (Object.keys(usuarios).length === 0) {
    usuarios = { ...usuariosIniciales };
}

/* Comprobar que existan las cuentas de demostración. */
if (!usuarios.admin) {
    usuarios.admin = { ...usuariosIniciales.admin };
}

if (!usuarios.cliente1) {
    usuarios.cliente1 = { ...usuariosIniciales.cliente1 };
}

if (!usuarios.cliente2) {
    usuarios.cliente2 = { ...usuariosIniciales.cliente2 };
}

if (!usuarios.cliente3) {
    usuarios.cliente3 = { ...usuariosIniciales.cliente3 };
}

/*
   Solicitudes de ejemplo para poder probar el sistema desde el
   primer momento. Solo se usan si aún no hay solicitudes guardadas.
*/
function fechaEnDias(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);

    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function solicitudesDemo() {
    return [
        {
            id: "SOL-DEMO-1",
            username: "cliente1",
            nombre: "Carlos Pérez",
            cedula: "1712345675",
            telefono: "0991234567",
            correo: "carlos@gmail.com",
            marca: "Kia",
            modelo: "Rio",
            placa: "PBC-1234",
            anio: 2019,
            kilometraje: 48000,
            servicio: "Cambio de aceite",
            fecha: fechaEnDias(7),
            hora: "09:00",
            modalidad: "Presencial",
            extras: ["Lavado exterior"],
            descripcion: "Cambio de aceite y revisión de ruidos al frenar.",
            estado: "Pendiente",
            fechaRegistro: new Date().toISOString()
        },
        {
            id: "SOL-DEMO-2",
            username: "cliente2",
            nombre: "María López",
            cedula: "1723456784",
            telefono: "0981234567",
            correo: "maria@gmail.com",
            marca: "Chevrolet",
            modelo: "Sail",
            placa: "GSA-5678",
            anio: 2016,
            kilometraje: 92000,
            servicio: "Revisión de frenos",
            fecha: fechaEnDias(10),
            hora: "10:30",
            modalidad: "Domicilio",
            extras: [],
            descripcion: "Los frenos hacen ruido al detenerse.",
            estado: "En revisión",
            fechaRegistro: new Date().toISOString()
        }
    ];
}

let solicitudes = cargarSolicitudes();

if (solicitudes.length === 0) {
    solicitudes = solicitudesDemo();
}

guardarUsuarios();
guardarSolicitudes();

/* =========================================================
   3. FUNCIONES GENERALES
========================================================= */

function obtenerElemento(id) {
    return document.getElementById(id);
}

function obtenerValor(id) {
    const elemento = obtenerElemento(id);
    return elemento ? elemento.value.trim() : "";
}

function establecerError(id, mensaje) {
    const elemento = obtenerElemento(id);

    if (!elemento) return;

    elemento.classList.add("is-invalid");
    elemento.classList.remove("is-valid");

    let feedback = elemento.parentElement
        ? elemento.parentElement.querySelector(".invalid-feedback")
        : null;

    if (!feedback) {
        feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        elemento.insertAdjacentElement("afterend", feedback);
    }

    feedback.textContent = mensaje;
}

function establecerCorrecto(id) {
    const elemento = obtenerElemento(id);

    if (!elemento) return;

    elemento.classList.remove("is-invalid");
    elemento.classList.add("is-valid");
}

function limpiarValidaciones(formulario) {
    if (!formulario) return;

    formulario.querySelectorAll(".is-invalid, .is-valid")
        .forEach(elemento => {
            elemento.classList.remove("is-invalid", "is-valid");
        });

    formulario.querySelectorAll(".invalid-feedback")
        .forEach(elemento => {
            elemento.textContent = "";
            elemento.classList.remove("d-block");
        });
}

function mostrarAlerta(tipo, titulo, mensaje = "") {
    if (window.Swal) {
        return Swal.fire({
            icon: tipo,
            title: titulo,
            text: mensaje,
            confirmButtonColor: "#0d6efd"
        });
    }

    alert(titulo + (mensaje ? "\n" + mensaje : ""));
    return Promise.resolve();
}

function confirmarAccion(titulo, mensaje) {
    if (window.Swal) {
        return Swal.fire({
            title: titulo,
            text: mensaje,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d"
        }).then(resultado => resultado.isConfirmed);
    }

    return Promise.resolve(confirm(mensaje));
}

function generarId() {
    return "SOL-" + Date.now() + "-" +
        Math.floor(Math.random() * 1000);
}

function obtenerFechaActual() {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function obtenerFechaMaxima() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 90);

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => {
        const equivalencias = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return equivalencias[caracter];
    });
}

function obtenerSesion() {
    const username = sessionStorage.getItem(CLAVE_SESION);

    if (!username) return null;

    const usuario = usuarios[username];

    return usuario && usuario.activo !== false ? usuario : null;
}

function iniciarSesion(username) {
    sessionStorage.setItem(CLAVE_SESION, username);
}

function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION);

    /* index.html está en la raíz y las demás páginas en /pages/ */
    window.location.href =
        window.location.pathname.includes("/pages/")
            ? "login.html"
            : "pages/login.html";
}

/* =========================================================
   3.1 MENÚ DE NAVEGACIÓN SEGÚN LA SESIÓN
   Se construye en todas las páginas. Cambia según el rol:
   - Sin sesión: Registrarse e Iniciar sesión.
   - Cliente: Mi panel, Nueva solicitud y Cerrar sesión.
   - Administrador: Administración y Cerrar sesión.
========================================================= */

function construirMenu() {
    const lista = document.querySelector("#menuPrincipal .navbar-nav");

    if (!lista) return;

    const sesion = obtenerSesion();
    const enPages = window.location.pathname.includes("/pages/");
    const raiz = enPages ? "../" : "";
    const carpeta = enPages ? "" : "pages/";
    const archivoActual =
        window.location.pathname.split("/").pop() || "index.html";

    const enlaces = [
        { texto: "Inicio", href: raiz + "index.html", archivo: "index.html" },
        { texto: "Acerca de", href: carpeta + "acerca.html", archivo: "acerca.html" },
        { texto: "Servicios", href: carpeta + "servicios.html", archivo: "servicios.html" }
    ];

    if (!sesion) {
        enlaces.push(
            { texto: "Registrarse", href: carpeta + "registro.html", archivo: "registro.html" },
            { texto: "Iniciar sesión", href: carpeta + "login.html", archivo: "login.html" }
        );
    } else if (sesion.rol === "admin") {
        enlaces.push(
            { texto: "Administración", href: carpeta + "admin.html", archivo: "admin.html" }
        );
    } else {
        enlaces.push(
            { texto: "Mi panel", href: carpeta + "dashboard.html", archivo: "dashboard.html" },
            { texto: "Nueva solicitud", href: carpeta + "solicitud.html", archivo: "solicitud.html" }
        );
    }

    let html = enlaces.map(enlace => `
        <li class="nav-item">
            <a class="nav-link ${enlace.archivo === archivoActual ? "active" : ""}"
               href="${enlace.href}">${enlace.texto}</a>
        </li>
    `).join("");

    if (sesion) {
        html += `
            <li class="nav-item">
                <a class="nav-link" href="${carpeta}login.html"
                   data-cerrar-sesion>Cerrar sesión (${escaparHTML(sesion.username)})</a>
            </li>
        `;
    }

    lista.innerHTML = html;
}

/* =========================================================
   4. CONTROL DE ACCESO Y ROLES
========================================================= */

function exigirSesion() {
    const sesion = obtenerSesion();

    if (!sesion) {
        window.location.href = "login.html";
        return false;
    }

    return true;
}

function exigirRol(rolNecesario) {
    const sesion = obtenerSesion();

    if (!sesion) {
        window.location.href = "login.html";
        return false;
    }

    if (sesion.rol !== rolNecesario) {
        mostrarAlerta(
            "error",
            "Acceso denegado",
            "No tienes permisos para ingresar a esta página."
        ).then(() => {
            window.location.href =
                sesion.rol === "admin" ? "admin.html" : "dashboard.html";
        });

        return false;
    }

    return true;
}

/* =========================================================
   5. VALIDACIONES DE DATOS
========================================================= */

function validarNombre(nombre) {
    return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[\s'-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/
        .test(nombre) && nombre.length >= 3 && nombre.length <= 60;
}

function validarCedula(cedula) {
    if (!/^\d{10}$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2), 10);
    const tercerDigito = parseInt(cedula.charAt(2), 10);

    if (provincia < 1 || provincia > 24) return false;
    if (tercerDigito > 5) return false;
    if (/^(\d)\1{9}$/.test(cedula)) return false;

    let suma = 0;

    for (let i = 0; i < 9; i++) {
        let numero = parseInt(cedula.charAt(i), 10);

        if (i % 2 === 0) {
            numero *= 2;

            if (numero > 9) {
                numero -= 9;
            }
        }

        suma += numero;
    }

    const residuo = suma % 10;
    const verificador = residuo === 0 ? 0 : 10 - residuo;

    return verificador === parseInt(cedula.charAt(9), 10);
}

function validarTelefono(telefono) {
    return /^09\d{8}$/.test(telefono);
}

function validarCorreo(correo) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        .test(correo);
}

function validarUsuario(username) {
    return /^[a-zA-Z0-9_]{4,20}$/.test(username);
}

function validarContrasena(password) {
    return password.length >= 4 && password.length <= 30;
}

function normalizarPlaca(placa) {
    const limpia = placa.toUpperCase().replace(/[\s-]/g, "");

    if (/^[A-Z]{3}\d{3,4}$/.test(limpia)) {
        return limpia.slice(0, 3) + "-" + limpia.slice(3);
    }

    return placa.toUpperCase().replace(/\s/g, "");
}

function validarPlaca(placa) {
    return /^[A-Z]{3}-?\d{3,4}$/.test(placa.toUpperCase());
}

function validarAnio(anio) {
    const numero = Number(anio);
    const actual = new Date().getFullYear();

    return /^\d{4}$/.test(String(anio)) &&
        numero >= 1950 && numero <= actual;
}

function validarKilometraje(kilometraje) {
    if (!/^\d{1,3}(?:\.\d{3})*$|^\d+$/.test(kilometraje)) {
        return false;
    }

    const numero = Number(kilometraje.replace(/\./g, ""));

    return Number.isInteger(numero) &&
        numero >= 0 && numero <= 2000000;
}

function validarFecha(fecha) {
    if (!fecha) return false;

    const hoy = obtenerFechaActual();
    const limite = obtenerFechaMaxima();

    return fecha >= hoy && fecha <= limite;
}

function validarHora(hora, fecha = "") {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
        return false;
    }

    if (hora < "08:00" || hora > "17:59") {
        return false;
    }

    if (fecha === obtenerFechaActual()) {
        const ahora = new Date();
        const horaActual =
            String(ahora.getHours()).padStart(2, "0") + ":" +
            String(ahora.getMinutes()).padStart(2, "0");

        return hora > horaActual;
    }

    return true;
}

function validarDescripcion(descripcion) {
    return descripcion.length >= 10 && descripcion.length <= 300;
}

function marcaValida(marca) {
    return MARCAS.includes(marca);
}

function modeloValido(marca, modelo) {
    return MODELOS_POR_MARCA[marca] &&
        MODELOS_POR_MARCA[marca].includes(modelo);
}

function servicioValido(servicio) {
    return SERVICIOS.includes(servicio);
}

/* =========================================================
   6. REGISTRO DE USUARIOS
========================================================= */

function inicializarRegistro() {
    const formulario = obtenerElemento("formRegistro");

    if (!formulario) return;

    formulario.addEventListener("submit", async evento => {
        evento.preventDefault();
        limpiarValidaciones(formulario);

        const nombre = obtenerValor("nombreRegistro");
        const cedula = obtenerValor("cedulaRegistro");
        const telefono = obtenerValor("telefonoRegistro");
        const correo = obtenerValor("correoRegistro").toLowerCase();
        const username = obtenerValor("usuarioRegistro");
        const password = obtenerValor("contrasenaRegistro");
        const confirmar = obtenerValor("confirmarContrasena");
        const terminos = obtenerElemento("aceptaTerminos");

        let valido = true;

        if (!nombre) {
            establecerError("nombreRegistro", "Ingresa tus nombres y apellidos.");
            valido = false;
        } else if (!validarNombre(nombre)) {
            establecerError(
                "nombreRegistro",
                "El nombre debe tener entre 3 y 60 caracteres y solo contener letras."
            );
            valido = false;
        } else {
            establecerCorrecto("nombreRegistro");
        }

        if (!cedula) {
            establecerError("cedulaRegistro", "Ingresa tu número de cédula.");
            valido = false;
        } else if (!validarCedula(cedula)) {
            establecerError(
                "cedulaRegistro",
                "La cédula no es válida. Revisa sus 10 dígitos y el dígito verificador."
            );
            valido = false;
        } else {
            establecerCorrecto("cedulaRegistro");
        }

        if (!telefono) {
            establecerError("telefonoRegistro", "Ingresa tu número de teléfono.");
            valido = false;
        } else if (!validarTelefono(telefono)) {
            establecerError(
                "telefonoRegistro",
                "El teléfono debe tener 10 dígitos y comenzar con 09."
            );
            valido = false;
        } else {
            establecerCorrecto("telefonoRegistro");
        }

        if (!correo) {
            establecerError("correoRegistro", "Ingresa tu correo electrónico.");
            valido = false;
        } else if (!validarCorreo(correo)) {
            establecerError("correoRegistro", "Ingresa un correo electrónico válido.");
            valido = false;
        } else {
            establecerCorrecto("correoRegistro");
        }

        if (!username) {
            establecerError("usuarioRegistro", "Ingresa un nombre de usuario.");
            valido = false;
        } else if (!validarUsuario(username)) {
            establecerError(
                "usuarioRegistro",
                "El usuario debe tener entre 4 y 20 caracteres: letras, números o guion bajo."
            );
            valido = false;
        } else {
            establecerCorrecto("usuarioRegistro");
        }

        if (!password) {
            establecerError("contrasenaRegistro", "Ingresa una contraseña.");
            valido = false;
        } else if (!validarContrasena(password)) {
            establecerError(
                "contrasenaRegistro",
                "La contraseña debe tener entre 4 y 30 caracteres."
            );
            valido = false;
        } else {
            establecerCorrecto("contrasenaRegistro");
        }

        if (!confirmar) {
            establecerError(
                "confirmarContrasena",
                "Confirma tu contraseña."
            );
            valido = false;
        } else if (confirmar !== password) {
            establecerError(
                "confirmarContrasena",
                "Las contraseñas no coinciden."
            );
            valido = false;
        } else {
            establecerCorrecto("confirmarContrasena");
        }

        if (!terminos || !terminos.checked) {
            if (terminos) {
                establecerError(
                    "aceptaTerminos",
                    "Debes aceptar los términos y condiciones."
                );
            }

            valido = false;
        }

        if (valido) {
            const usuarioExiste = Object.values(usuarios).find(
                usuario => usuario.username.toLowerCase() === username.toLowerCase()
            );

            const cedulaExiste = Object.values(usuarios).find(
                usuario => usuario.cedula === cedula
            );

            const correoExiste = Object.values(usuarios).find(
                usuario => usuario.correo.toLowerCase() === correo
            );

            if (usuarioExiste) {
                establecerError(
                    "usuarioRegistro",
                    "Este nombre de usuario ya está registrado."
                );
                valido = false;
            }

            if (cedulaExiste) {
                establecerError(
                    "cedulaRegistro",
                    "Esta cédula ya se encuentra registrada."
                );
                valido = false;
            }

            if (correoExiste) {
                establecerError(
                    "correoRegistro",
                    "Este correo electrónico ya está registrado."
                );
                valido = false;
            }
        }

        if (!valido) {
            mostrarAlerta(
                "warning",
                "Revisa el formulario",
                "Corrige los campos señalados antes de continuar."
            );
            return;
        }

        usuarios[username] = {
            username,
            password,
            nombre,
            cedula,
            telefono,
            correo,
            rol: "cliente"
        };

        guardarUsuarios();

        await mostrarAlerta(
            "success",
            "Registro exitoso",
            "Tu cuenta ha sido creada. Ahora puedes iniciar sesión."
        );

        window.location.href = "login.html";
    });
}

/* =========================================================
   7. INICIO DE SESIÓN
========================================================= */

function inicializarLogin() {
    const formulario = obtenerElemento("formLogin");

    if (!formulario) return;

    formulario.addEventListener("submit", async evento => {
        evento.preventDefault();
        limpiarValidaciones(formulario);

        const username = obtenerValor("usuario");
        const password = obtenerValor("contrasena");

        let valido = true;

        if (!username) {
            establecerError("usuario", "Ingresa tu nombre de usuario.");
            valido = false;
        }

        if (!password) {
            establecerError("contrasena", "Ingresa tu contraseña.");
            valido = false;
        }

        if (!valido) {
            mostrarAlerta(
                "warning",
                "Campos incompletos",
                "Debes ingresar usuario y contraseña."
            );
            return;
        }

        const usuarioEncontrado = Object.values(usuarios).find(
            usuario =>
                usuario.username.toLowerCase() === username.toLowerCase()
        );

        if (!usuarioEncontrado ||
            usuarioEncontrado.password !== password) {
            establecerError(
                "usuario",
                "Usuario o contraseña incorrectos."
            );

            establecerError(
                "contrasena",
                "Verifica tus credenciales."
            );

            mostrarAlerta(
                "error",
                "Inicio de sesión fallido",
                "El usuario o la contraseña son incorrectos."
            );

            return;
        }

        if (usuarioEncontrado.activo === false) {
            mostrarAlerta(
                "error",
                "Cuenta deshabilitada",
                "Tu cuenta está deshabilitada. Comunícate con el taller."
            );
            return;
        }

        iniciarSesion(usuarioEncontrado.username);

        await mostrarAlerta(
            "success",
            "Bienvenido",
            "Has iniciado sesión correctamente."
        );

        if (usuarioEncontrado.rol === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "dashboard.html";
        }
    });
}

/* =========================================================
   8. ACTUALIZAR MODELOS SEGÚN LA MARCA
========================================================= */

function actualizarModelos(idMarca, idModelo) {
    const marca = obtenerElemento(idMarca);
    const modelo = obtenerElemento(idModelo);

    if (!marca || !modelo) return;

    const cargar = () => {
        const marcaSeleccionada = marca.value;

        modelo.innerHTML = '<option value="">Selecciona un modelo</option>';

        const modelos = MODELOS_POR_MARCA[marcaSeleccionada] || [];

        modelos.forEach(nombreModelo => {
            const opcion = document.createElement("option");
            opcion.value = nombreModelo;
            opcion.textContent = nombreModelo;
            modelo.appendChild(opcion);
        });
    };

    marca.addEventListener("change", cargar);
    cargar();
}

/* =========================================================
   9. VALIDAR FORMULARIO DE SOLICITUD
========================================================= */


function validarDatosSolicitud(datos, prefijo = "", fechaOriginal = "") {
    const ids = prefijo === "admin"
        ? {
            Nombre: "adminNombre",
            Cedula: "adminCedula",
            Telefono: "adminTelefono",
            Correo: "adminCorreo",
            Marca: "adminMarca",
            Modelo: "adminModelo",
            Placa: "adminPlaca",
            Anio: "adminAnio",
            Kilometraje: "adminKilometraje",
            Servicio: "adminServicio",
            Fecha: "adminFecha",
            Hora: "adminHora",
            Descripcion: "adminDescripcion",
            AceptaCondiciones: "adminAceptaCondiciones"
        }
        : {
            Nombre: "nombreCliente",
            Cedula: "cedula",
            Telefono: "telefono",
            Correo: "correo",
            Marca: "marca",
            Modelo: "modelo",
            Placa: "placa",
            Anio: "anio",
            Kilometraje: "kilometraje",
            Servicio: "servicio",
            Fecha: "fecha",
            Hora: "hora",
            Descripcion: "descripcion",
            AceptaCondiciones: "aceptaCondiciones"
        };

    let valido = true;

    function error(campo, mensaje) {
        establecerError(ids[campo], mensaje);
        valido = false;
    }

    function correcto(campo) {
        establecerCorrecto(ids[campo]);
    }

    Object.values(ids).forEach(id => {
        const elemento = obtenerElemento(id);
        if (elemento) {
            elemento.classList.remove("is-invalid", "is-valid");
        }
    });

    if (!datos.nombre) {
        error("Nombre", "Ingresa el nombre del cliente.");
    } else if (!validarNombre(datos.nombre)) {
        error("Nombre", "Ingresa un nombre válido de 3 a 60 caracteres.");
    } else correcto("Nombre");

    if (!datos.cedula) {
        error("Cedula", "Ingresa la cédula del cliente.");
    } else if (!validarCedula(datos.cedula)) {
        error("Cedula", "La cédula ecuatoriana no es válida.");
    } else correcto("Cedula");

    if (!datos.telefono) {
        error("Telefono", "Ingresa el teléfono del cliente.");
    } else if (!validarTelefono(datos.telefono)) {
        error("Telefono", "Debe tener 10 dígitos y comenzar con 09.");
    } else correcto("Telefono");

    if (!datos.correo) {
        error("Correo", "Ingresa el correo electrónico.");
    } else if (!validarCorreo(datos.correo)) {
        error("Correo", "Ingresa un correo electrónico válido.");
    } else correcto("Correo");

    if (!datos.marca) {
        error("Marca", "Selecciona la marca del vehículo.");
    } else if (!marcaValida(datos.marca)) {
        error("Marca", "Selecciona una marca de la lista.");
    } else correcto("Marca");

    if (!datos.modelo) {
        error("Modelo", "Selecciona el modelo del vehículo.");
    } else if (!modeloValido(datos.marca, datos.modelo)) {
        error("Modelo", "El modelo no corresponde a la marca seleccionada.");
    } else correcto("Modelo");

    if (!datos.placa) {
        error("Placa", "Ingresa la placa del vehículo.");
    } else if (!validarPlaca(datos.placa)) {
        error("Placa", "Formato válido: ABC123 o ABC1234.");
    } else correcto("Placa");

    if (!datos.anio) {
        error("Anio", "Ingresa el año del vehículo.");
    } else if (!validarAnio(datos.anio)) {
        error("Anio", `El año debe estar entre 1950 y ${new Date().getFullYear()}.`);
    } else correcto("Anio");

    if (datos.kilometraje === "") {
        error("Kilometraje", "Ingresa el kilometraje.");
    } else if (!validarKilometraje(datos.kilometraje)) {
        error("Kilometraje", "Ingresa un kilometraje válido entre 0 y 2.000.000.");
    } else correcto("Kilometraje");

    if (!datos.servicio) {
        error("Servicio", "Selecciona el servicio que necesitas.");
    } else if (!servicioValido(datos.servicio)) {
        error("Servicio", "Selecciona un servicio de la lista.");
    } else correcto("Servicio");

    if (!datos.fecha) {
        error("Fecha", "Selecciona la fecha de atención.");
    } else if (datos.fecha !== fechaOriginal && !validarFecha(datos.fecha)) {
        error("Fecha", "La fecha debe estar entre hoy y los próximos 90 días.");
    } else correcto("Fecha");

    if (!datos.hora) {
        error("Hora", "Selecciona una hora.");
    } else if (!validarHora(datos.hora, datos.fecha)) {
        error("Hora", "Horario de 08:00 a 17:59. Si es para hoy, la hora no puede haber pasado.");
    } else correcto("Hora");

    const errorModalidad = obtenerElemento(
        prefijo === "admin" ? "errorAdminModalidad" : "errorModalidad"
    );

    if (!datos.modalidad ||
        !["Presencial", "Domicilio"].includes(datos.modalidad)) {
        if (errorModalidad) {
            errorModalidad.textContent = "Selecciona una modalidad válida.";
            errorModalidad.classList.add("d-block");
        }
        valido = false;
    } else if (errorModalidad) {
        errorModalidad.textContent = "";
        errorModalidad.classList.remove("d-block");
    }

    if (!datos.descripcion) {
        error("Descripcion", "Describe el problema del vehículo.");
    } else if (!validarDescripcion(datos.descripcion)) {
        error("Descripcion", "La descripción debe tener entre 10 y 300 caracteres.");
    } else correcto("Descripcion");

    if (!datos.aceptaCondiciones) {
        error("AceptaCondiciones", "Debes aceptar las condiciones.");
    }

    return valido;
}


/* =========================================================
   10. OBTENER DATOS DEL FORMULARIO
========================================================= */


function obtenerDatosFormulario(prefijo = "") {
    const ids = prefijo === "admin"
        ? {
            nombre: "adminNombre",
            cedula: "adminCedula",
            telefono: "adminTelefono",
            correo: "adminCorreo",
            marca: "adminMarca",
            modelo: "adminModelo",
            placa: "adminPlaca",
            anio: "adminAnio",
            kilometraje: "adminKilometraje",
            servicio: "adminServicio",
            fecha: "adminFecha",
            hora: "adminHora",
            descripcion: "adminDescripcion",
            condiciones: "adminAceptaCondiciones",
            modalidad: "adminModalidad",
            extras: "adminExtras"
        }
        : {
            nombre: "nombreCliente",
            cedula: "cedula",
            telefono: "telefono",
            correo: "correo",
            marca: "marca",
            modelo: "modelo",
            placa: "placa",
            anio: "anio",
            kilometraje: "kilometraje",
            servicio: "servicio",
            fecha: "fecha",
            hora: "hora",
            descripcion: "descripcion",
            condiciones: "aceptaCondiciones",
            modalidad: "modalidad",
            extras: "extras"
        };

    const radio = document.querySelector(
        `input[name="${ids.modalidad}"]:checked`
    );

    return {
        nombre: obtenerValor(ids.nombre),
        cedula: obtenerValor(ids.cedula),
        telefono: obtenerValor(ids.telefono),
        correo: obtenerValor(ids.correo).toLowerCase(),
        marca: obtenerValor(ids.marca),
        modelo: obtenerValor(ids.modelo),
        placa: normalizarPlaca(obtenerValor(ids.placa)),
        anio: obtenerValor(ids.anio),
        kilometraje: obtenerValor(ids.kilometraje),
        servicio: obtenerValor(ids.servicio),
        fecha: obtenerValor(ids.fecha),
        hora: obtenerValor(ids.hora),
        modalidad: radio ? radio.value : "",
        extras: [...document.querySelectorAll(
            `input[name="${ids.extras}"]:checked`
        )]
            .map(casilla => casilla.value)
            .filter(valor => EXTRAS.includes(valor)),
        descripcion: obtenerValor(ids.descripcion),
        aceptaCondiciones: Boolean(
            obtenerElemento(ids.condiciones)?.checked
        )
    };
}


/* =========================================================
   11. CREAR SOLICITUD DEL CLIENTE
========================================================= */

function inicializarSolicitud() {
    const formulario = obtenerElemento("formSolicitud");

    if (!formulario) return;

    if (!exigirRol("cliente")) return;

    actualizarModelos("marca", "modelo");

    /* El cliente solo registra solicitudes para sí mismo:
       se cargan sus datos de perfil y no se pueden cambiar. */
    const sesionCliente = obtenerSesion();
    const camposPerfil = {
        nombreCliente: "nombre",
        cedula: "cedula",
        telefono: "telefono",
        correo: "correo"
    };

    Object.entries(camposPerfil).forEach(([idCampo, propiedad]) => {
        const campo = obtenerElemento(idCampo);

        if (campo) {
            campo.value = sesionCliente[propiedad];
            campo.readOnly = true;
        }
    });

    const fecha = obtenerElemento("fecha");

    if (fecha) {
        fecha.min = obtenerFechaActual();
        fecha.max = obtenerFechaMaxima();
    }

    formulario.addEventListener("submit", async evento => {
        evento.preventDefault();

        const datos = obtenerDatosFormulario();

        if (!validarDatosSolicitud(datos)) {
            mostrarAlerta(
                "warning",
                "Solicitud incompleta",
                "Revisa los campos señalados antes de enviar."
            );
            return;
        }

        const sesion = obtenerSesion();

        const nuevaSolicitud = {
            id: generarId(),
            username: sesion.username,
            nombre: datos.nombre,
            cedula: datos.cedula,
            telefono: datos.telefono,
            correo: datos.correo,
            marca: datos.marca,
            modelo: datos.modelo,
            placa: datos.placa,
            anio: Number(datos.anio),
            kilometraje: Number(datos.kilometraje.replace(/\./g, "")),
            servicio: datos.servicio,
            fecha: datos.fecha,
            hora: datos.hora,
            modalidad: datos.modalidad,
            extras: datos.extras,
            descripcion: datos.descripcion,
            estado: "Pendiente",
            fechaRegistro: new Date().toISOString()
        };

        solicitudes.push(nuevaSolicitud);
        guardarSolicitudes();

        await mostrarAlerta(
            "success",
            "Solicitud registrada",
            "Tu solicitud se ha enviado correctamente."
        );

        window.location.href = "dashboard.html";
    });
}

/* =========================================================
   12. PANEL DEL CLIENTE
========================================================= */

function inicializarDashboard() {
    const tabla = obtenerElemento("tablaSolicitudes");

    if (!tabla) return;

    if (!exigirRol("cliente")) return;

    const sesion = obtenerSesion();

    mostrarPerfil(sesion);

    const misSolicitudes = solicitudes.filter(
        solicitud => solicitud.username === sesion.username
    );

    const pendientes = misSolicitudes.filter(
        solicitud => solicitud.estado === "Pendiente"
    );

    const completadas = misSolicitudes.filter(
        solicitud => solicitud.estado === "Completada"
    );

    if (obtenerElemento("totalSolicitudes")) {
        obtenerElemento("totalSolicitudes").textContent =
            misSolicitudes.length;
    }

    if (obtenerElemento("totalPendientes")) {
        obtenerElemento("totalPendientes").textContent =
            pendientes.length;
    }

    if (obtenerElemento("totalCompletadas")) {
        obtenerElemento("totalCompletadas").textContent =
            completadas.length;
    }

    tabla.innerHTML = "";

    if (misSolicitudes.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    Todavía no tienes solicitudes registradas.
                </td>
            </tr>
        `;
        return;
    }

    misSolicitudes.forEach(solicitud => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${escaparHTML(solicitud.id)}</td>
            <td>${escaparHTML(solicitud.servicio)}</td>
            <td>${escaparHTML(solicitud.marca)} ${escaparHTML(solicitud.modelo)}</td>
            <td>${escaparHTML(solicitud.placa)}</td>
            <td>${escaparHTML(solicitud.fecha)}</td>
            <td>${escaparHTML(solicitud.hora)}</td>
            <td>${crearEtiquetaEstado(solicitud.estado)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary"
                    type="button"
                    onclick="verDetalleSolicitud('${escaparHTML(solicitud.id)}')">
                    Ver
                </button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

function mostrarPerfil(sesion) {
    const campos = {
        perfilNombre: sesion.nombre,
        perfilUsuario: sesion.username,
        perfilCedula: sesion.cedula,
        perfilTelefono: sesion.telefono,
        perfilCorreo: sesion.correo,
        perfilRol: sesion.rol === "admin" ? "Administrador" : "Cliente"
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const elemento = obtenerElemento(id);

        if (elemento) elemento.textContent = valor;
    });
}

function crearEtiquetaEstado(estado) {
    const clases = {
        "Pendiente": "bg-warning text-dark",
        "En revisión": "bg-info text-dark",
        "En proceso": "bg-primary",
        "Completada": "bg-success",
        "Cancelada": "bg-danger"
    };

    const clase = clases[estado] || "bg-secondary";

    return `<span class="badge ${clase}">${escaparHTML(estado)}</span>`;
}

async function verDetalleSolicitud(id) {
    const solicitud = solicitudes.find(item => item.id === id);

    if (!solicitud) {
        mostrarAlerta("error", "No encontrada", "La solicitud ya no existe.");
        return;
    }

    const sesion = obtenerSesion();

    if (!sesion ||
        (sesion.rol !== "admin" && solicitud.username !== sesion.username)) {
        mostrarAlerta(
            "error",
            "Acceso denegado",
            "Solo puedes consultar tus propias solicitudes."
        );
        return;
    }

    const contenido = `
        <div class="text-start">
            <p><strong>Código:</strong> ${escaparHTML(solicitud.id)}</p>
            <p><strong>Cliente:</strong> ${escaparHTML(solicitud.nombre)}</p>
            <p><strong>Cédula:</strong> ${escaparHTML(solicitud.cedula)}</p>
            <p><strong>Teléfono:</strong> ${escaparHTML(solicitud.telefono)}</p>
            <p><strong>Correo:</strong> ${escaparHTML(solicitud.correo)}</p>
            <p><strong>Vehículo:</strong> ${escaparHTML(solicitud.marca)} ${escaparHTML(solicitud.modelo)}</p>
            <p><strong>Placa:</strong> ${escaparHTML(solicitud.placa)}</p>
            <p><strong>Año:</strong> ${escaparHTML(solicitud.anio)}</p>
            <p><strong>Kilometraje:</strong> ${escaparHTML(solicitud.kilometraje)}</p>
            <p><strong>Servicio:</strong> ${escaparHTML(solicitud.servicio)}</p>
            <p><strong>Fecha:</strong> ${escaparHTML(solicitud.fecha)}</p>
            <p><strong>Hora:</strong> ${escaparHTML(solicitud.hora)}</p>
            <p><strong>Modalidad:</strong> ${escaparHTML(solicitud.modalidad)}</p>
            <p><strong>Servicios adicionales:</strong> ${escaparHTML((solicitud.extras || []).join(", ") || "Ninguno")}</p>
            <p><strong>Estado:</strong> ${escaparHTML(solicitud.estado)}</p>
            <p><strong>Descripción:</strong> ${escaparHTML(solicitud.descripcion)}</p>
        </div>
    `;

    if (window.Swal) {
        Swal.fire({
            title: "Detalle de solicitud",
            html: contenido,
            confirmButtonText: "Cerrar",
            confirmButtonColor: "#0d6efd",
            width: 650
        });
    } else {
        mostrarAlerta("info", "Detalle de solicitud", solicitud.id);
    }
}

/* =========================================================
   13. PANEL ADMINISTRATIVO
========================================================= */

function inicializarAdmin() {
    const tabla = obtenerElemento("tablaAdmin");

    if (!tabla) return;

    if (!exigirRol("admin")) return;

    actualizarModelos("adminMarca", "adminModelo");

    const fecha = obtenerElemento("adminFecha");

    if (fecha) {
        fecha.min = obtenerFechaActual();
        fecha.max = obtenerFechaMaxima();
    }

    const buscar = obtenerElemento("buscarSolicitud");
    const filtro = obtenerElemento("filtrarEstado");

    if (buscar) {
        buscar.addEventListener("input", renderizarAdmin);
    }

    if (filtro) {
        filtro.addEventListener("change", renderizarAdmin);
    }

    const botonNueva = obtenerElemento("btnNuevaSolicitudAdmin");

    if (botonNueva) {
        botonNueva.addEventListener("click", abrirModalAdmin);
    }

    const formulario = obtenerElemento("formSolicitudAdmin");

    if (formulario) {
        if (!obtenerElemento("adminIdEdicion")) {
            const oculto = document.createElement("input");
            oculto.type = "hidden";
            oculto.id = "adminIdEdicion";
            formulario.appendChild(oculto);
        }

        formulario.addEventListener("submit", guardarSolicitudAdmin);
    }

    llenarCuentasAdmin();
    renderizarCuentas();

    const selectCuenta = obtenerElemento("adminCliente");

    if (selectCuenta) {
        selectCuenta.addEventListener("change", autocompletarDesdeCuenta);
    }

    mostrarPerfil(obtenerSesion());

    renderizarAdmin();
}

/*
   El administrador elige la cuenta a la que pertenece la solicitud:
   la suya o la de cualquier cliente. Así el cliente la ve en su panel.
*/
function llenarCuentasAdmin() {
    const select = obtenerElemento("adminCliente");

    if (!select) return;

    select.innerHTML = Object.values(usuarios)
        .map(cuenta => {
            const etiqueta = cuenta.rol === "admin"
                ? `${cuenta.nombre} (administrador, propia)`
                : `${cuenta.nombre} (${cuenta.username})` +
                  (cuenta.activo === false ? " - deshabilitada" : "");

            return `<option value="${escaparHTML(cuenta.username)}">${escaparHTML(etiqueta)}</option>`;
        })
        .join("");
}

function autocompletarDesdeCuenta() {
    const select = obtenerElemento("adminCliente");

    if (!select) return;

    const cuenta = usuarios[select.value];

    if (!cuenta) return;

    const campos = {
        adminNombre: cuenta.nombre,
        adminCedula: cuenta.cedula,
        adminTelefono: cuenta.telefono,
        adminCorreo: cuenta.correo
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const elemento = obtenerElemento(id);

        if (elemento) elemento.value = valor;
    });
}

/* =========================================================
   CUENTAS DE USUARIO: HABILITAR / DESHABILITAR
   Solo el administrador puede cambiar el campo "activo".
========================================================= */

function renderizarCuentas() {
    const tabla = obtenerElemento("tablaCuentas");

    if (!tabla) return;

    tabla.innerHTML = "";

    Object.values(usuarios).forEach(cuenta => {
        const habilitada = cuenta.activo !== false;
        const esAdminCuenta = cuenta.rol === "admin";

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${escaparHTML(cuenta.username)}</td>
            <td>${escaparHTML(cuenta.nombre)}</td>
            <td>${esAdminCuenta ? "Administrador" : "Cliente"}</td>
            <td>
                <span class="badge ${habilitada ? "bg-success" : "bg-danger"}">
                    ${habilitada ? "Habilitada" : "Deshabilitada"}
                </span>
            </td>
            <td>
                ${esAdminCuenta
                    ? '<span class="text-secondary small">No se puede deshabilitar</span>'
                    : `<button class="btn btn-sm ${habilitada ? "btn-outline-danger" : "btn-outline-success"}"
                           type="button"
                           onclick="cambiarEstadoCuenta('${escaparHTML(cuenta.username)}')">
                           ${habilitada ? "Deshabilitar" : "Habilitar"}
                       </button>`}
            </td>
        `;

        tabla.appendChild(fila);
    });
}

async function cambiarEstadoCuenta(username) {
    if (!exigirRol("admin")) return;

    const cuenta = usuarios[username];

    if (!cuenta || cuenta.rol === "admin") {
        mostrarAlerta("error", "Cuenta no válida");
        return;
    }

    const habilitada = cuenta.activo !== false;

    const confirmado = await confirmarAccion(
        habilitada ? "¿Deshabilitar cuenta?" : "¿Habilitar cuenta?",
        habilitada
            ? `${cuenta.nombre} ya no podrá iniciar sesión.`
            : `${cuenta.nombre} podrá iniciar sesión nuevamente.`
    );

    if (!confirmado) return;

    cuenta.activo = !habilitada;

    guardarUsuarios();
    renderizarCuentas();
    llenarCuentasAdmin();

    mostrarAlerta(
        "success",
        habilitada ? "Cuenta deshabilitada" : "Cuenta habilitada",
        `La cuenta de ${cuenta.nombre} quedó ${habilitada ? "deshabilitada" : "habilitada"}.`
    );
}

function renderizarAdmin() {
    const tabla = obtenerElemento("tablaAdmin");

    if (!tabla) return;

    const texto = obtenerValor("buscarSolicitud").toLowerCase();
    const estado = obtenerValor("filtrarEstado");

    const solicitudesFiltradas = solicitudes.filter(solicitud => {
        const coincideTexto = [
            solicitud.id,
            solicitud.nombre,
            solicitud.cedula,
            solicitud.placa,
            solicitud.servicio,
            solicitud.username
        ].some(valor =>
            String(valor ?? "").toLowerCase().includes(texto)
        );

        const coincideEstado =
            !estado || solicitud.estado === estado;

        return coincideTexto && coincideEstado;
    });

    const pendientes = solicitudes.filter(
        solicitud => solicitud.estado === "Pendiente"
    ).length;

    const proceso = solicitudes.filter(
        solicitud => solicitud.estado === "En proceso"
    ).length;

    const completadas = solicitudes.filter(
        solicitud => solicitud.estado === "Completada"
    ).length;

    if (obtenerElemento("adminTotal")) {
        obtenerElemento("adminTotal").textContent = solicitudes.length;
    }

    if (obtenerElemento("adminPendientes")) {
        obtenerElemento("adminPendientes").textContent = pendientes;
    }

    if (obtenerElemento("adminProceso")) {
        obtenerElemento("adminProceso").textContent = proceso;
    }

    if (obtenerElemento("adminCompletadas")) {
        obtenerElemento("adminCompletadas").textContent = completadas;
    }

    tabla.innerHTML = "";

    if (solicitudesFiltradas.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">
                    No se encontraron solicitudes.
                </td>
            </tr>
        `;
        return;
    }

    solicitudesFiltradas.forEach(solicitud => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${escaparHTML(solicitud.id)}</td>
            <td>${escaparHTML(solicitud.nombre)}</td>
            <td>${escaparHTML(solicitud.cedula)}</td>
            <td>${escaparHTML(solicitud.placa)}</td>
            <td>${escaparHTML(solicitud.servicio)}</td>
            <td>${escaparHTML(solicitud.fecha)}</td>
            <td>${crearEtiquetaEstado(solicitud.estado)}</td>
            <td>
                <select class="form-select form-select-sm"
                    aria-label="Cambiar estado"
                    onchange="cambiarEstadoSolicitud('${escaparHTML(solicitud.id)}', this.value)">
                    ${ESTADOS.map(estado => `
                        <option value="${escaparHTML(estado)}"
                            ${solicitud.estado === estado ? "selected" : ""}>
                            ${escaparHTML(estado)}
                        </option>
                    `).join("")}
                </select>
            </td>
            <td>
                <div class="d-flex gap-1 flex-wrap">
                    <button class="btn btn-sm btn-outline-info"
                        type="button"
                        onclick="verDetalleSolicitud('${escaparHTML(solicitud.id)}')">
                        Ver
                    </button>

                    <button class="btn btn-sm btn-outline-primary"
                        type="button"
                        onclick="editarSolicitudAdmin('${escaparHTML(solicitud.id)}')">
                        Editar
                    </button>

                    <button class="btn btn-sm btn-outline-danger"
                        type="button"
                        onclick="eliminarSolicitudAdmin('${escaparHTML(solicitud.id)}')">
                        Eliminar
                    </button>
                </div>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

/* =========================================================
   14. CREAR SOLICITUD DESDE ADMINISTRADOR
========================================================= */

function abrirModalAdmin() {
    const formulario = obtenerElemento("formSolicitudAdmin");

    if (formulario) {
        formulario.reset();
        limpiarValidaciones(formulario);
    }

    const titulo = document.querySelector(
        "#modalSolicitudAdmin .modal-title"
    );

    if (titulo) {
        titulo.textContent = "Crear nueva solicitud";
    }

    const idEdicion = obtenerElemento("adminIdEdicion");

    if (idEdicion) idEdicion.value = "";

    autocompletarDesdeCuenta();

    const modalElemento = obtenerElemento("modalSolicitudAdmin");

    if (modalElemento && window.bootstrap) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalElemento);
        modal.show();
    } else {
        mostrarAlerta(
            "error",
            "No se pudo abrir el formulario",
            "Verifica que Bootstrap JavaScript esté cargado."
        );
    }
}

async function guardarSolicitudAdmin(evento) {
    evento.preventDefault();

    if (!exigirRol("admin")) return;

    const datos = obtenerDatosFormulario("admin");
    const idEdicion = obtenerElemento("adminIdEdicion")?.value || "";
    const solicitudOriginal = solicitudes.find(item => item.id === idEdicion);

    if (!validarDatosSolicitud(
        datos,
        "admin",
        solicitudOriginal ? solicitudOriginal.fecha : ""
    )) {
        mostrarAlerta(
            "warning",
            "Datos incorrectos",
            "Revisa los campos del formulario administrativo."
        );
        return;
    }

    /* Cuenta a la que pertenece la solicitud (la del admin o la de un cliente). */
    const cuentaDestino = usuarios[obtenerValor("adminCliente")];

    if (!cuentaDestino ||
        (!idEdicion && cuentaDestino.activo === false)) {
        establecerError(
            "adminCliente",
            "Selecciona una cuenta activa para la solicitud."
        );
        mostrarAlerta(
            "warning",
            "Cuenta no válida",
            "Selecciona una cuenta activa para registrar la solicitud."
        );
        return;
    }

    if (idEdicion) {
        const solicitud = solicitudes.find(item => item.id === idEdicion);

        if (!solicitud) {
            mostrarAlerta("error", "Solicitud no encontrada");
            return;
        }

        Object.assign(solicitud, {
            username: cuentaDestino.username,
            nombre: datos.nombre,
            cedula: datos.cedula,
            telefono: datos.telefono,
            correo: datos.correo,
            marca: datos.marca,
            modelo: datos.modelo,
            placa: datos.placa,
            anio: Number(datos.anio),
            kilometraje: Number(datos.kilometraje.replace(/\./g, "")),
            servicio: datos.servicio,
            fecha: datos.fecha,
            hora: datos.hora,
            modalidad: datos.modalidad,
            extras: datos.extras,
            descripcion: datos.descripcion
        });

        guardarSolicitudes();

        await mostrarAlerta(
            "success",
            "Solicitud actualizada",
            "Los cambios se guardaron correctamente."
        );
    } else {
        const nuevaSolicitud = {
            id: generarId(),
            username: cuentaDestino.username,
            nombre: datos.nombre,
            cedula: datos.cedula,
            telefono: datos.telefono,
            correo: datos.correo,
            marca: datos.marca,
            modelo: datos.modelo,
            placa: datos.placa,
            anio: Number(datos.anio),
            kilometraje: Number(datos.kilometraje.replace(/\./g, "")),
            servicio: datos.servicio,
            fecha: datos.fecha,
            hora: datos.hora,
            modalidad: datos.modalidad,
            extras: datos.extras,
            descripcion: datos.descripcion,
            estado: "Pendiente",
            fechaRegistro: new Date().toISOString()
        };

        solicitudes.push(nuevaSolicitud);
        guardarSolicitudes();

        await mostrarAlerta(
            "success",
            "Solicitud creada",
            `La solicitud quedó asociada a la cuenta de ${cuentaDestino.nombre}.`
        );
    }

    const modalElemento = obtenerElemento("modalSolicitudAdmin");

    if (modalElemento && window.bootstrap) {
        const modal = bootstrap.Modal.getInstance(modalElemento);

        if (modal) modal.hide();
    }

    renderizarAdmin();
}

/* =========================================================
   15. EDITAR SOLICITUD
========================================================= */

function editarSolicitudAdmin(id) {
    if (!exigirRol("admin")) return;

    const solicitud = solicitudes.find(item => item.id === id);

    if (!solicitud) {
        mostrarAlerta("error", "Solicitud no encontrada");
        return;
    }

    abrirModalAdmin();

    const asignaciones = {
        adminCliente: solicitud.username,
        adminNombre: solicitud.nombre,
        adminCedula: solicitud.cedula,
        adminTelefono: solicitud.telefono,
        adminCorreo: solicitud.correo,
        adminMarca: solicitud.marca,
        adminPlaca: solicitud.placa,
        adminAnio: solicitud.anio,
        adminKilometraje: solicitud.kilometraje,
        adminServicio: solicitud.servicio,
        adminFecha: solicitud.fecha,
        adminHora: solicitud.hora,
        adminDescripcion: solicitud.descripcion
    };

    Object.entries(asignaciones).forEach(([idCampo, valor]) => {
        const elemento = obtenerElemento(idCampo);

        if (elemento) elemento.value = valor;
    });

    const marca = obtenerElemento("adminMarca");
    const modelo = obtenerElemento("adminModelo");

    if (marca && modelo) {
        marca.dispatchEvent(new Event("change"));

        setTimeout(() => {
            modelo.value = solicitud.modelo;
        }, 0);
    }

    const radio = document.querySelector(
        `input[name="adminModalidad"][value="${solicitud.modalidad}"]`
    );

    if (radio) radio.checked = true;

    document.querySelectorAll('input[name="adminExtras"]').forEach(casilla => {
        casilla.checked = (solicitud.extras || []).includes(casilla.value);
    });

    const condiciones = obtenerElemento("adminAceptaCondiciones");

    if (condiciones) condiciones.checked = true;

    const idEdicion = obtenerElemento("adminIdEdicion");

    if (idEdicion) idEdicion.value = solicitud.id;

    const titulo = document.querySelector(
        "#modalSolicitudAdmin .modal-title"
    );

    if (titulo) titulo.textContent = "Editar solicitud";
}

/* =========================================================
   16. CAMBIAR ESTADO
========================================================= */

async function cambiarEstadoSolicitud(id, nuevoEstado) {
    if (!exigirRol("admin")) return;

    if (!ESTADOS.includes(nuevoEstado)) {
        mostrarAlerta("error", "Estado no válido");
        renderizarAdmin();
        return;
    }

    const solicitud = solicitudes.find(item => item.id === id);

    if (!solicitud) {
        mostrarAlerta("error", "Solicitud no encontrada");
        return;
    }

    solicitud.estado = nuevoEstado;

    guardarSolicitudes();
    renderizarAdmin();

    await mostrarAlerta(
        "success",
        "Estado actualizado",
        `La solicitud ahora está: ${nuevoEstado}.`
    );
}

/* =========================================================
   17. ELIMINAR SOLICITUD
========================================================= */

async function eliminarSolicitudAdmin(id) {
    if (!exigirRol("admin")) return;

    const solicitud = solicitudes.find(item => item.id === id);

    if (!solicitud) {
        mostrarAlerta("error", "Solicitud no encontrada");
        return;
    }

    const confirmado = await confirmarAccion(
        "¿Eliminar solicitud?",
        "Esta acción no se puede deshacer."
    );

    if (!confirmado) return;

    solicitudes = solicitudes.filter(
        item => item.id !== id
    );

    guardarSolicitudes();
    renderizarAdmin();

    mostrarAlerta(
        "success",
        "Solicitud eliminada",
        "El registro se eliminó correctamente."
    );
}

/* =========================================================
   18. CERRAR SESIÓN Y MOSTRAR USUARIO
========================================================= */

function inicializarSesionVisual() {
    const sesion = obtenerSesion();

    const nombreElementos = document.querySelectorAll(
        "[data-usuario-nombre]"
    );

    nombreElementos.forEach(elemento => {
        elemento.textContent = sesion ? sesion.nombre : "";
    });

    const botonesCerrar = document.querySelectorAll(
        "[data-cerrar-sesion]"
    );

    botonesCerrar.forEach(boton => {
        boton.addEventListener("click", evento => {
            evento.preventDefault();

            confirmarAccion(
                "¿Cerrar sesión?",
                "¿Estás seguro de que deseas salir de AutoCare?"
            ).then(confirmado => {
                if (confirmado) {
                    cerrarSesion();
                }
            });
        });
    });
}

/* =========================================================
   19. VALIDACIÓN EN TIEMPO REAL
========================================================= */

function activarValidacionAlEscribir() {
    document.querySelectorAll("input, select, textarea")
        .forEach(elemento => {
            elemento.addEventListener("input", () => {
                if (elemento.classList.contains("is-invalid")) {
                    elemento.classList.remove("is-invalid");
                }
            });

            elemento.addEventListener("change", () => {
                if (elemento.classList.contains("is-invalid")) {
                    elemento.classList.remove("is-invalid");
                }
            });
        });
}

/* =========================================================
   20. INICIALIZACIÓN GENERAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    construirMenu();
    inicializarRegistro();
    inicializarLogin();
    inicializarSolicitud();
    inicializarDashboard();
    inicializarAdmin();
    inicializarSesionVisual();
    activarValidacionAlEscribir();

    console.log("AutoCare iniciado correctamente.");
    console.log("Usuarios registrados:", Object.keys(usuarios).length);
    console.log("Solicitudes registradas:", solicitudes.length);
});
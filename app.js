// ===================================================================================
// ESTADO Y DATOS DE LA APLICACIÓN
// ===================================================================================
let listaCompras = {};
let categoriaLabels = {};

function setDefaultValues() {
    listaCompras = {
        frutas: [], lacteos: [], carnes: [], congelados: [],
        dulces: [], verduras: [], cereales: [], bebidas: [],
        limpieza: [], panificado: [], fiambreria: [], almacen: [],
        bazar: [], herboristeria: [], otros: [], notas: []
    };
    categoriaLabels = {
        frutas: '🍎 Frutas', lacteos: '🥛 Lácteos', carnes: '🥩 Carnes',
        congelados: '🧊 Congelados', dulces: '🍭 Dulces', verduras: '🥕 Verduras',
        cereales: '🌾 Cereales', bebidas: '🥤 Bebidas', limpieza: '🧽 Limpieza',
        panificado: '🍞 Panificado', fiambreria: '🥪 Fiambrería', almacen: '🏬 Almacén',
        bazar: '🍴 Bazar', herboristeria: '🌿 Herboristería', otros: '👀 Otros',
        notas: '📃 Notas Importantes'
    };
}

function cargarDatosGuardados() {
    try {
        const listaGuardada = localStorage.getItem('listaComprasInteligente');
        const labelsGuardados = localStorage.getItem('listaComprasLabels');

        if (listaGuardada && labelsGuardados) {
            listaCompras = JSON.parse(listaGuardada);
            categoriaLabels = JSON.parse(labelsGuardados);
        } else {
            setDefaultValues();
        }
    } catch (error) {
        console.error("Error al cargar datos de localStorage, se usarán valores por defecto:", error);
        setDefaultValues();
    }
}

function guardarDatos() {
    localStorage.setItem('listaComprasInteligente', JSON.stringify(listaCompras));
    localStorage.setItem('listaComprasLabels', JSON.stringify(categoriaLabels));
}

function hayElementosEnLista() {
    return Object.values(listaCompras).some(categoria => categoria.length > 0);
}

// ===================================================================================
// MANIPULACIÓN DEL DOM Y RENDERIZADO
// ===================================================================================

const app = document.getElementById('app');
const body = document.body;

/**
 * Limpia todo el contenido del contenedor principal de la aplicación.
 */
function limpiarApp() {
    app.innerHTML = '';
}

/**
 * Crea un botón estándar con texto, clases y un data-action.
 * @param {string} texto - El texto que mostrará el botón.
 * @param {string[]} clases - Un array de clases CSS para el botón.
 * @param {string} action - El valor para el atributo data-action.
 * @returns {HTMLButtonElement} El elemento botón creado.
 */
function crearBoton(texto, clases = [], action = '') {
    const boton = document.createElement('button');
    boton.textContent = texto;
    if (clases.length > 0) {
        boton.classList.add(...clases);
    }
    if (action) {
        boton.dataset.action = action;
    }
    return boton;
}

/**
 * Muestra el menú principal de la aplicación.
 */
function mostrarMenuPrincipal() {
    limpiarApp();

    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const questionText = document.createElement('div');
    questionText.className = 'question';
    questionText.textContent = '¿Deseas agregar un elemento a tu lista de compras?';

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const btnSi = crearBoton('Sí', [], 'iniciarAgregarElemento');
    const btnNo = crearBoton('Mostrar lista', ['no-button'], 'mostrarLista');

    buttonGroup.appendChild(btnSi);

    if (hayElementosEnLista()) {
        const btnEliminar = crearBoton('🗑️ Eliminar elemento', ['delete-button'], 'iniciarEliminarElemento'); // La dejaremos por ahora.
        // buttonGroup.appendChild(btnEliminar); // No lo agregamos aquí por ahora, ya que se eliminará desde la lista.
    }

    buttonGroup.appendChild(btnNo);

    questionSection.appendChild(questionText);
    questionSection.appendChild(buttonGroup);
    app.appendChild(questionSection);
}

/**
 * Muestra el formulario para agregar un nuevo elemento.
 */
function iniciarAgregarElemento() {
    limpiarApp();

    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const questionText = document.createElement('div');
    questionText.className = 'question';
    questionText.textContent = '¿Qué elemento deseas agregar?';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'nombreAlimento';
    input.placeholder = 'Ej: banana, leche, pollo...';
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            mostrarOpcionesCategoria();
        }
    });

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.style.marginTop = '20px';
    const btnContinuar = crearBoton('Continuar', [], 'mostrarOpcionesCategoria');
    buttonGroup.appendChild(btnContinuar);

    questionSection.appendChild(questionText);
    questionSection.appendChild(input);
    questionSection.appendChild(buttonGroup);
    app.appendChild(questionSection);
    input.focus();
}

/**
 * Muestra las categorías para asignar el nuevo elemento.
 */
function mostrarOpcionesCategoria() {
    const input = document.getElementById('nombreAlimento');
    const nombreAlimento = input.value.trim();

    if (!nombreAlimento) {
        alert('Por favor, ingresa el nombre del elemento.');
        return;
    }

    limpiarApp();

    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const questionText = document.createElement('div');
    questionText.className = 'question';
    questionText.textContent = `¿En qué categoría se encuentra "${nombreAlimento}"?`;

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    for (const categoriaKey in categoriaLabels) {
        const botonCategoria = crearBoton(categoriaLabels[categoriaKey], [], 'agregarElemento');
        botonCategoria.dataset.nombre = nombreAlimento;
        botonCategoria.dataset.categoria = categoriaKey;
        buttonGroup.appendChild(botonCategoria);
    }

    questionSection.appendChild(questionText);
    questionSection.appendChild(buttonGroup);
    app.appendChild(questionSection);
}

/**
 * Agrega el elemento a la lista y muestra confirmación.
 * @param {string} nombre - Nombre del elemento a agregar.
 * @param {string} categoria - Clave de la categoría.
 */
function agregarElemento(nombre, categoria) {
    if (!listaCompras[categoria]) {
        listaCompras[categoria] = [];
    }
    listaCompras[categoria].push(nombre);
    guardarDatos();

    limpiarApp();
    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const successMessage = document.createElement('div');
    successMessage.className = 'question success-message';
    successMessage.textContent = `✅ "${nombre}" agregado a ${categoriaLabels[categoria]}`;

    const questionText = document.createElement('div');
    questionText.className = 'question';
    questionText.textContent = '¿Deseas agregar otro elemento?';
    
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const btnSi = crearBoton('Sí', [], 'iniciarAgregarElemento');
    // const btnEliminar = crearBoton('🗑️ Eliminar elemento', ['delete-button'], 'iniciarEliminarElemento'); // Se eliminará desde la lista.
    const btnNo = crearBoton('Mostrar lista', ['no-button'], 'mostrarLista');

    buttonGroup.appendChild(btnSi);
    // buttonGroup.appendChild(btnEliminar);
    buttonGroup.appendChild(btnNo);

    questionSection.appendChild(successMessage);
    questionSection.appendChild(questionText);
    questionSection.appendChild(buttonGroup);
    app.appendChild(questionSection);
}

/**
 * Muestra la lista completa de compras organizada por categorías.
 */
function mostrarLista() {
    limpiarApp();

    const shoppingList = document.createElement('div');
    shoppingList.className = 'shopping-list';

    const title = document.createElement('h2');
    title.textContent = '🛒 Tu Lista de Compras Organizada';
    shoppingList.appendChild(title);

    for (const categoriaKey in listaCompras) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';

        const categoryName = document.createElement('div');
        categoryName.className = 'category-name';
        categoryName.textContent = categoriaLabels[categoriaKey] || categoriaKey;

        const btnAdd = crearBoton('➕ Agregar', ['category-add-btn'], 'agregarDirectoACategoria');
        btnAdd.dataset.categoria = categoriaKey;
        btnAdd.title = `Agregar elemento a esta categoría`;
        // Listener para agregar directo a la categoría
        btnAdd.addEventListener('click', () => {
            const nombreAlimento = prompt(`¿Qué deseas agregar a ${categoriaLabels[categoriaKey]}?`);
            if (nombreAlimento) {
                agregarElemento(nombreAlimento.trim(), categoriaKey);
            }
        });


        categoryHeader.appendChild(categoryName);
        categoryHeader.appendChild(btnAdd);

        const categoryItems = document.createElement('div');
        categoryItems.className = 'category-items';

        if (listaCompras[categoriaKey].length > 0) {
            listaCompras[categoriaKey].forEach(elemento => {
                const itemSpan = document.createElement('span');
                itemSpan.className = 'clickable-item';
                itemSpan.textContent = elemento;
                itemSpan.title = 'Click para editar o eliminar';
                itemSpan.dataset.action = 'interactuarConElemento';
                itemSpan.dataset.elemento = elemento;
                itemSpan.dataset.categoria = categoriaKey;
                categoryItems.appendChild(itemSpan);
            });
        } else {
            const emptySpan = document.createElement('span');
            emptySpan.className = 'empty-category';
            emptySpan.textContent = 'No hay elementos en esta categoría';
            categoryItems.appendChild(emptySpan);
        }
        
        categoryDiv.appendChild(categoryHeader);
        categoryDiv.appendChild(categoryItems);
        shoppingList.appendChild(categoryDiv);
    }
    
    if (hayElementosEnLista()) {
        const helpText = document.createElement('div');
        helpText.className = 'help-text';
        helpText.innerHTML = '💡 Haz click en cualquier elemento para editarlo o eliminarlo.';
        shoppingList.appendChild(helpText);
    }

    const finalButtonGroup = document.createElement('div');
    finalButtonGroup.className = 'button-group';
    finalButtonGroup.style.marginTop = '20px';

    const btnAgregarMas = crearBoton('➕ Agregar más elementos', [], 'iniciarAgregarElemento');
    const btnAgregarRubro = crearBoton('✨ Agregar más Rubros', ['add-rubro-button'], 'mostrarFormularioNuevoRubro'); // Añadir funcionalidad después
    const btnReiniciar = crearBoton('🔄 Nueva Lista', ['reset-button'], 'reiniciarLista');

    finalButtonGroup.appendChild(btnAgregarMas);
    finalButtonGroup.appendChild(btnAgregarRubro);
    finalButtonGroup.appendChild(btnReiniciar);

    shoppingList.appendChild(finalButtonGroup);
    app.appendChild(shoppingList);
}


// ===================================================================================
// LÓGICA DE EVENTOS
// ===================================================================================

// Delegación de eventos para el contenedor principal
app.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    if (!action) return;

    switch (action) {
        case 'iniciarAgregarElemento':
            iniciarAgregarElemento();
            break;
        case 'mostrarOpcionesCategoria':
            mostrarOpcionesCategoria();
            break;
        case 'agregarElemento':
            const { nombre, categoria } = e.target.dataset;
            agregarElemento(nombre, categoria);
            break;
        case 'mostrarLista':
            mostrarLista();
            break;
        case 'interactuarConElemento':
            const { elemento, categoria: cat } = e.target.dataset;
            interactuarConElemento(elemento, cat);
            break;
        case 'reiniciarLista':
            reiniciarLista();
            break;
        case 'mostrarFormularioNuevoRubro':
            mostrarFormularioNuevoRubro();
            break;
        case 'agregarNuevoRubro':
            const nuevoRubroNombre = document.getElementById('nuevoRubroNombre').value.trim();
            const nuevoRubroEtiqueta = document.getElementById('nuevoRubroEtiqueta').value.trim();
            if (nuevoRubroNombre && nuevoRubroEtiqueta) {
                agregarNuevoRubro(nuevoRubroNombre, nuevoRubroEtiqueta);
            } else {
                alert('Por favor, ingresa el nombre y la etiqueta del nuevo rubro.');
            }
            break;
    }
});


// ===================================================================================
// TEMAS Y OTROS EVENTOS (Fuera de #app)
// ===================================================================================
function initializeTheme() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedColorTheme = localStorage.getItem('colorTheme') || 'blue';

    if (savedDarkMode) {
        body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle').textContent = '☀️';
        document.querySelector('.theme-toggle').title = 'Modo claro';
    }
    setColorTheme(savedColorTheme);
}

function toggleDarkMode() {
    const toggle = document.querySelector('.theme-toggle');
    const isDark = body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        body.removeAttribute('data-theme');
        toggle.textContent = '🌙';
        toggle.title = 'Modo oscuro';
        localStorage.setItem('darkMode', 'false');
    } else {
        body.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️';
        toggle.title = 'Modo claro';
        localStorage.setItem('darkMode', 'true');
    }
}

function setColorTheme(theme) {
    document.querySelectorAll('.color-option').forEach(option => option.classList.remove('active'));
    document.querySelector(`.color-option[data-theme="${theme}"]`).classList.add('active');
    body.setAttribute('data-color-theme', theme);
    localStorage.setItem('colorTheme', theme);
}

// Event listeners para los controles de tema
document.querySelector('.theme-toggle').addEventListener('click', toggleDarkMode);
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => setColorTheme(option.dataset.theme));
});


// ===================================================================================
// FUNCIONES DE DIÁLOGOS Y OVERLAYS
// ===================================================================================

function interactuarConElemento(elemento, categoria) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';

    overlay.innerHTML = `
        <div class="custom-confirm-dialog">
            <div class="custom-confirm-icon">✏️</div>
            <div class="custom-confirm-title">¿Qué deseas hacer con este elemento?</div>
            <div class="custom-confirm-message interaction-message">
                <span class="custom-confirm-element">${elemento}</span>
                de la categoría
                <span class="custom-confirm-element">${categoriaLabels[categoria]}</span>
            </div>
            <div class="custom-confirm-buttons">
                <button class="confirm-btn-edit" data-action="editar-item">✏️ Editar</button>
                <button class="confirm-btn-yes" data-action="eliminar-item">🗑️ Eliminar</button>
                <button class="confirm-btn-no" data-action="cancelar-accion">❌ Cancelar</button>
            </div>
        </div>
    `;

    const dialog = overlay.querySelector('.custom-confirm-dialog');
    const interactionMessage = overlay.querySelector('.interaction-message');
    const buttonsContainer = overlay.querySelector('.custom-confirm-buttons');

    overlay.querySelector('.confirm-btn-edit').addEventListener('click', () => {
        // Limpiar el mensaje y mostrar el input para editar
        interactionMessage.innerHTML = `
            <div class="edit-input-group">
                <input type="text" id="editItemInput" value="${elemento}" class="edit-item-input">
            </div>
        `;
        const editItemInput = overlay.querySelector('#editItemInput');
        editItemInput.focus();

        // Ocultar los botones originales y mostrar solo el de guardar y cancelar
        buttonsContainer.innerHTML = ''; // Limpiar botones anteriores
        
        const btnGuardar = crearBoton('✔️ Guardar', ['confirm-btn-save'], 'guardar-edicion');
        btnGuardar.addEventListener('click', () => {
            const nuevoNombre = editItemInput.value.trim();
            if (nuevoNombre && nuevoNombre !== elemento) {
                editarElemento(elemento, categoria, nuevoNombre);
            }
            body.removeChild(overlay);
        });

        const btnCancelar = crearBoton('❌ Cancelar', ['confirm-btn-no'], 'cancelar-edicion');
        btnCancelar.addEventListener('click', () => {
            body.removeChild(overlay);
        });

        buttonsContainer.appendChild(btnGuardar);
        buttonsContainer.appendChild(btnCancelar);

        editItemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                btnGuardar.click();
            }
        });
    });

    overlay.querySelector('.confirm-btn-yes').addEventListener('click', () => {
        mostrarConfirmacionPersonalizada(
            `¿Estás seguro de que deseas eliminar "${elemento}"?`,
            elemento,
            categoria,
            (confirmado) => {
                if (confirmado) {
                    eliminarElemento(elemento, categoria);
                }
            }
        );
        body.removeChild(overlay);
    });
    
    overlay.querySelector('.confirm-btn-no').addEventListener('click', () => {
        body.removeChild(overlay);
    });

    body.appendChild(overlay);
}

function editarElemento(elementoAntiguo, categoria, nuevoNombre) {
    const index = listaCompras[categoria].indexOf(elementoAntiguo);
    if (index > -1) {
        listaCompras[categoria][index] = nuevoNombre;
        guardarDatos();
        mostrarLista();
    }
}

function eliminarElemento(elemento, categoria) {
    const index = listaCompras[categoria].indexOf(elemento);
    if (index > -1) {
        listaCompras[categoria].splice(index, 1);
        guardarDatos();
        mostrarLista();
    }
}

function reiniciarLista() {
     mostrarConfirmacionPersonalizada(
        '¿Estás seguro de que deseas borrar toda la lista?',
        'toda la lista',
        'general',
        (confirmado) => {
            if (confirmado) {
                localStorage.removeItem('listaComprasInteligente');
                localStorage.removeItem('listaComprasLabels');
                cargarDatosGuardados(); // Recargar valores por defecto
                mostrarMenuPrincipal();
            }
        }
    );
}

function mostrarConfirmacionPersonalizada(mensaje, elemento, categoria, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';
    
    overlay.innerHTML = `
        <div class="custom-confirm-dialog">
            <div class="custom-confirm-icon">⚠️</div>
            <div class="custom-confirm-title">¿Confirmar acción?</div>
            <div class="custom-confirm-message">
                ${mensaje}
            </div>
            <div class="custom-confirm-buttons">
                <button class="confirm-btn-yes">✔️ Sí</button>
                <button class="confirm-btn-no">❌ Cancelar</button>
            </div>
        </div>
    `;
    
    overlay.querySelector('.confirm-btn-yes').onclick = () => {
        callback(true);
        body.removeChild(overlay);
    };
    overlay.querySelector('.confirm-btn-no').onclick = () => {
        callback(false);
        body.removeChild(overlay);
    };
    
    body.appendChild(overlay);
}

function mostrarFormularioNuevoRubro() {
    limpiarApp();

    const questionSection = document.createElement('div');
    questionSection.className = 'question-section';

    const questionText = document.createElement('div');
    questionText.className = 'question';
    questionText.textContent = 'Agrega un nuevo rubro (categoría):';

    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.id = 'nuevoRubroNombre';
    inputNombre.placeholder = 'Nombre del rubro (ej: Postres)';
    inputNombre.className = 'input-full-width';
    inputNombre.style.marginBottom = '10px';

    const inputEtiqueta = document.createElement('input');
    inputEtiqueta.type = 'text';
    inputEtiqueta.id = 'nuevoRubroEtiqueta';
    inputEtiqueta.placeholder = 'Etiqueta/Emoji (ej: 🍰 Postres)';
    inputEtiqueta.className = 'input-full-width';
    inputEtiqueta.style.marginBottom = '20px';


    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.style.marginTop = '20px';
    const btnAgregar = crearBoton('✔️ Agregar Rubro', ['add-rubro-button'], 'agregarNuevoRubro');
    const btnCancelar = crearBoton('❌ Cancelar', ['no-button'], 'mostrarLista');

    buttonGroup.appendChild(btnAgregar);
    buttonGroup.appendChild(btnCancelar);

    questionSection.appendChild(questionText);
    questionSection.appendChild(inputNombre);
    questionSection.appendChild(inputEtiqueta);
    questionSection.appendChild(buttonGroup);
    app.appendChild(questionSection);

    inputNombre.focus();
}

function agregarNuevoRubro(nombre, etiqueta) {
    const claveRubro = nombre.toLowerCase().replace(/ /g, ''); // Genera una clave simple
    if (listaCompras[claveRubro]) {
        alert('Este rubro ya existe. Por favor, elige un nombre diferente.');
        return;
    }
    listaCompras[claveRubro] = [];
    categoriaLabels[claveRubro] = etiqueta;
    guardarDatos();
    alert(`Rubro "${etiqueta}" agregado exitosamente.`);
    mostrarLista();
}


// ===================================================================================
// INICIO DE LA APLICACIÓN
// ===================================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    cargarDatosGuardados();
    mostrarMenuPrincipal();
});
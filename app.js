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
        const btnEliminar = crearBoton('🗑️ Eliminar elemento', ['delete-button'], 'iniciarEliminarElemento');
        buttonGroup.appendChild(btnEliminar);
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
    const btnEliminar = crearBoton('🗑️ Eliminar elemento', ['delete-button'], 'iniciarEliminarElemento');
    const btnNo = crearBoton('Mostrar lista', ['no-button'], 'mostrarLista');

    buttonGroup.appendChild(btnSi);
    buttonGroup.appendChild(btnEliminar);
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
    const btnAgregarRubro = crearBoton('✨ Agregar más Rubros', ['add-rubro-button'], 'mostrarFormularioNuevoRubro');
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
            // Esta función crea su propio overlay, así que no se maneja aquí.
            // La dejamos como estaba porque no actúa sobre #app.
            const { elemento, categoria: cat } = e.target.dataset;
            interactuarConElemento(elemento, cat);
            break;
        case 'reiniciarLista':
            // Similar al anterior, abre un diálogo.
            reiniciarLista();
            break;
        // Agrega aquí más casos para otras acciones que ocurran dentro de #app
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
// FUNCIONES DE DIÁLOGOS Y OVERLAYS (Se mantienen casi igual)
// ===================================================================================
// NOTA: Estas funciones crean sus propios overlays y los añaden al 'body',
// por lo que su lógica de eventos interna puede permanecer como está por ahora,
// aunque idealmente también se refactorizaría.

function interactuarConElemento(elemento, categoria) {
    // ... (Esta función y las de los diálogos se mantienen como estaban)
    // ... (ya que usan `document.createElement` y se añaden al body)
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
                cargarDatosGuardados();
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


// ===================================================================================
// INICIO DE LA APLICACIÓN
// ===================================================================================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    cargarDatosGuardados();
    mostrarMenuPrincipal();
});
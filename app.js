let listaCompras = {};
let categoriaLabels = {};

// Función para establecer los valores por defecto
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

// FUNCIONES DE TEMA
function initializeTheme() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedColorTheme = localStorage.getItem('colorTheme') || 'blue';
    
    if (savedDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-toggle').textContent = '☀️';
        document.querySelector('.theme-toggle').title = 'Modo claro';
    }
    
    setColorTheme(savedColorTheme);
}

function toggleDarkMode() {
    const body = document.body;
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
    // Remover clase active de todos los botones
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Añadir clase active al tema seleccionado
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
    
    // Aplicar el tema al body
    document.body.setAttribute('data-color-theme', theme);
    
    // Guardar preferencia
    localStorage.setItem('colorTheme', theme);
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
    for (const categoria in listaCompras) {
        if (listaCompras[categoria] && listaCompras[categoria].length > 0) {
            return true;
        }
    }
    return false;
}

// Función para mostrar confirmación personalizada
function mostrarConfirmacionPersonalizada(mensaje, elemento, categoria, callback) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';
    
    overlay.innerHTML = `
        <div class="custom-confirm-dialog">
            <div class="custom-confirm-icon">⚠️</div>
            <div class="custom-confirm-title">¿Confirmar eliminación?</div>
            <div class="custom-confirm-message">
                ¿Estás seguro de que deseas eliminar <br>
                <span class="custom-confirm-element">${elemento}</span><br>
                de ${categoriaLabels[categoria] || categoria}?
            </div>
            <div class="custom-confirm-buttons">
                <button class="confirm-btn-yes" onclick="confirmarAccion(true)">🗑️ Sí, eliminar</button>
                <button class="confirm-btn-no" onclick="confirmarAccion(false)">❌ Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Guardar el callback para uso posterior
    window.confirmCallback = callback;
}

// Nuevo formulario para editar/eliminar un elemento
function interactuarConElemento(elemento, categoria) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';

    // Crear el select de categorías
    let categoryOptions = '';
    for (const cat in categoriaLabels) {
        categoryOptions += `<option value="${cat}" ${cat === categoria ? 'selected' : ''}>${categoriaLabels[cat]}</option>`;
    }

    overlay.innerHTML = `
        <div class="custom-confirm-dialog">
            <h2>✏️ Editar o Eliminar</h2>
            <p>
                Edita el nombre o la categoría de
                <span class="custom-confirm-element">${elemento}</span>
            </p>
            <input type="text" id="editItemName" value="${elemento}" placeholder="Nuevo nombre del elemento...">
            <select id="editItemCategory">
                ${categoryOptions}
            </select>
            <div class="custom-confirm-buttons">
                <button class="confirm-btn-yes" onclick="eliminarElementoDesdeDialog('${elemento}', '${categoria}')">🗑️ Eliminar</button>
                <button class="confirm-btn-edit" onclick="confirmarEdicion('${elemento}', '${categoria}')">✅ Guardar Cambios</button>
                <button class="confirm-btn-no" onclick="cerrarDialog()">❌ Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function cerrarDialog() {
    const overlay = document.querySelector('.custom-confirm-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease forwards';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 200);
    }
}

function confirmarEdicion(elementoOriginal, categoriaOriginal) {
    const nuevoNombre = document.getElementById('editItemName').value.trim();
    const nuevaCategoria = document.getElementById('editItemCategory').value;

    if (!nuevoNombre) {
        alert('El nombre del elemento no puede estar vacío.');
        return;
    }

    // Eliminar el elemento original
    const indice = listaCompras[categoriaOriginal].indexOf(elementoOriginal);
    if (indice > -1) {
        listaCompras[categoriaOriginal].splice(indice, 1);
    }

    // Añadir el elemento con el nuevo nombre y categoría
    if (!listaCompras[nuevaCategoria]) listaCompras[nuevaCategoria] = [];
    listaCompras[nuevaCategoria].push(nuevoNombre);
    guardarDatos();
    
    cerrarDialog();
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="question-section">
            <div class="question success-message">✅ "${elementoOriginal}" ha sido actualizado a "${nuevoNombre}" en ${categoriaLabels[nuevaCategoria]}.</div>
            <div class="question">Regresando a tu lista...</div>
        </div>`;
    setTimeout(() => responderNo(), 1500);
}

function eliminarElementoDesdeDialog(elemento, categoria) {
    cerrarDialog();
    mostrarConfirmacionPersonalizada('¿Estás seguro de que deseas eliminar este elemento?', elemento, categoria, function(confirmado) {
        if (confirmado) {
            const indice = listaCompras[categoria].indexOf(elemento);
            if (indice > -1) {
                listaCompras[categoria].splice(indice, 1);
                guardarDatos();
                const app = document.getElementById('app');
                app.innerHTML = `
                    <div class="question-section">
                        <div class="question success-message">✅ "${elemento}" eliminado exitosamente.</div>
                        <div class="question">Regresando a tu lista...</div>
                    </div>`;
                setTimeout(() => responderNo(), 1500);
            }
        } else {
            // Si se cancela la eliminación, volver a mostrar el menú principal o la lista
            responderNo();
        }
    });
}

function confirmarAccion(confirmado) {
    const overlay = document.querySelector('.custom-confirm-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease forwards';
        setTimeout(() => {
            document.body.removeChild(overlay);
            if (window.confirmCallback) {
                window.confirmCallback(confirmado);
                window.confirmCallback = null;
            }
        }, 200);
    }
}

function mostrarMenuPrincipal() {
    const app = document.getElementById('app');
    let buttonsHTML = `<button onclick="responderSi()">Sí</button> <button class="no-button" onclick="responderNo()">No</button>`;

    if (hayElementosEnLista()) {
        buttonsHTML = `<button onclick="responderSi()">Sí</button> <button class="delete-button" onclick="mostrarOpcionesEliminar()">🗑️ Eliminar elemento</button> <button class="no-button" onclick="responderNo()">No</button>`;
    }

    app.innerHTML = `
        <div class="question-section">
            <div class="question">¿Deseas agregar un alimento a tu lista de compras?</div>
            <div class="button-group">${buttonsHTML}</div>
        </div>`;
}

function responderSi() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="question-section">
            <div class="question">¿Qué alimento deseas agregar?</div>
            <input type="text" id="nombreAlimento" placeholder="Ej: banana, leche, pollo..." onkeypress="if(event.key==='Enter') preguntarCategoria()">
            <div class="button-group" style="margin-top: 20px;"><button onclick="preguntarCategoria()">Continuar</button></div>
        </div>`;
    document.getElementById('nombreAlimento').focus();
}

function preguntarCategoria() {
    const nombreAlimento = document.getElementById('nombreAlimento').value.trim();
    if (!nombreAlimento) {
        alert('Por favor, ingresa el nombre del alimento');
        return;
    }
    let categoryButtons = '';
    for (const categoria in categoriaLabels) {
        categoryButtons += `<button onclick="agregarAlimento('${nombreAlimento}', '${categoria}')">${categoriaLabels[categoria]}</button>`;
    }
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="question-section">
            <div class="question">¿En qué categoría se encuentra "${nombreAlimento}"?</div>
            <div class="button-group">${categoryButtons}</div>
        </div>`;
}

function agregarAlimento(nombre, categoria) {
    if (!listaCompras[categoria]) listaCompras[categoria] = [];
    listaCompras[categoria].push(nombre);
    guardarDatos();
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="question-section">
            <div class="question success-message">✅ "${nombre}" agregado a ${categoriaLabels[categoria]}</div>
            <div class="question">¿Deseas agregar otro alimento a tu lista?</div>
            <div class="button-group">
                <button onclick="responderSi()">Sí</button>
                <button class="delete-button" onclick="mostrarOpcionesEliminar()">🗑️ Eliminar elemento</button>
                <button class="no-button" onclick="responderNo()">No, mostrar lista</button>
            </div>
        </div>`;
}

// Nueva función para agregar elemento directamente a una categoría específica
function agregarACategoria(categoria) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="question-section">
            <div class="question">¿Qué elemento deseas agregar a ${categoriaLabels[categoria]}?</div>
            <input type="text" id="elementoCategoria" placeholder="Escribe el nombre del elemento..." onkeypress="if(event.key==='Enter') confirmarAgregarACategoria('${categoria}')">
            <div class="button-group" style="margin-top: 20px;">
                <button onclick="confirmarAgregarACategoria('${categoria}')">➕ Agregar</button>
                <button class="no-button" onclick="responderNo()">Cancelar</button>
            </div>
        </div>`;
    document.getElementById('elementoCategoria').focus();
}

function confirmarAgregarACategoria(categoria) {
    const elemento = document.getElementById('elementoCategoria').value.trim();
    if (!elemento) {
        alert('Por favor, ingresa el nombre del elemento');
        return;
    }
    
    if (!listaCompras[categoria]) listaCompras[categoria] = [];
    listaCompras[categoria].push(elemento);
    guardarDatos();
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="question-section">
            <div class="question success-message">✅ "${elemento}" agregado a ${categoriaLabels[categoria]}</div>
            <div class="question">¿Deseas realizar otra acción?</div>
            <div class="button-group">
                <button onclick="agregarACategoria('${categoria}')">➕ Agregar otro a ${categoriaLabels[categoria]}</button>
                <button onclick="responderSi()">➕ Agregar a otra categoría</button>
                <button class="no-button" onclick="responderNo()">Ver lista completa</button>
            </div>
        </div>`;
}

function mostrarOpcionesEliminar() {
    const app = document.getElementById('app');
    let elementosHTML = '<div class="current-list"><h3>📋 Elementos actuales en tu lista:</h3>';
    if (!hayElementosEnLista()) {
        elementosHTML += '<h3>La lista está vacía</h3>';
    } else {
        for (const categoria in listaCompras) {
            if (listaCompras[categoria].length > 0) {
                listaCompras[categoria].forEach(elemento => {
                    elementosHTML += `<div class="list-item">${categoriaLabels[categoria]}: ${elemento}</div>`;
                });
            }
        }
    }
    elementosHTML += '</div>';
    app.innerHTML = `
        <div class="question-section">
            <div class="question">¿Qué elemento deseas eliminar?</div>
            ${elementosHTML}
            <input type="text" id="elementoEliminar" placeholder="Escribe exactamente el nombre del elemento..." onkeypress="if(event.key==='Enter') eliminarElemento()">
            <div class="button-group" style="margin-top: 20px;">
                <button onclick="eliminarElemento()">🗑️ Eliminar</button>
                <button class="no-button" onclick="mostrarMenuPrincipal()">Cancelar</button>
            </div>
        </div>`;
    document.getElementById('elementoEliminar').focus();
}

function eliminarElemento() {
    const elementoAEliminar = document.getElementById('elementoEliminar').value.trim();
    if (!elementoAEliminar) {
        alert('Por favor, ingresa el nombre del elemento a eliminar');
        return;
    }
    let encontrado = false;
    let categoriaEncontrada = '';
    for (const categoria in listaCompras) {
        const indice = listaCompras[categoria].indexOf(elementoAEliminar);
        if (indice !== -1) {
            listaCompras[categoria].splice(indice, 1);
            guardarDatos();
            encontrado = true;
            categoriaEncontrada = categoria;
            break;
        }
    }
    const app = document.getElementById('app');
    if (encontrado) {
        app.innerHTML = `
            <div class="question-section">
                <div class="question success-message">✅ "${elementoAEliminar}" eliminado exitosamente.</div>
                <div class="question">¿Deseas realizar otra acción?</div>
                <div class="button-group">
                    <button onclick="responderSi()">➕ Agregar elemento</button>
                    ${hayElementosEnLista() ? '<button class="delete-button" onclick="mostrarOpcionesEliminar()">🗑️ Eliminar otro</button>' : ''}
                    <button class="no-button" onclick="responderNo()">Ver lista completa</button>
                </div>
            </div>`;
    } else {
        app.innerHTML = `
            <div class="question-section">
                <div class="question error-message">❌ El elemento "${elementoAEliminar}" no existe en tu lista.</div>
                <div class="button-group">
                    <button onclick="mostrarOpcionesEliminar()">🔄 Intentar de nuevo</button>
                    <button class="no-button" onclick="mostrarMenuPrincipal()">Volver al menú</button>
                </div>
            </div>`;
    }
}

function mostrarFormularioNuevoRubro() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="question-section">
            <div class="question">Añadir una nueva categoría</div>
            <input type="text" id="nuevoRubroNombre" placeholder="Nombre del rubro (ej: Limpieza)">
            <input type="text" id="nuevoRubroEmoji" placeholder="Emoji del rubro (ej: 🧼)">
            <div class="button-group" style="margin-top: 20px;">
                <button class="add-rubro-button" onclick="agregarNuevoRubro()">✨ Añadir Rubro</button>
                <button class="no-button" onclick="responderNo()">Cancelar</button>
            </div>
        </div>`;
    document.getElementById('nuevoRubroNombre').focus();
}

function agregarNuevoRubro() {
    const nombre = document.getElementById('nuevoRubroNombre').value.trim();
    const emoji = document.getElementById('nuevoRubroEmoji').value.trim();
    if (!nombre || !emoji) {
        alert('Por favor, completa ambos campos para añadir el rubro.');
        return;
    }
    const clave = nombre.toLowerCase().replace(/\s+/g, '');
    if (listaCompras.hasOwnProperty(clave)) {
        alert('Esa categoría ya existe.');
        return;
    }
    categoriaLabels[clave] = `${emoji} ${nombre}`;
    listaCompras[clave] = [];
    guardarDatos();
    responderNo();
}

function responderNo() {
    let listaHTML = '<div class="shopping-list"><h2>🛒 Tu Lista de Compras Organizada</h2>';
    for (const categoria in listaCompras) {
        listaHTML += `<div class="category">
                        <div class="category-header">
                            <div class="category-name">${categoriaLabels[categoria] || categoria}</div>
                            <button class="category-add-btn" onclick="agregarACategoria('${categoria}')" title="Agregar elemento a esta categoría">➕ Agregar</button>
                        </div>
                        <div class="category-items">`;
        if (listaCompras[categoria].length > 0) {
            listaCompras[categoria].forEach(elemento => {
                listaHTML += `<span class="clickable-item" onclick="interactuarConElemento('${elemento}', '${categoria}')" title="Click para editar o eliminar">${elemento}</span>`;
            });
        } else {
            listaHTML += `<span class="empty-category">No hay elementos en esta categoría</span>`;
        }
        listaHTML += `</div></div>`;
    }
    if (hayElementosEnLista()) {
        listaHTML += `<div class="help-text">💡 Haz click en cualquier elemento para editarlo o eliminarlo, o usa los botones "Agregar" de cada categoría</div>`;
    }
    listaHTML += `<div class="button-group" style="margin-top: 20px;">
                    <button onclick="mostrarMenuPrincipal()">➕ Agregar más elementos</button>
                    <button class="add-rubro-button" onclick="mostrarFormularioNuevoRubro()">✨ Agregar más Rubros</button>
                    <button class="reset-button" onclick="reiniciarLista()">🔄 Nueva Lista</button>
                  </div></div>`;
    document.getElementById('app').innerHTML = listaHTML;
}

function reiniciarLista() {
    mostrarConfirmacionPersonalizada(
        '¿Estás seguro de que deseas borrar toda la lista y los rubros personalizados? Esta acción no se puede deshacer.',
        'toda la lista',
        'general',
        function(confirmado) {
            if (confirmado) {
                localStorage.removeItem('listaComprasInteligente');
                localStorage.removeItem('listaComprasLabels');
                cargarDatosGuardados();
                mostrarMenuPrincipal();
            }
        }
    );
}

// INICIO DE LA APLICACIÓN
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    cargarDatosGuardados();
    mostrarMenuPrincipal();
});
// Base de datos de tanques por planta
const tanquesPorPlanta = {
    Jabones: [
        { id: "FV29", nombre: "FV29", alto: 11.22, diametro: 6.22, forma: "redondo" },
        { id: "FV30", nombre: "FV30", alto: 7.67, diametro: 5.4, forma: "redondo" },
        { id: "FV31", nombre: "FV31", alto: 6.36, diametro: 5.18, forma: "redondo" },
        { id: "FV32", nombre: "FV32", alto: 6.3, diametro: 3.88, forma: "redondo" },
        { id: "FV34", nombre: "FV34", alto: 9.71, diametro: 5.8, forma: "redondo" },
        { id: "FV35", nombre: "FV35", alto: 7.57, diametro: 9.1, forma: "redondo" },
        { id: "FV36", nombre: "FV36", alto: 9.79, diametro: 5.8, forma: "redondo" },
        { id: "FV37", nombre: "FV37", alto: 11.22, diametro: 6.22, forma: "redondo" },
        { id: "PV1", nombre: "PV1", alto: 3.7, diametro: 4.25, forma: "redondo" },
        { id: "RV71", nombre: "RV71", alto: 2.4, diametro: 5, forma: "redondo" },
        { id: "RV73", nombre: "RV73", alto: 3.1, diametro: 2.74, forma: "redondo" },
        { id: "RB74", nombre: "RB74", alto: 2.6, diametro: 4.65, forma: "redondo" },
        { id: "RB79A", nombre: "RB79A", alto: 2, diametro: 2.44, forma: "redondo" },
        { id: "RV81", nombre: "RV81", alto: 3, diametro: 2.92, forma: "cuadrado" },
        { id: "SV50", nombre: "SV50", alto: 3.2, diametro: 3.8, forma: "redondo" },
        { id: "SV50A", nombre: "SV50A", alto: 3.2, diametro: 3.8, forma: "redondo" },
        { id: "TK1", nombre: "TK1", alto: 3.78, diametro: 3.91, forma: "redondo" },
        { id: "TK2", nombre: "TK2", alto: 3.78, diametro: 3.91, forma: "redondo" }
    ],
    Liquidos: [
        // Agrega aquí los tanques de Líquidos si los tienes
    ],
    CuidadoOral: [
        // Agrega aquí los tanques de Cuidado Oral si los tienes
    ],
    Axion: [
        // Agrega aquí los tanques de Axion si los tienes
    ]
};

// Elementos del DOM
const plantaSelect = document.getElementById('planta');
const tanqueSelect = document.getElementById('tanque');
const btnLimpiarCampos = document.getElementById('btnLimpiarCampos');
const formaTanque = document.getElementById('formaTanque');
const diametroGroup = document.getElementById('diametroGroup');
const anchoGroup = document.getElementById('anchoGroup');
const diametroInput = document.getElementById('diametro');
const anchoInput = document.getElementById('ancho');
const alturaInput = document.getElementById('altura');
const longitudMangueraInput = document.getElementById('longitudManguera');
const cantidadCodosSelect = document.getElementById('cantidadCodos');
const unidadesCaudalSelect = document.getElementById('unidadesCaudal');
const caudalVentiladorInput = document.getElementById('caudalVentilador');
const unidadLabel = document.getElementById('unidadLabel');
const btnCalcular = document.getElementById('btnCalcular');
const resultadoContainer = document.getElementById('resultadoContainer');
const resultadoTexto = document.getElementById('resultadoTexto');
const themeToggle = document.getElementById('themeToggle');

// Manejo del tema (modo oscuro por defecto)
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// Cargar tanques según planta seleccionada
plantaSelect.addEventListener('change', function() {
    const planta = this.value;
    const tanques = tanquesPorPlanta[planta] || [];
    
    // Limpiar select de tanques
    tanqueSelect.innerHTML = '<option value="">Seleccione un tanque...</option>';
    
    if (tanques.length > 0) {
        tanqueSelect.disabled = false;
        tanques.forEach(tanque => {
            const option = document.createElement('option');
            option.value = tanque.id;
            option.textContent = tanque.nombre;
            tanqueSelect.appendChild(option);
        });
    } else {
        tanqueSelect.disabled = true;
        tanqueSelect.innerHTML = '<option value="">No hay tanques disponibles para esta planta</option>';
    }
    
    // Limpiar campos al cambiar de planta
    limpiarCamposTanque();
});

// Cargar dimensiones del tanque seleccionado
tanqueSelect.addEventListener('change', function() {
    const tanqueId = this.value;
    if (!tanqueId) return;
    
    const planta = plantaSelect.value;
    const tanques = tanquesPorPlanta[planta] || [];
    const tanque = tanques.find(t => t.id === tanqueId);
    
    if (tanque) {
        // Cargar altura
        alturaInput.value = tanque.alto;
        
        // Cargar forma y dimensión
        if (tanque.forma === 'redondo') {
            formaTanque.value = 'redondo';
            diametroGroup.style.display = 'block';
            anchoGroup.style.display = 'none';
            diametroInput.value = tanque.diametro;
            anchoInput.value = '';
        } else {
            formaTanque.value = 'cuadrado';
            diametroGroup.style.display = 'none';
            anchoGroup.style.display = 'block';
            diametroInput.value = '';
            anchoInput.value = tanque.diametro; // Para cuadrado, el ancho es la dimensión
        }
        
        // Mostrar mensaje de confirmación
        mostrarNotificacion(`✅ Cargado: ${tanque.nombre} - ${tanque.forma === 'redondo' ? 'Cilíndrico' : 'Cuadrado'}`, '#48BB78');
    }
});

// Limpiar todos los campos del tanque
function limpiarCamposTanque() {
    alturaInput.value = '';
    diametroInput.value = '';
    anchoInput.value = '';
    formaTanque.value = 'redondo';
    diametroGroup.style.display = 'block';
    anchoGroup.style.display = 'none';
}

// Botón limpiar campos
btnLimpiarCampos.addEventListener('click', function() {
    limpiarCamposTanque();
    plantaSelect.value = '';
    tanqueSelect.innerHTML = '<option value="">Primero seleccione una planta...</option>';
    tanqueSelect.disabled = true;
    longitudMangueraInput.value = '';
    cantidadCodosSelect.value = '0';
    caudalVentiladorInput.value = '';
    resultadoContainer.style.display = 'none';
    mostrarNotificacion('🧹 Todos los campos han sido limpiados', '#4299E1');
});

// Función para mostrar notificaciones temporales
function mostrarNotificacion(mensaje, color) {
    const notificacion = document.createElement('div');
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${color};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 2s ease-in-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 2000);
}

// Agregar animación CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);

// Mostrar/ocultar campos según forma del tanque
formaTanque.addEventListener('change', function() {
    if (this.value === 'redondo') {
        diametroGroup.style.display = 'block';
        anchoGroup.style.display = 'none';
    } else {
        diametroGroup.style.display = 'none';
        anchoGroup.style.display = 'block';
    }
});

// Actualizar etiqueta según unidades de caudal
unidadesCaudalSelect.addEventListener('change', function() {
    const unidades = this.value;
    switch(unidades) {
        case 'm3h':
            unidadLabel.textContent = 'Ingrese el caudal en m³/h';
            break;
        case 'm3min':
            unidadLabel.textContent = 'Ingrese el caudal en m³/min (se convertirá a m³/h)';
            break;
        case 'cfm':
            unidadLabel.textContent = 'Ingrese el caudal en CFM (pies cúbicos por minuto)';
            break;
        case 'ls':
            unidadLabel.textContent = 'Ingrese el caudal en L/s (litros por segundo)';
            break;
    }
});

// Calcular volumen
function calcularVolumen() {
    const altura = parseFloat(alturaInput.value);
    const forma = formaTanque.value;
    
    if (forma === 'redondo') {
        const diametro = parseFloat(diametroInput.value);
        const radio = diametro / 2;
        return Math.PI * radio * radio * altura;
    } else {
        const ancho = parseFloat(anchoInput.value);
        return ancho * ancho * altura;
    }
}

// Calcular pérdida por codos
function calcularPerdidaCodos() {
    const codos = parseInt(cantidadCodosSelect.value);
    return codos * 0.5;
}

// Convertir caudal a m³/h
function convertirCaudalAM3H(caudal, unidades) {
    switch(unidades) {
        case 'm3min':
            return caudal * 60;
        case 'cfm':
            return caudal * 1.69901;
        case 'ls':
            return caudal * 3.6;
        default:
            return caudal;
    }
}

// Obtener dimensión
function obtenerDimension() {
    if (formaTanque.value === 'redondo') {
        return parseFloat(diametroInput.value);
    } else {
        return parseFloat(anchoInput.value);
    }
}

// Obtener nombre de la dimensión
function obtenerNombreDimension() {
    return formaTanque.value === 'redondo' ? 'Diámetro' : 'Ancho';
}

// Obtener unidad original para mostrar
function obtenerUnidadOriginal(unidades) {
    switch(unidades) {
        case 'm3min': return 'm³/min';
        case 'cfm': return 'CFM';
        case 'ls': return 'L/s';
        default: return 'm³/h';
    }
}

// Función principal de cálculo
function calcularVentilacion() {
    const altura = parseFloat(alturaInput.value);
    const dimension = obtenerDimension();
    const longitudManguera = parseFloat(longitudMangueraInput.value);
    const caudalVentilador = parseFloat(caudalVentiladorInput.value);
    
    if (isNaN(altura) || altura <= 0) {
        mostrarError('Por favor, ingrese una altura válida (>0)');
        return;
    }
    
    if (isNaN(dimension) || dimension <= 0) {
        const nombreDim = obtenerNombreDimension();
        mostrarError(`Por favor, ingrese un ${nombreDim.toLowerCase()} válido (>0)`);
        return;
    }
    
    if (isNaN(longitudManguera) || longitudManguera <= 0) {
        mostrarError('Por favor, ingrese una longitud de manguera válida (>0)');
        return;
    }
    
    if (isNaN(caudalVentilador) || caudalVentilador <= 0) {
        mostrarError('Por favor, ingrese un caudal de ventilador válido (>0)');
        return;
    }
    
    const volumen = calcularVolumen();
    const unidades = unidadesCaudalSelect.value;
    const unidadOriginal = obtenerUnidadOriginal(unidades);
    const caudalM3H = convertirCaudalAM3H(caudalVentilador, unidades);
    const perdidaLongitud = longitudManguera * 0.1;
    const perdidaCodos = calcularPerdidaCodos();
    const perdidasTotales = perdidaLongitud + perdidaCodos;
    let caudalEfectivo = caudalM3H - perdidasTotales;
    
    let resultadoHTML = '';
    let claseResultado = '';
    
    if (caudalEfectivo <= 0) {
        claseResultado = 'result-insuficiente';
        resultadoHTML = `
            <div style="color: #F56565;">
                <strong>⚠️ ADVERTENCIA: Caudal insuficiente</strong><br><br>
                El caudal del ventilador es insuficiente para vencer las pérdidas del sistema.<br>
                Caudal efectivo: 0 m³/h<br>
                Pérdidas totales: ${perdidasTotales.toFixed(2)} m³/h<br><br>
                <strong>Recomendación:</strong> Aumentar el caudal del ventilador o reducir la longitud de manguera y cantidad de codos.
            </div>
        `;
        mostrarResultado(resultadoHTML, claseResultado);
        return;
    }
    
    const renovacionesHora = caudalEfectivo / volumen;
    let colorRecomendacion = '';
    let mensajeRecomendacion = '';
    
    if (renovacionesHora >= 6) {
        claseResultado = 'result-excelente';
        colorRecomendacion = '#48BB78';
        mensajeRecomendacion = '✓ EXCELENTE - El sistema proporciona ventilación adecuada (>6 renovaciones/hora)';
    } else if (renovacionesHora >= 4) {
        claseResultado = 'result-aceptable';
        colorRecomendacion = '#ED8936';
        mensajeRecomendacion = '⚠️ ACEPTABLE - Considere aumentar el caudal (>4 renovaciones/hora)';
    } else {
        claseResultado = 'result-insuficiente';
        colorRecomendacion = '#F56565';
        mensajeRecomendacion = '❌ INSUFICIENTE - Se requiere mayor capacidad de ventilación (<4 renovaciones/hora)';
    }
    
    // Información del tanque seleccionado
    let tanqueInfo = '';
    const tanqueId = tanqueSelect.value;
    if (tanqueId) {
        tanqueInfo = `<br><strong>🏷️ Tanque seleccionado:</strong> ${tanqueId}<br>`;
    }
    
    resultadoHTML = `
        <div>
            <strong>📊 RESULTADOS DEL CÁLCULO</strong>${tanqueInfo}<br>
            
            <strong>📐 Dimensiones del tanque:</strong><br>
            • Forma: ${formaTanque.options[formaTanque.selectedIndex].text.toUpperCase()}<br>
            • Altura: ${altura.toFixed(2)} m<br>
            • ${obtenerNombreDimension()}: ${dimension.toFixed(2)} m<br>
            • Volumen: ${volumen.toFixed(2)} m³<br><br>
            
            <strong>💨 Sistema de ventilación:</strong><br>
            • Caudal nominal: ${caudalVentilador.toFixed(2)} ${unidadOriginal} = ${caudalM3H.toFixed(2)} m³/h<br>
            • Caudal efectivo: ${caudalEfectivo.toFixed(2)} m³/h = ${(caudalEfectivo / 60).toFixed(2)} m³/min<br>
            • Longitud de manguera: ${longitudManguera.toFixed(2)} m<br>
            • Cantidad de codos: ${cantidadCodosSelect.value}<br>
            • Pérdidas totales: ${perdidasTotales.toFixed(2)} m³/h (${(perdidasTotales / 60).toFixed(2)} m³/min)<br><br>
            
            <strong>⏱️ Tiempos de ventilación:</strong><br>
            • Tiempo para 1 renovación: ${(volumen / caudalEfectivo * 60).toFixed(1)} minutos<br>
            • Tiempo para 5 renovaciones: ${(volumen / caudalEfectivo * 60 * 5).toFixed(1)} minutos<br>
            • Renovaciones por hora: ${renovacionesHora.toFixed(1)} veces/hora<br><br>
            
            <strong>✅ RECOMENDACIÓN:</strong><br>
            <span style="color: ${colorRecomendacion}; font-weight: bold;">${mensajeRecomendacion}</span><br><br>
            
            <strong>💡 Nota importante:</strong><br>
            • Para espacios confinados Clase 0 (riesgo bajo): mínimo 4 renovaciones/hora<br>
            • Para espacios Clase I (riesgo medio): mínimo 6 renovaciones/hora<br>
            • Para espacios Clase II (riesgo alto): mínimo 10 renovaciones/hora<br>
            • Consulte siempre la normativa local aplicable.
        </div>
    `;
    
    mostrarResultado(resultadoHTML, claseResultado);
}

function mostrarError(mensaje) {
    resultadoContainer.style.display = 'block';
    resultadoContainer.className = 'result-card result-insuficiente';
    resultadoTexto.innerHTML = `
        <div style="color: #F56565; padding: 20px; text-align: center;">
            <strong>❌ ERROR</strong><br><br>
            ${mensaje}
        </div>
    `;
    resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function mostrarResultado(html, clase) {
    resultadoContainer.style.display = 'block';
    resultadoContainer.className = `result-card ${clase}`;
    resultadoTexto.innerHTML = html;
    resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Event listener para el botón calcular
btnCalcular.addEventListener('click', calcularVentilacion);

// Permitir calcular con Enter
const inputs = ['altura', 'diametro', 'ancho', 'longitudManguera', 'caudalVentilador'];
inputs.forEach(id => {
    document.getElementById(id)?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calcularVentilacion();
        }
    });
});

// Inicializar
formaTanque.dispatchEvent(new Event('change'));
unidadesCaudalSelect.dispatchEvent(new Event('change'));
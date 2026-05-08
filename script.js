// Base de datos de tanques por planta
const tanquesPorPlanta = {
    Jabones: [
        { id: "FV29", nombre: "FV29 - GRASA", alto: 11.22, diametro: 6.22, forma: "redondo", soda: false },
        { id: "FV30", nombre: "FV30 - GRASA", alto: 7.67, diametro: 5.4, forma: "redondo", soda: false },
        { id: "FV31", nombre: "FV31 - GRASA", alto: 6.36, diametro: 5.18, forma: "redondo", soda: false },
        { id: "FV32", nombre: "FV32 - SODA", alto: 6.3, diametro: 3.88, forma: "redondo", soda: true },
        { id: "FV34", nombre: "FV34 - GRASA", alto: 9.71, diametro: 5.8, forma: "redondo", soda: false },
        { id: "FV35", nombre: "FV35 - GRASA", alto: 7.57, diametro: 9.1, forma: "redondo", soda: false },
        { id: "FV36", nombre: "FV36 - LAURICO", alto: 9.79, diametro: 5.8, forma: "redondo", soda: false },
        { id: "FV37", nombre: "FV37 - AGUA", alto: 11.22, diametro: 6.22, forma: "redondo", soda: false },
        { id: "PV1", nombre: "PV1 - GRASA", alto: 3.7, diametro: 4.25, forma: "redondo", soda: false },
        { id: "RV71", nombre: "RV71 - LAURICO", alto: 2.4, diametro: 5, forma: "redondo", soda: false },
        { id: "RV73", nombre: "RV73 - GRASA", alto: 3.1, diametro: 2.74, forma: "redondo", soda: false },
        { id: "RB74", nombre: "RB74 - GRASA", alto: 2.6, diametro: 4.65, forma: "redondo", soda: false },
        { id: "RB79A", nombre: "RB79A- SALMUERA", alto: 2, diametro: 2.44, forma: "redondo", soda: false },
        { id: "RV81", nombre: "RV81- SODA", alto: 3, diametro: 2.92, forma: "cuadrado", soda: true },
        { id: "SV50", nombre: "SV50 - GRASA", alto: 3.2, diametro: 3.8, forma: "redondo", soda: false },
        { id: "SV50A", nombre: "SV50A - GRASA", alto: 3.2, diametro: 3.8, forma: "redondo", soda: false },
        { id: "TK1", nombre: "TK1 - JABÓN", alto: 3.78, diametro: 3.91, forma: "redondo", soda: false },
        { id: "TK2", nombre: "TK2 - JABÓN", alto: 3.78, diametro: 3.91, forma: "redondo", soda: false }
    ],
    Liquidos: [],
    CuidadoOral: [],
    Axion: []
};

// Elementos del DOM (igual que antes)
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

// Tema oscuro (igual)
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

// Cargar tanques según planta
plantaSelect.addEventListener('change', function() {
    const planta = this.value;
    const tanques = tanquesPorPlanta[planta] || [];
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
        tanqueSelect.innerHTML = '<option value="">No hay tanques disponibles</option>';
    }
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
        alturaInput.value = tanque.alto;
        if (tanque.forma === 'redondo') {
            formaTanque.value = 'redondo';
            diametroGroup.style.display = 'block';
            anchoGroup.style.display = 'none';
            diametroInput.value = tanque.diametro;
        } else {
            formaTanque.value = 'cuadrado';
            diametroGroup.style.display = 'none';
            anchoGroup.style.display = 'block';
            anchoInput.value = tanque.diametro;
        }
        mostrarNotificacion(`✅ Cargado: ${tanque.nombre}`, '#48BB78');
        // Guardar el tanque actual para usarlo en el cálculo (propiedad soda)
        window.tanqueActual = tanque;
    }
});

function limpiarCamposTanque() {
    alturaInput.value = '';
    diametroInput.value = '';
    anchoInput.value = '';
    formaTanque.value = 'redondo';
    diametroGroup.style.display = 'block';
    anchoGroup.style.display = 'none';
    window.tanqueActual = null;
}

btnLimpiarCampos.addEventListener('click', () => {
    limpiarCamposTanque();
    plantaSelect.value = '';
    tanqueSelect.innerHTML = '<option value="">Primero seleccione una planta...</option>';
    tanqueSelect.disabled = true;
    longitudMangueraInput.value = '';
    cantidadCodosSelect.value = '0';
    caudalVentiladorInput.value = '';
    resultadoContainer.style.display = 'none';
    mostrarNotificacion('🧹 Todos los campos limpiados', '#4299E1');
});

function mostrarNotificacion(mensaje, color) {
    const div = document.createElement('div');
    div.textContent = mensaje;
    div.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: ${color}; color: white; padding: 12px 24px; border-radius: 8px;
        font-size: 14px; font-weight: bold; z-index: 1000;
        animation: fadeInOut 2s ease-in-out; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

// Animación
const styleAnim = document.createElement('style');
styleAnim.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(styleAnim);

// Mostrar/ocultar campos según forma
formaTanque.addEventListener('change', function() {
    if (this.value === 'redondo') {
        diametroGroup.style.display = 'block';
        anchoGroup.style.display = 'none';
    } else {
        diametroGroup.style.display = 'none';
        anchoGroup.style.display = 'block';
    }
});

// Unidades
unidadesCaudalSelect.addEventListener('change', function() {
    const u = this.value;
    if (u === 'm3h') unidadLabel.textContent = 'Ingrese el caudal en m³/h';
    else if (u === 'm3min') unidadLabel.textContent = 'Ingrese el caudal en m³/min (se convertirá a m³/h)';
    else if (u === 'cfm') unidadLabel.textContent = 'Ingrese el caudal en CFM';
    else unidadLabel.textContent = 'Ingrese el caudal en L/s';
});

// Funciones de cálculo
function calcularVolumen() {
    const h = parseFloat(alturaInput.value);
    const forma = formaTanque.value;
    if (forma === 'redondo') {
        const d = parseFloat(diametroInput.value);
        const r = d / 2;
        return Math.PI * r * r * h;
    } else {
        const a = parseFloat(anchoInput.value);
        return a * a * h;
    }
}

function calcularPerdidaCodos() {
    return parseInt(cantidadCodosSelect.value) * 0.5;
}

function convertirCaudalAM3H(caudal, unidad) {
    if (unidad === 'm3min') return caudal * 60;
    if (unidad === 'cfm') return caudal * 1.69901;
    if (unidad === 'ls') return caudal * 3.6;
    return caudal;
}

function obtenerDimension() {
    if (formaTanque.value === 'redondo') return parseFloat(diametroInput.value);
    else return parseFloat(anchoInput.value);
}

function obtenerNombreDimension() {
    return formaTanque.value === 'redondo' ? 'Diámetro' : 'Ancho';
}

function obtenerUnidadOriginal(unidad) {
    if (unidad === 'm3min') return 'm³/min';
    if (unidad === 'cfm') return 'CFM';
    if (unidad === 'ls') return 'L/s';
    return 'm³/h';
}

// Cálculo principal con recomendaciones adicionales
function calcularVentilacion() {
    const altura = parseFloat(alturaInput.value);
    const dimension = obtenerDimension();
    const longManguera = parseFloat(longitudMangueraInput.value);
    const caudalEntrada = parseFloat(caudalVentiladorInput.value);

    if (isNaN(altura) || altura <= 0) return mostrarError('Altura válida (>0)');
    if (isNaN(dimension) || dimension <= 0) return mostrarError(`${obtenerNombreDimension()} válido (>0)`);
    if (isNaN(longManguera) || longManguera <= 0) return mostrarError('Longitud de manguera >0');
    if (isNaN(caudalEntrada) || caudalEntrada <= 0) return mostrarError('Caudal >0');

    const volumen = calcularVolumen();
    const unidad = unidadesCaudalSelect.value;
    const caudalM3H = convertirCaudalAM3H(caudalEntrada, unidad);
    const perdidas = longManguera * 0.1 + calcularPerdidaCodos();
    let caudalEfectivo = caudalM3H - perdidas;
    if (caudalEfectivo <= 0) {
        mostrarError('Caudal insuficiente para vencer pérdidas');
        return;
    }

    const renovaciones = caudalEfectivo / volumen;
    let clase, color, mensaje;
    if (renovaciones >= 6) {
        clase = 'result-excelente';
        color = '#48BB78';
        mensaje = '✓ EXCELENTE - Ventilación adecuada (>6 renovaciones/hora)';
    } else if (renovaciones >= 4) {
        clase = 'result-aceptable';
        color = '#ED8936';
        mensaje = '⚠️ ACEPTABLE - Considere aumentar caudal (>4 renovaciones/hora)';
    } else {
        clase = 'result-insuficiente';
        color = '#F56565';
        mensaje = '❌ INSUFICIENTE - Requiere mayor capacidad';
    }

    // === RECOMENDACIÓN ADICIONAL PARA TANQUES DE SODA ===
    let sodaRecomendacion = '';
    if (window.tanqueActual && window.tanqueActual.soda === true) {
        sodaRecomendacion = `
            <br><br>
            <div style="background: rgba(245, 101, 101, 0.2); padding: 12px; border-radius: 8px; border-left: 4px solid #F56565;">
                <strong>⚠️ ADVERTENCIA - TANQUE CON SODA (FV32 / RV81)</strong><br>
                • <strong>Riesgos específicos:</strong> Polvo de soda (irritante), posible fermentación con generación de CO₂ y deficiencia de oxígeno.<br>
                • <strong>Monitoreo obligatorio:</strong> Medir O₂ (19.5-23.5%) y CO₂ (<0.5%) antes y durante el ingreso. Usar detector de gases.<br>
                • <strong>Protección respiratoria:</strong> Respirador con filtro para partículas (P100 o N100) como respaldo. Línea de aire si hay riesgo alto.<br>
                • <strong>Ventilación continua:</strong> Mantener el ventilador funcionando durante toda la estancia. No confiar solo en la ventilación previa.<br>
                • <strong>Procedimiento especial:</strong> Espacio confinado con permiso de trabajo. Tener vigía exterior y equipo de rescate.<br>
                • <strong>Limpieza previa:</strong> Si es posible, lavar o neutralizar residuos de soda antes de ingresar.
            </div>
        `;
    }

    const resultadoHTML = `
        <div>
            <strong>📊 RESULTADOS DEL CÁLCULO</strong><br>
            ${window.tanqueActual ? `<strong>🏷️ Tanque:</strong> ${window.tanqueActual.nombre}<br>` : ''}
            <strong>📐 Dimensiones:</strong><br>
            • Forma: ${formaTanque.options[formaTanque.selectedIndex].text}<br>
            • Altura: ${altura.toFixed(2)} m<br>
            • ${obtenerNombreDimension()}: ${dimension.toFixed(2)} m<br>
            • Volumen: ${volumen.toFixed(2)} m³<br><br>
            <strong>💨 Ventilación:</strong><br>
            • Caudal nominal: ${caudalEntrada.toFixed(2)} ${obtenerUnidadOriginal(unidad)} = ${caudalM3H.toFixed(2)} m³/h<br>
            • Caudal efectivo: ${caudalEfectivo.toFixed(2)} m³/h (${(caudalEfectivo/60).toFixed(2)} m³/min)<br>
            • Pérdidas totales: ${perdidas.toFixed(2)} m³/h<br><br>
            <strong>⏱️ Tiempos:</strong><br>
            • 1 renovación: ${(volumen/caudalEfectivo*60).toFixed(1)} min<br>
            • 5 renovaciones: ${(volumen/caudalEfectivo*60*5).toFixed(1)} min<br>
            • Renovaciones/hora: ${renovaciones.toFixed(1)}<br><br>
            <strong>✅ RECOMENDACIÓN:</strong><br>
            <span style="color:${color}; font-weight:bold;">${mensaje}</span>
            ${sodaRecomendacion}
        </div>
    `;

    resultadoContainer.style.display = 'block';
    resultadoContainer.className = `result-card ${clase}`;
    resultadoTexto.innerHTML = resultadoHTML;
    resultadoContainer.scrollIntoView({ behavior: 'smooth' });
}

function mostrarError(mensaje) {
    resultadoContainer.style.display = 'block';
    resultadoContainer.className = 'result-card result-insuficiente';
    resultadoTexto.innerHTML = `<div style="color:#F56565; padding:20px;"><strong>❌ ERROR</strong><br>${mensaje}</div>`;
}

btnCalcular.addEventListener('click', calcularVentilacion);
// Enter
['altura','diametro','ancho','longitudManguera','caudalVentilador'].forEach(id => {
    document.getElementById(id)?.addEventListener('keypress', e => { if(e.key === 'Enter') calcularVentilacion(); });
});
// Inicializar
formaTanque.dispatchEvent(new Event('change'));
unidadesCaudalSelect.dispatchEvent(new Event('change'));
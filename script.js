// ==================== DATOS DE TANQUES ====================
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
        { id: "RB79A", nombre: "RB79A - SALMUERA", alto: 2, diametro: 2.44, forma: "redondo", soda: false },
        { id: "RV81", nombre: "RV81 - SODA", alto: 3, diametro: 2.92, forma: "cuadrado", soda: true }, // RB81
        { id: "SV50", nombre: "SV50 - GRASA", alto: 3.2, diametro: 3.8, forma: "redondo", soda: false },
        { id: "SV50A", nombre: "SV50A - GRASA", alto: 3.2, diametro: 3.8, forma: "redondo", soda: false },
        { id: "TK1", nombre: "TK1 - JABON", alto: 3.78, diametro: 3.91, forma: "redondo", soda: false },
        { id: "TK2", nombre: "TK2 - JABON", alto: 3.78, diametro: 3.91, forma: "redondo", soda: false }
    ],
    Liquidos: [],
    CuidadoOral: [],
    Axion: []
};

// ==================== ELEMENTOS DEL DOM ====================
const plantaSelect = document.getElementById('planta');
const tanqueSelect = document.getElementById('tanque');
const btnLimpiar = document.getElementById('btnLimpiarCampos');
const formaTanque = document.getElementById('formaTanque');
const diametroGroup = document.getElementById('diametroGroup');
const anchoGroup = document.getElementById('anchoGroup');
const diametroInput = document.getElementById('diametro');
const anchoInput = document.getElementById('ancho');
const alturaInput = document.getElementById('altura');
const longManguera = document.getElementById('longitudManguera');
const cantidadCodos = document.getElementById('cantidadCodos');
const unidadesCaudal = document.getElementById('unidadesCaudal');
const caudalInput = document.getElementById('caudalVentilador');
const unidadLabel = document.getElementById('unidadLabel');
const btnCalcular = document.getElementById('btnCalcular');
const resultadoContainer = document.getElementById('resultadoContainer');
const resultadoTexto = document.getElementById('resultadoTexto');
const themeToggle = document.getElementById('themeToggle');

// Nuevos elementos
const tipoInverso = document.getElementById('tipoInverso');
const panelInverso = document.getElementById('panelInverso');
const valorInverso = document.getElementById('valorInverso');
const labelInverso = document.getElementById('labelInverso');
const unidadInverso = document.getElementById('unidadInverso');
const resultadoInversoDiv = document.getElementById('resultadoInverso');
const usarSegundo = document.getElementById('usarSegundoVentilador');
const panelSegundo = document.getElementById('panelSegundoVentilador');
const caudal2Input = document.getElementById('caudalVentilador2');
const unidades2 = document.getElementById('unidadesCaudal2');
const modoCombinacion = document.getElementById('modoCombinacion');
const btnCopiar = document.getElementById('btnCopiarResultado');
const btnPDF = document.getElementById('btnDescargarPDF');

let tanqueActual = null;

// ==================== TEMA OSCURO ====================
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
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

// ==================== HELPER: NOTIFICACIONES ====================
function notificar(msg, color) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: ${color}; color: white; padding: 12px 24px; border-radius: 8px;
        font-size: 14px; font-weight: bold; z-index: 1000;
        animation: fadeInOut 2s ease-in-out; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 2000);
}

// ==================== CARGAR TANQUES ====================
plantaSelect.addEventListener('change', function() {
    const planta = this.value;
    const tanques = tanquesPorPlanta[planta] || [];
    tanqueSelect.innerHTML = '<option value="">Seleccione un tanque...</option>';
    if (tanques.length) {
        tanqueSelect.disabled = false;
        tanques.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.nombre;
            tanqueSelect.appendChild(opt);
        });
    } else {
        tanqueSelect.disabled = true;
        tanqueSelect.innerHTML = '<option value="">No hay tanques</option>';
    }
    limpiarCamposTanque();
});

tanqueSelect.addEventListener('change', function() {
    const id = this.value;
    if (!id) return;
    const planta = plantaSelect.value;
    const tanques = tanquesPorPlanta[planta] || [];
    const t = tanques.find(t => t.id === id);
    if (t) {
        alturaInput.value = t.alto;
        if (t.forma === 'redondo') {
            formaTanque.value = 'redondo';
            diametroGroup.style.display = 'block';
            anchoGroup.style.display = 'none';
            diametroInput.value = t.diametro;
            anchoInput.value = '';
        } else {
            formaTanque.value = 'cuadrado';
            diametroGroup.style.display = 'none';
            anchoGroup.style.display = 'block';
            anchoInput.value = t.diametro;
            diametroInput.value = '';
        }
        tanqueActual = t;
        notificar(`✅ Cargado: ${t.nombre}`, '#48BB78');
    }
});

function limpiarCamposTanque() {
    alturaInput.value = '';
    diametroInput.value = '';
    anchoInput.value = '';
    formaTanque.value = 'redondo';
    diametroGroup.style.display = 'block';
    anchoGroup.style.display = 'none';
    tanqueActual = null;
}

btnLimpiar.addEventListener('click', () => {
    limpiarCamposTanque();
    plantaSelect.value = '';
    tanqueSelect.innerHTML = '<option value="">Primero seleccione una planta...</option>';
    tanqueSelect.disabled = true;
    longManguera.value = '';
    cantidadCodos.value = '0';
    caudalInput.value = '';
    caudal2Input.value = '';
    unidades2.value = 'm3h';
    usarSegundo.value = 'no';
    panelSegundo.style.display = 'none';
    tipoInverso.value = 'ninguno';
    panelInverso.style.display = 'none';
    valorInverso.value = '';
    resultadoInversoDiv.style.display = 'none';
    resultadoContainer.style.display = 'none';
    notificar('🧹 Campos limpiados', '#4299E1');
});

// ==================== MOSTRAR/OCULTAR CAMPOS ====================
formaTanque.addEventListener('change', function() {
    if (this.value === 'redondo') {
        diametroGroup.style.display = 'block';
        anchoGroup.style.display = 'none';
    } else {
        diametroGroup.style.display = 'none';
        anchoGroup.style.display = 'block';
    }
});

unidadesCaudal.addEventListener('change', function() {
    const u = this.value;
    if (u === 'm3h') unidadLabel.textContent = 'Ingrese caudal en m³/h';
    else if (u === 'm3min') unidadLabel.textContent = 'Ingrese caudal en m³/min (x60 a m³/h)';
    else if (u === 'cfm') unidadLabel.textContent = 'Ingrese caudal en CFM (x1.699 a m³/h)';
    else unidadLabel.textContent = 'Ingrese caudal en L/s (x3.6 a m³/h)';
});

// Panel inverso
tipoInverso.addEventListener('change', function() {
    if (this.value === 'ninguno') {
        panelInverso.style.display = 'none';
    } else {
        panelInverso.style.display = 'block';
        if (this.value === 'renovaciones') {
            labelInverso.textContent = 'Renovaciones por hora deseadas:';
            unidadInverso.textContent = 'Ej: 6 (mínimo seguro)';
        } else {
            labelInverso.textContent = 'Tiempo máximo para 1 renovación (minutos):';
            unidadInverso.textContent = 'Ej: 10 minutos';
        }
    }
    resultadoInversoDiv.style.display = 'none';
});

// Panel segundo ventilador
usarSegundo.addEventListener('change', function() {
    panelSegundo.style.display = this.value === 'si' ? 'block' : 'none';
});

// ==================== FUNCIONES DE CONVERSIÓN Y CÁLCULO ====================
function convertirAM3H(caudal, unidad) {
    if (unidad === 'm3min') return caudal * 60;
    if (unidad === 'cfm') return caudal * 1.69901;
    if (unidad === 'ls') return caudal * 3.6;
    return caudal;
}

function calcularVolumen() {
    const h = parseFloat(alturaInput.value);
    if (isNaN(h)) return 0;
    const forma = formaTanque.value;
    if (forma === 'redondo') {
        const d = parseFloat(diametroInput.value);
        if (isNaN(d)) return 0;
        const r = d / 2;
        return Math.PI * r * r * h;
    } else {
        const a = parseFloat(anchoInput.value);
        if (isNaN(a)) return 0;
        return a * a * h;
    }
}

function obtenerDimension() {
    const forma = formaTanque.value;
    if (forma === 'redondo') return parseFloat(diametroInput.value);
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

function calcularPerdidas(longitud, codos) {
    return longitud * 0.1 + codos * 0.5;
}

// ==================== CÁLCULO PRINCIPAL + INVERSO + MÚLTIPLES VENTILADORES ====================
function calcularTodo() {
    // Validaciones básicas
    const altura = parseFloat(alturaInput.value);
    const dimension = obtenerDimension();
    const longitud = parseFloat(longManguera.value);
    if (isNaN(altura) || altura <= 0) return mostrarError('Altura válida');
    if (isNaN(dimension) || dimension <= 0) return mostrarError(`${obtenerNombreDimension()} válido`);
    if (isNaN(longitud) || longitud <= 0) return mostrarError('Longitud de manguera >0');

    const volumen = calcularVolumen();
    if (volumen <= 0) return mostrarError('Volumen no calculable');

    // Caudal efectivo combinado
    const caudal1 = parseFloat(caudalInput.value);
    if (isNaN(caudal1) || caudal1 <= 0) return mostrarError('Caudal del primer ventilador >0');

    const unidad1 = unidadesCaudal.value;
    let caudalTotalM3H = convertirAM3H(caudal1, unidad1);

    const usar2 = usarSegundo.value === 'si';
    if (usar2) {
        const caudal2 = parseFloat(caudal2Input.value);
        if (!isNaN(caudal2) && caudal2 > 0) {
            const unidad2Val = unidades2.value;
            const caudal2M3H = convertirAM3H(caudal2, unidad2Val);
            if (modoCombinacion.value === 'suma') {
                caudalTotalM3H += caudal2M3H;
            } else {
                caudalTotalM3H = Math.max(caudalTotalM3H, caudal2M3H);
            }
        }
    }

    const codos = parseInt(cantidadCodos.value);
    const perdidas = calcularPerdidas(longitud, codos);
    let caudalEfectivo = caudalTotalM3H - perdidas;
    if (caudalEfectivo <= 0) {
        return mostrarError(`Caudal efectivo nulo. Pérdidas: ${perdidas.toFixed(2)} m³/h > caudal total`);
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

    // Cálculo inverso (caudal necesario)
    let textoInverso = '';
    const tipoInv = tipoInverso.value;
    if (tipoInv !== 'ninguno') {
        const valor = parseFloat(valorInverso.value);
        if (!isNaN(valor) && valor > 0) {
            let caudalNecesarioM3H = 0;
            if (tipoInv === 'renovaciones') {
                caudalNecesarioM3H = (volumen * valor) + perdidas;
            } else { // tiempo en minutos para 1 renovación
                const tiempoHoras = valor / 60;
                caudalNecesarioM3H = (volumen / tiempoHoras) + perdidas;
            }
            if (caudalNecesarioM3H > 0) {
                const caudalNecesarioMin = (caudalNecesarioM3H / 60).toFixed(2);
                textoInverso = `
                    <div class="info-card" style="margin-top: 10px; padding: 12px;">
                        <strong>📌 Caudal necesario según criterio:</strong><br>
                        • ${tipoInv === 'renovaciones' ? `${valor} renovaciones/hora` : `1 renovación en ${valor} minutos`}<br>
                        • Caudal mínimo requerido: <strong>${caudalNecesarioM3H.toFixed(2)} m³/h</strong> (${caudalNecesarioMin} m³/min)<br>
                        ${caudalTotalM3H < caudalNecesarioM3H ? '<span style="color:#F56565;">⚠️ Tu caudal actual es INSUFICIENTE para ese criterio</span>' : '<span style="color:#48BB78;">✓ Tu caudal actual supera el mínimo requerido</span>'}
                    </div>
                `;
                resultadoInversoDiv.innerHTML = textoInverso;
                resultadoInversoDiv.style.display = 'block';
            } else {
                resultadoInversoDiv.style.display = 'none';
            }
        } else {
            resultadoInversoDiv.style.display = 'none';
        }
    } else {
        resultadoInversoDiv.style.display = 'none';
    }

    // Recomendación de soda
    let sodaRecom = '';
    if (tanqueActual && tanqueActual.soda) {
        sodaRecom = `
            <br><br>
            <div style="background: rgba(245, 101, 101, 0.2); padding: 12px; border-radius: 8px; border-left: 4px solid #F56565;">
                <strong>⚠️ ADVERTENCIA - TANQUE CON SODA</strong><br>
                • Monitorear O₂ (19.5-23.5%) y CO₂ (<0.5%)<br>
                • Usar respirador con filtro para partículas (P100)<br>
                • Ventilación continua durante toda la estancia<br>
                • Permiso de trabajo y vigía exterior
            </div>
        `;
    }

    // Texto del resultado principal
    let resultadoHTML = `
        <div>
            <strong>📊 RESULTADOS DEL CÁLCULO</strong><br>
            ${tanqueActual ? `<strong>🏷️ Tanque:</strong> ${tanqueActual.nombre}<br>` : ''}
            <strong>📐 Dimensiones:</strong><br>
            • Forma: ${formaTanque.options[formaTanque.selectedIndex].text}<br>
            • Altura: ${altura.toFixed(2)} m<br>
            • ${obtenerNombreDimension()}: ${dimension.toFixed(2)} m<br>
            • Volumen: ${volumen.toFixed(2)} m³<br><br>
            <strong>💨 Ventilación:</strong><br>
            • Caudal total instalado: ${caudalTotalM3H.toFixed(2)} m³/h (${(caudalTotalM3H/60).toFixed(2)} m³/min)<br>
            • Caudal efectivo: ${caudalEfectivo.toFixed(2)} m³/h (${(caudalEfectivo/60).toFixed(2)} m³/min)<br>
            • Pérdidas totales: ${perdidas.toFixed(2)} m³/h<br><br>
            <strong>⏱️ Tiempos:</strong><br>
            • 1 renovación: ${(volumen/caudalEfectivo*60).toFixed(1)} min<br>
            • 5 renovaciones: ${(volumen/caudalEfectivo*60*5).toFixed(1)} min<br>
            • Renovaciones/hora: ${renovaciones.toFixed(1)}<br><br>
            <strong>✅ RECOMENDACIÓN:</strong><br>
            <span style="color:${color}; font-weight:bold;">${mensaje}</span>
            ${sodaRecom}
        </div>
    `;

    resultadoContainer.style.display = 'block';
    resultadoContainer.className = `result-card ${clase}`;
    resultadoTexto.innerHTML = resultadoHTML + (textoInverso ? `<br>${textoInverso}` : '');
    resultadoContainer.scrollIntoView({ behavior: 'smooth' });
}

function mostrarError(mensaje) {
    resultadoContainer.style.display = 'block';
    resultadoContainer.className = 'result-card result-insuficiente';
    resultadoTexto.innerHTML = `<div style="color:#F56565; padding:20px;"><strong>❌ ERROR</strong><br>${mensaje}</div>`;
}

// ==================== COPIAR RESULTADO Y PDF ====================
async function copiarResultado() {
    const texto = resultadoTexto.innerText;
    try {
        await navigator.clipboard.writeText(texto);
        notificar('📋 Resultado copiado al portapapeles', '#4299E1');
    } catch (err) {
        notificar('❌ No se pudo copiar', '#F56565');
    }
}

async function descargarPDF() {
    if (resultadoContainer.style.display === 'none') {
        notificar('❌ Primero realiza un cálculo', '#ED8936');
        return;
    }
    
    // Obtener fecha y hora actual
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

	// Obtener planta y tanque seleccionados
    const plantaSelect = document.getElementById('planta');
    const tanqueSelect = document.getElementById('tanque');
    const planta = plantaSelect.options[plantaSelect.selectedIndex]?.text || 'No especificada';
    const tanque = tanqueSelect.options[tanqueSelect.selectedIndex]?.text || 'No especificado';
    
    // Obtener el texto del resultado
    const textoOriginal = resultadoTexto.innerText;
    
    // Crear el contenido con fecha y hora
    const contenidoConFecha = `
================================================
    INFORME DE VENTILACIÓN
    Espacios Confinados
================================================
    Fecha y hora: ${fechaHora}
    Planta: ${planta}
    Tanque: ${tanque}
================================================

${textoOriginal}

================================================

    `;
    
    try {
        // Crear un blob de texto con la fecha incluida
        const blob = new Blob([contenidoConFecha], { type: 'text/plain;charset=utf-8' });
        
        // Crear nombre de archivo con fecha
        const fechaArchivo = ahora.toISOString().slice(0, 19).replace(/:/g, '-');
        const nombreArchivo = `informe_ventilacion_${fechaArchivo}.txt`;
        
        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        notificar('📄 Informe descargado con fecha y hora', '#48BB78');
    } catch (error) {
        // Fallback final: copiar al portapapeles
        await navigator.clipboard.writeText(contenidoConFecha);
        notificar('📋 Texto copiado con fecha y hora', '#ED8936');
    }
}

btnCalcular.addEventListener('click', calcularTodo);
btnCopiar.addEventListener('click', copiarResultado);
btnPDF.addEventListener('click', descargarPDF);

// Enter
['altura','diametro','ancho','longitudManguera','caudalVentilador','caudalVentilador2','valorInverso'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keypress', e => { if(e.key === 'Enter') calcularTodo(); });
});

// Inicializar
formaTanque.dispatchEvent(new Event('change'));
unidadesCaudal.dispatchEvent(new Event('change'));
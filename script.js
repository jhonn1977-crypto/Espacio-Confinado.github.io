// Elementos del DOM
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
            return caudal * 60; // 1 m³/min = 60 m³/h
        case 'cfm':
            return caudal * 1.69901; // 1 CFM = 1.69901 m³/h
        case 'ls':
            return caudal * 3.6; // 1 L/s = 3.6 m³/h
        default:
            return caudal; // m³/h
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
    
    // Mostrar también el caudal en m³/min si aplica
    let caudalMinText = '';
    if (unidades !== 'm3min') {
        caudalMinText = `<br>• Caudal equivalente: ${(caudalVentilador / 60).toFixed(2)} m³/min`;
    }
    
    resultadoHTML = `
        <div>
            <strong>📊 RESULTADOS DEL CÁLCULO</strong><br><br>
            
            <strong>📐 Dimensiones del tanque:</strong><br>
            • Forma: ${formaTanque.options[formaTanque.selectedIndex].text.toUpperCase()}<br>
            • Altura: ${altura.toFixed(2)} m<br>
            • ${obtenerNombreDimension()}: ${dimension.toFixed(2)} m<br>
            • Volumen: ${volumen.toFixed(2)} m³<br><br>
            
            <strong>💨 Sistema de ventilación:</strong><br>
            • Caudal nominal: ${caudalVentilador.toFixed(2)} ${unidadOriginal} = ${caudalM3H.toFixed(2)} m³/h${unidades === 'm3min' ? '' : `<br>• Caudal equivalente: ${(caudalVentilador / 60).toFixed(2)} m³/min`}<br>
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
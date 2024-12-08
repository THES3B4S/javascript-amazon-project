const formatoMoneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });

export function centsToDollar(cents){
    return formatoMoneda.format(((cents / 100).toFixed(2)) * 4000)
}
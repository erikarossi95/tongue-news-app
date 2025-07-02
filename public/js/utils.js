/**
 * Formatta un timestamp Unix in una stringa di data leggibile.
 * @param {number} unixTimestamp 
 * @returns {string} 
 */
export function formatUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);

    // Opzioni per la formattazione della data
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    // Restituisce la data formattata localizzata.
    return date.toLocaleDateString('it-IT', options);
}

/**
 * Restituisce una nuova funzione che, quando invocata, eseguirà la funzione originale
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function} 
 */
export function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

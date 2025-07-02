
import { formatUnixTimestamp } from './utils.js';

// Riferimenti agli elementi DOM
const newsContainer = document.getElementById('news-container');
const loadingIndicator = document.getElementById('loading-indicator');
const loadMoreBtn = document.getElementById('load-more-btn');
const errorMessageDisplay = document.getElementById('error-message');

/**
 * Crea e aggiunge un elemento HTML per una singola notizia al container.
 * @param {object} newsItem 
 */
export function displayNewsItem(newsItem) {
    const newsCard = document.createElement('div');
    newsCard.classList.add('news-item'); 

    // Immagine del favicon
    const faviconElement = document.createElement('img');
    faviconElement.classList.add('news-favicon'); 
    faviconElement.alt = `Icona di ${newsItem.url}`;
    faviconElement.loading = 'lazy'; 

    if (newsItem.faviconUrl) {
        faviconElement.src = newsItem.faviconUrl;
    } else {
        // Fallback generico se il favicon non è disponibile
        faviconElement.src = 'https://placehold.co/32x32/cccccc/333333?text=🌐'; 
    }

    // Gestore di errore per il favicon
    faviconElement.onerror = () => {
        faviconElement.src = 'https://placehold.co/32x32/cccccc/333333?text=🌐'; 
        console.warn(`UI: Favicon non caricato per "${newsItem.url}", usando fallback generico.`);
    };

    // Titolo della notizia con link
    const titleElement = document.createElement('h3');
    titleElement.classList.add('news-title');
    const linkElement = document.createElement('a');
    linkElement.href = newsItem.url;
    linkElement.textContent = newsItem.title;
    linkElement.target = '_blank'; 
    linkElement.rel = 'noopener noreferrer'; 
    titleElement.appendChild(linkElement);

    // Dettagli meta: autore e data
    const metaElement = document.createElement('p');
    metaElement.classList.add('news-meta');
    
    let metaText = '';
    if (newsItem.by) {
        metaText += `Di: ${newsItem.by}`;
    }
    if (newsItem.time) {
        metaText += `${newsItem.by ? ' - ' : ''}Pubblicato il: ${formatUnixTimestamp(newsItem.time)}`;
    }
    metaElement.textContent = metaText;

    // Aggiungi gli elementi alla card della notizia
    newsCard.appendChild(faviconElement); 
    newsCard.appendChild(titleElement);
    newsCard.appendChild(metaElement);

    newsContainer.appendChild(newsCard);
}

/**
 * Pulisce il contenitore delle notizie.
 */
export function clearNews() {
    newsContainer.innerHTML = '';
}

/**
 * Mostra o nasconde l'indicatore di caricamento.
 * @param {boolean} show 
 */
export function toggleLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

/**
 * Mostra o nasconde il pulsante "Carica altro".
 * @param {boolean} show 
 * @param {boolean} [disable=false] 
 */
export function toggleLoadMoreButton(show, disable = false) {
    if (show) {
        loadMoreBtn.classList.remove('hidden');
    } else {
        loadMoreBtn.classList.add('hidden');
    }
    loadMoreBtn.disabled = disable; 
}

/**
 * Mostra o nasconde un messaggio di errore.
 * @param {string|null} message 
 */
export function displayErrorMessage(message) {
    if (message) {
        errorMessageDisplay.textContent = message;
        errorMessageDisplay.classList.remove('hidden');
    } else {
        errorMessageDisplay.textContent = '';
        errorMessageDisplay.classList.add('hidden');
    }
}

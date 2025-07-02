
import { fetchNewStoriesIds, fetchNewsItem, getFaviconUrl } from './api.js';
import { displayNewsItem, toggleLoading, toggleLoadMoreButton, displayErrorMessage, clearNews } from './ui.js';
import { debounce } from './utils.js';

// Costanti per la paginazione
const NEWS_PER_PAGE = 10; 

// Variabili di stato dell'applicazione
let allNewsIds = []; 
let allNewsItems = []; 
let filteredAndSortedNews = []; 
let currentStartIndex = 0; 

// Riferimenti agli elementi DOM per ricerca e ordinamento
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const sortSelect = document.getElementById('sort-select');
const loadMoreBtn = document.getElementById('load-more-btn');

/**
 * Filtra e ordina le notizie in base al termine di ricerca e all'opzione di ordinamento.
 * Questa funzione non carica nuove notizie, ma riorganizza quelle già caricate.
 */
function filterAndSortNews() {
    let tempNews = [...allNewsItems]; 

    // 1. Filtra per termine di ricerca
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        tempNews = tempNews.filter(item =>
            item.title.toLowerCase().includes(searchTerm)
        );
        console.log(`APP: Notizie filtrate per "${searchTerm}": ${tempNews.length} risultati.`);
    }

    // 2. Ordina
    const sortOrder = sortSelect.value;
    if (sortOrder === 'score') {
        tempNews.sort((a, b) => b.score - a.score); 
        console.log('APP: Notizie ordinate per punteggio.');
    } else { 
        tempNews.sort((a, b) => b.time - a.time); 
        console.log('APP: Notizie ordinate per data.');
    }

    filteredAndSortedNews = tempNews;
    currentStartIndex = 0; 
    loadAndDisplayNewsChunk(false); 
}

/**
 * Carica e visualizza un set di notizie dal pool filtrato e ordinato.
 * @param {boolean} [append=true] 
 */
async function loadAndDisplayNewsChunk(append = true) {
    console.log(`APP: Caricamento chunk di notizie. Append: ${append}.`);
    toggleLoading(true);
    toggleLoadMoreButton(true, true);

    displayErrorMessage(null);


    if (!append) {
        clearNews();
        console.log('APP: Contenitore notizie pulito.');
    }

    const idsToLoad = filteredAndSortedNews.slice(currentStartIndex, currentStartIndex + NEWS_PER_PAGE);

    if (idsToLoad.length === 0 && currentStartIndex === 0) {

        displayErrorMessage('Nessuna notizia trovata con i criteri specificati.');
        toggleLoading(false);
        toggleLoadMoreButton(false);
        return;
    } else if (idsToLoad.length === 0) {

        toggleLoading(false);
        toggleLoadMoreButton(false);
        console.log('APP: Tutte le notizie caricate, pulsante "Carica altro" nascosto.');
        return;
    }

    console.log(`APP: Visualizzazione di ${idsToLoad.length} notizie dal chunk.`);

    idsToLoad.forEach(item => displayNewsItem(item)); 

    currentStartIndex += idsToLoad.length; 

    toggleLoading(false);

    // Riabilita il pulsante "Carica altro" se ci sono ancora notizie da caricare
    if (currentStartIndex < filteredAndSortedNews.length) {
        toggleLoadMoreButton(true, false); 
        console.log('APP: Pulsante "Carica altro" abilitato.');
    } else {
        toggleLoadMoreButton(false); 
        console.log('APP: Nessun\'altra notizia da caricare, pulsante "Carica altro" nascosto.');
    }
}

/**
 * Inizializza l'applicazione: recupera tutti gli ID e i dettagli delle news.
 */
async function initializeApp() {
    console.log('APP: Inizializzazione applicazione...');
    toggleLoading(true); 
    displayErrorMessage(null); 

    try {
        allNewsIds = await fetchNewStoriesIds(); 
        console.log(`APP: Recuperati ${allNewsIds.length} ID delle ultime news.`);

        const initialLoadLimit = 200; 
        const idsToFetchDetails = allNewsIds.slice(0, initialLoadLimit);

        const detailPromises = idsToFetchDetails.map(async (id) => {
            try {
                const item = await fetchNewsItem(id);
                if (item && item.type === 'story' && item.url) {
                    const faviconUrl = getFaviconUrl(item.url);
                    return { ...item, faviconUrl };
                }
                return null;
            } catch (error) {
                console.error(`APP: Errore caricamento dettagli notizia ID ${id}:`, error.message);
                return null;
            }
        });

        allNewsItems = (await Promise.all(detailPromises)).filter(Boolean);
        console.log(`APP: Caricati i dettagli per ${allNewsItems.length} notizie valide.`);

        filterAndSortNews();

    } catch (error) {
        console.error('APP: Errore fatale all\'avvio dell\'applicazione:', error);
        displayErrorMessage(error.message || 'Si è verificato un errore inaspettato durante il caricamento iniziale delle news.');
        toggleLoading(false); 
        toggleLoadMoreButton(false); 
    }
}

/**
 * Click sul pulsante "Carica altro".
 */
async function handleLoadMore() {
    console.log('APP: Click sul pulsante "Carica altro".');
    loadAndDisplayNewsChunk(true); 
}

// Aggiungi gli event listener
searchButton.addEventListener('click', filterAndSortNews);
searchInput.addEventListener('input', debounce(filterAndSortNews, 500)); 
sortSelect.addEventListener('change', filterAndSortNews);
loadMoreBtn.addEventListener('click', handleLoadMore);

document.addEventListener('DOMContentLoaded', initializeApp);


import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'https://hacker-news.firebaseio.com/v0';

/**
 * Recupera un array di ID delle ultime news da Hacker News.
 * @returns {Promise<number[]>} 
 * @throws {Error} 
 */
export async function fetchNewStoriesIds() {
    console.log('API: Tentativo di recuperare gli ID delle news da:', `${API_BASE_URL}/newstories.json`);
    try {
        const response = await axios.get(`${API_BASE_URL}/newstories.json`);
        console.log('API: Risposta ricevuta per gli ID delle news:', response.data);
        if (!Array.isArray(response.data)) {
            throw new Error('Risposta API inattesa: expected array of IDs');
        }
        return response.data;
    } catch (error) {
        console.error('API: Errore durante il recupero degli ID delle news:', error);
        throw new Error('Impossibile caricare gli ID delle ultime news. Riprova più tardi.');
    }
}

/**
 * Recupera i dettagli di una singola notizia tramite il suo ID.
 * @param {number} id
 * @returns {Promise<object|null>} 
 * @throws {Error} 
 */
export async function fetchNewsItem(id) {
    console.log('API: Tentativo di recuperare i dettagli per la notizia ID:', id);
    try {
        const response = await axios.get(`${API_BASE_URL}/item/${id}.json`);
        console.log(`API: Dettagli ricevuti per ID ${id}:`, response.data);

        if (response.data === null) {
            console.warn(`API: Item ID ${id} è nullo (es. cancellato).`);
            return null;
        }

        if (!response.data.id || !response.data.time) {
             console.warn(`API: Dati minimi (ID o tempo) mancanti per item ID ${id}.`);
             return null;
        }

        return response.data;
    } catch (error) {
        console.error(`API: Errore durante il recupero della notizia ID ${id}:`, error);
        throw new Error(`Impossibile caricare i dettagli per la notizia ID ${id}.`);
    }
}

/**
 * Estrae il dominio da un URL e costruisce l'URL del favicon usando un servizio di Google.
 * @param {string} url
 * @returns {string|null} 
 */
export function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch (error) {
        console.warn(`API: Impossibile estrarre il dominio o costruire l'URL del favicon per: ${url}`, error);
        return null;
    }
}

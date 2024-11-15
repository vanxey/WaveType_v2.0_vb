/**
 * Builds the query URL for searching lyrics with the Musixmatch API.
 * @param {String} artist - The artist name.
 * @param {String} track - The track name.
 * @param {String} apiToken - The API token for Musixmatch.
 * @return {String} - The search query URL.
 */
export const API_BUILD_QUERY = (artist, track, apiToken) => {
    const apiBaseURL = 'https://api.musixmatch.com/ws/1.1/';

    if (!artist || !track) {
        throw new Error(`Error: No artist or track specified in the Musixmatch database (artist: ${artist}, track: ${track})`);
    }
    if (!apiToken) throw new Error('Error: No access to Musixmatch API.');

    return `${apiBaseURL}track.search?q_artist=${artist}&q_track=${track}&page_size=1&page=1&s_track_rating=desc&apikey=${apiToken}`;
};

/**
 * Retrieves the track ID from Musixmatch using the search query URL.
 * @param {String} query - The search query URL.
 * @return {Promise<Number>} - The track ID.
 */
export const API_GET_TRACK_ID = async (query) => {
    const response = await fetch(query);
    const data = await response.json();
    return data.message.body.track_list[0].track.track_id;
};

/**
 * Retrieves lyrics for a specific track ID from Musixmatch.
 * @param {Number} trackId - The track ID.
 * @param {String} apiToken - The API token for Musixmatch.
 * @return {Promise<String>} - The lyrics.
 */
export const API_GET_LYRICS = async (trackId, apiToken) => {
    const apiBaseURL = 'https://api.musixmatch.com/ws/1.1/';
    const lyricsQuery = `${apiBaseURL}track.lyrics.get?track_id=${trackId}&apikey=${apiToken}`;

    const response = await fetch(lyricsQuery);
    const data = await response.json();
    return data.message.body.lyrics.lyrics_body;
};

/**
 * Combines search query and API calls to Musixmatch, retrieving lyrics based on artist and track.
 * @param {String} artist - The artist name.
 * @param {String} track - The track name.
 * @param {String} apiToken - The API token for Musixmatch.
 * @return {Promise<String>} - The lyrics.
 */
export const API_CALL_MUSIXMATCH = async (artist, track, apiToken) => {
    try {
        const query = API_BUILD_QUERY(artist, track, apiToken);
        const trackId = await API_GET_TRACK_ID(query);
        return await API_GET_LYRICS(trackId, apiToken);
    } catch (error) {
        return error.message;
    }
};



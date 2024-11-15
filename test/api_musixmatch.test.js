import { expect, it, describe } from 'vitest';
import { API_BUILD_QUERY, API_GET_TRACK_ID, API_GET_LYRICS } from '../views/api/api_connection_musixmatch';
import arcticMonkeysTestData from './test data/arctic_monkeys_test.json' assert { type: 'json' };
import "dotenv/config";

describe('MusixMatch API Integration Tests', () => {

    const artist = 'arctic monkeys';
    const track = 'arabella';
    const apiToken = process.env.API_TOKEN;
    const expectedQuery = `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist}&q_track=${track}&page_size=1&page=1&s_track_rating=desc&apikey=${apiToken}`;
    
    const expectedTrackId = arcticMonkeysTestData.track_id;
    const expectedLyrics = arcticMonkeysTestData.lyrics;

    describe('API_BUILD_QUERY', () => {
        it('builds the correct search query for MusixMatch', () => {
            const query = API_BUILD_QUERY(artist, track, apiToken);
            expect(query).toEqual(expectedQuery);
        });
    });

    describe('API_GET_TRACK_ID', () => {
        it('returns the track ID of the queried song and artist', async () => {
            const trackId = await API_GET_TRACK_ID(expectedQuery);
            expect(trackId).toEqual(expectedTrackId);
        });
    });

    describe('API_GET_LYRICS', () => {
        it('retrieves lyrics for the specified track ID', async () => {
            const lyrics = await API_GET_LYRICS(expectedTrackId, apiToken);
            expect(lyrics.toLowerCase()).toEqual(expectedLyrics.toLowerCase());
        });
    });
    

});

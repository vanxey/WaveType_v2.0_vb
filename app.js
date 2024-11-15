import express from "express";
import { API_CALL_MUSIXMATCH } from "./views/api/api_connection_musixmatch.js";
import { CREATE_USER, DELETE_USER, GET_SPECIFIC_USER, UPDATE_USER, GET_ALL_USERS } from "./views/db/crud_functions.js";
import { logger } from './middlewares/logger.js';
import { readableScore } from "./views/helpers/user-views.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

// Setup view engine and middleware
app.set('view engine', 'ejs');
app.use(logger);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Helper Functions for Rendering Pages ---
const renderPage = (res, view, options = {}) => res.render(view, options);

// --- Route Handlers ---

// Home and Static Pages
app.get('/', (req, res) => renderPage(res, 'index', { lyrics: '', scroll: 'main-container-1' }));
app.get('/wavetype', (req, res) => res.redirect('/'));
app.get('/about', (req, res) => renderPage(res, 'about', { hClass: "nav-header-1" }));
app.get('/contact', (req, res) => renderPage(res, 'contact', { hClass: "nav-header-1" }));
app.get('/kbrd-test', (req, res) => renderPage(res, 'kbrd-test'));
app.get('/user', (req, res) => renderPage(res, 'user', { hClass: "nav-header-1" }));

app.get('/wavetype/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    const animalEmoji = keyword === 'dog' ? '🐶' : keyword === 'cat' ? '🐱' : '🥶';
    renderPage(res, 'random-slug', { keyword: `${keyword} ${animalEmoji}` });
});

// --- CRUD Operations ---

// View Users
const renderUsers = async (view, req, res) => {
    try {
        const users = await GET_ALL_USERS();
        renderPage(res, view, { users, readableScore, hClass: "nav-header-2" });
    } catch (error) {
        console.error(error);
        renderPage(res, view, { users: [], readableScore, hClass: "nav-header-2" });
    }
};

app.get('/users/view', (req, res) => renderUsers('users/index', req, res));
app.get('/users/which', (req, res) => renderUsers('users/which', req, res));

// View Specific User
app.get('/users/view/:slug', async (req, res) => {
    try {
        const user = await GET_SPECIFIC_USER(req.params.slug);
        if (!user) throw new Error('User not found');
        renderPage(res, 'users/show', { user, readableScore, hClass: "nav-header-2" });
    } catch (error) {
        console.error(error);
        res.status(404).send("Could not find the user you're looking for.");
    }
});

// Edit User
app.get('/users/view/:slug/edit', async (req, res) => {
    try {
        const user = await GET_SPECIFIC_USER(req.params.slug);
        if (!user) throw new Error('User not found');
        renderPage(res, 'users/edit', { user, hClass: "nav-header-2" });
    } catch (error) {
        console.error(error);
        res.status(404).send("Could not find the user you're looking for.");
    }
});

app.post('/users/:slug', async (req, res) => {
    try {
        const updatedUser = await UPDATE_USER(req.params.slug, req.body);
        res.redirect(`/users/view/${updatedUser.slug}`);
    } catch (error) {
        console.error(error);
        res.send('Error: The user could not be updated.');
    }
});

// Delete User
app.get('/users/view/:slug/delete', async (req, res) => {
    try {
        await DELETE_USER(req.params.slug);
        res.redirect('/users/view');
    } catch (error) {
        console.error(error);
        res.send('Error: No user was deleted.');
    }
});

// Create User
app.get('/users/new', (req, res) => renderPage(res, 'users/new', { hClass: "nav-header-2" }));

app.post('/users', async (req, res) => {
    try {
        await CREATE_USER(req.body.slug, req.body.name, req.body.score);
        res.redirect('/users/view');
    } catch (error) {
        console.error(error);
        res.send('Error: The user could not be created.');
    }
});

// Lyrics API Call
app.post('/search', async (req, res) => {
    try {
        const lyrics = await API_CALL_MUSIXMATCH(req.body.artist, req.body.track, process.env.API_TOKEN);
        if (res.statusCode === 200) renderPage(res, 'index', { lyrics, scroll: '.display-start' });
        else throw new Error(`Error ${res.statusCode}: No lyrics found for artist: ${req.body.artist}, track: ${req.body.track}`);
    } catch (error) {
        renderPage(res, 'error', { error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`👋 Started server on port ${PORT}`);
});

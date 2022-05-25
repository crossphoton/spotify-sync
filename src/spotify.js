const fetch = require("node-fetch");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const SPOTIFY_AUTH_HOST = new URL("https://accounts.spotify.com/authorize");
const OAUTH_REDIRECT_URL = new URL(process.env.OAUTH_REDIRECT_URL);

let SPOTIFY_REDIRECT_URL = SPOTIFY_AUTH_HOST;
let scope = "user-read-currently-playing user-read-email";

SPOTIFY_REDIRECT_URL.searchParams.append("response_type", "code");
SPOTIFY_REDIRECT_URL.searchParams.append("client_id", CLIENT_ID);
SPOTIFY_REDIRECT_URL.searchParams.append("scope", scope);
SPOTIFY_REDIRECT_URL.searchParams.append("redirect_uri", OAUTH_REDIRECT_URL.toString());
SPOTIFY_REDIRECT_URL.searchParams.append("state", "spotify-sync");


const SPOTIFY_TOKEN_HOST = new URL("https://accounts.spotify.com/api/token");

module.exports = {
    /**
     * Get access_token using auth code
     * @param {string} code 
     */
    getAccessToken: async function(code) {
        let bodyFormData = new URLSearchParams();
        bodyFormData.append("grant_type", "authorization_code");
        bodyFormData.append("code", code);
        bodyFormData.append("redirect_uri", OAUTH_REDIRECT_URL.toString());

        console.log(bodyFormData);

        const response = await fetch(SPOTIFY_TOKEN_HOST.toString(), {
            method: "POST",
            body: bodyFormData,
            headers: {
                "Authorization": `Basic ${(Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))}`,
                // "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return response;
    },
    /**
     * Get access_token using auth code
     * @param {string} code 
     */
    refreshAccessToken: async function(refresh_token) {
        let bodyFormData = new URLSearchParams();
        bodyFormData.append("grant_type", "refresh_token");
        bodyFormData.append("refresh_token", refresh_token);
        bodyFormData.append("client_id", CLIENT_ID);

        const response = await fetch(SPOTIFY_TOKEN_HOST.toString(), {
            method: "POST",
            body: bodyFormData,
            headers: {
                "Authorization": `Basic ${(Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return response;
    },
    /**
     *
     * @param {string} access_token 
     */
    getUser: async function(access_token) {
        const URL = "https://api.spotify.com/v1/me";
        const response = await fetch(URL, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            }
        });

        return response;
    },

    /**
     * 
     * @param {string} access_token 
     * @returns 
     */
    getCurrentPlaying: async function(access_token) {
        const URL = "https://api.spotify.com/v1/me/player/currently-playing";
        const response = await fetch(URL, {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            }
        });

        return response;
    },

    SPOTIFY_REDIRECT_URL
}
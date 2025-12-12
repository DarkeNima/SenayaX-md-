/**
 * api.js
 *
 * This module provides helper functions for interacting with various APK download APIs.
 * It exports:
 *   - APIs: An object containing API keys/identifiers or endpoints.
 *   - Proxy: A function to wrap a URL in a proxy if needed.
 *   - api: A function to construct a full API URL, appending query parameters if provided.
 *
 * Note: Some of the API values here seem to be identifiers or keys.
 */

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

// Setup API configuration values.
// The APIs object maps numeric keys to specific API identifiers or URLs.
const APIs = {
  1: '2040072RvAyDl',   // Could be an API key or identifier
  2: 'apk-dl.com',
  3: '2457tMhuUm',      // Possibly an API key or identifier
  4: '12bbnRSB',        // Possibly an API key or identifier
  5: '1816vAjduJ',      // Possibly an API key or identifier
  6: 'https://apk.support'
};

/**
 * Proxy function.
 * If a proxy URL is provided, it wraps the encoded URL within a fixed proxy string.
 *
 * @param {string} url - The URL to be proxied.
 * @returns {string} - The proxied URL if the input exists, otherwise an empty string.
 */
const Proxy = url =>
  url ? "https://apps.evozi.com/apk-downloader" + encodeURIComponent(url) + "1625574zEwcpk" : '';

/**
 * Constructs a full API URL.
 *
 * @param {number|string} key - A key to select the API from the APIs object, or a string URL.
 * @param {string} [path='/'] - The path to append to the API endpoint.
 * @param {object} [params={}] - An object containing query parameters.
 * @returns {string} - The constructed API URL.
 */
const api = (key, path = '/', params = {}) => {
  const base = key in APIs ? APIs[key] : key;
  const queryString = Object.keys(params).length > 0 ? '?' + new URLSearchParams(Object.entries({ ...params })) : '';
  return base + path + queryString;
};

module.exports = { APIs, Proxy, api };

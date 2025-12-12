/**
 * apkdl.js
 * 
 * This module provides functions to search for and download APK files.
 * It uses an API (configured via the tools.api function from the config file) to query for apps.
 * The module exposes two functions:
 *    - search(query): Returns a list of search results (each with a name and package ID).
 *    - download(query): Returns detailed information (name, last update, package, size, icon URL, and download link)
 *      for an app based on a query.
 */

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

const fileSizeUrl = (...args) =>
  import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args));

const cheerio = require('cheerio');
const tools = require('./config.js');

// Searches for apps using the provided query. Returns an array with objects containing the app name and package id.
async function search(query) {
  // Use the API endpoint defined in the config.
  let response = await fetch(tools.api(5, '/apps/search', {
    query: query,
    limit: 1000
  }));
  
  // Parse the JSON response.
  response = await response.json();
  
  // Map the returned list to only include the app's name and its package as id.
  let results = response.data.list.map(item => {
    return {
      name: item.name,
      id: item.package
    };
  });
  
  return results;
}

// Downloads the APK details for the provided query (returns detailed info for the first app found).
async function download(query) {
  // Call the same API endpoint with limit 1 to get detailed info for a single app.
  let response = await fetch(tools.api(5, '/apps/search', {
    query: query,
    limit: 1
  }));
  response = await response.json();
  
  // Get the first app in the list.
  const appItem = response.data.list[0];
  
  // Extract necessary details.
  const name = appItem.name;
  const pkg = appItem.package;
  // The API may return the icon URL or update date in a field; here we use "updated" for both icon and last update.
  const icon = appItem.updated;
  const dllink = appItem.file;
  const lastup = appItem.updated;
  
  // Get the file size by calling fileSizeUrl on the download link.
  const size = await fileSizeUrl(dllink);
  
  return {
    name: name,
    lastup: lastup,
    package: pkg,
    size: size,
    icon: icon,
    dllink: dllink
  };
}

module.exports = {
  search: search,
  download: download
};

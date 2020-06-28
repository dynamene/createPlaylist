const axios = require('axios');

const BASE_URL = 'https://us-central1-play-mo.cloudfunctions.net/';
const PLATFORMS = ['deezer', 'spotify', 'tidal'];

async function getToken(funcName) {
  const metadataServerURL =
    'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience=';
  const url = `${metadataServerURL}${BASE_URL}${funcName}`;
  const headers = { 'Metadata-Flavor': 'Google' };
  const res = await axios.get(url, { headers });
  return res.data;
}

async function createPlaylist(playlist) {
  const links = PLATFORMS.map(async (platform) => {
    const token = await getToken(platform);
    const headers = { Authorization: `bearer ${token}` };
    const url = `${BASE_URL}${platform}`;
    return axios.post(url, playlist, { headers });
  });

  const res = await axios.all(links);
  let [deezer, spotify, tidal] = res.map((resp) => {
    return resp.data;
  });

  return { deezer, spotify, tidal };
}

module.exports = { createPlaylist };

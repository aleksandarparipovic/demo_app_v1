<template>
  <div class="form-container">
    <div class="form-content">
      <div class="left-panel">
        <h1>Client Credentials</h1>
        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <label for="clientID">Client ID</label>
            <input type="text" id="clientID" v-model="clientID" placeholder="Enter your Client ID" />
          </div>
          <div class="input-group">
            <label for="clientSecret">Client Secret</label>
            <div class="password-wrapper">
              <input :type="isSecretVisible ? 'text' : 'password'" id="clientSecret" v-model="clientSecret" placeholder="Enter your Client Secret" />
              <span @click="toggleSecretVisibility" class="eye-icon">
                <img :src="isSecretVisible ? eyeIconOpen : eyeIconClosed" alt="Toggle visibility" />
              </span>
            </div>
          </div>
        </form>
      </div>

      <div class="right-panel">
        <h1>BYON API Request</h1>
        <div class="form-group uri-method-group">
          <div class="method-dropdown">
            <label for="method">Method:</label>
            <select id="method" v-model="selectedMethod">
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="DELETE">DELETE</option>
              <option value="UPDATE">UPDATE</option>
            </select>
          </div>
          <div class="uri-input-group">
            <label for="uri">URI:</label>
            <input type="text" id="uri" v-model="currentURI" placeholder="Enter the URI" />
          </div>
        </div>
        <div class="form-group">
          <label for="request-body">Request Body:</label>
          <textarea id="request-body" rows="10" cols="50" v-model="requestBody" placeholder="Enter the Request Body"></textarea>
        </div>
        <button class="btn" @click="sendRequest">Send Request</button>
        <div class="form-group response-group">
          <label for="response">Response:</label>
          <textarea id="response" rows="10" cols="50" readonly v-model="response"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
// @ts-ignore
import popTokenBuilder from 'tmo-poptoken-builder/poptoken-builder-node.js';
import { initializeAuthorizationHeader } from '../initAuthorizationHeader'; // Adjust path as necessary

// Importing images
import eyeIconOpen from '@/components/icons/eye-icon-open.png';
import eyeIconClosed from '@/components/icons/eye-icon-closed.png';

// Client credentials
let clientID = ref('tmon-BGphffvi5Lk5N9GHlisrA918yh4UC3ww');
let clientSecret = ref('65N3MGG1kGq0uosO');

// Visibility toggle for client secret
let isSecretVisible = ref(false);

const toggleSecretVisibility = () => {
  isSecretVisible.value = !isSecretVisible.value;
};

// Authorization header
let authorizationHeader = ref('');
const updateAuthorizationHeader = () => {
  authorizationHeader.value = initializeAuthorizationHeader(clientID.value, clientSecret.value);
};

// API request state
const uris = ref([
  'qod/v0/sessions',
  'calllogs/v2/{calllogId}'
]);

const currentURI = ref(uris.value[0]);
const selectedMethod = ref('GET'); // New ref for selected method
const requestBody = ref('');
const response = ref('');
const loading = ref(false);
const error = ref('');
const data = ref('');
let accessToken = ref('');
let idToken = ref('');

// Handle client credentials form submission
function handleSubmit() {
  console.log('Client ID:', clientID.value);
  console.log('Client Secret:', clientSecret.value);
  updateAuthorizationHeader();
}

// Handle URI change
const getAccessToken = async () => {
  updateAuthorizationHeader();
  const popToken = generatePopToken(authorizationHeader.value, 'application/json', '/oauth2/v2/tokens', 'POST', '');
  await fetchAccessToken(popToken);
};

// Generate PoP token
const generatePopToken = (authorization: string, contentType: string, uri: string, httpMethod: string, body: string) => {
  updateAuthorizationHeader();
  let ehtsKeyValueMap = new Map();
  const privateKeyPemStr: string = `
    -----BEGIN PRIVATE KEY-----
    MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeiyREXzFp0r71
    62/oMssrLd9FylhLiEmteiTk78Xm0etWVZkWSvmHgUHMd/0R9ZLuPjnFGmYYNq3z
    ZYTIkyS1J8gCy94Ak3pYD2kLIoRX6KmGC+LQRdOLJfXkcew6J+FvTcWjk9XyyOeS
    shffvubo2Orhx324QRVDlXYFIg4dZNy36ntMCbXANVM8rGqtLo4CJQQ0E6jU/Hwv
    ggtDYCHra0CK9jem0Fvxqiu/7QSf/jRoUeNO7y5bJUKLyMYlWc6yoz5n3uFEuxoE
    xDwYoukikUaCdtEXj64zkJ/tKihSdPU3kjDwSPybVm/ZoRgB04S5N4pMb2yu8wUL
    XjEOVA0fAgMBAAECggEARpQcrg9OmRSHjESmSdEq3usJ5TDCA8YFPqQMfpo7GJlE
    0edDQkhYMzmYiCS2VWNkaIjtANDSuF7HK357EStoAPlXsd790nXU1hTuJ1XTYqsh
    pJnv+9XJ6b0ZbPxGNFGCqyENJdfvO6iyZny/4gxDEU9XqPE9B2R5yd9kbb6OWAjW
    RrQdJC/XjgqTWIjrts1u6nyTtvEr/Odms33Bagz5BFauIEUzWkGu7eMUKrldNJwo
    T3hCIHsoF9SoBX6qtfh+ftif0E6d0d/4C0Y7tFGxBvST9RB+L8wlBrlvcBL/l1g1
    eT54KU9rOuAHyL3EabJBB61IxtukR5Oobjwxv3io2QKBgQDOu6ujiL2qR11C4GLf
    nBD0Q6r0kNFgPweWhcV3nqZchwY9mtCtyqFdNyxIWQiU9gI9mmh6vEDR5EQVFG6s
    Xx3iGEj2n212X5nWnq6eeRgvQutZmglO5UQVsEa9EW9G/4X7tx3ZR/EQ2cNIW1qx
    +5XwM/6Ym2V33kdc2uyqukOEwwKBgQDEU4g5+YiBGxg6u3RjOUIfgVttVCgVRWJv
    MpcylsMHGApUj2dFyo4ViZux/CKs4EdLhtdK2waGEKYFMrXxZ8p2zyqIJUHiXb05
    b/rTskoxwXwCfyVPBS6WnmFx0+hw5nsSca/vqZxU/x4qQCDQvwdNe0csLpmqhLNF
    94aTQaAgdQKBgEou49dp8Q1SUG/4DuLIoPjV81mRQeC0nWdxFzvmbTIUrbObgzhp
    1t+ZNcW8VS0G3iT27HjmZqgqrheWXmRyOUnxhvUgnmn0wkJWbLinIXuMGuHrOV3b
    PUQ/HhMoV3L1rEF4Izjd7O4sBjxHs9LcQaCRN9HRKWcLFzaFxJk6/5F7AoGAZNoM
    RsvaxYenoLQfC8GkKA8JalYq6RJliH3SkdhEg2ZkGCA6iu2Mo5+27W16Wpgzx6aS
    /g8ZgNEYl97+++23YeT2Ek4hVCmXROQzU4BpALpF+/pYrgkZb6IYqKKU6zpaypTA
    LjtQ5ZDQbB/ZO6KGG9VSMG4X3jKg7TZEWW0C1ukCgYBmXLI7ZUrEyME4+R+7gXKK
    zuYKRYb5F/Guc9UQEf9N4P+xAocMKvIkkSnRllkJPYjNV6WKnVPImlFwkRyUqXSY
    wn8b9Opc2nQSnmvNNuGxODg6H+HGST2DZrTBIidSpqR+EmWdGMaaK5/0Aw7zdfJU
    isvXtVzhQqtxKpL3ErLeOA==
    -----END PRIVATE KEY-----
  `;
  if(authorization)
    ehtsKeyValueMap.set('Authorization', authorization);
  if(contentType)
    ehtsKeyValueMap.set('Content-Type', contentType);
  if(uri)
    ehtsKeyValueMap.set('uri', uri);
  if(httpMethod)
    ehtsKeyValueMap.set('http-method', httpMethod); // Use selected method
  if(body)
    ehtsKeyValueMap.set('body', body);

  return popTokenBuilder.buildPopToken(ehtsKeyValueMap, privateKeyPemStr);
};

// Send request
const sendRequest = async () => {
  await getAccessToken();
  const auth = 'Bearer ' + accessToken.value;
  const popToken = generatePopToken('', 'application/json', '/' + currentURI.value, selectedMethod.value, requestBody.value);
  try {
    const headers = {
      'Authorization': auth,
      'X-Authorization': popToken,
      'Content-Type': 'application/json'
    };
    const myResponse = await axios.post(
      'https://api-teststg.t-mobile.com/' + currentURI.value,
      requestBody.value,
      { headers: headers }
    );
    response.value = myResponse.data;
  } catch (err) {
    response.value = `Error: ${(err as Error).message}`;
  }
};

// Fetch data
async function fetchAccessToken(popToken: string) {
  loading.value = true;
  error.value = "";
  data.value = "";

  try {
    const headers = {
      'Authorization': authorizationHeader.value,
      'X-Authorization': popToken,
      'Content-Type': 'application/json'
    };

    const myResponse = await axios.post(
      'https://api-teststg.t-mobile.com/oauth2/v2/tokens',
      {},
      { headers: headers }
    );
    accessToken.value = myResponse.data.access_token;
  } catch (err) {
    error.value = `Error: ${(err as Error).message}`;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.form-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.form-content {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Aligns both panels at the top */
  gap: 2rem;
  width: 100%;
}

.left-panel, .right-panel {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 50%; /* Each panel takes up 50% of the width */
}

.orange {
  color: #f6a927;
  text-align: center;
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #e6543d;
}

input[type="text"],
input[type="password"],
textarea {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="password"]:focus,
textarea:focus {
  border-color: #f6a927;
  outline: none;
  box-shadow: 0 0 0 3px rgba(246, 169, 39, 0.3);
}

.password-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.eye-icon {
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.eye-icon img {
  width: 20px;
  height: 20px;
}

.btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #e6543d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.btn:hover {
  background-color: #c94431;
}

h1 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.response-group {
  margin-top: 30px;
}

/* Styling for URI and Method inputs */
.uri-method-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.uri-input-group {
  flex: 3;
}

.method-dropdown {
  flex: 1;
}

select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

select:focus {
  border-color: #f6a927;
  outline: none;
  box-shadow: 0 0 0 3px rgba(246, 169, 39, 0.3);
}
</style>

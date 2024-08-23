<template>
  <div class="container">
    <h1>BYON API Request</h1>
    <div class="form-group">
      <label for="uri">Select URI:</label>
      <select id="uri" v-model="selectedUri" @change="handleUriChange">
        <option v-for="uri in uris" :key="uri" :value="uri">{{ uri }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="request-body">Request Body:</label>
      <textarea
        id="request-body"
        rows="10"
        cols="50"
        v-model="requestBody"
      ></textarea>
    </div>
    <button class="btn" @click="sendRequest">Send Request</button>
    <div class="form-group response-group">
      <label for="response">Response:</label>
      <textarea
        id="response"
        rows="10"
        cols="50"
        readonly
        v-model="response"
      ></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { clientID, clientSecret } from '../components/HelloWorld.vue'; // Importing the clientID and clientSecret
import { initializeAuthorizationHeader } from '../initAuthorizationHeader.ts'; // Adjust path as necessary
import axios from 'axios';
import popTokenBuilder from 'tmo-poptoken-builder/poptoken-builder-node.js';

let authorizationHeader = ref('');
const updateAuthorizationHeader = () => {
  authorizationHeader.value = initializeAuthorizationHeader(clientID.value, clientSecret.value);
}
const uris = ref([
  'calllogs/v2/search',
  'calllogs/v2/{calllogId}'
]);

const selectedUri = ref(uris.value[0]);
const requestBody = ref('');
const response = ref('');
const data = ref(null);
const loading = ref(false);
const error = ref(null);
const handleUriChange = () => {
    // Change request body based on the selected URI
    updateAuthorizationHeader();
    requestBody.value = `Request body for ${selectedUri.value}`;
    requestBody.value += `\nClient ID: ${clientID.value}`;
    requestBody.value += `\nClient Secret: ${clientSecret.value}`;
    requestBody.value += `\nAuthorizationHeader: ${authorizationHeader.value}`;

    let popToken = '';
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



    ehtsKeyValueMap.set('Content-Type', 'application/json');
    ehtsKeyValueMap.set('Authorization', authorizationHeader.value);
    ehtsKeyValueMap.set('uri', '/oauth2/v2/tokens');
    ehtsKeyValueMap.set('http-method', 'POST');
    ehtsKeyValueMap.set('test-23', 'test-001');
    popToken = popTokenBuilder.buildPopToken(ehtsKeyValueMap, privateKeyPemStr);
    response.value = popToken;
    fetchData(popToken);
};

const sendRequest = async () => {
  try {
    // const res = await axios.post(selectedUri.value, JSON.parse(requestBody.value));
    // response.value = JSON.stringify(res.data, null, 2);
  } catch (error) {
    response.value = `Error: ${error.message}`;
  }
};



// Method to fetch data from the API
async function fetchData(popToken) {
  loading.value = true;  // Set loading state to true
  error.value = null;    // Reset error state
  data.value = null;     // Reset data state

  const requestBody = {
      'Authorization': authorizationHeader.value,
      'X-Authorization': popToken,
      'Content-Type': 'application/json',
      'test-23': 'test-001'
    };

    try {
       console.log(requestBody);
      const response = await axios.post('https://api-teststg.t-mobile.com/oauth2/v2/tokens', requestBody);
      // data.value = `Success: ${response.data.message}`;
      console.log(response);
    } catch (error) {
      error.value = `Error: ${error.response ? error.response.data.message : error.message}`;
    } finally {
      loading.value = false;  // Reset loading state
    }

}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #f6a927; /* Primary color */
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.response-group {
  margin-top: 30px; /* Added margin-top to create more space above the response area */
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #e6543d; /* Secondary color */
}

select,
textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: vertical;
}

select:focus,
textarea:focus {
  border-color: #f6a927; /* Primary color for focus */
  outline: none;
  box-shadow: 0 0 0 3px rgba(246, 169, 39, 0.3);
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #e6543d; /* Secondary color */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
  margin-bottom: 0px; /* Added margin-bottom to create space below the button */
}

.btn:hover {
  background-color: #c94431; /* Darkened secondary color for hover */
}
</style>

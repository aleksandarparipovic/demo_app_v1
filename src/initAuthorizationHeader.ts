export function initializeAuthorizationHeader(clientID, clientSecret) {
    let res = clientID + ":" + clientSecret;
    res = btoa(res);
    res = "Basic " + res;
    return res;
}

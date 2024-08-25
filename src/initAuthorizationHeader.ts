export function initializeAuthorizationHeader(clientID: string, clientSecret: string) {
    let res = clientID + ":" + clientSecret;
    res = btoa(res);
    res = "Basic " + res;
    return res;
}

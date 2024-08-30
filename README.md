# demo_app

This demo application demonstrates how to use the BYON service.

## Overview

The primary logic of the application is contained in the `APIRequestView.vue` file.

### User Interaction

- **Client Credentials**: Users can input their own `ClientID` and `Client Secret`.
- **HTTP Method Selection**: Users can select the HTTP method (GET, POST, UPDATE, DELETE).
- **Endpoint Input**: Users enter the desired endpoint.
- **Request Body**: Users input the request body.

After providing the necessary details, the user clicks the **Send Request** button. The application will then display the appropriate response in the **Response** text area, which could be either the response body or an error message.

## Application Logic

When the user clicks the **Send Request** button, the following sequence of actions occurs:

1. **getAccessToken()**
    - This method first invokes `updateAuthorizationHeader()` to compute the Basic Authorization header using the provided `ClientID` and `Client Secret`.
    - A PoP (Proof of Possession) token is then generated for the authentication endpoint by calling `generatePopToken()`.
    - Next, the `fetchAccessToken()` function is called, which makes a request to the `/oauth/v2/tokens` endpoint. The access token is retrieved from the response body.

2. **Authorization and Sending Request**
    - The authorization header for the desired endpoint is created as a Bearer token using the access token.
    - A new PoP token is generated for the specific endpoint.
    - The `sendRequest()` method is then invoked to make the API call to the desired endpoint. The response is displayed in the **Response** text area, or an error message is shown if the request fails.

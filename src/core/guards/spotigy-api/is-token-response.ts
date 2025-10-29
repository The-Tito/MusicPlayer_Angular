// src/app/core/guards/spotify-api/is-token-response.ts

import { SpotifyTokenResponse } from "../../../interface/interface_data";


export function isTokenResponse(body: any): body is SpotifyTokenResponse {
  return (
    body &&
    typeof body === 'object' &&
    'access_token' in body &&
    'token_type' in body &&
    'expires_in' in body
  );
}

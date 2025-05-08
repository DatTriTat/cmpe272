export function withKongKey(headers: HeadersInit = {}): HeadersInit {
    return {
      ...headers,
      "x-api-key": import.meta.env.VITE_KONG_API_KEY,
    };
  }
  
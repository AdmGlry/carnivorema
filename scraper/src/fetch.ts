import { DELAY_MS, USER_AGENT } from "./config.js";

export type Fetcher = (url: string) => Promise<string>;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Récupère une page avec quelques nouvelles tentatives (backoff exponentiel) et un délai de politesse. */
export function politeFetcher({ delayMs = DELAY_MS, retries = 3 } = {}): Fetcher {
  let last = 0;
  return async (url) => {
    for (let attempt = 0; ; attempt++) {
      const wait = last + delayMs - Date.now();
      if (wait > 0) await sleep(wait);
      last = Date.now();
      try {
        const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, "Accept-Language": "fr-MA,fr;q=0.9" } });
        if (res.ok) return await res.text();
        // 4xx (hors 429) : inutile de réessayer.
        if (res.status < 500 && res.status !== 429) throw new Error(`HTTP ${res.status} sur ${url}`);
        if (attempt >= retries) throw new Error(`HTTP ${res.status} sur ${url} après ${retries + 1} essais`);
      } catch (err) {
        if (attempt >= retries || (err instanceof Error && err.message.startsWith("HTTP 4"))) throw err;
      }
      await sleep(2000 * 2 ** attempt);
    }
  };
}

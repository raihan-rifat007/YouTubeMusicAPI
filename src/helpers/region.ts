const cache = new Map<string, { country: string; language: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

const countryLanguageMap: Record<string, string> = {
  TN: "ar", DZ: "ar", MA: "ar", EG: "ar", SA: "ar", AE: "ar", KW: "ar",
  QA: "ar", BH: "ar", OM: "ar", JO: "ar", LB: "ar", IQ: "ar", LY: "ar",
  SD: "ar", YE: "ar", SY: "ar", PS: "ar",
  FR: "fr", BE: "fr", CH: "fr", CA: "fr", SN: "fr", CI: "fr", ML: "fr",
  BF: "fr", NE: "fr", TG: "fr", BJ: "fr", CM: "fr", MG: "fr",
  DE: "de", AT: "de",
  ES: "es", MX: "es", AR: "es", CO: "es", PE: "es", VE: "es", CL: "es",
  EC: "es", GT: "es", CU: "es", BO: "es", DO: "es", HN: "es", PY: "es",
  SV: "es", NI: "es", CR: "es", PA: "es", UY: "es",
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  IT: "it", NL: "nl", RU: "ru", BY: "ru", KZ: "ru", TR: "tr",
  JP: "ja", KR: "ko", CN: "zh", TW: "zh", HK: "zh",
  IN: "hi", TH: "th", VN: "vi", ID: "id", PL: "pl", UA: "uk",
  RO: "ro", GR: "el", CZ: "cs", SE: "sv", NO: "no", DK: "da",
  FI: "fi", HU: "hu", IL: "he", IR: "fa", PK: "ur", BD: "bn",
  PH: "tl", MY: "ms",
};

export function getLanguageForCountry(code: string): string {
  return countryLanguageMap[code] || "en";
}

function getClientIP(req: Request): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return null;
}

function isLocalIP(ip: string): boolean {
  return ip === "127.0.0.1" || 
         ip === "::1" ||
         ip.startsWith("192.168.") ||
         ip.startsWith("10.") ||
         ip.startsWith("172.16.") ||
         ip.startsWith("172.17.") ||
         ip.startsWith("172.18.") ||
         ip.startsWith("172.19.") ||
         ip.startsWith("172.20.") ||
         ip.startsWith("172.21.") ||
         ip.startsWith("172.22.") ||
         ip.startsWith("172.23.") ||
         ip.startsWith("172.24.") ||
         ip.startsWith("172.25.") ||
         ip.startsWith("172.26.") ||
         ip.startsWith("172.27.") ||
         ip.startsWith("172.28.") ||
         ip.startsWith("172.29.") ||
         ip.startsWith("172.30.") ||
         ip.startsWith("172.31.");
}

function cleanCache(): void {
  const now = Date.now();
  for (const [key, value] of cache) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

setInterval(cleanCache, 60 * 60 * 1000);

export async function detectRegionFromIP(req: Request): Promise<{ country: string; language: string } | null> {
  try {
    const cfCountry = req.headers.get("cf-ipcountry") || req.headers.get("x-country");
    if (cfCountry && cfCountry !== "XX") {
      return { country: cfCountry, language: getLanguageForCountry(cfCountry) };
    }

    const ip = getClientIP(req);
    if (!ip || isLocalIP(ip)) {
      return null;
    }

    const cached = cache.get(ip);
    if (cached) {
      return { country: cached.country, language: cached.language };
    }

    const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
    if (!geoResponse.ok) {
      return null;
    }

    const geoData = await geoResponse.json();
    if (!geoData.countryCode) {
      return null;
    }

    const result = {
      country: geoData.countryCode,
      language: getLanguageForCountry(geoData.countryCode)
    };

    cache.set(ip, { ...result, timestamp: Date.now() });

    return result;
  } catch {
    return null;
  }
    }


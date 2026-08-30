import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const localesDir = "src/i18n/locales";
const baseLng = "en";
const baseNs = readdirSync(join(localesDir, baseLng)).map(f => f.replace(".json",""));
let hasError = false;
for (const lng of readdirSync(localesDir).filter(d => d !== baseLng)) {
  for (const ns of baseNs) {
    try {
      const base = JSON.parse(readFileSync(join(localesDir, baseLng, `${ns}.json`), "utf8"));
      const target = JSON.parse(readFileSync(join(localesDir, lng, `${ns}.json`), "utf8"));
      const baseKeys = new Set(Object.keys(flatten(base)));
      const targetKeys = new Set(Object.keys(flatten(target)));
      for (const k of baseKeys) {
        if (!targetKeys.has(k)) {
          console.error(`Missing key ${k} in ${lng}/${ns}.json`);
          hasError = true;
        }
      }
    } catch (e) {
      console.error(`Error checking ${lng}/${ns}:`, e.message);
      hasError = true;
    }
  }
}
function flatten(obj, prefix="") {
  const out = {};
  for (const [k,v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) Object.assign(out, flatten(v, key));
    else out[key] = v;
  }
  return out;
}
if (hasError) {
  console.error("Missing i18n keys found");
  process.exit(1);
} else {
  console.log("All i18n keys present");
}

#!/usr/bin/env node

/**
 * Import barbershops from Google Places API into Supabase.
 *
 * Usage:
 *   node scripts/import-barbershops.mjs "Rijeka"
 *   node scripts/import-barbershops.mjs "Zagreb"
 *
 * Required environment variables (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_PLACES_API_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env.local ────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local is optional if env vars are set externally
}

// ── Config ─────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
if (!GOOGLE_API_KEY) {
  console.error("❌ Missing GOOGLE_PLACES_API_KEY in .env.local");
  process.exit(1);
}

const city = process.argv[2];
if (!city) {
  console.error("Usage: node scripts/import-barbershops.mjs <city-name>");
  console.error('Example: node scripts/import-barbershops.mjs "Rijeka"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Google Places API (New) ────────────────────────────────────────

/**
 * Search for barbershops in a city using Google Places Text Search (New).
 * Docs: https://developers.google.com/maps/documentation/places/web-service/text-search
 */
async function searchBarbershops(cityName) {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const body = {
    textQuery: `barber shop in ${cityName}`,
    languageCode: "en",
    maxResultCount: 20,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.nationalPhoneNumber",
        "places.internationalPhoneNumber",
        "places.currentOpeningHours",
        "places.regularOpeningHours",
        "places.priceLevel",
        "places.photos",
        "places.location",
      ].join(","),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.places || [];
}

/**
 * Get a photo URL from a Google Places photo reference.
 * Uses the Places Photos (New) API.
 */
async function getPhotoUrl(photoName) {
  // The new API returns photo URLs via: GET /v1/{name}/media
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=600&maxHeightPx=800&key=${GOOGLE_API_KEY}&skipHttpRedirect=true`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  return data.photoUri || null;
}

/**
 * Fetch up to `count` photo URLs for a place.
 */
async function getPhotos(photos, count = 3) {
  if (!photos || photos.length === 0) return [];

  const selected = photos.slice(0, count);
  const urls = [];

  for (const photo of selected) {
    const url = await getPhotoUrl(photo.name);
    if (url) urls.push(url);
  }

  return urls;
}

/**
 * Format opening hours from Google's structured format into a readable string.
 */
function formatHours(place) {
  const hours = place.regularOpeningHours || place.currentOpeningHours;
  if (!hours) return "Hours not available";

  // If there are weekday descriptions, join the first few
  if (hours.weekdayDescriptions && hours.weekdayDescriptions.length > 0) {
    return hours.weekdayDescriptions.join(" | ");
  }

  return "Hours not available";
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 Searching for barbershops in "${city}"...\n`);

  const places = await searchBarbershops(city);

  if (places.length === 0) {
    console.log("No barbershops found. Try a different city name.");
    return;
  }

  console.log(`Found ${places.length} barbershop(s). Importing...\n`);

  let imported = 0;
  let updated = 0;
  let errors = 0;

  for (const place of places) {
    const googlePlaceId = place.id;
    const name = place.displayName?.text || "Unknown Barbershop";

    // Build the record from Google data
    const record = {
      name,
      rating: place.rating || 0,
      user_ratings_total: place.userRatingCount || 0,
      phone:
        place.nationalPhoneNumber ||
        place.internationalPhoneNumber ||
        "",
      address: place.formattedAddress || "",
      hours: formatHours(place),
      city,
      price_level: parsePriceLevel(place.priceLevel),
      google_place_id: googlePlaceId,
    };

    // Check if already imported
    const { data: existing } = await supabase
      .from("barbershops")
      .select("id")
      .eq("google_place_id", googlePlaceId)
      .maybeSingle();

    if (existing) {
      // Update existing record with latest data
      const { error } = await supabase
        .from("barbershops")
        .update(record)
        .eq("id", existing.id);

      if (error) {
        console.error(`  ❌ Error updating "${name}": ${error.message}`);
        errors++;
      } else {
        console.log(`  🔄 Updated: ${name}`);
        updated++;
      }
      continue;
    }

    // Fetch photos for new barbershops
    const photoUrls = await getPhotos(place.photos);

    const images =
      photoUrls.length > 0
        ? photoUrls
        : [
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=600&fit=crop",
          ];

    const { error } = await supabase.from("barbershops").insert({ ...record, distance: "", images });

    if (error) {
      console.error(`  ❌ Error inserting "${name}": ${error.message}`);
      errors++;
    } else {
      console.log(`  ✅ Imported: ${name}`);
      imported++;
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Summary for "${city}":`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   🔄 Updated:  ${updated}`);
  if (errors > 0) console.log(`   ❌ Errors:   ${errors}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

/**
 * Parse Google's PRICE_LEVEL enum to a number.
 * https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places#PriceLevel
 */
function parsePriceLevel(level) {
  if (!level) return null;
  const map = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };
  return map[level] ?? null;
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

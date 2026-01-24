import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyLocation } from "./supabase";

const NAVER_CLIENT_ID =
  process.env.EXPO_PUBLIC_REVERSE_GEOCODING_API_CLIENT_ID || "";
const NAVER_CLIENT_SECRET =
  process.env.EXPO_PUBLIC_REVERSE_GEOCODING_API_CLIENT_SECRET || "";
const STORAGE_KEY = "@my_original_address";

/**
 * Calls Naver Reverse Geocoding API
 */
export async function fetchAddressFromCoords(
  lat: number, lon: number
): Promise<string> {
  try {
    // Naver expects coords in "lon,lat" format
    const coordString = `${lon},${lat}`;
    const url = `https://maps.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${coordString}&output=json&orders=roadaddr,addr`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-ncp-apigw-api-key-id": NAVER_CLIENT_ID,
        "x-ncp-apigw-api-key": NAVER_CLIENT_SECRET,
        Accept: "application/json",
      },
    });

    const json = await response.json();

    if (json.status.code !== 0) {
      console.error("Geocoding Error:", json.status.message);
      return "주소 확인 오류";
    }

    // Attempt to find road address first, then standard address
    const result =
      json.results.find((r: any) => r.name === "roadaddr") ||
      json.results.find((r: any) => r.name === "addr");

    if (!result) return "주소 없음";

    // specific formatting depends on response structure, this is a safe generic builder
    const region = result.region;
    const land = result.land;

    // Example: "Seoul" "Gangnam-gu" ...
    let fullAddr = `${region.area1.name} ${region.area2.name} ${region.area3.name}`;

    // Add detailed road name/number if available
    if (land) {
      if (land.name) fullAddr += ` ${land.name}`;
      if (land.number1) fullAddr += ` ${land.number1}`;
      if (land.number2) fullAddr += `-${land.number2}`;
    }

    return fullAddr.trim();
  } catch (error) {
    console.error("Geocoding Fetch Error:", error);
    return "주소 확인 오류";
  }
}

/**
 * Gets Original Address (Cached)
 * Checks AsyncStorage first. If missing, fetches from API and saves it.
 */
export async function getOriginalAddress(): Promise<string> {
  try {
    // A. Check Cache First
    const cachedAddr = await AsyncStorage.getItem(STORAGE_KEY);
    if (cachedAddr) return cachedAddr;

    // B. If no cache, Fetch coords from DB
    const savedCoords = await getMyLocation();
    if (!savedCoords) return "위치 정보 없음";

    // C. Convert DB Coords -> Address String
    const fetchedAddr = await fetchAddressFromCoords(savedCoords.lat, savedCoords.lon);

    // D. Save to Cache and Return
    if (fetchedAddr) {
      await AsyncStorage.setItem(STORAGE_KEY, fetchedAddr);
      return fetchedAddr;
    }

    return "주소 불명";
  } catch (e) {
    return "주소 확인 오류";
  }
}

type Location = {
  addr: string
  is_public: boolean
}

/**
 * Gets Original Address (Cached) + Publicity of avatar
 * Always do db call to get publicity -? Checks AsyncStorage first. If address missing, fetches from API and saves it.
 * Returns null if no avatar placed yet.
 */
export async function getAddressPublicity(): Promise<Location | null> {
  try {
    const savedCoords = await getMyLocation();
    if (!savedCoords) return null;
    
    const cachedAddr = await AsyncStorage.getItem(STORAGE_KEY);
    if (cachedAddr) return {addr: cachedAddr, is_public: savedCoords.is_public};

    const fetchedAddr = await fetchAddressFromCoords(
      savedCoords.lat,
      savedCoords.lon,
    );

    await AsyncStorage.setItem(STORAGE_KEY, fetchedAddr);
    return { addr: fetchedAddr, is_public: savedCoords.is_public };

  } catch (e) {
    return { addr: "주소 확인 오류", is_public: false };
  }
}

export async function updateAddressCache(newAddress: string) {
  if (!newAddress) return;
  await AsyncStorage.setItem(STORAGE_KEY, newAddress);
}

/**
 * Force clear cache (call this when the user successfully updates their profile location)
 */
export async function clearAddressCache() {
  await AsyncStorage.removeItem("@my_original_address");
}

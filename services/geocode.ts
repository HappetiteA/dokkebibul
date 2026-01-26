import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyLocation, reverseGeocode } from "./supabase";

const STORAGE_KEY = "@my_original_address";

/**
 * Gets Original Address (Cached)
 * Checks AsyncStorage first. If missing, fetches from API and saves it.
 */
export async function getOriginalAddress(): Promise<string> {
  try {
    // A. Check Cache First
    const cachedAddr = await AsyncStorage.getItem(STORAGE_KEY);
    if (cachedAddr && cachedAddr !== "주소 확인 오류") return cachedAddr;

    // B. If no cache or error in cache, Fetch coords from DB
    const savedCoords = await getMyLocation();
    if (!savedCoords) return "위치 정보 없음";

    // C. Convert DB Coords -> Address String
    const fetchedAddr = await reverseGeocode(
      savedCoords.lat,
      savedCoords.lon,
    );
    console.log(fetchedAddr)

    // D. Save to Cache and Return
    await AsyncStorage.setItem(STORAGE_KEY, fetchedAddr);
    return fetchedAddr;
  } catch (e) {
    return "주소 확인 오류";
  }
}

type Location = {
  addr: string;
  is_public: boolean;
};

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
    if (cachedAddr)
      return { addr: cachedAddr, is_public: savedCoords.is_public };

    const fetchedAddr = await reverseGeocode(
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

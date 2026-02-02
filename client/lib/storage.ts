import AsyncStorage from "@react-native-async-storage/async-storage";
import { Listing, User, CreateListingInput } from "@/types/listing";
import { ThemePreference } from "@/types/theme";
import { AppPreferences, CurrencyPreference, LanguagePreference, LocationPreference } from "@/types/preferences";

const LISTINGS_KEY = "raqam_listings";
const USER_KEY = "raqam_user";
const FAVORITES_KEY = "raqam_favorites";
const THEME_KEY = "raqam_theme_preference";
const LANGUAGE_KEY = "raqam_language";
const CURRENCY_KEY = "raqam_currency";
const LOCATION_KEY = "raqam_default_location";

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const SAMPLE_LISTINGS: Listing[] = [
  {
    id: "1",
    category: "car_plate",
    number: "A 1234",
    price: 25000,
    description: "رقم مميز للبيع - لوحة سيارة فاخرة",
    location: "الرياض",
    sellerId: "seller1",
    sellerName: "أحمد محمد",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    category: "mobile_number",
    number: "0555 123 456",
    price: 5000,
    description: "رقم جوال مميز سهل الحفظ",
    location: "جدة",
    sellerId: "seller2",
    sellerName: "خالد العمري",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "3",
    category: "car_plate",
    number: "B 5555",
    price: 75000,
    description: "لوحة مميزة - أرقام متكررة",
    location: "الدمام",
    sellerId: "seller3",
    sellerName: "محمد السعيد",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "4",
    category: "mobile_number",
    number: "0500 000 111",
    price: 15000,
    description: "رقم VIP - سهل التذكر",
    location: "مكة",
    sellerId: "seller1",
    sellerName: "أحمد محمد",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "5",
    category: "car_plate",
    number: "K 7777",
    price: 120000,
    description: "لوحة نادرة - رقم مميز جداً",
    location: "الرياض",
    sellerId: "seller4",
    sellerName: "عبدالله الفهد",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_USER: User = {
  id: "current_user",
  name: "محمد أحمد",
  phone: "0555 999 888",
  location: "الرياض",
  bio: "مهتم بالأرقام المميزة",
};

export async function initializeData(): Promise<void> {
  try {
    const existingListings = await AsyncStorage.getItem(LISTINGS_KEY);
    if (!existingListings) {
      await AsyncStorage.setItem(LISTINGS_KEY, JSON.stringify(SAMPLE_LISTINGS));
    }
    
    const existingUser = await AsyncStorage.getItem(USER_KEY);
    if (!existingUser) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

export async function getListings(): Promise<Listing[]> {
  try {
    const data = await AsyncStorage.getItem(LISTINGS_KEY);
    const listings = data ? JSON.parse(data) : [];
    const favorites = await getFavorites();
    return listings.map((listing: Listing) => ({
      ...listing,
      isFavorite: favorites.includes(listing.id),
    }));
  } catch (error) {
    console.error("Error getting listings:", error);
    return [];
  }
}

export async function getListing(id: string): Promise<Listing | null> {
  try {
    const listings = await getListings();
    return listings.find((l) => l.id === id) || null;
  } catch (error) {
    console.error("Error getting listing:", error);
    return null;
  }
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  try {
    const user = await getUser();
    const listings = await getListings();
    
    const newListing: Listing = {
      id: generateId(),
      ...input,
      sellerId: user?.id || "current_user",
      sellerName: user?.name || "مستخدم",
      createdAt: new Date().toISOString(),
    };
    
    listings.unshift(newListing);
    await AsyncStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
    
    return newListing;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}

export async function deleteListing(id: string): Promise<void> {
  try {
    const listings = await getListings();
    const filtered = listings.filter((l) => l.id !== id);
    await AsyncStorage.setItem(LISTINGS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
}

export async function getUser(): Promise<User | null> {
  try {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function updateUser(updates: Partial<User>): Promise<User | null> {
  try {
    const user = await getUser();
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
}

export async function toggleFavorite(listingId: string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    const index = favorites.indexOf(listingId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(listingId);
    }
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return false;
  }
}

export async function getMyListings(): Promise<Listing[]> {
  try {
    const user = await getUser();
    if (!user) return [];
    
    const listings = await getListings();
    return listings.filter((l) => l.sellerId === user.id);
  } catch (error) {
    console.error("Error getting my listings:", error);
    return [];
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      LISTINGS_KEY,
      USER_KEY,
      FAVORITES_KEY,
      THEME_KEY,
      LANGUAGE_KEY,
      CURRENCY_KEY,
      LOCATION_KEY,
    ]);
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}

export async function getThemePreference(): Promise<ThemePreference | null> {
  try {
    const data = await AsyncStorage.getItem(THEME_KEY);
    if (data === "light" || data === "dark" || data === "system") {
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error getting theme preference:", error);
    return null;
  }
}

export async function setThemePreference(value: ThemePreference): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, value);
  } catch (error) {
    console.error("Error setting theme preference:", error);
  }
}

export type AppPreferenceKey = "language" | "currency" | "location";

const DEFAULT_PREFERENCES: AppPreferences = {
  language: "ar",
  currency: "sar",
  location: "riyadh",
};

const getPreferenceKey = (key: AppPreferenceKey): string => {
  switch (key) {
    case "language":
      return LANGUAGE_KEY;
    case "currency":
      return CURRENCY_KEY;
    case "location":
      return LOCATION_KEY;
  }
};

const normalizeLanguage = (value: string | null): LanguagePreference => {
  if (value === "ar" || value === "en") return value;
  if (value === "العربية") return "ar";
  if (value === "English") return "en";
  return DEFAULT_PREFERENCES.language;
};

const normalizeCurrency = (value: string | null): CurrencyPreference => {
  if (value === "sar" || value === "aed" || value === "usd" || value === "jod") return value;
  if (value === "ريال سعودي") return "sar";
  if (value === "درهم إماراتي") return "aed";
  if (value === "دولار أمريكي") return "usd";
  if (value === "دينار أردني") return "jod";
  if (value === "Saudi Riyal") return "sar";
  if (value === "UAE Dirham") return "aed";
  if (value === "US Dollar") return "usd";
  if (value === "Jordanian Dinar") return "jod";
  return DEFAULT_PREFERENCES.currency;
};

const normalizeLocation = (value: string | null): LocationPreference => {
  if (value === "riyadh" || value === "jeddah" || value === "dammam" || value === "mecca") return value;
  if (value === "الرياض") return "riyadh";
  if (value === "جدة") return "jeddah";
  if (value === "الدمام") return "dammam";
  if (value === "مكة") return "mecca";
  if (value === "Riyadh") return "riyadh";
  if (value === "Jeddah") return "jeddah";
  if (value === "Dammam") return "dammam";
  if (value === "Mecca") return "mecca";
  return DEFAULT_PREFERENCES.location;
};

export async function getAppPreferences(): Promise<AppPreferences> {
  try {
    const [language, currency, location] = await AsyncStorage.multiGet([
      LANGUAGE_KEY,
      CURRENCY_KEY,
      LOCATION_KEY,
    ]);

    return {
      language: normalizeLanguage(language[1]),
      currency: normalizeCurrency(currency[1]),
      location: normalizeLocation(location[1]),
    };
  } catch (error) {
    console.error("Error getting app preferences:", error);
    return DEFAULT_PREFERENCES;
  }
}

export async function setAppPreference(
  key: AppPreferenceKey,
  value: AppPreferences[AppPreferenceKey],
): Promise<void> {
  try {
    await AsyncStorage.setItem(getPreferenceKey(key), value);
  } catch (error) {
    console.error("Error setting app preference:", error);
  }
}

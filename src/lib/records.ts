export interface SavedRecord {
  id: string;
  formId: string;
  formName: string;
  inspector: string;
  date: string;
  comments: string;
  answers: Record<string, boolean | string | number | null>;
  signature: string | null;
  images: string[];
}

const STORAGE_KEY = "inspection-records";
export const RECORDS_EVENT = "records:updated";

const isBrowser = () => typeof window !== "undefined";

const readRecords = (): SavedRecord[] => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedRecord[]) : [];
  } catch {
    return [];
  }
};

const writeRecords = (records: SavedRecord[]) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(RECORDS_EVENT));
};

export function getRecords(): SavedRecord[] {
  return readRecords();
}

export function findRecord(id: string): SavedRecord | null {
  return readRecords().find((record) => record.id === id) || null;
}

export function saveRecord(record: SavedRecord) {
  writeRecords([...readRecords(), record]);
}

export function deleteRecord(id: string) {
  writeRecords(readRecords().filter((record) => record.id !== id));
}

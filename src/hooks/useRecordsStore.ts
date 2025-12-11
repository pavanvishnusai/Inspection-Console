"use client";

import { useSyncExternalStore } from "react";
import { getRecords, RECORDS_EVENT, type SavedRecord } from "@/lib/records";

interface RecordsSnapshot {
  ready: boolean;
  records: SavedRecord[];
}

const defaultSnapshot: RecordsSnapshot = { ready: false, records: [] };
let snapshot: RecordsSnapshot = defaultSnapshot;

if (typeof window !== "undefined") {
  snapshot = { ready: true, records: getRecords() };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => defaultSnapshot;

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const updateSnapshot = () => {
    snapshot = { ready: true, records: getRecords() };
    callback();
  };

  updateSnapshot();

  window.addEventListener(RECORDS_EVENT, updateSnapshot);
  window.addEventListener("storage", updateSnapshot);

  return () => {
    window.removeEventListener(RECORDS_EVENT, updateSnapshot);
    window.removeEventListener("storage", updateSnapshot);
  };
};

export const useRecordsStore = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

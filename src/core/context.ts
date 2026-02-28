import { createContext, useContext } from "solid-js";
import type { DateFormatConfig } from "./types";

export interface SouiContextValue {
  dateFormat: DateFormatConfig;
}

const defaultContext: SouiContextValue = {
  dateFormat: {
    displayFormat: "yyyy/MM/dd",
  },
};

export const SouiContext = createContext<SouiContextValue>(defaultContext);

export function useSoui(): SouiContextValue {
  return useContext(SouiContext);
}

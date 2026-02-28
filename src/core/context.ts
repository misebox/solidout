import { createContext, useContext } from "solid-js";
import type { DateFormatConfig } from "./types";

export interface SolidoutContextValue {
  dateFormat: DateFormatConfig;
}

const defaultContext: SolidoutContextValue = {
  dateFormat: {
    displayFormat: "yyyy/MM/dd",
  },
};

export const SolidoutContext = createContext<SolidoutContextValue>(defaultContext);

export function useSolidout(): SolidoutContextValue {
  return useContext(SolidoutContext);
}

import { createContext, useContext } from "react";

export interface SheetsApi {
  openTx: (id: string) => void;
  openPay: (merchantId?: string) => void;
  openDemo: () => void;
}
export const SheetsContext = createContext<SheetsApi>({ openTx: () => {}, openPay: () => {}, openDemo: () => {} });
export const useSheets = () => useContext(SheetsContext);

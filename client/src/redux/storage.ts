/* eslint-disable @typescript-eslint/no-unused-vars */
import type { WebStorage } from "redux-persist";

const createNoopStorage = (): WebStorage => ({
  getItem: async (_key: string): Promise<string | null> => {
    return null;
  },
  setItem: async (_key: string, _value: string): Promise<void> => {
    return;
  },
  removeItem: async (_key: string): Promise<void> => {
    return;
  },
});
/* eslint-enable @typescript-eslint/no-unused-vars */

const storage: WebStorage =
  typeof window !== "undefined"
    ? (require("redux-persist/lib/storage").default as WebStorage)
    : createNoopStorage();

export default storage;

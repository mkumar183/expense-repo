
/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly [key: string]: string | boolean | undefined;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
  };
}

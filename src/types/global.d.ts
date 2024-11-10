// Global type declarations
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    // Add other env variables here
  }
}

// Utility types
type Nullable<T> = T | null
type Optional<T> = T | undefined 
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_UNSPLASH_APPLICATION_ID: string
  VITE_UNSPLASH_ACCESS_KEY: string
  VITE_UNSPLASH_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
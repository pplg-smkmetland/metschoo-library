import type { Tables } from "./supabase"

export type Buku = Tables<"buku">
export type Pengguna = Tables<"pengguna">
export type Kategori = Tables<"kategori_buku">
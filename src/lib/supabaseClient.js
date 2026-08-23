import { createClient } from '@supabase/supabase-js'

// Estas variables se leen de tu archivo .env (ver .env.example).
// No se usan todavía — se conectan en la Fase 2 (Auth) y Fase 3 (datos).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // se mantiene la sesión guardada en el navegador
    autoRefreshToken: true, // renueva el token automáticamente, sin pedir login de nuevo
  },
})

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsAdmin(Boolean(data?.user?.user_metadata?.es_admin))
      setLoading(false)
    })
  }, [])

  return { isAdmin, loading }
}
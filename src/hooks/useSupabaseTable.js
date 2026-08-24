import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

export function useSupabaseTable(tableName, { orderBy = 'created_at', ascending = false } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(orderBy, { ascending })
    if (error) setError(error.message)
    else {
      setItems(data)
      setError(null)
    }
    setLoading(false)
  }, [tableName, orderBy, ascending])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function addItem(values) {
    const { data: userData } = await supabase.auth.getUser()
    const creado_por = userData?.user?.user_metadata?.nombre || userData?.user?.email
    const { error } = await supabase.from(tableName).insert([{ ...values, creado_por }])
    if (error) {
      setError(error.message)
      throw error
    }
    setError(null)
    await refresh()
  }

  async function updateItem(id, values) {
    const { error } = await supabase.from(tableName).update(values).eq('id', id)
    if (error) {
      setError(error.message)
      throw error
    }
    setError(null)
    await refresh()
  }

  async function deleteItem(id) {
    const { error } = await supabase.from(tableName).delete().eq('id', id)
    if (error) {
      setError(error.message)
      throw error
    }
    setError(null)
    await refresh()
  }

  return { items, loading, error, addItem, updateItem, deleteItem, refresh }
}
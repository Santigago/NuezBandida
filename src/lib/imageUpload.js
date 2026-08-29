import { supabase } from './supabaseClient.js'

const MAX_DIMENSION = 1600
const JPEG_QUALITY = 0.8

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width)
            width = MAX_DIMENSION
          } else {
            width = Math.round((width * MAX_DIMENSION) / height)
            height = MAX_DIMENSION
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo procesar la imagen'))),
          'image/jpeg',
          JPEG_QUALITY
        )
      }
      img.onerror = () => reject(new Error('No se pudo leer la imagen'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file, folder) {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen')
  }

  const resizedBlob = await resizeImage(file)
  const fileName = `${folder}/${crypto.randomUUID()}.jpg`

  const { error } = await supabase.storage
    .from('app-images')
    .upload(fileName, resizedBlob, { contentType: 'image/jpeg', cacheControl: '3600' })

  if (error) throw error

  const { data } = supabase.storage.from('app-images').getPublicUrl(fileName)
  return data.publicUrl
}

export async function deleteImageByUrl(url) {
  const marker = '/app-images/'
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await supabase.storage.from('app-images').remove([path])
}

// Crea una copia independiente de una imagen en otra carpeta del bucket.
// Útil para "archivar" una foto (ej: recuerdos del tablero) de forma que
// borrar o reemplazar el original no afecte a la copia archivada.
export async function copyImage(url, folder) {
  const marker = '/app-images/'
  const idx = url.indexOf(marker)
  if (idx === -1) return url

  const oldPath = url.slice(idx + marker.length)
  const ext = oldPath.split('.').pop() || 'jpg'
  const newPath = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('app-images').copy(oldPath, newPath)
  if (error) throw error

  const { data } = supabase.storage.from('app-images').getPublicUrl(newPath)
  return data.publicUrl
}

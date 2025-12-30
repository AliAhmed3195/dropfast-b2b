'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { PublicStore } from '../../../src/app/components/public-store/PublicStore'
import { Loader2 } from 'lucide-react'

export default function StorePage() {
  const params = useParams()
  const slug = params.slug as string
  const [storeData, setStoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchStore = async () => {
      if (!slug) {
        if (isMounted) {
          setError('Store slug is required')
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
        
        const response = await fetch(`/api/public/store/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        // Log response for debugging
        console.log('Store fetch response:', {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
        })
        
        if (!response.ok) {
          let errorData: any = {}
          try {
            errorData = await response.json()
          } catch (e) {
            // If response is not JSON, use status text
            errorData = { error: response.statusText || 'Unknown error' }
          }
          
          console.error('Store fetch error:', {
            status: response.status,
            errorData,
          })
          
          if (isMounted) {
            if (response.status === 404) {
              setError(errorData.error || `Store "${slug}" not found. Please check the URL and try again.`)
            } else if (response.status === 403) {
              setError(errorData.error || 'Store is not available. Please publish the store first by clicking "Publish" in the store builder.')
            } else {
              setError(errorData.error || `Failed to load store (${response.status}). Please try again later.`)
            }
            setLoading(false)
          }
          return
        }

        const data = await response.json()
        console.log('Store data received:', data)
        
        if (!isMounted) return
        
        if (!data) {
          setError('No data received from server')
          setLoading(false)
          return
        }

        if (!data.store) {
          setError('Invalid store data: store object not found in response')
          setLoading(false)
          return
        }

        setStoreData({
          ...data.store,
          slug: slug,
        })
        setError(null)
      } catch (err: any) {
        console.error('Fetch store error:', err)
        if (isMounted) {
          if (err.name === 'AbortError') {
            setError('Request timed out. Please check your connection and try again.')
          } else {
            setError(err.message || 'Failed to load store. Please check your connection and try again.')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStore()
    
    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </div>
    )
  }

  if (error || !storeData) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'The store you are looking for does not exist.'}
          </p>
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-700 underline"
          >
            Go to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <PublicStore
      storeData={storeData}
      onClose={() => {
        // Navigate to home or dashboard
        window.location.href = '/'
      }}
    />
  )
}


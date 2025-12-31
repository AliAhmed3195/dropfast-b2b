'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PublicStore } from '../../../../src/app/components/public-store/PublicStore'
import { Loader2 } from 'lucide-react'

export default function CartPage() {
  const params = useParams()
  const router = useRouter()
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
        
        const response = await fetch(`/api/public/store/${slug}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (isMounted) {
            if (response.status === 404) {
              setError(errorData.error || 'Store not found')
            } else if (response.status === 403) {
              setError(errorData.error || 'Store is not available')
            } else {
              setError(errorData.error || 'Failed to load store')
            }
            setLoading(false)
          }
          return
        }

        const data = await response.json()
        if (!isMounted) return
        
        if (!data.store) {
          setError('Invalid store data')
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
          setError(err.message || 'Failed to load store')
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !storeData) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error || 'Store not found'}</p>
          <button
            onClick={() => router.push(`/store/${slug}`)}
            className="text-indigo-600 hover:text-indigo-700 underline"
          >
            Back to Store
          </button>
        </div>
      </div>
    )
  }

  return (
    <PublicStore
      storeData={storeData}
      initialView={{ type: 'cart' }}
      onClose={() => router.push(`/store/${slug}`)}
    />
  )
}


import { useEffect, useState } from 'react'
import { topicService } from '../topic.service'
import type { Topic } from '../../../types/database.types'

export function useTopics(moduleId: string | null) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(Boolean(moduleId))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!moduleId) {
      setTopics([])
      setIsLoading(false)
      setError(null)
      return
    }

    let isMounted = true

    const loadTopics = async () => {
      try {
        const topicData = await topicService.listTopics(moduleId)
        if (!isMounted) return
        setTopics(topicData)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Unable to load topics.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTopics()

    return () => {
      isMounted = false
    }
  }, [moduleId])

  return { topics, isLoading, error }
}

import useStore from '../store/editorStore'
import { startGenerate, pollGenerate } from '../lib/api'

// 3D generation via Go backend → gRPC → AI backend → PiAPI/Tripo.
export function useAIGeneration(workspaceId: string) {
  const isGenerating = useStore((s: any) => s.isGenerating)
  const generationStatus = useStore((s: any) => s.generationStatus)
  const addModel = useStore((s: any) => s.addModel)

  const startGeneration = async (prompt: string, file: File | null) => {
    useStore.setState({ isGenerating: true, generationStatus: 'Starting generation…' })

    try {
      let body: { mode: 'text_to_model' | 'image_to_model'; prompt?: string; image_url?: string }
      if (file) {
        // ponytail: image sent as data URI — works with PiAPI; swap to S3 upload if a provider rejects it
        const dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        body = { mode: 'image_to_model', image_url: dataUri, prompt }
      } else {
        body = { mode: 'text_to_model', prompt }
      }

      const job = await startGenerate(workspaceId, body)
      useStore.setState({ generationStatus: 'Generating 3D model… (1-3 min)' })

      const modelUrl = await pollGenerate(workspaceId, job.job_id, job.chat_id, (s) =>
        useStore.setState({ generationStatus: `Generating 3D model… (${s})` }),
      )

      useStore.setState({ isGenerating: false, generationStatus: '' })
      addModel(modelUrl, prompt ? `AI: ${prompt.substring(0, 15)}...` : 'AI Generated Model')
    } catch (error: any) {
      console.error('AI Generation Error:', error)
      useStore.setState({ isGenerating: false, generationStatus: `Error: ${error.message}` })
    }
  }

  return {
    isGenerating,
    generationStatus,
    startGeneration,
  }
}

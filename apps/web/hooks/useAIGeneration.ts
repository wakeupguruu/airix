import useStore from '../store/editorStore'
import { ai3dService, AIProvider, GenerationParams } from '../services/ai3d'
import { useState } from 'react'

export function useAIGeneration() {
  const isGenerating = useStore((s) => s.isGenerating)
  const generationStatus = useStore((s) => s.generationStatus)
  const addModel = useStore((s) => s.addModel)
  // We'll update Zustand store manually inside this hook to decouple logic
  
  const startGeneration = async (
    prompt: string, 
    file: File | null, 
    provider: AIProvider = 'piapi', 
    params: Partial<GenerationParams> = {}
  ) => {
    useStore.setState({ isGenerating: true, generationStatus: 'Initializing AI...' })

    const handleProgress = (status: string) => {
      useStore.setState({ generationStatus: status })
    }

    try {
      let finalModelUrl = ''

      const genParams: GenerationParams = {
        prompt,
        file,
        onProgress: handleProgress,
        ...params
      }

      switch (provider) {
        case 'piapi':
          finalModelUrl = await ai3dService.generateWithPiAPI(genParams)
          break
        case 'hf':
          finalModelUrl = await ai3dService.generateWithHuggingFace(genParams)
          break
        case 'tripo':
          finalModelUrl = await ai3dService.generateWithTripo(genParams)
          break
        default:
          throw new Error(`Unsupported provider: ${provider}`)
      }

      if (!finalModelUrl) throw new Error('Could not find final model URL')

      useStore.setState({ isGenerating: false, generationStatus: '' })
      addModel(finalModelUrl, prompt ? `AI: ${prompt.substring(0, 15)}...` : 'AI Generated Model')

    } catch (error: any) {
      console.error('AI Generation Error:', error)
      useStore.setState({ isGenerating: false, generationStatus: `Error: ${error.message}` })
    }
  }

  return {
    isGenerating,
    generationStatus,
    startGeneration
  }
}

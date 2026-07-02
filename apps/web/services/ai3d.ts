import { Client } from '@gradio/client'

export type AIProvider = 'piapi' | 'hf' | 'tripo'

export interface GenerationParams {
  prompt?: string
  file?: File | null
  ss_sampling_steps?: number
  slat_sampling_steps?: number
  ss_guidance_strength?: number
  slat_guidance_strength?: number
  onProgress?: (status: string) => void
}

const PIAPI_KEY = process.env.NEXT_PUBLIC_TELLIST_AI || ''
const HF_KEY = process.env.NEXT_PUBLIC_HF_KEY || ''
const TRIPO_KEY = process.env.NEXT_PUBLIC_TRIPO_KEY || ''

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export const ai3dService = {
  generateWithPiAPI: async (params: GenerationParams): Promise<string> => {
    const { prompt, file, onProgress } = params
    let inputPayload: Record<string, any> = {}
    let taskType = 'text-to-3d'

    if (file) {
      onProgress?.('Converting image for PiAPI...')
      const base64Image = await fileToBase64(file)
      taskType = 'image-to-3d'
      inputPayload = { image: base64Image }
    } else if (prompt) {
      inputPayload = { prompt }
    } else {
      throw new Error('No prompt or image provided')
    }

    onProgress?.(`Creating Trellis task (${taskType})...`)

    const createRes = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: { 'x-api-key': PIAPI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'Qubico/trellis',
        task_type: taskType,
        input: {
          ...inputPayload,
          ss_sampling_steps: params.ss_sampling_steps || 50,
          slat_sampling_steps: params.slat_sampling_steps || 50,
          ss_guidance_strength: params.ss_guidance_strength || 7.5,
          slat_guidance_strength: params.slat_guidance_strength || 3,
        },
      }),
    })

    if (!createRes.ok) {
      const errData = await createRes.json().catch(() => ({}))
      throw new Error(errData.message || `Task creation failed: ${createRes.status}`)
    }

    const createData = await createRes.json()
    const taskId = createData.data?.task_id
    if (!taskId) throw new Error('No task ID received from PiAPI')

    onProgress?.('Task created. Waiting for 3D generation...')

    let done = false
    while (!done) {
      await new Promise((r) => setTimeout(r, 2000))
      const poll = await fetch(`https://api.piapi.ai/api/v1/task/${taskId}`, {
        headers: { 'x-api-key': PIAPI_KEY },
      })
      if (!poll.ok) continue
      const d = await poll.json()
      const st = d.data?.status
      if (st === 'completed') {
        const out = d.data.output
        const finalModelUrl = out.model || out.model_url || out.url || out.mesh ||
          Object.values(out).find(
            (v) => typeof v === 'string' && (v.endsWith('.glb') || v.endsWith('.gltf') || v.endsWith('.obj'))
          )
        if (!finalModelUrl) throw new Error('Model URL not found in PiAPI response')
        return finalModelUrl as string
      } else if (st === 'failed') {
        throw new Error('PiAPI task failed')
      } else {
        onProgress?.(`Status: ${st}...`)
      }
    }
    throw new Error('Timeout or unknown error in PiAPI')
  },

  generateWithHuggingFace: async (params: GenerationParams): Promise<string> => {
    const { prompt, file, onProgress } = params
    onProgress?.('Connecting to tencent/Hunyuan3D-2...')
    try {
      // hf_token missing from ClientOptions typings but accepted at runtime
      const client = await Client.connect('tencent/Hunyuan3D-2', {
        hf_token: HF_KEY,
      } as any)
      let result
      if (file) {
        onProgress?.('Sending image to Hunyuan3D-2...')
        result = await client.predict('/shape_generation', [
          prompt || '', file,
          null, null, null, null,
          30, 5.0, 1234, 256, true, 8000, true,
        ])
      } else if (prompt) {
        onProgress?.('Sending text to Hunyuan3D-2...')
        result = await client.predict('/shape_generation', [
          prompt, null,
          null, null, null, null,
          30, 5.0, 1234, 256, true, 8000, true,
        ])
      } else {
        throw new Error('No prompt or image provided')
      }

      onProgress?.('Processing HuggingFace response...')
      if (result && result.data && Array.isArray(result.data)) {
        const out = result.data.find(d => d && d.url && (d.url.endsWith('.glb') || d.url.endsWith('.obj')))
        if (out) return out.url
      }
      throw new Error('Failed to parse HuggingFace output')
    } catch (err: any) {
      throw new Error(`HuggingFace error: ${err.message}`)
    }
  },

  generateWithTripo: async (params: GenerationParams): Promise<string> => {
    const { prompt, file, onProgress } = params
    let createRes

    if (file) {
      onProgress?.('Uploading image to Tripo3D...')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')

      const uploadRes = await fetch('https://api.tripo3d.ai/v2/openapi/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${TRIPO_KEY}` },
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Tripo3D image upload failed')
      const uploadData = await uploadRes.json()
      const imageToken = uploadData.data?.image_token

      onProgress?.('Creating Tripo3D image-to-3d task...')
      createRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: { Authorization: `Bearer ${TRIPO_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'image_to_model', file: { type: 'jpg', file_token: imageToken } }),
      })
    } else if (prompt) {
      onProgress?.('Creating Tripo3D text-to-3d task...')
      createRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
        method: 'POST',
        headers: { Authorization: `Bearer ${TRIPO_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'text_to_model', prompt }),
      })
    } else {
      throw new Error('No prompt or image provided')
    }

    if (!createRes.ok) throw new Error('Tripo3D task creation failed')
    const createData = await createRes.json()
    const taskId = createData.data?.task_id
    if (!taskId) throw new Error('No task ID received from Tripo3D')

    onProgress?.('Task created. Polling Tripo3D status...')

    let done = false
    while (!done) {
      await new Promise((r) => setTimeout(r, 2000))
      const poll = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
        headers: { Authorization: `Bearer ${TRIPO_KEY}` },
      })
      if (!poll.ok) continue
      const d = await poll.json()
      const st = d.data?.status
      if (st === 'success') {
        const finalUrl = d.data.output?.model || d.data.result?.model?.url
        if (!finalUrl) throw new Error('No model URL in Tripo3D response')
        return finalUrl
      } else if (st === 'failed') {
        throw new Error('Tripo3D task failed')
      } else {
        const progress = d.data?.progress || 0
        onProgress?.(`Generating: ${progress}%...`)
      }
    }
    throw new Error('Timeout or unknown error in Tripo3D')
  }
}

// @ts-nocheck
/* eslint-disable */
import { create } from 'zustand'
import * as THREE from 'three'
import { Brush, Evaluator, ADDITION, SUBTRACTION, INTERSECTION } from 'three-bvh-csg'

const PIAPI_KEY = process.env.NEXT_PUBLIC_TELLIST_AI || ''

let nextId = 1

/* ─────────────────────────────────────────────
   Helper: create a THREE.BufferGeometry from
   our serialisable scene-object descriptor.
   ───────────────────────────────────────────── */
function createGeometryFromDescriptor(type, geometryArgs) {
  const a = geometryArgs || []
  switch (type) {
    case 'box':          return new THREE.BoxGeometry(...a)
    case 'cylinder':     return new THREE.CylinderGeometry(...a)
    case 'sphere':       return new THREE.SphereGeometry(...a)
    case 'cone':         return new THREE.ConeGeometry(...a)
    case 'torus':        return new THREE.TorusGeometry(...a)
    case 'plane':        return new THREE.PlaneGeometry(...a)
    case 'capsule':      return new THREE.CapsuleGeometry(...a)
    case 'circle':       return new THREE.CircleGeometry(...a)
    case 'dodecahedron': return new THREE.DodecahedronGeometry(...a)
    case 'icosahedron':  return new THREE.IcosahedronGeometry(...a)
    case 'octahedron':   return new THREE.OctahedronGeometry(...a)
    case 'tetrahedron':  return new THREE.TetrahedronGeometry(...a)
    case 'ring':         return new THREE.RingGeometry(...a)
    case 'torusknot':    return new THREE.TorusKnotGeometry(...a)
    default:             return new THREE.BoxGeometry(1, 1, 1)
  }
}

/* ─────────────────────────────────────────────
   Helper: run CSG imperatively with three-bvh-csg.
   Returns a BufferGeometry or null on failure.
   ───────────────────────────────────────────── */
function runCSG(objA, objB, operation) {
  try {
    const geoA = objA.type === 'csg_result'
      ? objA.geometry.clone()
      : createGeometryFromDescriptor(objA.type, objA.geometryArgs)

    const geoB = objB.type === 'csg_result'
      ? objB.geometry.clone()
      : createGeometryFromDescriptor(objB.type, objB.geometryArgs)

    const brushA = new Brush(geoA, new THREE.MeshStandardMaterial())
    brushA.position.set(...(objA.position || [0, 0, 0]))
    brushA.rotation.set(...(objA.rotation || [0, 0, 0]))
    brushA.scale.set(...(objA.scale || [1, 1, 1]))
    brushA.updateMatrixWorld(true)

    const brushB = new Brush(geoB, new THREE.MeshStandardMaterial())
    brushB.position.set(...(objB.position || [0, 0, 0]))
    brushB.rotation.set(...(objB.rotation || [0, 0, 0]))
    brushB.scale.set(...(objB.scale || [1, 1, 1]))
    brushB.updateMatrixWorld(true)

    const opMap = { union: ADDITION, subtract: SUBTRACTION, intersect: INTERSECTION }
    const evaluator = new Evaluator()
    const result = evaluator.evaluate(brushA, brushB, opMap[operation] ?? ADDITION)

    // The result IS a Brush (which extends Mesh), so we grab .geometry
    const outGeo = result.geometry
    outGeo.computeVertexNormals()

    // Clean up temporaries
    geoA.dispose()
    geoB.dispose()

    return outGeo
  } catch (err) {
    console.error('CSG evaluation failed:', err)
    return null
  }
}

/* ═════════════════════════════════════════════
   ZUSTAND STORE
   ═════════════════════════════════════════════ */
const useStore = create((set, get) => ({
  // ── Scene objects ──
  sceneObjects: [],
  selectedIds: [],
  transformMode: 'translate',
  exportGroupRef: null,
  setExportGroupRef: (ref) => set({ exportGroupRef: ref }),
  
  // ── Global Scene Settings ──
  materialMode: 'solid',
  setMaterialMode: (mode) => set({ materialMode: mode }),

  editorTheme: null,
  setEditorTheme: (theme) => set({ editorTheme: theme }),

  envSettings: {
    bgId: 'dark',
    showGrid: true,
    showAxes: false,
    fogEnabled: false,
    fogDensity: 0.02,
    ambientInt: 0.9,
    shadowsOn: false,
    toneMapping: 'aces',
  },
  setEnvSettings: (updates) => set((s) => ({ envSettings: { ...s.envSettings, ...updates } })),

  // ── Undo / Redo ──
  // NOTE: csg_result objects contain a BufferGeometry which is NOT
  // JSON-serialisable.  The history serialiser skips them so undo/redo
  // will not restore CSG results.  A full solution would snapshot the
  // geometry arrays, but that's out of scope here.
  history: ['[]'],
  historyIndex: 0,
  clipboard: [],

  // ── CSG (imperative, using three-bvh-csg) ──
  performCSG: (operation) => {
    const state = get()
    const selected = state.selectedIds
      .map((id) => state.sceneObjects.find((o) => o.id === id))
      .filter(Boolean)

    if (selected.length < 2) return

    get().saveHistory()

    // Fold left: A op B op C op D ...
    let accumObj = selected[0]

    for (let i = 1; i < selected.length; i++) {
      const resultGeo = runCSG(accumObj, selected[i], operation)
      if (!resultGeo) {
        console.error('CSG failed at step', i)
        return
      }
      // Build an intermediate csg_result descriptor that can be fed
      // back into runCSG (it checks for type === 'csg_result')
      accumObj = {
        id: '_tmp_',
        type: 'csg_result',
        geometry: resultGeo,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      }
    }

    const newId = `csg_${nextId++}`
    const csgObj = {
      id: newId,
      type: 'csg_result',
      name: `CSG ${operation.charAt(0).toUpperCase() + operation.slice(1)}`,
      geometry: accumObj.geometry,          // BufferGeometry stored in state
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: selected[0].color || '#aaaaaa',
      visible: true,
      castShadow: true,
      receiveShadow: true,
    }

    set((s) => ({
      sceneObjects: [
        ...s.sceneObjects.filter((o) => !s.selectedIds.includes(o.id)),
        csgObj,
      ],
      selectedIds: [newId],
    }))
  },

  // ── UI state ──
  sidebarTab: 'scene',
  sidebarExpanded: false,
  showShortcuts: false,
  isGenerating: false,
  generationStatus: '',

  // ── Actions ──
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setSidebarExpanded: (v) => set({ sidebarExpanded: v }),
  setTransformMode: (mode) => set({ transformMode: mode }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelection: (id, multi) =>
    set((s) => {
      if (multi) {
        return s.selectedIds.includes(id)
          ? { selectedIds: s.selectedIds.filter((i) => i !== id) }
          : { selectedIds: [...s.selectedIds, id] }
      }
      return { selectedIds: [id] }
    }),
  setShowShortcuts: (show) => set({ showShortcuts: show }),

  // ── History ──
  saveHistory: () =>
    set((s) => {
      // Filter out non-serialisable csg_result geometry before snapshot
      const serialisable = s.sceneObjects.map((o) =>
        o.type === 'csg_result' ? { ...o, geometry: '__CSG__' } : o
      )
      const snap = JSON.stringify(serialisable)
      const next = s.history.slice(0, s.historyIndex + 1)
      if (next.length > 0 && next[next.length - 1] === snap) return s
      next.push(snap)
      if (next.length > 50) next.shift()
      return { history: next, historyIndex: next.length - 1 }
    }),

  undo: () =>
    set((s) => {
      if (s.historyIndex > 0) {
        const parsed = JSON.parse(s.history[s.historyIndex - 1])
        // csg_result objects lose their geometry on undo — filter them out
        const restored = parsed.filter((o) => o.type !== 'csg_result' || o.geometry !== '__CSG__')
        return { sceneObjects: restored, historyIndex: s.historyIndex - 1, selectedIds: [] }
      }
      return s
    }),

  redo: () =>
    set((s) => {
      if (s.historyIndex < s.history.length - 1) {
        const parsed = JSON.parse(s.history[s.historyIndex + 1])
        const restored = parsed.filter((o) => o.type !== 'csg_result' || o.geometry !== '__CSG__')
        return { sceneObjects: restored, historyIndex: s.historyIndex + 1, selectedIds: [] }
      }
      return s
    }),

  copySelected: () =>
    set((s) => {
      const selected = s.sceneObjects
        .filter((o) => s.selectedIds.includes(o.id) && o.type !== 'csg_result')
      return { clipboard: JSON.parse(JSON.stringify(selected)) }
    }),

  pasteClipboard: () => {
    const { clipboard } = get()
    if (clipboard.length === 0) return
    get().saveHistory()
    set((s) => {
      const newObjs = clipboard.map((obj) => ({
        ...JSON.parse(JSON.stringify(obj)),
        id: `obj_${nextId++}`,
        name: `${obj.name} (Copy)`,
        position: [obj.position[0] + 0.5, obj.position[1] + 0.5, obj.position[2] + 0.5],
      }))
      return {
        sceneObjects: [...s.sceneObjects, ...newObjs],
        selectedIds: newObjs.map((o) => o.id),
      }
    })
  },

  // ── Add Primitive ──
  addPrimitive: (type, overrides = {}) => {
    get().saveHistory()
    const id = `obj_${nextId++}`

    const defaultArgs = {
      box: [1, 1, 1],
      cylinder: [1, 1, 2, 32],
      sphere: [1, 32, 16],
      cone: [1, 2, 32],
      torus: [1, 0.4, 16, 100],
      plane: [1, 1],
      capsule: [1, 1, 4, 8],
      circle: [1, 32],
      dodecahedron: [1, 0],
      icosahedron: [1, 0],
      octahedron: [1, 0],
      tetrahedron: [1, 0],
      ring: [0.5, 1, 32],
      torusknot: [1, 0.4, 64, 8],
      tube: [],
      lathe: [],
      pointlight: [],
      directionallight: [],
      spotlight: [],
      hemispherelight: [],
      ambientlight: [],
    }

    const names = {
      box: 'Box', cylinder: 'Cylinder', sphere: 'Sphere', cone: 'Cone',
      torus: 'Torus', plane: 'Plane', capsule: 'Capsule', circle: 'Circle',
      dodecahedron: 'Dodecahedron', icosahedron: 'Icosahedron',
      octahedron: 'Octahedron', tetrahedron: 'Tetrahedron',
      ring: 'Ring', torusknot: 'Torus Knot', tube: 'Tube', lathe: 'Lathe',
      pointlight: 'Point Light', directionallight: 'Directional Light',
      spotlight: 'Spot Light', hemispherelight: 'Hemisphere Light',
      ambientlight: 'Ambient Light',
    }

    set((s) => {
      const offset = s.sceneObjects.length * 1.5
      const obj = {
        id,
        type,
        name: overrides.name || names[type] || type,
        position: overrides.position || [offset - 3, 0.977, 0],
        rotation: overrides.rotation || [0, 0, 0],
        scale: overrides.scale || [1, 1, 1],
        geometryArgs: overrides.geometryArgs || defaultArgs[type] || [1],
        color: overrides.color || '#aaaaaa',
        visible: true,
        castShadow: false,
        receiveShadow: false,
      }
      return { sceneObjects: [...s.sceneObjects, obj], selectedIds: [id] }
    })
  },

  removePrimitive: (id) => {
    get().saveHistory()
    set((s) => ({
      sceneObjects: s.sceneObjects.filter((o) => o.id !== id),
      selectedIds: s.selectedIds.filter((i) => i !== id),
    }))
  },

  updateObject: (id, updates) =>
    set((s) => ({
      sceneObjects: s.sceneObjects.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),

  clearScene: () => {
    get().saveHistory()
    set({ sceneObjects: [], selectedIds: [] })
  },

  addModel: (url, filename) => {
    get().saveHistory()
    const id = `obj_${nextId++}`
    set((s) => ({
      sceneObjects: [
        ...s.sceneObjects,
        {
          id,
          type: 'gltf',
          name: filename,
          url,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          visible: true,
          castShadow: true,
          receiveShadow: true,
          color: '#ffffff',
        },
      ],
      selectedIds: [id],
    }))
  },
}))

export default useStore

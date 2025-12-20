import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled'
export type ProjectType = 'Residential' | 'Commercial' | 'Industrial' | 'Infrastructure' | 'Other'

export interface Project {
  id: number
  projectName: string
  customerId: number
  customerName?: string
  projectType: ProjectType
  location: string
  startDate: string
  endDate?: string
  status: ProjectStatus
  contractValue: number
  advanceReceived: number
  remainingAmount: number
  paymentTerms?: string
  projectManagerId?: number
  projectManagerName?: string
  contractorId?: number
  contractorName?: string
  notes?: string
}

export interface ProjectFormData {
  projectName: string
  customerId: number
  projectType: ProjectType
  location: string
  startDate: string
  endDate?: string
  status: ProjectStatus
  contractValue: number
  advanceReceived: number
  remainingAmount: number
  paymentTerms?: string
  projectManagerId?: number
  contractorId?: number
  notes?: string
}

interface ProjectState {
  list: Project[]
  loading: boolean
  error: string | null
  selectedProject: Project | null
}

const initialState: ProjectState = {
  list: [],
  loading: false,
  error: null,
  selectedProject: null
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    fetchProjects(state) {
      state.loading = true
      state.error = null
    },
    fetchProjectsSuccess(state, action: PayloadAction<Project[]>) {
      state.list = Array.isArray(action.payload) ? action.payload : []
      state.loading = false
      state.error = null
    },
    fetchProjectsFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
      if (!Array.isArray(state.list)) {
        state.list = []
      }
    },
    createProject(state, action: PayloadAction<ProjectFormData>) {
      state.loading = true
      state.error = null
    },
    createProjectSuccess(state, action: PayloadAction<Project>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      state.list.push(action.payload)
      state.loading = false
      state.error = null
    },
    createProjectFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    updateProject(state, action: PayloadAction<{ id: number; data: ProjectFormData }>) {
      state.loading = true
      state.error = null
    },
    updateProjectSuccess(state, action: PayloadAction<Project>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      }
      const index = state.list.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
      state.error = null
    },
    updateProjectFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    deleteProject(state, action: PayloadAction<number>) {
      state.loading = true
      state.error = null
    },
    deleteProjectSuccess(state, action: PayloadAction<number>) {
      if (!Array.isArray(state.list)) {
        state.list = []
      } else {
        state.list = state.list.filter((p) => p.id !== action.payload)
      }
      state.loading = false
      state.error = null
    },
    deleteProjectFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    selectProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload
    },
    clearError(state) {
      state.error = null
    }
  }
})

export const {
  fetchProjects,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  createProject,
  createProjectSuccess,
  createProjectFailure,
  updateProject,
  updateProjectSuccess,
  updateProjectFailure,
  deleteProject,
  deleteProjectSuccess,
  deleteProjectFailure,
  selectProject,
  clearError
} = projectSlice.actions

export default projectSlice.reducer


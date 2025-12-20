import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectProject, clearError } from '../store/slices/projectSlice'
import ProjectList from './project/ProjectList'
import ProjectForm from './project/ProjectForm'
import ErrorDisplay from '../components/ErrorDisplay'
import './ProjectsPage.css'

export default function ProjectsPage() {
  const dispatch = useAppDispatch()
  const { selectedProject, error } = useAppSelector((s) => s.project)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (selectedProject) {
      setShowForm(true)
    }
  }, [selectedProject])

  const handleFormSuccess = () => {
    setShowForm(false)
    dispatch(selectProject(null))
  }

  const handleAddNew = () => {
    dispatch(selectProject(null))
    setShowForm(true)
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>Project Management</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            + Add New Project
          </button>
        )}
      </div>

      <ErrorDisplay
        error={error}
        onClear={() => dispatch(clearError())}
      />

      {showForm && (
        <div className="form-section">
          <ProjectForm project={selectedProject} onSuccess={handleFormSuccess} />
        </div>
      )}

      {!showForm && (
        <div className="list-section">
          <ProjectList />
        </div>
      )}
    </div>
  )
}

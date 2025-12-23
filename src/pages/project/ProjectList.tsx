import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  fetchProjects,
  deleteProject,
  selectProject,
  Project
} from '../../store/slices/projectSlice'
import useNotification from '../../components/NotificationContainer'
import { useTableSort } from '../../hooks/useTableSort'
import { getSortClassName } from '../../utils/sortHelpers'
import './ProjectList.css'

export default function ProjectList() {
  const dispatch = useAppDispatch()
  const { list, loading, error } = useAppSelector((s) => s.project)
  const { showNotification, NotificationContainer } = useNotification()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const handleDelete = (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(projectId))
      showNotification('success', 'Project deleted successfully')
    }
  }

  const handleEdit = (project: Project) => {
    dispatch(selectProject(project))
  }

  const filteredProjects = (Array.isArray(list) ? list : []).filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const { sortedData, handleSort, getSortDirection } = useTableSort<Project>(filteredProjects)

  return (
    <>
      <NotificationContainer />
      <div className="project-list-container">
        <div className="project-list-header">
          <h2>Projects</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {loading && <div className="loading">Loading projects...</div>}

        {!loading && filteredProjects.length === 0 && (
          <div className="empty-state">
            {searchTerm ? 'No projects found matching your search.' : 'No projects found.'}
          </div>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="project-table-wrapper">
            <table className="project-table">
              <thead>
                <tr>
                  <th 
                    className={getSortClassName(getSortDirection, 'projectName')}
                    onClick={() => handleSort('projectName')}
                  >
                    Project Name
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'customerName')}
                    onClick={() => handleSort('customerName')}
                  >
                    Customer
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'projectType')}
                    onClick={() => handleSort('projectType')}
                  >
                    Type
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'location')}
                    onClick={() => handleSort('location')}
                  >
                    Location
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'status')}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </th>
                  <th 
                    className={getSortClassName(getSortDirection, 'contractValue')}
                    onClick={() => handleSort('contractValue')}
                  >
                    Contract Value
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((project) => (
                  <tr key={project.id}>
                    <td>{project.projectName}</td>
                    <td>{project.customerName || '-'}</td>
                    <td>{project.projectType}</td>
                    <td>{project.location}</td>
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>₹{project.contractValue.toLocaleString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-edit"
                          onClick={() => handleEdit(project)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(project.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}


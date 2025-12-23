import { useState } from 'react'
import UnitsTab from './masterdata/UnitsTab'
import CategoriesTab from './masterdata/CategoriesTab'
import MaterialsTab from './masterdata/MaterialsTab'
import RolesTab from './masterdata/RolesTab'
import UsersTab from './user/UsersTab'
import './MasterDataPage.css'

type TabType = 'units' | 'categories' | 'materials' | 'roles' | 'users'

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabType>('units')

  return (
    <div className="master-data-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'units' ? 'active' : ''}`}
            onClick={() => setActiveTab('units')}
          >
            Units
          </button>
          <button
            className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            className={`tab ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            Materials
          </button>
          <button
            className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'units' && <UnitsTab />}
          {activeTab === 'categories' && <CategoriesTab />}
          {activeTab === 'materials' && <MaterialsTab />}
          {activeTab === 'roles' && <RolesTab />}
          {activeTab === 'users' && <UsersTab />}
        </div>
      </div>
    </div>
  )
}


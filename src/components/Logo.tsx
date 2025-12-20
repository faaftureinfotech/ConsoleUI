import './Logo.css'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

export default function Logo({ size = 'medium', showText = true }: LogoProps) {
  return (
    <div className={`logo logo-${size}`}>
      <div className="logo-icon">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg"
        >
          {/* Construction crane/building icon */}
          <rect x="30" y="50" width="40" height="45" fill="#2563eb" rx="2" />
          <rect x="35" y="55" width="8" height="8" fill="white" rx="1" />
          <rect x="47" y="55" width="8" height="8" fill="white" rx="1" />
          <rect x="59" y="55" width="8" height="8" fill="white" rx="1" />
          <rect x="35" y="67" width="8" height="8" fill="white" rx="1" />
          <rect x="47" y="67" width="8" height="8" fill="white" rx="1" />
          <rect x="59" y="67" width="8" height="8" fill="white" rx="1" />
          
          {/* Crane arm */}
          <line x1="50" y1="50" x2="50" y2="20" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="20" x2="75" y2="20" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="75" y1="20" x2="75" y2="35" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="75" cy="38" r="4" fill="#f59e0b" />
          
          {/* Base */}
          <rect x="45" y="85" width="10" height="10" fill="#374151" rx="1" />
        </svg>
      </div>
      {showText && (
        <div className="logo-text">
          <span className="logo-text-primary">Construction</span>
          <span className="logo-text-secondary">App</span>
        </div>
      )}
    </div>
  )
}


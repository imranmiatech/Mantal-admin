import { useEffect, useState } from 'react'
import { getResearcherSubmissionsRequest } from '../api/adminApi'
import type { AllResearcher, ResearcherSubmission } from '../types/admin'

type ResearcherPostsModalProps = {
  researcher: AllResearcher | null
  onClose: () => void
}

export function ResearcherPostsModal({ researcher, onClose }: ResearcherPostsModalProps) {
  const [posts, setPosts] = useState<ResearcherSubmission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!researcher) return

    const fetchPosts = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getResearcherSubmissionsRequest(researcher.id)
        setPosts(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch posts.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [researcher])

  if (!researcher) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return '#b7dd79'
      case 'PENDING': return '#d8ad4b'
      case 'REJECTED': return '#ef7f70'
      default: return '#f5f7f2'
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease;
          padding: 24px;
        }

        .modal-content {
          background: var(--surface-strong, #111a14);
          border: 1px solid var(--line);
          border-radius: 24px;
          width: 100%;
          max-width: 680px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
          position: relative;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--line);
          color: var(--text-soft);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.2s;
        }
        
        .modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .modal-header {
          padding: 28px 32px 20px;
          border-bottom: 1px solid var(--line);
        }
        
        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 4px;
          color: #f5f7f2;
        }

        .posts-timeline {
          padding: 32px;
          overflow-y: auto;
          display: grid;
          gap: 20px;
        }

        .posts-timeline::-webkit-scrollbar {
          width: 8px;
        }
        .posts-timeline::-webkit-scrollbar-track {
          background: transparent;
        }
        .posts-timeline::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .post-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 24px;
        }

        .post-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .post-card-header h3 {
          font-size: 1.1rem;
          margin: 0 0 4px;
          color: #f5f7f2;
        }

        .post-meta {
          font-size: 0.85rem;
          color: var(--text-soft);
        }

        .status-indicator {
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .post-scores {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.15);
          border: 1px solid var(--line);
          border-radius: 12px;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px;
        }

        .score-item:not(:last-child) {
          border-right: 1px solid var(--line);
        }

        .score-label {
          font-size: 0.7rem;
          color: var(--text-soft);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .score-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f5f7f2;
        }

        .post-narrative {
          color: var(--text-soft);
          font-size: 0.95rem;
          line-height: 1.6;
          padding-top: 16px;
          border-top: 1px dashed var(--line);
        }

        .modal-loading,
        .modal-error {
          padding: 48px;
          text-align: center;
          color: var(--text-soft);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <header className="modal-header">
          <h2>{researcher.fullName}'s Posts</h2>
          <p className="muted">{researcher.email}</p>
        </header>

        {loading ? (
          <div className="modal-loading">Loading posts...</div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : posts.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem 0' }}>
            No posts found for this researcher.
          </div>
        ) : (
          <div className="posts-timeline">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-card-header">
                  <div>
                    <h3>
                      {post.district}
                      {post.upazilaName ? `, ${post.upazilaName}` : ''}
                    </h3>
                    <span className="post-meta">
                      {new Date(post.createdAt).toLocaleDateString()} • {post.division}
                    </span>
                  </div>
                  <span
                    className="status-indicator"
                    style={{
                      color: getStatusColor(post.status),
                      borderColor: getStatusColor(post.status),
                      backgroundColor: `${getStatusColor(post.status)}1A`
                    }}
                  >
                    {post.status}
                  </span>
                </div>

                <div className="post-scores">
                  <div className="score-item">
                    <span className="score-label">Risk Index</span>
                    <strong className="score-value" style={{ color: 'var(--primary)' }}>
                      {post.riskIndex}
                    </strong>
                  </div>
                  <div className="score-item">
                    <span className="score-label">CE</span>
                    <strong className="score-value">{post.ce}</strong>
                  </div>
                  <div className="score-item">
                    <span className="score-label">AI</span>
                    <strong className="score-value">{post.ag}</strong>
                  </div>
                  <div className="score-item">
                    <span className="score-label">PS</span>
                    <strong className="score-value">{post.ps}</strong>
                  </div>
                  <div className="score-item">
                    <span className="score-label">AC</span>
                    <strong className="score-value">{post.ac}</strong>
                  </div>
                </div>

                <div className="post-narrative">
                  {post.narrative}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

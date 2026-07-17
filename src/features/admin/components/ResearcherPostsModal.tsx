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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)]" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10" 
          onClick={onClose} 
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <header className="px-8 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{researcher.fullName}'s Posts</h2>
          <p className="text-sm text-slate-500">{researcher.email}</p>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="py-12 text-center text-slate-500 animate-pulse font-medium">Loading posts...</div>
          ) : error ? (
            <div className="py-12 text-center text-rose-700 bg-rose-50 rounded-xl border border-rose-200">{error}</div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              No posts found for this researcher.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => {
                const isPublished = post.status === 'PUBLISHED'
                const isRejected = post.status === 'REJECTED'
                const statusColor = isPublished ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : isRejected ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                
                return (
                  <div key={post.id} className="glass-card rounded-2xl p-6 transition-all hover:bg-slate-50">
                    <div className="flex justify-between items-start mb-5 gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
                          {post.district}
                          {post.upazilaName ? `, ${post.upazilaName}` : ''}
                        </h3>
                        <span className="text-sm text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} • {post.division}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border tracking-wider ${statusColor}`}>
                        {post.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-y-3 mb-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex flex-col items-center px-4 sm:px-6 border-r border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Risk Index</span>
                        <strong className="text-lg font-black text-emerald-600">{post.riskIndex}</strong>
                      </div>
                      <div className="flex flex-col items-center px-4 sm:px-6 border-r border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">CE</span>
                        <strong className="text-lg font-bold text-slate-900">{post.ce}</strong>
                      </div>
                      <div className="flex flex-col items-center px-4 sm:px-6 border-r border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">AI</span>
                        <strong className="text-lg font-bold text-slate-900">{post.ag}</strong>
                      </div>
                      <div className="flex flex-col items-center px-4 sm:px-6 border-r border-slate-200 sm:border-none">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">PS</span>
                        <strong className="text-lg font-bold text-slate-900">{post.ps}</strong>
                      </div>
                      <div className="flex flex-col items-center px-4 sm:px-6 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 w-full sm:w-auto sm:border-l">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">AC</span>
                        <strong className="text-lg font-bold text-slate-900">{post.ac}</strong>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 text-sm text-slate-600 leading-relaxed">
                      {post.narrative}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
      `}</style>
    </div>
  )
}

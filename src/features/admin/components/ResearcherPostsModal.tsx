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
    <div className="fixed inset-0 z-[9999] flex cursor-pointer items-end justify-center bg-black/60 p-0 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl cursor-default flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] sm:max-h-[85vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-5 top-5 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <header className="px-5 py-5 pr-16 border-b border-slate-200 bg-white/80 backdrop-blur-md shrink-0 sm:px-8 sm:py-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1 sm:text-2xl">{researcher.fullName}'s Posts</h2>
          <p className="break-all text-sm text-slate-500">{researcher.email}</p>
        </header>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar sm:p-8">
          {loading ? (
            <div className="py-8 text-center text-slate-500 animate-pulse font-medium sm:py-12">Loading posts...</div>
          ) : error ? (
            <div className="py-8 text-center text-rose-700 bg-rose-50 rounded-xl border border-rose-200 sm:py-12">{error}</div>
          ) : posts.length === 0 ? (
            <div className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-100 sm:py-12">
              No posts found for this researcher.
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-6">
              {posts.map((post) => {
                const isPublished = post.status === 'PUBLISHED'
                const isRejected = post.status === 'REJECTED'
                const statusColor = isPublished ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : isRejected ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                
                return (
                  <div key={post.id} className="glass-card rounded-2xl p-3 transition-all hover:bg-slate-50 sm:p-6">
                    <div className="flex flex-col justify-between items-start mb-5 gap-3 sm:flex-row sm:gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
                          {post.district}
                          {post.upazilaName ? `, ${post.upazilaName}` : ''}
                        </h3>
                        <span className="text-sm text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} - {post.division}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border tracking-wider ${statusColor}`}>
                        {post.status}
                      </span>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:mb-5 sm:flex sm:flex-wrap sm:gap-y-3 sm:p-4">
                      <div className="flex flex-col items-center px-2 sm:px-6 sm:border-r sm:border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Risk Index</span>
                        <strong className="text-lg font-black text-emerald-600">{post.riskIndex}</strong>
                      </div>
                      <div className="flex flex-col items-center px-2 sm:px-6 sm:border-r sm:border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">CE</span>
                        <strong className="text-lg font-bold text-slate-900">{post.ce}</strong>
                      </div>
                      <div className="flex flex-col items-center px-2 sm:px-6 sm:border-r sm:border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">AI</span>
                        <strong className="text-lg font-bold text-slate-900">{post.ag}</strong>
                      </div>
                      <div className="flex flex-col items-center px-2 sm:px-6 sm:border-r sm:border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">PS</span>
                        <strong className="text-lg font-bold text-slate-900">{post.ps}</strong>
                      </div>
                      <div className="flex flex-col items-center px-2 sm:w-auto sm:px-6">
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

function CommentList({ comments, loading }) {
  if (loading) {
    return <p className="text-gray-500 mt-4">Loading comments...</p>;
  }

  if (comments.length === 0) {
    return <p className="text-gray-500 mt-4">No comments yet. Be the first to share your thoughts!</p>;
  }

  return (
    <div className="mt-6 space-y-6">
      {comments.map((comment, index) => (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm"
        >
          <div className="flex items-start gap-3 mb-2">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-semibold text-sm">
              {comment.user?.charAt(0).toUpperCase() || 'A'}
            </div>

            {/* User info and comment */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
              <h4 className="text-gray-800 font-medium text-sm">
  {comment.user || 'Anonymous'} on <span className="text-cyan-600 italic">{comment.diseaseName || 'a disease'}</span> says:
</h4>

              <span className="text-xs text-gray-400">
                {new Date(comment.date).toLocaleString()}
              </span>
            </div>

              {/* Comment content */}
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentList;

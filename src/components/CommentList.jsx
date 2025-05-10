function CommentList({ comments, loading }) {
  if (loading) {
    return <p className="text-gray-500 mt-4">Loading comments...</p>;
  }

  if (comments.length === 0) {
    return <p className="text-gray-500 mt-4">No comments yet. Be the first to share your thoughts!</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment, index) => (
        <div
          key={index}
          className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col text-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white text-gray-700 flex items-center justify-center font-semibold">
              {comment.user?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-gray-800 font-medium">
              {comment.user || 'Anonymous'}
            </div>
          </div>
          <p className="text-gray-700">{comment.content}</p>
          <span className="text-gray-400 text-xs mt-2 self-end">
            {new Date(comment.date).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
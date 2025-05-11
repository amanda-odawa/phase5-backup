
import { useState } from 'react';

function CommentList({ comments, loading }) {
  const [localSearch, setLocalSearch] = useState('');

  // Handle search query change
  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  // Filter comments based on search query
  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(localSearch.toLowerCase()) ||
      (comment.diseaseName || '').toLowerCase().includes(localSearch.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return <p className="text-gray-500 mt-4">Loading comments...</p>;
  }

  if (filteredComments.length === 0) {
    return <p className="text-gray-500 mt-4">No comments found. Be the first to share your thoughts!</p>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 py-16 px-4 sm:px-8">
      <h1 className="text-3xl font-semibold text-center mb-2">Comments</h1>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Read comments and discussions about different diseases and related topics.
      </p>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search keywords eg: malaria, africa, infection..."
          value={localSearch}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded px-3 py-2 w-48"
        />
      </div>

      {/* Comment Cards */}
      <div className="mt-6 space-y-6">
        {filteredComments.map((comment, index) => (
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
                    {comment.user || 'Anonymous'} on{' '}
                    <span className="text-cyan-600 italic">{comment.diseaseName || 'a disease'}</span> says:
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
    </div>
  );
}

export default CommentList;

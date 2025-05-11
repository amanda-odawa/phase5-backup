import { useState } from 'react';

function CommentList({ comments, loading, onReply }) {
  const [localSearch, setLocalSearch] = useState('');
  const [expandedComments, setExpandedComments] = useState({});

  const handleSearchChange = (e) => setLocalSearch(e.target.value);

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(localSearch.toLowerCase()) ||
      (comment.diseaseName || '').toLowerCase().includes(localSearch.toLowerCase());
    return matchesSearch;
  });

  const formatMentions = (content) =>
    content.split(/(@\w+):?/g).map((part, i) =>
      part.startsWith('@') ? (
        <span key={i} className="text-cyan-700 font-semibold">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );

  const groupComments = () => {
    const idMap = {};
    const grouped = [];

    filteredComments.forEach((c) => {
      idMap[c.id] = { ...c, replies: [] };
    });

    filteredComments.forEach((c) => {
      const match = c.content.match(/^@(\w+):/);
      if (match) {
        const parent = filteredComments.find(
          (target) =>
            target.user === match[1] &&
            !/^@/.test(target.content) &&
            target.id !== c.id
        );
        if (parent && idMap[parent.id]) {
          idMap[parent.id].replies.push(idMap[c.id]);
        } else {
          grouped.push(idMap[c.id]); // orphan reply
        }
      } else {
        grouped.push(idMap[c.id]); // top-level
      }
    });

    return grouped;
  };

  const renderReplies = (replies, level = 1) =>
    replies.map((reply) => (
      <div
        key={reply.id}
        className="pl-4 border-l-4 border-cyan-400 ml-4 my-2"
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-start gap-3 mb-1">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-semibold text-sm">
            {reply.user?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <div className="text-sm text-gray-800 mb-1">
              <strong>{reply.user || 'Anonymous'}</strong> on{' '}
              <span className="text-cyan-600 italic">
                {reply.diseaseName || 'a disease'}
              </span>{' '}
              says:
            </div>
            <div className="text-gray-700 whitespace-pre-wrap">{formatMentions(reply.content)}</div>
            <button
              onClick={() => onReply(reply.user)}
              className="text-xs text-cyan-600 mt-1 hover:underline"
            >
              Reply
            </button>
          </div>
        </div>
        {reply.replies.length > 0 && renderReplies(reply.replies, level + 1)}
      </div>
    ));

  const topLevelComments = groupComments();

  if (loading) {
    return <p className="text-gray-500 mt-4">Loading comments...</p>;
  }

  if (topLevelComments.length === 0) {
    return (
      <p className="text-gray-500 mt-4">
        No comments found. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 py-16 px-4 sm:px-8">
      <h1 className="text-3xl font-semibold text-center mb-2">Discussion Thread</h1>
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
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
        />
      </div>

      {/* Comments */}
      <div className="space-y-6">
        {topLevelComments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-xl shadow">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-semibold text-sm">
                {comment.user?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-800 mb-1">
                  <strong>{comment.user || 'Anonymous'}</strong> on{' '}
                  <span className="text-cyan-600 italic">
                    {comment.diseaseName || 'a disease'}
                  </span>{' '}
                  says:
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">
                  {formatMentions(comment.content)}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {new Date(comment.date).toLocaleString()}
                  </span>
                  <button
                    onClick={() => onReply(comment.user)}
                    className="text-xs text-cyan-600 hover:underline"
                  >
                    Reply
                  </button>
                </div>

                {comment.replies.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="text-xs text-cyan-600 hover:underline mb-2"
                    >
                      {expandedComments[comment.id] ? 'Hide Replies' : 'Show Replies'} (
                      {comment.replies.length})
                    </button>
                    {expandedComments[comment.id] && renderReplies(comment.replies)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentList;

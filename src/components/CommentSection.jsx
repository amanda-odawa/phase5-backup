// src/components/CommentSection.jsx
import { useEffect, useState } from "react";
import api from "../utils/api";
import ReviewForm from "./ReviewForm";
import CommentList from "./CommentList";

function CommentSection({ areaId, diseaseId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/reviews?diseaseId=${diseaseId}`);
      setComments(res.data.reverse());
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchComments();
  }, [diseaseId]);

  const handleAddComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <div className="space-y-6">
      <ReviewForm
        areaId={areaId}
        diseaseId={diseaseId}
        onCommentSubmit={handleAddComment}
      />
      <CommentList comments={comments} loading={loading} />
    </div>
  );
}

export default CommentSection;
import { useEffect, useState } from "react";
import api from "../utils/api";
import CommentList from "./CommentList";

function CommentSection({ diseaseId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/reviews?diseaseId=${diseaseId}`);
      setComments(res.data.reverse()); // Reverse to show latest comments first
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [diseaseId]);

  return (
    <div className="space-y-6">
      <CommentList comments={comments} loading={loading} />
    </div>
  );
}

export default CommentSection;

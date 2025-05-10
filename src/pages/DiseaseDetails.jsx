import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchDiseases } from "../store/diseaseSlice";
import { fetchAreas } from "../store/areaSlice";
import api from '../utils/api'; // Ensure this is the API for fetching comments
import { toast } from 'react-toastify';
import CommentList from '../components/CommentList'; // Assuming this component is used for displaying comments

function DiseaseDetails() {
  const { id } = useParams(); // diseaseId from URL params
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { diseases, status: diseaseStatus, error } = useSelector((state) => state.diseases);
  const { areas, status: areaStatus } = useSelector((state) => state.areas);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [disease, setDisease] = useState(null);
  const [affectedAreas, setAffectedAreas] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    if (diseaseStatus === "idle") dispatch(fetchDiseases());
    if (areaStatus === "idle") dispatch(fetchAreas());
  }, [dispatch, diseaseStatus, areaStatus]);

  useEffect(() => {
    const foundDisease = diseases.find((d) => String(d.id) === id); // Make sure diseaseId matches
    if (foundDisease) {
      setDisease(foundDisease);
    } else if (diseaseStatus === "succeeded" && !foundDisease) {
      navigate("/diseases"); // Redirect if no disease found
    }
  }, [diseases, id, navigate, diseaseStatus]);

  useEffect(() => {
    if (areas.length && disease) {
      const affected = [];
      let total = 0;

      areas.forEach((area) => {
        const cases = area.diseaseCases?.[id];
        if (cases && cases > 0) {
          affected.push(area);
          total += cases;
        }
      });

      setAffectedAreas(affected);
      setTotalCases(total);
    }
  }, [areas, disease, id]);

  useEffect(() => {
    // Fetch comments for this specific disease
    const fetchComments = async () => {
      try {
        const res = await api.get(`/reviews?disease_id=${id}`);
        const rawComments = res.data.reverse() || [];

        // Get unique user IDs for enrichment
        const userIds = [...new Set(rawComments.map((c) => c.user_id))];

        // Fetch usernames for each unique user_id
        const userMap = {};
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userRes = await api.get(`/users/${userId}`);
              userMap[userId] = userRes.data?.username || `User #${userId}`;
            } catch (err) {
              userMap[userId] = 'Anonymous';
            }
          })
        );

        // Enrich comments with usernames and consistent date field
        const enrichedComments = rawComments.map((c) => ({
          ...c,
          user: userMap[c.user_id],
          date: c.updated_at,
        }));

        setComments(enrichedComments); // Store the enriched comments
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        toast.error('Failed to load comments');
      } finally {
        setCommentsLoading(false);
      }
    };

    if (id) {
      fetchComments(); // Fetch comments for the current disease only
    }
  }, [id]);

  const primaryAreaId = affectedAreas.length > 0 ? affectedAreas[0].id : null; // Get areaId

  if (diseaseStatus === "loading" || areaStatus === "loading") {
    return <div className="text-center mt-12 text-gray-600">Loading...</div>;
  }

  if (diseaseStatus === "failed") {
    return <div className="text-center mt-12 text-red-500">Error: {error}</div>;
  }

  if (!disease) {
    return (
      <div className="text-center mt-12 text-gray-600">Loading...</div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${disease.image})` }}
      >
        <div className="absolute inset-0 bg-pink-200 bg-opacity-50"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold text-black">{disease.name}</h1>
          <div className="flex space-x-3 mt-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {disease.category}
            </span>
            <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
              {disease.prevalence}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-2">About</h2>
            <p className="text-gray-700">{disease.about}</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Symptoms
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {disease.symptoms?.split(",").map((symptom, idx) => (
                <li key={idx}>{symptom.trim()}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Prevention
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {disease.prevention?.split(",").map((method, idx) => (
                <li key={idx}>{method.trim()}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Treatment
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {disease.treatment?.split(",").map((treatment, idx) => (
                <li key={idx}>{treatment.trim()}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Risk Factors
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              {disease.risk_factors?.split(",").map((factor, idx) => (
                <li key={idx}>{factor.trim()}</li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="text-lg font-bold text-gray-800 mb-2">
              Affected Regions
            </h4>
            <ul className="space-y-2">
              {affectedAreas.map((area, idx) => {
                const cases = area.diseaseCases?.[id] ?? 0;
                return (
                  <li
                    key={idx}
                    className="flex justify-between items-center text-gray-700"
                  >
                    <span className="flex items-center gap-1">
                      📍 {area.name}
                    </span>
                    <span className="text-sm">
                      {cases ? `${cases.toLocaleString()} cases` : 'No data'}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Total reported cases: <strong>{totalCases}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 mt-10 pt-8 pb-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {commentsLoading ? (
            <p className="text-gray-600">Loading comments...</p>
          ) : (
            <CommentList comments={comments} />
          )}
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetails;

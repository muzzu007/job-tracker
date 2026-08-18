import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../stylesheet/Dashboard.css";
import { toast } from "react-toastify";
import DeleteModal from "../components/DeleteModal";
import "../stylesheet/DeleteModal.css";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";




const initialState = {
  company: "",
  position: "",
  status: "",
  applyDate: "",
  notes: ""
};



function Dashboard() {
    //Inittailization
    const [sortBy, setSortBy] = useState("Newest");
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteJobId, setDeleteJobId] = useState(null);
    const [deleteCompany, setDeleteCompany] = useState("");
    const username = localStorage.getItem("name");
    const [editingId, setEditingId] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const navigate = useNavigate();

   useEffect(() => {
    getJobs();
    }, []);


    //Fetch Jobs
    async function getJobs() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setJobs(data);

        } catch (error) {
            console.error(error);
        }
    }

    //Handle Submission
    async function handleSubmit() {
        try {
            if (!formData.company || !formData.position) {
            toast.error('Please fill all required fields');
                return;
            }
            if (editingId) {
                setLoading(true);
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/jobs/${editingId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(formData)
                    }
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }


                toast.success(data.message);
            } else {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }

                toast.success(data.message);

            }
            setEditingId(null);
            setFormData(initialState);
            await getJobs();
        } catch (error) {
            toast.error("Unable to reach server");
        }finally{
        setLoading(false);
    }

    }
    
    //Handle Input Change
    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })

    }

    //Edit the Job
    function editJob(job) {

        setFormData({
            company: job.company,
            position: job.position,
            status: job.status,
            applyDate: job.applyDate
                ? job.applyDate.substring(0, 10)
                : "",
            notes: job.notes
        });

        setEditingId(job._id);
    }
    
    //Delete the Jobs
    async function deleteJob(id) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/jobs/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }

                });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            toast.success(data.message);
            await getJobs();

        } catch (error) {
            toast.error("Unable to delete");

        }
    }

    const filteredJobs = jobs
    .filter((job) => {

        const matchesSearch =
            job.company.toLowerCase().includes(search.toLowerCase()) ||

            job.position.toLowerCase().includes(search.toLowerCase()) ||

            (job.notes || "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            job.status === statusFilter;

        return matchesSearch && matchesStatus;

    })

    .sort((a, b) => {

        switch (sortBy) {

            case "Newest":
                return new Date(b.applyDate) - new Date(a.applyDate);

            case "Oldest":
                return new Date(a.applyDate) - new Date(b.applyDate);

            case "AZ":
                return a.company.localeCompare(b.company);

            case "ZA":
                return b.company.localeCompare(a.company);

            default:
                return 0;

        }

    });
    //Handle Logout
    function handleLogout() {
        localStorage.removeItem("token");

        setJobs([]);
        setEditingId(null);
        setFormData(initialState);

        navigate("/login", { replace: true });
        return;
    }

    return (
  <div className="dashboard-page">

    {/* ================= HEADER ================= */}

    <header className="dashboard-header">

      <div className="brand">

        <div className="brand-icon">📋</div>

        <div>
          <h1>Job Tracker</h1>
          <p>Track every application in one place</p>
        </div>

      </div>

      <div className="header-right">

        <div className="welcome-box">
          <h3>Welcome, {username} 👋</h3>
          <span>Manage your job applications</span>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
         <FaSignOutAlt /> Logout
        </button>

      </div>

    </header>

    {/* ================= STATS ================= */}

    <section className="stats-grid">

      <div className="stat-card">
        <span>Total</span>
        <h2>{jobs.length}</h2>
      </div>

      <div className="stat-card">
        <span>Applied</span>
        <h2>
          {jobs.filter(job => job.status === "Applied").length}
        </h2>
      </div>

      <div className="stat-card">
        <span>Interview</span>
        <h2>
          {jobs.filter(job => job.status === "Interview").length}
        </h2>
      </div>

      <div className="stat-card">
        <span>Offer</span>
        <h2>
          {jobs.filter(job => job.status === "Offer").length}
        </h2>
      </div>

      <div className="stat-card">
        <span>Rejected</span>
        <h2>
          {jobs.filter(job => job.status === "Rejected").length}
        </h2>
      </div>

    </section>

    {/* ================= FORM ================= */}

    <section className="form-card">

      <div className="card-title">

        <h2>
          {editingId ? "Update Application" : "Add New Application"}
        </h2>

        <p>
          Save your applications and keep track of your progress.
        </p>

      </div>

      <div className="form-grid">

        <div className="form-group">

          <label>Company</label>

          <input
            type="text"
            name="company"
            placeholder="Google"
            value={formData.company}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Position</label>

          <input
            type="text"
            name="position"
            placeholder="Frontend Developer"
            value={formData.position}
            onChange={handleChange}
          />

        </div>

        <div className="form-group">

          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>

        </div>

        <div className="form-group">

          <label>Application Date</label>

          <input
            type="date"
            name="applyDate"
            value={formData.applyDate}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="form-group">

        <label>Notes</label>

        <textarea
          name="notes"
          placeholder="Example: Applied through LinkedIn..."
          value={formData.notes}
          onChange={handleChange}
        />

      </div>

      <div className="form-actions">

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                    >
                    
                    {loading
                          ? "Saving..."
                          : editingId
                              ? "Update Job"
                              : (
                                  <>
                                      <FaPlus />
                                      {" "}Add Job
                                  </>
                              )
                      }

                </button>

      </div>

    </section>
          {/* ================= FILTER ================= */}

    <section className="filter-card">

      <div className="filter-header">

        <h2>Applications</h2>

        <p>
          Search and filter your job applications
        </p>

      </div>

      <div className="filters">

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          />

        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
          <option value="AZ">Company A-Z</option>
          <option value="ZA">Company Z-A</option>
      </select>
      </div>

    </section>

    {/* ================= JOBS ================= */}

    <section className="jobs-section">

      {
        filteredJobs.length === 0 ? (

        <div className="empty-state">

        <div className="empty-icon">
            📂
        </div>

        <h2>No Applications Found</h2>

        <p>
            Start by adding your first job application.
        </p>

    </div>

) : (

    filteredJobs.map((job) => (

              <article
                className="job-card"
                key={job._id}
              >

                <div className="job-header">

                  <div>

                    <h3>{job.company}</h3>

                    <h4>{job.position}</h4>

                  </div>

                  <span
                    className={`status ${job.status.toLowerCase()}`}
                  >

                    {job.status}

                  </span>

                </div>

                <div className="job-body">

                  <div className="job-info">

                    <span>📅</span>

                    <div>

                      <strong>Applied On</strong>

                      <p>

                        {

                          job.applyDate

                            ?

                            new Date(job.applyDate)
                              .toLocaleDateString()

                            :

                            "No Date"

                        }

                      </p>

                    </div>

                  </div>

                  <div className="job-info">

                    <span>📝</span>

                    <div>

                      <strong>Notes</strong>

                      <p>

                        {

                          job.notes ||

                          "No notes added."

                        }

                      </p>

                    </div>

                  </div>

                </div>

                <div className="job-actions">

                  <button

                    className="edit-btn"

                    onClick={() => editJob(job)}

                  >

                   <FaEdit />Edit

                  </button>

                  <button

                    className="delete-btn"

                    onClick={() => {

                        setDeleteJobId(job._id);
                        setDeleteCompany(job.company);
                        setShowDeleteModal(true);

                    }}

                  >

                    <FaTrash />Delete

                  </button>

                </div>

              </article>

            )))

      }

    </section>
    <DeleteModal

    isOpen={showDeleteModal}
    company={deleteCompany}
    onClose={() => setShowDeleteModal(false)}
    onConfirm={async () => {
        await deleteJob(deleteJobId);
        setShowDeleteModal(false);

    }}

    />

  </div>

);
}

export default Dashboard;

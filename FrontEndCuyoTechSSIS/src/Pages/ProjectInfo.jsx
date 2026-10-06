import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CinematicReveal from "../Components/CinematicReveal.jsx";
import ThemeToggle from "../Components/ThemeToggle.jsx";
import { apiRequest } from "../services/api.js";
import { getAuthUser } from "../services/auth.js";

const faqs = [
    {
        category: "Accounts",
        question: "Can students create their own CuyoTech account?",
        answer: "No. Student accounts are created by authorized university staff after enrollment records are established. On first login, the student verifies the official profile information before entering the Student Portal.",
    },
    {
        category: "Enrollment",
        question: "How does student enrollment work?",
        answer: "The Registrar records the student's course, academic year, semester, year level, and subjects. The Student Portal then displays the official enrollment information.",
    },
    {
        category: "Academic Records",
        question: "Why can a student not see a grade yet?",
        answer: "Grades become visible only after the Registrar marks them as released. This keeps unreleased or incomplete grade records out of the Student Portal.",
    },
    {
        category: "Documents",
        question: "How does a TOR, COR, or certification request move through the system?",
        answer: "The student submits a request, the Registrar reviews it, the Cashier verifies any required payment, the Registrar processes the document, marks it ready, and finally releases it. The student can track each status.",
    },
    {
        category: "Payments",
        question: "How are document-request payments handled?",
        answer: "After Registrar approval, a payment record is created when a fee is required. The Cashier verifies the payment and the system automatically creates a receipt and moves the request into processing.",
    },
    {
        category: "Clearance",
        question: "Who updates student clearance?",
        answer: "Authorized Department staff manage clearance records and may mark them Pending, Cleared, or Hold with remarks. Students receive a notification when their clearance status changes.",
    },
    {
        category: "Security",
        question: "Can an administrator see a user's existing password?",
        answer: "No. Passwords are stored securely as hashes. An administrator may reset a password and provide a new temporary password, but cannot recover the previous password.",
    },
    {
        category: "Project",
        question: "Who created CuyoTech SSIS?",
        answer: "CuyoTech SSIS was developed by the SixGrams team. The role designation matrix and each member's project responsibilities are shown below.",
    },
];

const databaseGroups = [
    {
        title: "Accounts & Students",
        tables: "users → students",
        description: "Authentication, roles, account status, and the student's official profile.",
    },
    {
        title: "Enrollment & Grades",
        tables: "departments → courses → subjects → enrollments → subject_enrollments",
        description: "Academic structure, enrolled subjects, grade encoding, and grade release.",
    },
    {
        title: "Document Services",
        tables: "document_types → document_requests → payments → receipts",
        description: "TOR/COR/certification requests, fee verification, and receipts.",
    },
    {
        title: "Clearance",
        tables: "students → clearances → departments",
        description: "Department clearance status and processing remarks.",
    },
    {
        title: "System Activity",
        tables: "audit_logs · portal_notifications · announcements · important_dates",
        description: "Security/activity tracking, notifications, university notices, and important schedules.",
    },
];

function ProjectInfo() {
    const [team, setTeam] = useState([]);
    const [groupName, setGroupName] = useState("SixGrams");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [openIndex, setOpenIndex] = useState(0);
    const [message, setMessage] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [editForm, setEditForm] = useState({
        display_order: 1,
        name: "",
        scrum_role: "",
        deliverables: "",
        support_roles: "",
    });
    const [savingMember, setSavingMember] = useState(false);
    const user = getAuthUser();
    const isAdmin = user?.role === "admin";

    async function loadTeam() {
        try {
            const data = await apiRequest("/project-info");
            setTeam(data.members || []);
            setGroupName(data.group_name || "SixGrams");
        } catch (error) {
            setMessage(error.message);
        }
    }

    useEffect(() => {
        let active = true;

        apiRequest("/project-info")
            .then((data) => {
                if (active) {
                    setTeam(data.members || []);
                    setGroupName(data.group_name || "SixGrams");
                }
            })
            .catch((error) => {
                if (active) {
                    setMessage(error.message);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(faqs.map((item) => item.category)))],
        []
    );

    const filteredFaqs = useMemo(() => {
        const keyword = query.trim().toLowerCase();

        return faqs.filter((item) => {
            const matchesCategory = category === "All" || item.category === category;
            const searchable = `${item.category} ${item.question} ${item.answer}`.toLowerCase();
            return matchesCategory && (!keyword || searchable.includes(keyword));
        });
    }, [query, category]);

    async function uploadPhoto(member, file) {
        if (!file) {
            return;
        }

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setMessage("Use a JPG, PNG, or WEBP image.");
            return;
        }

        if (file.size > 1_500_000) {
            setMessage("Image must be 1.5 MB or smaller.");
            return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
            try {
                const response = await apiRequest(`/admin/project-team/${member.id}/photo`, {
                    method: "POST",
                    body: JSON.stringify({
                        image_data_url: reader.result,
                    }),
                });

                setMessage(response.message);
                setRefreshKey((current) => current + 1);
                await loadTeam();
            } catch (error) {
                setMessage(error.message);
            }
        };

        reader.readAsDataURL(file);
    }

    async function removePhoto(member) {
        if (!window.confirm(`Remove ${member.name}'s project photo?`)) {
            return;
        }

        try {
            const response = await apiRequest(`/admin/project-team/${member.id}/photo`, {
                method: "DELETE",
            });

            setMessage(response.message);
            setRefreshKey((current) => current + 1);
            await loadTeam();
        } catch (error) {
            setMessage(error.message);
        }
    }

    function startEditingMember(member) {
        setEditingMemberId(member.id);
        setEditForm({
            display_order: member.display_order || 1,
            name: member.name || "",
            scrum_role: member.scrum_role || "",
            deliverables: member.deliverables || "",
            support_roles: member.support_roles || "",
        });
        setMessage("");
    }

    function cancelEditingMember() {
        setEditingMemberId(null);
        setSavingMember(false);
    }

    async function saveMemberText(member) {
        setSavingMember(true);
        setMessage("");

        try {
            const response = await apiRequest(`/admin/project-team/${member.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    display_order: Number(editForm.display_order),
                    name: editForm.name.trim(),
                    scrum_role: editForm.scrum_role.trim() || null,
                    deliverables: editForm.deliverables.trim() || null,
                    support_roles: editForm.support_roles.trim() || null,
                }),
            });

            setMessage(response.message);
            setEditingMemberId(null);
            await loadTeam();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setSavingMember(false);
        }
    }

    return (
        <div className="project-info-page">
            <header className="project-info-header">
                <Link className="project-brand" to="/">
                    <span>CT</span>
                    <div>
                        <strong>CuyoTech College of Science and Technology</strong>
                        <small>Student Services Information System</small>
                    </div>
                </Link>

                <div className="project-header-actions">
                    {user && <Link to={`/${user.role}/dashboard`}>Return to portal</Link>}
                    {!user && <Link to="/">Sign in</Link>}
                    <ThemeToggle />
                </div>
            </header>

            <main>
                <section className="project-cinematic-hero">
                    <CinematicReveal>
                        <p className="project-kicker">NEED TO KNOW</p>
                        <h1>
                            Simple answers.
                            <br />
                            Clear university services.
                        </h1>
                        <p className="project-hero-copy">
                            Learn how CuyoTech SSIS works, see the SixGrams project team,
                            and review the system's database structure at a glance.
                        </p>
                    </CinematicReveal>
                </section>

                <section className="project-section faq-section">
                    <CinematicReveal>
                        <div className="project-section-heading">
                            <div>
                                <p className="project-kicker">FAQ</p>
                                <h2>Frequently asked questions</h2>
                            </div>
                            <p>Search by task or choose a category.</p>
                        </div>

                        <div className="faq-search-row">
                            <div className="faq-search">
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        setOpenIndex(-1);
                                    }}
                                    placeholder="Search accounts, enrollment, grades, requests..."
                                    aria-label="Search frequently asked questions"
                                />
                                {query && (
                                    <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                                        ×
                                    </button>
                                )}
                            </div>

                            <div className="faq-categories" aria-label="FAQ categories">
                                {categories.map((item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        className={category === item ? "active" : ""}
                                        onClick={() => {
                                            setCategory(item);
                                            setOpenIndex(-1);
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="faq-result-summary">
                            <strong>{filteredFaqs.length}</strong>
                            <span>
                                {query ? ` matching “${query}”` : category === "All" ? " questions about CuyoTech SSIS" : ` ${category.toLowerCase()} question(s)`}
                            </span>
                        </div>
                    </CinematicReveal>

                    <div className="faq-accordion">
                        {filteredFaqs.length === 0 ? (
                            <div className="faq-empty">
                                <h3>No matching questions</h3>
                                <p>Try a shorter search or show all questions.</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setQuery("");
                                        setCategory("All");
                                    }}
                                >
                                    Show all questions
                                </button>
                            </div>
                        ) : filteredFaqs.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <CinematicReveal key={`${item.category}-${item.question}`} delay={Math.min(index * 70, 350)}>
                                    <article className={isOpen ? "faq-item open" : "faq-item"}>
                                        <button
                                            type="button"
                                            className="faq-summary"
                                            onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                            aria-expanded={isOpen}
                                        >
                                            <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                                            <span className="faq-main">
                                                <small>{item.category}</small>
                                                <strong>{item.question}</strong>
                                            </span>
                                            <span className="faq-toggle">{isOpen ? "−" : "+"}</span>
                                        </button>

                                        <div className="faq-answer-wrap">
                                            <div className="faq-answer">
                                                <p>{item.answer}</p>
                                            </div>
                                        </div>
                                    </article>
                                </CinematicReveal>
                            );
                        })}
                    </div>
                </section>

                <section className="project-section team-section">
                    <CinematicReveal>
                        <div className="project-section-heading">
                            <div>
                                <p className="project-kicker">CREATED BY {groupName.toUpperCase()}</p>
                                <h2>Group Role Designation Matrix</h2>
                            </div>
                            <p>
                                Primary ownership remains clear while secondary contributors
                                support the assigned role owners.
                            </p>
                        </div>
                    </CinematicReveal>

                    {message && <p className="project-message">{message}</p>}

                    <div className="team-grid">
                        {team.map((member, index) => (
                            <CinematicReveal key={member.id} delay={Math.min(index * 90, 450)}>
                                <article className="team-card">
                                    <div className="team-photo">
                                        {member.has_photo ? (
                                            <img
                                                key={`${member.id}-${refreshKey}`}
                                                src={`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/project-team/${member.id}/photo?v=${refreshKey}`}
                                                alt={`${member.name} project team member`}
                                            />
                                        ) : (
                                            <span aria-hidden="true">{member.name.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>

                                    {isAdmin && editingMemberId === member.id ? (
                                        <div className="team-edit-form">
                                            <label>
                                                Role order
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="99"
                                                    value={editForm.display_order}
                                                    onChange={(event) =>
                                                        setEditForm((current) => ({
                                                            ...current,
                                                            display_order: event.target.value,
                                                        }))
                                                    }
                                                />
                                            </label>

                                            <label>
                                                Name
                                                <input
                                                    type="text"
                                                    maxLength="150"
                                                    value={editForm.name}
                                                    onChange={(event) =>
                                                        setEditForm((current) => ({
                                                            ...current,
                                                            name: event.target.value,
                                                        }))
                                                    }
                                                />
                                            </label>

                                            <label>
                                                Scrum / project role
                                                <input
                                                    type="text"
                                                    maxLength="100"
                                                    value={editForm.scrum_role}
                                                    onChange={(event) =>
                                                        setEditForm((current) => ({
                                                            ...current,
                                                            scrum_role: event.target.value,
                                                        }))
                                                    }
                                                />
                                            </label>

                                            <label>
                                                Deliverables
                                                <textarea
                                                    rows="5"
                                                    value={editForm.deliverables}
                                                    onChange={(event) =>
                                                        setEditForm((current) => ({
                                                            ...current,
                                                            deliverables: event.target.value,
                                                        }))
                                                    }
                                                />
                                            </label>

                                            <label>
                                                Secondary support
                                                <textarea
                                                    rows="3"
                                                    value={editForm.support_roles}
                                                    onChange={(event) =>
                                                        setEditForm((current) => ({
                                                            ...current,
                                                            support_roles: event.target.value,
                                                        }))
                                                    }
                                                />
                                            </label>

                                            <div className="team-edit-actions">
                                                <button
                                                    type="button"
                                                    className="team-save-button"
                                                    onClick={() => saveMemberText(member)}
                                                    disabled={savingMember || !editForm.name.trim()}
                                                >
                                                    {savingMember ? "Saving..." : "Save changes"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelEditingMember}
                                                    disabled={savingMember}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="team-role-number">
                                                Role {member.display_order}
                                            </div>

                                            <h3>{member.name}</h3>
                                            <strong className="team-role">{member.scrum_role}</strong>
                                            <p>{member.deliverables}</p>

                                            {member.support_roles && (
                                                <div className="support-role-box">
                                                    <span>Secondary support</span>
                                                    <strong>{member.support_roles}</strong>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {isAdmin && (
                                        <div className="team-photo-tools">
                                            <button
                                                type="button"
                                                onClick={() => startEditingMember(member)}
                                                disabled={editingMemberId === member.id}
                                            >
                                                Edit details
                                            </button>
                                            <label>
                                                {member.has_photo ? "Replace photo" : "Upload photo"}
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={(event) => {
                                                        uploadPhoto(member, event.target.files?.[0]);
                                                        event.target.value = "";
                                                    }}
                                                />
                                            </label>

                                            {member.has_photo && (
                                                <button type="button" onClick={() => removePhoto(member)}>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </article>
                            </CinematicReveal>
                        ))}
                    </div>

                    {isAdmin && (
                        <p className="admin-photo-note">
                            Admin tools: edit member text, role order, and project photos.
                            JPG, PNG, or WEBP photos must be 1.5 MB or smaller. Changes are stored
                            in the project database and persist across deployments.
                        </p>
                    )}
                </section>

                <section className="project-section database-section">
                    <CinematicReveal>
                        <div className="project-section-heading">
                            <div>
                                <p className="project-kicker">DATABASE IN SHORT</p>
                                <h2>How the SSIS data is organized</h2>
                            </div>
                            <p>
                                A high-level view only. Credentials, passwords, and connection
                                secrets are intentionally not displayed.
                            </p>
                        </div>
                    </CinematicReveal>

                    <div className="database-flow-grid">
                        {databaseGroups.map((group, index) => (
                            <CinematicReveal key={group.title} delay={Math.min(index * 80, 360)}>
                                <article className="database-card">
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                    <h3>{group.title}</h3>
                                    <code>{group.tables}</code>
                                    <p>{group.description}</p>
                                </article>
                            </CinematicReveal>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="project-info-footer">
                <strong>CuyoTech SSIS</strong>
                <span>Developed by SixGrams for academic project purposes.</span>
            </footer>
        </div>
    );
}

export default ProjectInfo;

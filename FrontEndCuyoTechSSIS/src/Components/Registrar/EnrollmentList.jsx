import { useMemo, useState } from "react";
import { useApiData } from "../../hooks/useApiData.js";
import { apiRequest } from "../../services/api.js";

function EnrollmentList() {
    const { data, loading, error, reload } = useApiData("/registrar/students", {
        students: [],
        courses: [],
        subjects: [],
    });
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [message, setMessage] = useState("");

    const students = data?.students || [];
    const courses = data?.courses || [];
    const subjects = data?.subjects || [];

    const filteredStudents = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return students.filter((student) => {
            const value = `${student.student_number} ${student.first_name} ${student.last_name} ${student.user?.email}`.toLowerCase();
            return !keyword || value.includes(keyword);
        });
    }, [students, search]);

    function openEnrollment(student) {
        const current = student.enrollments?.[0];

        setSelected({
            student,
            course_id: String(current?.course_id || courses[0]?.id || ""),
            academic_year: current?.academic_year || "2026-2027",
            semester: current?.semester || "First Semester",
            year_level: String(current?.year_level || 1),
            subject_ids: current?.subject_enrollments?.map((item) => item.subject_id) || [],
        });
        setMessage("");
    }

    function toggleSubject(subjectId) {
        setSelected((current) => ({
            ...current,
            subject_ids: current.subject_ids.includes(subjectId)
                ? current.subject_ids.filter((id) => id !== subjectId)
                : [...current.subject_ids, subjectId],
        }));
    }

    async function saveEnrollment(event) {
        event.preventDefault();
        setMessage("");

        try {
            const response = await apiRequest(`/registrar/students/${selected.student.id}/enrollment`, {
                method: "POST",
                body: JSON.stringify({
                    course_id: Number(selected.course_id),
                    academic_year: selected.academic_year,
                    semester: selected.semester,
                    year_level: Number(selected.year_level),
                    subject_ids: selected.subject_ids,
                }),
            });

            setMessage(response.message);
            await reload();
            setSelected(null);
        } catch (requestError) {
            setMessage(requestError.message);
        }
    }

    return (
        <div className="workflow-stack">
            <section className="record-panel">
                <div className="record-panel-heading">
                    <div>
                        <h2>Student enrollment</h2>
                        <p>Select a student account, then record the approved academic enrollment.</p>
                    </div>
                </div>

                <div className="record-toolbar one-column">
                    <label className="search-control">
                        <span>Search students</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Student number, name, or email"
                        />
                    </label>
                </div>

                {loading && <p>Loading students...</p>}
                {error && <p className="workflow-message error">{error}</p>}

                {!loading && !error && (
                    <div className="table-scroll">
                        <table>
                            <thead><tr><th>Student</th><th>Current enrollment</th><th>Action</th></tr></thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr><td colSpan="3" className="empty-cell">No matching students.</td></tr>
                                ) : filteredStudents.map((student) => {
                                    const current = student.enrollments?.[0];

                                    return (
                                        <tr key={student.id}>
                                            <td>
                                                <strong>{student.last_name}, {student.first_name}</strong>
                                                <small className="table-subtext">{student.student_number} · {student.user?.email}</small>
                                            </td>
                                            <td>
                                                {current
                                                    ? `${current.course?.code} · Year ${current.year_level} · ${current.semester}`
                                                    : "No enrollment yet"}
                                            </td>
                                            <td>
                                                <button type="button" className="table-action" onClick={() => openEnrollment(student)}>
                                                    {current ? "Edit enrollment" : "Enroll student"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {selected && (
                <section className="detail-card enrollment-editor">
                    <div className="record-panel-heading">
                        <div>
                            <p className="section-kicker">Enrollment record</p>
                            <h2>{selected.student.first_name} {selected.student.last_name}</h2>
                            <p>{selected.student.student_number}</p>
                        </div>
                        <button type="button" onClick={() => setSelected(null)}>Close</button>
                    </div>

                    <form className="workflow-form" onSubmit={saveEnrollment}>
                        <label>
                            Course
                            <select value={selected.course_id} onChange={(event) => setSelected({ ...selected, course_id: event.target.value })} required>
                                <option value="">Select course</option>
                                {courses.map((course) => <option key={course.id} value={course.id}>{course.code} — {course.name}</option>)}
                            </select>
                        </label>

                        <label>
                            Academic year
                            <input value={selected.academic_year} onChange={(event) => setSelected({ ...selected, academic_year: event.target.value })} required />
                        </label>

                        <label>
                            Semester
                            <select value={selected.semester} onChange={(event) => setSelected({ ...selected, semester: event.target.value })}>
                                <option>First Semester</option>
                                <option>Second Semester</option>
                                <option>Summer</option>
                            </select>
                        </label>

                        <label>
                            Year level
                            <select value={selected.year_level} onChange={(event) => setSelected({ ...selected, year_level: event.target.value })}>
                                {[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={level}>Year {level}</option>)}
                            </select>
                        </label>

                        <fieldset className="subject-picker">
                            <legend>Subjects</legend>
                            {subjects
                                .filter((subject) => String(subject.course_id) === String(selected.course_id))
                                .map((subject) => (
                                    <label key={subject.id}>
                                        <input
                                            type="checkbox"
                                            checked={selected.subject_ids.includes(subject.id)}
                                            onChange={() => toggleSubject(subject.id)}
                                        />
                                        <span><strong>{subject.code}</strong> {subject.name}</span>
                                    </label>
                                ))}
                        </fieldset>

                        <button type="submit" className="submit-button">Save enrollment</button>
                    </form>
                </section>
            )}

            {message && <p className="workflow-message">{message}</p>}
        </div>
    );
}

export default EnrollmentList;

import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../services/api.js";

const createDefaults = {
    email: "",
    password: "",
    role: "student",
    status: "active",
    student_number: "",
    first_name: "",
    last_name: "",
};

const staffRoles = ["registrar", "cashier", "department"];

const roleLabels = {
    student: "Student",
    registrar: "Registrar",
    cashier: "Cashier",
    department: "Department",
    admin: "Admin",
};

function UserAccountList() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(createDefaults);
    const [message, setMessage] = useState("");
    const [temporaryCredentials, setTemporaryCredentials] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    async function loadUsers() {
        setLoading(true);

        try {
            const data = await apiRequest("/admin/users");
            setUsers(data.users);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let active = true;

        apiRequest("/admin/users")
            .then((data) => {
                if (active) {
                    setUsers(data.users);
                }
            })
            .catch((error) => {
                if (active) {
                    setMessage(error.message);
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return users.filter((user) => {
            const studentText = user.student
                ? `${user.student.student_number} ${user.student.first_name} ${user.student.last_name}`
                : "";

            const matchesSearch =
                !keyword ||
                user.email.toLowerCase().includes(keyword) ||
                studentText.toLowerCase().includes(keyword);

            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            const matchesStatus = statusFilter === "all" || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    const activeCount = users.filter((user) => user.status === "active").length;
    const studentCount = users.filter((user) => user.role === "student").length;
    const staffCount = users.filter((user) => user.role !== "student").length;

    function updateForm(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    async function createAccount(event) {
        event.preventDefault();
        setMessage("");
        setTemporaryCredentials(null);

        try {
            const data = await apiRequest("/admin/users", {
                method: "POST",
                body: JSON.stringify(form),
            });

            setTemporaryCredentials({
                email: data.user.email,
                password: data.temporary_password,
            });
            setMessage(data.message);
            setForm(createDefaults);
            await loadUsers();
        } catch (error) {
            setMessage(error.message);
        }
    }

    async function saveAccount(user, role, status) {
        setMessage("");

        try {
            const data = await apiRequest(`/admin/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify({ role, status }),
            });

            setMessage(data.message);
            await loadUsers();
        } catch (error) {
            setMessage(error.message);
        }
    }

    async function resetPassword(user) {
        const entered = window.prompt(
            `Temporary password for ${user.email}.\nLeave blank to generate one automatically.`
        );

        if (entered === null) {
            return;
        }

        setTemporaryCredentials(null);
        setMessage("");

        try {
            const data = await apiRequest(`/admin/users/${user.id}/reset-password`, {
                method: "POST",
                body: JSON.stringify({
                    password: entered.trim() || null,
                }),
            });

            setTemporaryCredentials({
                email: user.email,
                password: data.temporary_password,
            });
            setMessage(data.message);
            await loadUsers();
        } catch (error) {
            setMessage(error.message);
        }
    }

    async function revokeSessions(user) {
        if (!window.confirm(`Log out all active sessions for ${user.email}?`)) {
            return;
        }

        setMessage("");

        try {
            const data = await apiRequest(`/admin/users/${user.id}/revoke-tokens`, {
                method: "POST",
            });

            setMessage(data.message);
            await loadUsers();
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <div className="admin-account-area">
            <section className="metric-strip" aria-label="Account summary">
                <div><strong>{users.length}</strong><span>Total accounts</span></div>
                <div><strong>{activeCount}</strong><span>Active</span></div>
                <div><strong>{studentCount}</strong><span>Students</span></div>
                <div><strong>{staffCount}</strong><span>Staff</span></div>
            </section>

            <section className="admin-card">
                <div className="section-heading-row compact">
                    <div>
                        <p className="section-kicker">Provision access</p>
                        <h2>Create account</h2>
                        <p>Students receive accounts after enrollment. Staff accounts are created by an administrator.</p>
                    </div>
                </div>

                <form className="admin-account-form" onSubmit={createAccount}>
                    <label>
                        Email
                        <input name="email" type="email" value={form.email} onChange={updateForm} required />
                    </label>

                    <label>
                        Temporary password
                        <input name="password" type="text" minLength="8" value={form.password} onChange={updateForm} required />
                    </label>

                    <label>
                        Role
                        <select name="role" value={form.role} onChange={updateForm}>
                            <option value="student">Student</option>
                            {staffRoles.map((role) => (
                                <option key={role} value={role}>{roleLabels[role]}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Status
                        <select name="status" value={form.status} onChange={updateForm}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </label>

                    {form.role === "student" && (
                        <>
                            <label>
                                Student number
                                <input name="student_number" value={form.student_number} onChange={updateForm} required />
                            </label>

                            <label>
                                First name
                                <input name="first_name" value={form.first_name} onChange={updateForm} required />
                            </label>

                            <label>
                                Last name
                                <input name="last_name" value={form.last_name} onChange={updateForm} required />
                            </label>
                        </>
                    )}

                    <button className="submit-button" type="submit">Create account</button>
                </form>

                {temporaryCredentials && (
                    <div className="temporary-password-box">
                        <strong>Temporary credentials — copy these now</strong>
                        <span>{temporaryCredentials.email}</span>
                        <code>{temporaryCredentials.password}</code>
                        <small>
                            The password is stored as a hash and cannot be viewed again. Admin can reset it later.
                        </small>
                    </div>
                )}

                {message && <p className="admin-message">{message}</p>}
            </section>

            <section className="admin-card">
                <div className="admin-section-heading">
                    <div>
                        <p className="section-kicker">Directory</p>
                        <h2>User accounts</h2>
                        <p>Search first, then use filters only when you need them.</p>
                    </div>
                    <button type="button" onClick={loadUsers}>Refresh</button>
                </div>

                <div className="record-toolbar">
                    <label className="search-control">
                        <span>Search accounts</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Name, email, or student number"
                        />
                    </label>

                    <label>
                        <span>Role</span>
                        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
                            <option value="all">All roles</option>
                            {Object.entries(roleLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Status</span>
                        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                            <option value="all">All statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </label>
                </div>

                {loading ? (
                    <p>Loading accounts...</p>
                ) : (
                    <>
                        <p className="results-count">{filteredUsers.length} account(s) shown</p>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Sessions</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="empty-cell">No matching accounts.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <AccountRow
                                                key={user.id}
                                                user={user}
                                                onSave={saveAccount}
                                                onReset={resetPassword}
                                                onRevoke={revokeSessions}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}

function AccountRow({ user, onSave, onReset, onRevoke }) {
    const [role, setRole] = useState(user.role);
    const [status, setStatus] = useState(user.status);
    const isAdmin = user.role === "admin";

    return (
        <tr>
            <td>
                <strong>{user.email}</strong>
                {user.student && (
                    <small className="table-subtext">
                        {user.student.student_number} · {user.student.first_name} {user.student.last_name}
                    </small>
                )}
            </td>
            <td>
                <select value={role} onChange={(event) => setRole(event.target.value)} disabled={isAdmin}>
                    {user.role === "student" ? (
                        <option value="student">Student</option>
                    ) : (
                        <>
                            <option value="registrar">Registrar</option>
                            <option value="cashier">Cashier</option>
                            <option value="department">Department</option>
                            {isAdmin && <option value="admin">Admin</option>}
                        </>
                    )}
                </select>
            </td>
            <td>
                <select value={status} onChange={(event) => setStatus(event.target.value)} disabled={isAdmin}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                </select>
            </td>
            <td><span className="session-count">{user.tokens_count}</span></td>
            <td>
                <div className="admin-row-actions">
                    <button type="button" className="primary-small" onClick={() => onSave(user, role, status)}>
                        Save
                    </button>
                    <button type="button" onClick={() => onReset(user)}>
                        Reset password
                    </button>
                    {!isAdmin && (
                        <button type="button" onClick={() => onRevoke(user)}>
                            Log out sessions
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default UserAccountList;

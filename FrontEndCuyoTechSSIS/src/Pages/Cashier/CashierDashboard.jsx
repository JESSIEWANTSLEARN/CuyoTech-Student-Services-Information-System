import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function CashierDashboard() {
    return (
        <ModuleDashboard
            role="cashier"
            title="Cashier Dashboard"
            description="Verify document-request payments and review issued receipts."
            areas={[
                { title: "Payments", path: "/cashier/payments", description: "Verify pending payments and automatically issue a receipt." },
                { title: "Receipts", path: "/cashier/receipts", description: "Review receipts generated from verified payments." },
            ]}
        />
    );
}

export default CashierDashboard;

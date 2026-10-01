import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function CashierDashboard() {
    return (
        <ModuleDashboard
            role="cashier"
            title="Cashier Dashboard"
            description="Review payment and receipt workflows."
            areas={[
                { title: "Payments", path: "/cashier/payments", description: "Verified payment records will appear after the Cashier API is connected." },
                { title: "Receipts", path: "/cashier/receipts", description: "Receipt processing will be available after integration." },
            ]}
        />
    );
}

export default CashierDashboard;

import ModuleDashboard from "../../Components/ModuleDashboard.jsx";

function CashierDashboard() {
    return (
        <ModuleDashboard
            title="Cashier Dashboard"
            description="Review payment and receipt workflows."
            areas={[
                { title: "Payments", description: "Verified payment records will appear after the Cashier API is connected." },
                { title: "Receipts", description: "Receipt processing will be available after integration." },
            ]}
        />
    );
}

export default CashierDashboard;

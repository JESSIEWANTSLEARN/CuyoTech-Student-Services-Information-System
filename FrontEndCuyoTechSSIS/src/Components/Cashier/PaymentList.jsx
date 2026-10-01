import RecordList from "../RecordList.jsx";

function PaymentList() {
    return <RecordList
        title="Payments"
        description="View verified student payment records when the Cashier module is connected."
        columns={["Student", "Payment", "Status"]}
        emptyMessage="No payment records are connected yet."
    />;
}

export default PaymentList;

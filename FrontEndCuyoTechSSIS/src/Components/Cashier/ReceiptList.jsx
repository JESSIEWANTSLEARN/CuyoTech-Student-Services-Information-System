import RecordList from "../RecordList.jsx";

function ReceiptList() {
    return <RecordList
        title="Receipts"
        description="Receipts will be available after a verified payment is recorded."
        columns={["Receipt", "Student", "Date"]}
        emptyMessage="No receipts are connected yet."
    />;
}

export default ReceiptList;

import RecordList from "../RecordList.jsx";

function EnrollmentList() {
    return <RecordList
        title="Enrollment records"
        description="Registrar enrollment records will appear here after integration."
        columns={["Student", "Program", "Enrollment status"]}
        emptyMessage="No enrollment records are connected yet."
    />;
}

export default EnrollmentList;

import RecordList from "../RecordList.jsx";

function DocumentRequestList() {
    return <RecordList
        title="Document requests"
        description="Requests for TOR, COR, and certifications will be reviewed here."
        columns={["Request", "Student", "Document", "Status"]}
        emptyMessage="No document requests are connected yet."
    />;
}

export default DocumentRequestList;

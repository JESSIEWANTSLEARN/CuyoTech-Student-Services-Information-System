import RecordList from "../RecordList.jsx";

function StudentRequestList() {
    return <RecordList
        title="Your document requests"
        description="Submitted requests and their processing status will appear here."
        columns={["Document", "Date requested", "Status"]}
        emptyMessage="Your document requests will appear after this page is connected."
    />;
}

export default StudentRequestList;

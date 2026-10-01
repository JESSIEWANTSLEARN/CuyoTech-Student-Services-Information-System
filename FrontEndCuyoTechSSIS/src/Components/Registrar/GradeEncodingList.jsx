import RecordList from "../RecordList.jsx";

function GradeEncodingList() {
    return <RecordList
        title="Grade encoding"
        description="Authorized staff will encode and release grades after the workflow is connected."
        columns={["Student", "Subject", "Grade status"]}
        emptyMessage="No grade records are connected yet."
    />;
}

export default GradeEncodingList;

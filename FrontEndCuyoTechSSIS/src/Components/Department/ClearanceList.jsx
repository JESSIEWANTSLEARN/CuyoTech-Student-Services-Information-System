import RecordList from "../RecordList.jsx";

function ClearanceList() {
    return <RecordList
        title="Clearance processing"
        description="Review assigned clearance requirements and their status."
        columns={["Student", "Requirement", "Status"]}
        emptyMessage="No clearance records are connected yet."
    />;
}

export default ClearanceList;

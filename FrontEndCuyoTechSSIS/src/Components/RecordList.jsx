function RecordList({ title, description, columns, emptyMessage }) {
    return (
        <section className="record-panel" aria-label={title}>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={columns.length} className="empty-cell">{emptyMessage}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default RecordList;

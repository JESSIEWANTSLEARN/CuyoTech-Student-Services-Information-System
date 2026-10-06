import ReceiptList from "../../Components/Cashier/ReceiptList.jsx";
import StaffPage from "../../Components/StaffPage.jsx";

function Receipts() {
    return (
        <StaffPage role="cashier" title="Receipts" description="Review official receipts generated from verified payments.">
            <ReceiptList />
        </StaffPage>
    );
}

export default Receipts;

import StaffPage from "../../Components/StaffPage.jsx";
import ReceiptList from "../../Components/Cashier/ReceiptList.jsx";

function Receipts() {
    return (
        <StaffPage role="cashier" title="Receipts" description="Review receipts for verified payments.">
            <ReceiptList />
        </StaffPage>
    );
}

export default Receipts;

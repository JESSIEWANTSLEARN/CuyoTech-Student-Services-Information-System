import StaffPage from "../../Components/StaffPage.jsx";
import PaymentList from "../../Components/Cashier/PaymentList.jsx";

function Payments() {
    return (
        <StaffPage role="cashier" title="Payments" description="Review payment records.">
            <PaymentList />
        </StaffPage>
    );
}

export default Payments;

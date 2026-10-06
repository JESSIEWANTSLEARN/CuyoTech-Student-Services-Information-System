import PaymentList from "../../Components/Cashier/PaymentList.jsx";
import StaffPage from "../../Components/StaffPage.jsx";

function Payments() {
    return (
        <StaffPage role="cashier" title="Payments" description="Verify payments connected to approved document requests.">
            <PaymentList />
        </StaffPage>
    );
}

export default Payments;

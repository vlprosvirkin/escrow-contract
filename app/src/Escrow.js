export default function Escrow({
  address,
  arbiter1,
  arbiter2,
  beneficiary,
  value,
  handleApprove,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Contract Address </div>
          <div> {address} </div>
        </li>
        <li>
          <div> Arbiter 1</div>
          <div> {arbiter1} </div>
        </li>
        <li>
          <div> Arbiter 2</div>
          <div> {arbiter2} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          className="button"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}

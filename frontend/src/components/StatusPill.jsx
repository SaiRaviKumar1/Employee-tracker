const toneByStatus = {
  Active: 'status-pill status-pill--active',
  'On Leave': 'status-pill status-pill--leave',
  Inactive: 'status-pill status-pill--inactive',
};

export default function StatusPill({ status }) {
  return <span className={toneByStatus[status] ?? 'status-pill'}>{status}</span>;
}

import "./FriendRequests.css";

interface Props {
  friendRequests: { RequesterId: string; Username: string; CurrentHCP: string }[];
  onAccept: (friendId: string) => void;
}

function FriendRequests({ friendRequests, onAccept }: Props) {
  return (
    <div className="friend-requests">
      <h3>Vänförfrågningar</h3>
      {friendRequests.length > 0 ? (
        <ul>
          {friendRequests.map((req) => (
            <li key={req.RequesterId}>
              <p>{req.Username} (HCP: {req.CurrentHCP})</p>
              <button onClick={() => onAccept(req.RequesterId)}>✔ Acceptera</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga vänförfrågningar.</p>
      )}
    </div>
  );
}

export default FriendRequests;

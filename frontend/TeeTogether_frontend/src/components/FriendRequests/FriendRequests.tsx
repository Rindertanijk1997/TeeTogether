import "../../components/FriendRequests/FriendRequests.css";

interface Props {
  friendRequests: { RequesterId: string; FriendId: string; Username: string; CurrentHCP: string }[];
  onAccept: () => void;
}

function FriendRequests({ friendRequests, onAccept }: Props) {
  return (
    <div className="friends-list">
      <h3>Vänförfrågningar</h3>
      {friendRequests.length > 0 ? (
        friendRequests.map(req => (
          <div key={req.RequesterId} className="user-row">
            <p>{req.Username}</p>
            <p>HCP: {req.CurrentHCP}</p>
            <button onClick={() => onAccept()}>✔ Acceptera</button>
          </div>
        ))
      ) : (
        <p>Inga vänförfrågningar.</p>
      )}
    </div>
  );
}

export default FriendRequests;

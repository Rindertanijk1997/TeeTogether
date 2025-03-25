import "../../components/FriendList/FriendList.css";

interface Props {
  friends: { UserId: string; Username: string; City: string; Age: number; CurrentHCP: string }[];
  onSelect: (user: { UserId: string; Username: string; City: string; Age: number; CurrentHCP: string }) => void;
}

function FriendList({ friends, onSelect }: Props) {
  return (
    <div className="users-list">
      <h3>Mina vänner</h3>
      {friends.length > 0 ? (
        friends.map(friend => (
          <div key={friend.UserId} className="user-row" onClick={() => onSelect(friend)}>
            <p>{friend.Username}</p>
            <p>{friend.City}</p>
            <p>{friend.Age} år</p>
            <p>HCP: {friend.CurrentHCP}</p>
          </div>
        ))
      ) : (
        <p>Du har inga vänner ännu.</p>
      )}
    </div>
  );
}

export default FriendList;

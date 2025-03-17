import "../../components/UserList/UserList.css";

interface Props {
  users: { UserId: string; Username: string; City: string; Age: number; CurrentHCP: string }[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onSelect: (user: { UserId: string; Username: string; City: string; Age: number; CurrentHCP: string }) => void;
  onSendRequest: (friendId: string) => void;
  sentRequests: string[];
}

function UserList({ users, searchTerm, onSearch, onSelect, onSendRequest, sentRequests }: Props) {
  return (
    <>
      <h3>Hitta golfvänner</h3>
      <input
        type="text"
        placeholder="Sök efter namn eller stad..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      <div className="users-list">
        {users
          .filter(user =>
            user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.City.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(user => (
            <div key={user.UserId} className="user-row" onClick={() => onSelect(user)}>
              <p>{user.Username}</p>
              <p>{user.City}</p>
              <p>{user.Age} år</p>
              <p>HCP: {user.CurrentHCP}</p>

              
            </div>
          ))}
      </div>
    </>
  );
}

export default UserList;

import "./UserOverlay.css";

interface UserOverlayProps {
  user: { UserId: string; Username: string; City: string; Age: number; CurrentHCP: string };
  onClose: () => void;
  onSendRequest: (friendId: string) => void;
  isFriend: boolean;
  sentRequests: string[];
}

function UserOverlay({ user, onClose, onSendRequest, isFriend, sentRequests }: UserOverlayProps) {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h3>{user.Username}</h3>
        <p>Stad: {user.City}</p>
        <p>Ålder: {user.Age}</p>
        <p>HCP: {user.CurrentHCP}</p>

        {!isFriend && !sentRequests.includes(user.UserId) && (
          <button className="send-request" onClick={() => onSendRequest(user.UserId)}>
            ➕ Lägg till vän
          </button>
        )}

        {sentRequests.includes(user.UserId) && (
          <button className="sent-request" disabled>
            Förfrågan skickad
          </button>
        )}

        <button onClick={onClose} className="close-button">✖ Stäng</button>
      </div>
    </div>
  );
}

export default UserOverlay;

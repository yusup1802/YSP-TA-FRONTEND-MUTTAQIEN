import { useNavigate } from "react-router";
import AuthStore from "../stores/AuthStore";

const HandleLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    AuthStore.getState().setAuthenticated(false);
    AuthStore.getState().setUser(null);

    console.log('🚪 Logout successful.');

    navigate('/login', { replace: true });
  };

  return (
    <button onClick={handleLogout} className="btn btn-error mt-2.5">
      Logout
    </button>

  );
};

export default HandleLogout;

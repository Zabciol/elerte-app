import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { loginApi, verifyTokenApi } from "../../../api/authApi"; // załóżmy, że ścieżka jest poprawna
import ConfirmPupUp from "../../common/ConfirmPopUp";
import PopUp from "../../common/PopUp";
import ChangePassword from "../ChangePassword";

// Tworzenie kontekstu auth
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    JSON.parse(sessionStorage.getItem("userToken"))
  );
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [showPopUpLogout, setShowPopUpLogout] = useState(false);
  const [showPopUp, setShowPopUp] = useState();
  const [reloadPopUp, setReloadPopUp] = useState(false);
  const [message, setMessage] = useState();
  const [changePasswordRequired, setChangePasswordRequired] = useState(false);

  // Funkcja do aktualizacji tokena
  const updateToken = (newToken) => {
    setAuthToken(newToken);
    sessionStorage.setItem("userToken", JSON.stringify(newToken)); // Dla sesji przeglądarki
  };

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginApi(email, password);
      if (data.token) {
        setAuthToken(data.token);
        setUser(data.user);
        console.log(data.user);
        setIsLogged(true);
        sessionStorage.setItem("userToken", JSON.stringify(data.token));
      }

      if (data.changePasswordRequired) {
        setChangePasswordRequired(true);
      }
    } catch (error) {
      console.error(error || "Login failed. Please try again.");
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setIsLogged(false);
    sessionStorage.removeItem("userToken");
    setShowPopUpLogout(false);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const storedToken = sessionStorage.getItem("userToken");
        if (storedToken) {
          const data = await verifyTokenApi(storedToken);
          if (data.isValid) {
            setAuthToken(storedToken);
            setIsLogged(true);
            setUser(data.user);
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error("Problem with token verification:", error);
        logout();
      }
    };

    verifyToken();
  }, [setAuthToken, setIsLogged, setUser, logout]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        isLogged,
        login,
        logout,
        setShowPopUp,
        setReloadPopUp,
        setShowPopUpLogout,
        setMessage,
      }}>
      {children}
      <ConfirmPupUp
        show={showPopUpLogout}
        hide={() => setShowPopUpLogout(false)}
        decline={() => window.location.reload()}
        confirm={logout}
        declineText='Odświez stronę'
        confirmText='Wyloguj'
        title='Uwaga'>
        {message}
      </ConfirmPupUp>
      <PopUp
        show={showPopUp}
        setShow={setShowPopUp}
        message={message}
        reload={reloadPopUp}
        setReloadPopUp={setReloadPopUp}
        title='Powiadomienie'></PopUp>
      <ChangePassword
        user={user}
        show={changePasswordRequired}
        setShow={setChangePasswordRequired}
        title='Wymagana zmiana hasła'
      />
    </AuthContext.Provider>
  );
};

// Hook do użycia kontekstu auth w komponentach
export const useAuth = () => useContext(AuthContext);

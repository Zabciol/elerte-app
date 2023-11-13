import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { loginApi, verifyTokenApi } from "../../../api/authApi"; // załóżmy, że ścieżka jest poprawna
import ConfirmPupUp from "../../common/ConfirmPopUp";
import { handleError } from "../../common/CommonFunctions";

// Tworzenie kontekstu auth
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(
    JSON.parse(sessionStorage.getItem("userToken"))
  );
  const [user, setUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [showPopUpLogout, setShowPopUpLogout] = useState(false);
  const [message, setMessage] = useState();

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
        setIsLogged(true);
        sessionStorage.setItem("userToken", JSON.stringify(data.token)); // Opcjonalnie zapisz token w localStorage
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
    </AuthContext.Provider>
  );
};

// Hook do użycia kontekstu auth w komponentach
export const useAuth = () => useContext(AuthContext);

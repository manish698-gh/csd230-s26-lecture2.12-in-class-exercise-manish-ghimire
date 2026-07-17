import { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {

    const [token, setTokenState] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const decodeToken = (jwt) => {
        try {
            const payload = jwt.split(".")[1];
            const decoded = JSON.parse(window.atob(payload));

            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                console.warn("Token is expired locally (exp claim in the past)");
                return { payload: null, isAdmin: false };
            }

            const scope =
                decoded.scope ||
                decoded.authorities ||
                decoded.role ||
                decoded.roles ||
                "";

            const admin = String(scope).toUpperCase().includes("ADMIN");

            return { payload: decoded, isAdmin: admin };

        } catch (error) {
            console.error("Invalid JWT:", error);
            return { payload: null, isAdmin: false };
        }
    };

    const setToken = (newToken) => {
        console.log("Saving token:", newToken);

        if (!newToken) {
            localStorage.removeItem("token");
            setTokenState(null);
            setIsAdmin(false);
            return;
        }

        const decoded = decodeToken(newToken);

        if (!decoded.payload) {
            localStorage.removeItem("token");
            setTokenState(null);
            setIsAdmin(false);
            console.error("Refused to store an invalid/expired token");
            return;
        }

        localStorage.setItem("token", newToken);
        setTokenState(newToken);
        setIsAdmin(decoded.isAdmin);
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            const decoded = decodeToken(savedToken);

            if (decoded.payload) {
                setTokenState(savedToken);
                setIsAdmin(decoded.isAdmin);
            } else {
                localStorage.removeItem("token");
            }
        }

        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setTokenState(null);
        setIsAdmin(false);
        window.location.href = "/";
    };

    const value = useMemo(() => ({
        token,
        setToken,
        isAdmin,
        logout,
        loading
    }), [token, isAdmin, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
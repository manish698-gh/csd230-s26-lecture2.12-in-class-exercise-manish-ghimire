import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Create the Context
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// AuthProvider Component - The Global Security Brain
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Decode JWT to extract roles from the "scope" claim
    const decodeToken = (jwt) => {
        try {
            // JWT format: header.payload.signature
            const payload = jwt.split('.')[1];
            const decoded = JSON.parse(atob(payload));

            // Check if the scope contains ADMIN
            const scope = decoded.scope || '';
            const isAdminUser = scope.includes('ROLE_ADMIN') || scope.includes('ADMIN');

            return { isAdmin: isAdminUser, payload: decoded };
        } catch (error) {
            console.error('Failed to decode token:', error);
            return { isAdmin: false, payload: null };
        }
    };

    // Check localStorage for existing token on app load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const { isAdmin: adminStatus } = decodeToken(storedToken);
            setToken(storedToken);
            setIsAdmin(adminStatus);
        }
        setLoading(false);
    }, []);

    // Update localStorage whenever token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            const { isAdmin: adminStatus } = decodeToken(token);
            setIsAdmin(adminStatus);
        } else {
            localStorage.removeItem('token');
            setIsAdmin(false);
        }
    }, [token]);

    // Logout function
    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        token,
        setToken,
        isAdmin,
        logout,
        loading
    }), [token, isAdmin, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
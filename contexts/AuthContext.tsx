import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';
import { INITIAL_USERS, USERS_KEY, CURRENT_USER_KEY } from '../constants';

interface AuthContextState {
  isLoggedIn: boolean;
  currentUser: User | null;
  isAdmin: boolean;
  users: User[];
  login: (username?: string, password?: string) => { success: boolean, message?: string, user?: User };
  googleLogin: () => { success: boolean, message?: string, user?: User };
  signup: (username?: string, password?: string) => { success: boolean, message?: string, user?: User };
  logout: () => void;
  addAdmin: (username?: string, password?: string) => { success: boolean, message?: string };
  updateAdmin: (id: string, newUsername: string, newPassword?: string) => { success: boolean, message?: string };
  removeAdmin: (id: string) => { success: boolean, message?: string };
  adminPassword?: string;
  updatePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem(USERS_KEY);
    return storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    try {
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
        return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);


  const login = (username?: string, password?: string): { success: boolean, message?: string, user?: User } => {
    if (!username || !password) return { success: false, message: 'Username and password are required.' };
    
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password && u.provider === 'credentials');
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password.' };
  };
  
  const signup = (username?: string, password?: string): { success: boolean, message?: string, user?: User } => {
    if (!username || !password) return { success: false, message: 'Username and password are required.' };

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already exists.' };
    }

    const newUser: User = {
        id: Date.now().toString(),
        username,
        password,
        role: 'user',
        provider: 'credentials',
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };
  
  const googleLogin = (): { success: boolean, message?: string, user?: User } => {
      // This is a simulation. In a real app, you'd use an OAuth library.
      const googleUsername = `user${Date.now().toString().slice(-4)}`;
      const existingUser = users.find(u => u.username === googleUsername);

      if(existingUser) {
        setCurrentUser(existingUser);
        return { success: true, user: existingUser };
      }
      
      const newUser: User = {
          id: Date.now().toString(),
          username: googleUsername,
          role: 'user',
          provider: 'google',
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return { success: true, user: newUser };
  }

  const logout = () => {
    setCurrentUser(null);
  };
  
  const addAdmin = (username?: string, password?: string): { success: boolean, message?: string } => {
    if (!username || !password) return { success: false, message: 'Username and password are required.' };

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already exists.' };
    }

    const newAdmin: User = {
        id: Date.now().toString(),
        username,
        password,
        role: 'admin',
        provider: 'credentials',
    };
    
    setUsers(prev => [...prev, newAdmin]);
    return { success: true };
  }

  const updatePassword = (newPassword: string) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, password: newPassword };

    setUsers(prevUsers => 
        prevUsers.map(user => 
            user.id === currentUser.id ? updatedUser : user
        )
    );
    setCurrentUser(updatedUser);
  };

  const updateAdmin = (id: string, newUsername: string, newPassword?: string): { success: boolean, message?: string } => {
    if (!newUsername.trim()) {
        return { success: false, message: 'Username cannot be empty.' };
    }
    const usernameExists = users.some(u => u.username.toLowerCase() === newUsername.toLowerCase() && u.id !== id);
    if (usernameExists) {
        return { success: false, message: 'Username already taken.' };
    }

    let updatedUser: User | null = null;
    setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => {
            if (user.id === id) {
                updatedUser = {
                    ...user,
                    username: newUsername,
                    // Only update password if a new one is provided and not empty
                    password: newPassword && newPassword.trim() ? newPassword.trim() : user.password,
                };
                return updatedUser;
            }
            return user;
        });
        return updatedUsers;
    });

    if (currentUser?.id === id && updatedUser) {
        setCurrentUser(updatedUser);
    }
    return { success: true };
  };

  const removeAdmin = (id: string): { success: boolean, message?: string } => {
      if (currentUser?.id === id) {
          return { success: false, message: 'You cannot remove your own account.' };
      }
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
          return { success: false, message: 'Cannot remove the last admin account.' };
      }

      setUsers(prev => prev.filter(user => user.id !== id));
      return { success: true };
  };

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';
  const adminPassword = (isAdmin && currentUser?.provider === 'credentials') ? currentUser.password : undefined;


  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, isAdmin, users, login, signup, googleLogin, logout, addAdmin, adminPassword, updatePassword, updateAdmin, removeAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
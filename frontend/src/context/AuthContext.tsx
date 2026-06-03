import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface User {
  sub: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let newSocket: Socket | null = null;
    
    if (token) {
      // Xác thực lại token bằng cách lấy profile
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data.data);
          
          // Kết nối realtime
          newSocket = io('http://localhost:3000');
          newSocket.on('connect', () => {
            console.log('WS Connected');
            newSocket?.emit('joinUserRoom', response.data.data.sub);
          });
          
          newSocket.on('orderStatusUpdated', (data) => {
            toast.success(`Đơn hàng ${data.orderId} đã chuyển trạng thái: ${data.status}`, { duration: 5000 });
          });
          
          setSocket(newSocket);
        })
        .catch(() => {
          // Token không hợp lệ hoặc hết hạn
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setSocket(null);
    }
    
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

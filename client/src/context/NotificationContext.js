import React, { createContext, useState, useContext, useCallback } from 'react';
import Notification from '../components/Notification';

// Create the context
const NotificationContext = createContext();

// Create the Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to ADD a notification
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now(); // Simple unique ID
    setNotifications(currentNotifications => [
      ...currentNotifications,
      { id, message, type, duration },
    ]);
  }, []);

  // ✅ HERE'S THE FIX: Function to REMOVE a notification
  const removeNotification = useCallback((id) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== id)
    );
  }, []);

  // Provide the state and functions to children
  const value = { addNotification, removeNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* This is the fixed container that will display the notifications.
        It's placed here so it's part of the provider itself.
      */}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-3">
        {notifications.map(n => (
          <Notification
            key={n.id}
            id={n.id}
            message={n.message}
            type={n.type}
            duration={n.duration}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Custom hook to easily use the context
export const useNotification = () => {
  return useContext(NotificationContext);
};
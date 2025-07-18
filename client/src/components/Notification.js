import React, { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

const notificationConfig = {
  success: {
    icon: <CheckCircleIcon className="h-6 w-6 text-emerald-500" />,
    barClass: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
    bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderClass: 'border-emerald-200 dark:border-emerald-800',
    textClass: 'text-emerald-800 dark:text-emerald-200'
  },
  error: {
    icon: <XCircleIcon className="h-6 w-6 text-red-500" />,
    barClass: 'bg-gradient-to-r from-red-400 to-red-500',
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    borderClass: 'border-red-200 dark:border-red-800',
    textClass: 'text-red-800 dark:text-red-200'
  },
  info: {
    icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
    barClass: 'bg-gradient-to-r from-blue-400 to-blue-500',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    borderClass: 'border-blue-200 dark:border-blue-800',
    textClass: 'text-blue-800 dark:text-blue-200'
  },
};

const Notification = ({ id, message, type, duration = 5000 }) => {
  const { removeNotification } = useNotification();
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        removeNotification(id);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [id, duration, removeNotification]);

  const { icon, barClass, bgClass, borderClass, textClass } = notificationConfig[type] || notificationConfig.info;

  return (
    <div className={`w-full max-w-sm overflow-hidden ${bgClass} backdrop-blur-sm rounded-xl shadow-lg border ${borderClass} my-2 transform transition-all duration-300 hover:scale-105`}>
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-sm">
            {icon}
          </div>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${textClass} leading-relaxed`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => removeNotification(id)}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${textClass} hover:bg-white/50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200`}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700/50">
        <div
          className={`${barClass} h-1 shadow-sm`}
          style={{ 
            animation: `shrink-width ${duration}ms linear`,
            animationFillMode: 'forwards'
          }}
        ></div>
      </div>
      
      <style jsx>{`
        @keyframes shrink-width {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
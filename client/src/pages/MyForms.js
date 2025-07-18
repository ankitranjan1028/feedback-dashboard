import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useNotification } from '../context/NotificationContext';
import {
  PlusIcon,
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';

const useMyForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const fetchForms = useCallback(async () => {
    try {
      const { data } = await api.get('/forms');
      setForms(data);
    } catch (error) {
      console.error('Failed to fetch forms', error);
      addNotification('Could not fetch your forms.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  return { forms, loading, fetchForms };
};

const FormCard = ({ form }) => {
  const { addNotification } = useNotification();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    const url = `${window.location.origin}/form/${form._id}`;
    navigator.clipboard.writeText(url).then(() => {
      addNotification('Link copied to clipboard!', 'success');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      addNotification('Failed to copy link.', 'error');
    });
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">{form.title}</h3>
          <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
            {form.questions.length}
          </span>
          {form.questions.length === 1 ? 'Question' : 'Questions'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={copyToClipboard}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              isCopied
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
            }`}
          >
            {isCopied ? <ClipboardDocumentCheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
            {isCopied ? 'Copied!' : 'Copy Link'}
          </button>
          <Link
            to={`/form/${form._id}/responses`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            <ChartBarIcon className="w-4 h-4" />
            View Responses
          </Link>
        </div>
      </div>
    </div>
  );
};

const MyForms = () => {
  const { forms, loading } = useMyForms();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        <div className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading your forms...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                My Forms
                <span className="block text-lg font-normal text-gray-600 dark:text-gray-300 mt-2">
                  Manage, share, and analyze all your forms in one place
                </span>
              </h1>
            </div>
            <Link
              to="/create-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              Create New Form
            </Link>
          </div>
        </header>

        <main>
          {forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {forms.map((form) => <FormCard key={form._id} form={form} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 shadow-sm">
              <div className="max-w-md mx-auto px-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DocumentPlusIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No forms created yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Get started by creating your first form. Build surveys, collect feedback, and gather insights from your audience.
                </p>
                <Link
                  to="/create-form"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Your First Form
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyForms;
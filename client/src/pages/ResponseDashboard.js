import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { useNotification } from '../context/NotificationContext';
import api from '../api';
import { 
    ArrowLeftIcon, 
    DocumentArrowDownIcon, 
    ChartBarIcon, 
    ExclamationTriangleIcon,
    ChevronUpIcon, 
    ChevronDownIcon 
} from '@heroicons/react/24/outline'; 

const useFormResponses = (formId) => {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification();

  const fetchData = useCallback(async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        api.get(`/forms/${formId}`),
        api.get(`/responses/${formId}`),
      ]);
      setForm(formRes.data);
      setResponses(responsesRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
      setError('Could not fetch response data.');
      addNotification('Could not fetch response data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [formId, addNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { form, responses, loading, error };
};

const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
    <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin"></div>
    {text && <div className="mt-4 text-lg font-medium tracking-wide">{text}</div>}
  </div>
);

const InfoState = ({ icon, title, message, children }) => (
  <div className="text-center py-16 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-lg">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">{message}</p>
    {children}
  </div>
);


const ResponseTable = ({ questions, responses, onSort, sortConfig }) => {
  const getAnswer = (response, questionId) => {
    const answerObj = response.answers.find((a) => a.questionId === questionId);
    return answerObj?.answer ? String(answerObj.answer) : <span className="text-gray-500">N/A</span>;
  };

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    if (sortConfig.direction === 'ascending') return <ChevronUpIcon className="w-4 h-4 text-cyan-400" />;
    return <ChevronDownIcon className="w-4 h-4 text-cyan-400" />;
  };

  return (
    <div className="overflow-x-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg max-h-[70vh] relative">
      <table className="min-w-full text-sm text-white">
        <thead className="bg-black/40">
          <tr>
            {questions.map((q) => (
              <th key={q._id} scope="col" className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm px-6 py-3 text-left">
                <button onClick={() => onSort(q._id)} className="group flex items-center gap-2 text-gray-300 uppercase tracking-wider font-semibold hover:text-cyan-400 transition-colors w-full">
                  <span className="truncate" title={q.questionText}>{q.questionText}</span>
                  <SortIndicator columnKey={q._id} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {responses.map((res) => (
            <tr key={res._id} className="hover:bg-cyan-900/20 even:bg-white/5 transition-colors duration-200">
              {questions.map((q) => (
                <td key={q._id} className="px-6 py-4 whitespace-nowrap text-gray-200">
                  <div className="truncate max-w-xs" title={typeof getAnswer(res, q._id) === 'string' ? getAnswer(res, q._id) : ''}>
                    {getAnswer(res, q._id)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex justify-between items-center text-gray-300 text-sm mt-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-black/20 border border-white/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-900/40 transition-colors"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-black/20 border border-white/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-900/40 transition-colors"
        >
          Next
        </button>
      </div>
    );
};

const ResponseDashboard = () => {
  const { id } = useParams();
  const { addNotification } = useNotification();
  const { form, responses, loading, error } = useFormResponses(id);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const ITEMS_PER_PAGE = 10;

  const sortedResponses = useMemo(() => {
    let sortableItems = [...responses];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const getAnswerValue = (response, questionId) => response.answers.find(ans => ans.questionId === questionId)?.answer || '';
        const aValue = getAnswerValue(a, sortConfig.key);
        const bValue = getAnswerValue(b, sortConfig.key);

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [responses, sortConfig]);

  const paginatedResponses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedResponses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedResponses, currentPage]);

  const totalPages = Math.ceil(responses.length / ITEMS_PER_PAGE);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const res = await api.get(`/responses/${id}/export`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${form.title.replace(/\s+/g, '_')}_responses.csv`);
      addNotification('Responses exported successfully!', 'success');
    } catch (err) {
      console.error('Failed to export responses', err);
      addNotification('Could not export responses.', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Responses..." />;
  }

  if (error || !form) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <InfoState
          icon={<ExclamationTriangleIcon className="w-16 h-16 text-red-500" />}
          title="Form Not Found"
          message="The form you are looking for does not exist or an error occurred."
        >
          <Link
            to="/my-forms"
            className="inline-flex items-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-lg shadow-lg transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to My Forms
          </Link>
        </InfoState>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link to="/my-forms" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-2 font-medium">
            <ArrowLeftIcon className="w-5 h-5" />
            Back to My Forms
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">{form.title}</h1>
          <p className="text-gray-400 mt-1">Showing {paginatedResponses.length} of {responses.length} submitted response{responses.length !== 1 ? 's' : ''}.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={responses.length === 0}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Export CSV
        </button>
      </header>

      <main>
        {responses.length > 0 ? (
          <div>
            <ResponseTable
              questions={form.questions}
              responses={paginatedResponses}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <InfoState
            icon={<ChartBarIcon className="w-16 h-16 text-gray-500" />}
            title="No Responses Yet!"
            message="As soon as someone fills out your form, their answers will appear here."
          >
             <Link
                to={`/form/${id}/share`} 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
            >
                Get Sharable Link
            </Link>
          </InfoState>
        )}
      </main>
    </div>
  );
};

export default ResponseDashboard;
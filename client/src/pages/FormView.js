import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useNotification } from '../context/NotificationContext';

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const FormSkeleton = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="mb-6">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
            ))}
            <div className="h-12 bg-gray-300 rounded w-full mt-4"></div>
        </div>
    </div>
);

const FormView = () => {
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const firstInputRef = useRef(null);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const { data } = await api.get(`/forms/${id}`);
                setForm(data);
                const initialAnswers = data.questions.map(q => ({ 
                    questionId: q._id, 
                    answer: '' 
                }));
                setAnswers(initialAnswers);
            } catch (error) {
                console.error('Failed to fetch form', error);
                addNotification('Form not found or could not be loaded.', 'error');
                navigate('/');
            }
        };
        fetchForm();
    }, [id, navigate, addNotification]);

    useEffect(() => {
        if (form && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [form]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(answers.map(a => a.questionId === questionId ? { ...a, answer: value } : a));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/responses/${id}`, { answers });
            setSubmitted(true);
            addNotification('Your feedback has been submitted successfully!', 'success');
        } catch (error) {
            console.error('Failed to submit response', error);
            addNotification('There was an error submitting your feedback. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-green-50 px-4">
                <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You! ✅</h1>
                    <p className="text-gray-700 mb-6">Your feedback is valuable to us.</p>
                </div>
            </div>
        );
    }

    if (!form) {
        return <FormSkeleton />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
            <form 
                onSubmit={handleSubmit} 
                className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl"
            >
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{form.title}</h1>
                <p className="text-gray-500 mb-8">Please fill out the form below.</p>

                {form.questions.map((q, index) => (
                    <div key={q._id} className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">{`${index + 1}. ${q.questionText}`}</label>

                        {q.questionType === 'text' ? (
                            <input
                                type="text"
                                ref={index === 0 ? firstInputRef : null}
                                value={answers.find(a => a.questionId === q._id)?.answer || ''}
                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                placeholder="Type your answer here..."
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        ) : (
                            <div className="space-y-3">
                                {q.options.map(opt => (
                                    <label 
                                        key={opt} 
                                        htmlFor={`${q._id}-${opt}`} 
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                                    >
                                        <input
                                            type="radio"
                                            id={`${q._id}-${opt}`}
                                            name={q._id}
                                            value={opt}
                                            onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                            required
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-gray-800">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Spinner /> : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default FormView;
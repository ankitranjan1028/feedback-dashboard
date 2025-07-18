import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useNotification } from '../context/NotificationContext';
import { PlusIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const QuestionEditor = ({ question, qIndex, onQuestionChange, onRemoveQuestion, onOptionChange, onAddOption, onRemoveOption }) => {
    
    const labelStyle = "block text-sm font-medium text-gray-300 mb-1";
    const inputStyle = "w-full px-3 py-2 bg-gray-900/50 border-2 border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors";

    return (
        <div className="bg-black/20 border border-white/10 rounded-xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-grow w-full">
                    <label htmlFor={`qtext-${qIndex}`} className={labelStyle}>Question {qIndex + 1}</label>
                    <input
                        type="text"
                        id={`qtext-${qIndex}`}
                        name="questionText"
                        value={question.questionText}
                        onChange={(e) => onQuestionChange(qIndex, e)}
                        required
                        className={inputStyle}
                        placeholder="e.g., What is your favorite color?"
                    />
                </div>
                <div className="w-full md:w-auto md:flex-shrink-0">
                    <label htmlFor={`qtype-${qIndex}`} className={labelStyle}>Type</label>
                    <select
                        id={`qtype-${qIndex}`}
                        name="questionType"
                        value={question.questionType}
                        onChange={(e) => onQuestionChange(qIndex, e)}
                        className={inputStyle}
                    >
                        <option value="text">Text</option>
                        <option value="multiple-choice">Multiple Choice</option>
                    </select>
                </div>
            </div>

            {question.questionType === 'multiple-choice' && (
                <div className="space-y-3 pt-2">
                    <label className={labelStyle}>Options</label>
                    {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-2 sm:gap-3">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => onOptionChange(qIndex, oIndex, e)}
                                className={inputStyle}
                                placeholder={`Option ${oIndex + 1}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveOption(qIndex, oIndex)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors flex-shrink-0"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => onAddOption(qIndex)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-md transition-colors"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Option
                    </button>
                </div>
            )}
            
            <div className="pt-4 text-right">
                 <button
                    type="button"
                    onClick={() => onRemoveQuestion(qIndex)}
                    className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
                >
                    Remove Question
                </button>
            </div>
        </div>
    );
};

const CreateForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ questionText: '', questionType: 'text', options: [''] }]);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleQuestionChange = (index, event) => {
        const values = [...questions];
        const { name, value } = event.target;
        values[index][name] = value;
        if (name === 'questionType' && value === 'text') {
            values[index].options = [''];
        }
        setQuestions(values);
    };

    const handleOptionChange = (qIndex, oIndex, event) => {
        const values = [...questions];
        values[qIndex].options[oIndex] = event.target.value;
        setQuestions(values);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', questionType: 'text', options: [''] }]);
    };

    const removeQuestion = (index) => {
        const values = [...questions];
        values.splice(index, 1);
        setQuestions(values);
    };

    const addOption = (qIndex) => {
        const values = [...questions];
        values[qIndex].options.push('');
        setQuestions(values);
    };

    const removeOption = (qIndex, oIndex) => {
        const values = [...questions];
        values[qIndex].options.splice(oIndex, 1);
        setQuestions(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const processedQuestions = questions.map(q => ({
            ...q,
            options: q.questionType === 'multiple-choice' ? q.options.filter(opt => opt.trim() !== '') : []
        }));

        try {
            await api.post('/forms', { title, description, questions: processedQuestions });
            addNotification('Form created successfully!', 'success');
            navigate('/my-forms');
        } catch (error) {
            console.error('Failed to create form', error);
            addNotification('Failed to create form. Please check your inputs.', 'error');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <header className="mb-8">
                 <Link to="/my-forms" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 font-medium">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to My Forms
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Create a New Form</h1>
                <p className="text-gray-400 mt-1">Build your form question by question.</p>
            </header>

            <form onSubmit={handleSubmit} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-8">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="formTitle" className="block text-base sm:text-lg font-semibold text-gray-100 mb-2">Form Title</label>
                        <input
                            type="text"
                            id="formTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                            placeholder="e.g., Customer Feedback Survey"
                        />
                    </div>
                     <div>
                        <label htmlFor="formDescription" className="block text-base sm:text-lg font-semibold text-gray-100 mb-2">Description (Optional)</label>
                        <textarea
                            id="formDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3" 
                            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                            placeholder="Provide a brief description for your form..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, i) => (
                        <QuestionEditor
                            key={i}
                            qIndex={i}
                            question={q}
                            onQuestionChange={handleQuestionChange}
                            onRemoveQuestion={removeQuestion}
                            onOptionChange={handleOptionChange}
                            onAddOption={addOption}
                            onRemoveOption={removeOption}
                        />
                    ))}
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center gap-4 pt-4">
                     <button
                        type="submit"
                        className="w-full md:w-auto justify-center px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                        Create Form
                    </button>
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full md:w-auto justify-center flex items-center gap-2 px-5 py-3 bg-cyan-500/20 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-500/30 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Another Question
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateForm;
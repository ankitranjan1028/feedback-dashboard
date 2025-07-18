import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, required: true, enum: ['text', 'multiple-choice'] },
  options: [{ type: String }],
});

const formSchema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const Form = mongoose.model('Form', formSchema);

export default Form;
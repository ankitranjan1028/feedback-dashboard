import mongoose from 'mongoose';

const answerSchema = mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer: { type: String, required: true },
});

const responseSchema = mongoose.Schema(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Form',
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

const Response = mongoose.model('Response', responseSchema);

export default Response;
import Response from "../models/Response.js";
import Form from "../models/Form.js";
import Papa from "papaparse";
const submitResponse = async (req, res) => {
  const { answers } = req.body;
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const response = new Response({
      form: formId,
      answers,
    });

    const createdResponse = await response.save();
    res.status(201).json(createdResponse);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

const getResponsesForForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const responses = await Response.find({ form: req.params.formId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const exportResponses = async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (form.admin.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const responses = await Response.find({ form: req.params.formId });

    // Prepare data for CSV
    const headers = form.questions.map((q) => q.questionText);
    const data = responses.map((response) => {
      const row = {};
      form.questions.forEach((q) => {
        const answer = response.answers.find((a) => a.questionId.equals(q._id));
        row[q.questionText] = answer ? answer.answer : "N/A";
      });
      return row;
    });

    const csv = Papa.unparse({
      fields: headers,
      data: data.map(Object.values),
    });

    res.header("Content-Type", "text/csv");
    res.attachment(`${form.title.replace(/\s+/g, "_")}_responses.csv`);
    res.send(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { submitResponse, getResponsesForForm, exportResponses };

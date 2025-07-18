import Form from "../models/Form.js";
import Response from "../models/Response.js";

const createForm = async (req, res) => {
  const { title, questions } = req.body;

  const form = new Form({
    admin: req.user._id,
    title,
    questions,
  });

  const createdForm = await form.save();
  res.status(201).json(createdForm);
};

const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (form) {
      res.json(form);
    } else {
      res.status(404).json({ message: "Form not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyForms = async (req, res) => {
  const forms = await Form.find({ admin: req.user._id });
  res.json(forms);
};

const getStats = async (req, res) => {
  try {
    const adminId = req.user._id;

    const forms = await Form.find({ admin: adminId });
    const formIds = forms.map((form) => form._id);

    const responses = await Response.find({ form: { $in: formIds } });

    const totalForms = forms.length;
    const totalResponses = responses.length;
    const responsesPerForm = forms.map((form) => {
      const responseCount = responses.filter((r) =>
        r.form.equals(form._id)
      ).length;
      return {
        name: form.title,
        responses: responseCount,
      };
    });

    res.json({
      totalForms,
      totalResponses,
      responsesPerForm,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { createForm, getFormById, getMyForms, getStats };

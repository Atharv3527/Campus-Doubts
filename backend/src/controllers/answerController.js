// backend/src/controllers/answerController.js
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";

// POST /api/questions/:id/answers
export const addAnswer = async (req, res, next) => {
  try {
    const { id: questionId } = req.params;
    const { content } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = await Answer.create({
      question: question._id,
      content,
      answeredBy: req.user._id,
    });

    question.answersCount += 1;
    await question.save();

    const populated = await answer.populate("answeredBy", "name");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// POST /api/answers/:id/upvote  (toggle)
export const toggleUpvote = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const userId = req.user._id.toString();
    const hasVoted = answer.upvotedBy.some(
      (uid) => uid.toString() === userId
    );

    if (hasVoted) {
      answer.upvotedBy = answer.upvotedBy.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      answer.upvotedBy.push(req.user._id);
    }

    answer.upvotes = answer.upvotedBy.length;
    await answer.save();

    const populated = await answer.populate("answeredBy", "name");
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// POST /api/answers/:id/accept
export const acceptAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id).populate(
      "question"
    );
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const question = answer.question;

    if (question.askedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only question owner can accept an answer" });
    }

    // unaccept previous answers
    await Answer.updateMany(
      { question: question._id },
      { $set: { isAccepted: false } }
    );

    answer.isAccepted = true;
    await answer.save();

    question.isSolved = true;
    question.acceptedAnswer = answer._id;
    await question.save();

    const populated = await Answer.findById(answer._id).populate(
      "answeredBy",
      "name"
    );

    res.json({ answer: populated });
  } catch (err) {
    next(err);
  }
};

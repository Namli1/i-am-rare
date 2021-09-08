const QuestionType = {
    yesOrNo: "yesOrNo",
    choice: "choice",
}

function getQuestionType(question) {
    console.log(question);
    if (question.options) {
        return QuestionType.choice;
    }
    else if (question.yes || question.no) {
        return QuestionType.yesOrNo;
    } else {
        return null;
    }
}
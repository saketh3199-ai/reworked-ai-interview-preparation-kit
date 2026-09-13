export const generateFlashcards = (questions) =>
{
    return questions.map
    (
        (question,index) =>
        {
            return {id: `f${index + 1}`,front: question.prompt,back: question.answer_outline,requirement_ids: question.requirement_ids};
        }
    );
};




//id
//front
//back
//requirement_ids
//takes every question object and transforms into flashcard object. Returns an array of flashcard objects

export const checkCoverage = (requirements, questions) =>
{
    const questionRequirementIds = new Set();

    for (const question of questions)
    {
        for (const requirementId of question.requirement_ids)
        {
            questionRequirementIds.add(requirementId);
        }
    }

    const uncoveredRequirementIds = [];

    for (const requirement of requirements)
    {
        if (!questionRequirementIds.has(requirement.id))
        {
            uncoveredRequirementIds.push(requirement.id);
        }
    }

    return uncoveredRequirementIds;
};


//This function returns an array containing the requirement ids which are not referenced at all
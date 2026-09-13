import Kit from "../models/Kit.js";

export const updatePractice = async (request,response) =>
{
    try
    {
        const { id } = request.params;
        const { confidence } = request.body;

        const kit = await Kit.findOne({_id: id,user: request.user});

        if (!kit)
        {
            return response.status(404).json({message: "Kit not found"});
        }

        kit.practice.confidence = confidence;

        await kit.save();

        response.json({message: "Practice progress saved successfully",practice: kit.practice});
    }
    catch (error)
    {
        console.error("Update practice error:",error);

        response.status(500).json({message: error.message});
    }
};
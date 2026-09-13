import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema
(
    {
        id:{type: String,required: true},

        text:{type: String,required: true},

        kind:{type: String,required: true,enum: ["technical", "behavioural", "domain"]},

        priority:{type: String,required: true,enum: ["must", "nice"]}
    },
    {
        _id: false
    }
);

const questionSchema = new mongoose.Schema
(
    {
        id:{type: String,required: true},

        requirement_ids:{type: [String],required: true},

        category:{type: String,required: true},

        prompt:{type: String,required: true},

        answer_outline:{type: String,required: true},

        difficulty:{type: Number,required: true,min: 1,max: 3}
    },
    {
        _id: false
    }
);

const flashcardSchema = new mongoose.Schema
(
    {
        id:{type: String,required: true},

        front:{type: String,required: true},

        back:{type: String,required: true},

        requirement_ids:{type: [String],required: true}
    },
    {
        _id: false
    }
);

const scheduleDaySchema = new mongoose.Schema
(
    {
        day:{type: Number,required: true},

        focus:{type: String,required: true},

        question_ids:{type: [String],required: true},
        
        minutes:{type: Number,required: true,min: 0}
    },
    {
        _id: false
    }
);

const kitSchema = new mongoose.Schema(
{
    user:{type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,index: true},

    status:{type: String,enum: ["draft", "generating", "ready", "failed"],default: "draft"},

    research:
    {
        interview: {type: mongoose.Schema.Types.Mixed,default: {}}
    },

    generation:
    {
        status:{type: String,enum: ["idle", "running", "completed", "failed"],default: "idle"},
        progress:{type: Number,min: 0,max: 100,default: 0},
        current_step:{type: String,default: null},
        error:{type: String,default: null}
    },

    builder:{type: mongoose.Schema.Types.Mixed,default: {}},

    practice:{confidence:{type: Map,of: String,default: {}}},

    kit:{
        source:
        {
                company:{type: String,default: ""},
                company_url:{type: String,default: ""},
                role:{type: String,default: ""},
                location:{type: String,default: ""},
                jd_chars:{type: Number,default: 0,min: 0},
                researched_at:{type: String,default: ""},
                pages_used:{type: [String],default: []},
                jd:{type: String,default: ""}
        },

        company_brief:
        {
                summary:{type: String,default: ""},
                what_they_do:{type: String,default: ""},
                sources:{type: [String],default: []}
        },

        role:
        {
                title:{type: String,default: ""},
                seniority:{type: String,default: ""},
                responsibilities:{type: [String],default: []},
                requirements:{type: [requirementSchema],default: []}
        },

        questions:
        {
                type: [questionSchema],
                default: []
        },

        flashcards:
        {
                type: [flashcardSchema],
                default: []
        },

        schedule:
        {
                days_available:{type: Number,required: true,min: 1,max: 60},
                days:{type: [scheduleDaySchema],default: []}
        },

        coverage:
        {
                uncovered_requirement_ids:{type: [String],default: []},
                passes:{type: Number,default: 0,min: 0}
        }
        }
    },
    {
        timestamps: true
    }
);

const Kit = mongoose.model("Kit", kitSchema);

export default Kit;
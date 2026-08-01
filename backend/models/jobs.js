const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company: String,
    position: String,
    status: String,
    applyDate: Date,
    notes: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("job", jobSchema);
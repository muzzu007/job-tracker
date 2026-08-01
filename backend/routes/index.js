const express = require('express');
const router = express.Router();
const Job = require("../models/jobs");
const auth = require("../middleware/auth")


router.get("/", (req, res) => {
    res.send("hello");

});



router.post("/jobs", auth, async (req, res) => {
    try {
        const job = new Job({

            company: req.body.company,

            position: req.body.position,

            status: req.body.status,

            applyDate: req.body.applyDate,

            notes: req.body.notes,

            user: req.user.id

        });
        await job.save();
        res.json({
            message: "Application Added Successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});


router.get("/jobs", auth, async (req, res) => {
    try {
        const jobs = await Job.find({
            user: req.user.id
        });
        res.json(jobs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


router.delete("/jobs/:id", auth, async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job Deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


router.put("/jobs/:id", auth, async (req, res) => {
    try {

        const job = await Job.findByIdAndUpdate({
            _id: req.params.id,
            user: req.user.id
        }, 
        req.body
    );

        res.json({
            message: "Job Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.post("/check", (req, res,next) => {
    console.log(req.body);
    const generated = req.body.generated;
    const inpArr = req.body.inpArr;
    if (!Array.isArray(generated) || !Array.isArray(inpArr)) {
        return res.status(400).json({ error: "Inputs must be arrays" });
    }
    
    if(!generated || !inpArr) {
        return res.status(400).json({ error: "Invalid input" });
    }
    if(generated.length === 0 || inpArr.length === 0) {
        return res.status(400).json({ error: "Input arrays cannot be empty" });
    }
    if(JSON.stringify(inpArr) === JSON.stringify(generated) && inpArr.length > 0) {
        return res.status(200).json({ success: true });
    }
    else {
        return res.status(400).json({ success: false });
    }
})
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
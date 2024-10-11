import Checkin from "../model/checkin.js";

const checkedIn = async (req, res) => {
  try {
    const { id } = req.params;

    const checkedin = await Checkin.find({ sId: id });

    if (!checkedin) {
      return res.status(404).json({ message: "No checkked in on your behalf" });
    }

    res.status(200).json({ message: "Success", data: checkedin });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default checkedIn;

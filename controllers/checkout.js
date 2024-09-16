import Checkin from "../model/checkin.js";

const CheckOut = async (req, res) => {
  try {
    const { sId } = req.body;
    const { id } = req.params;
    console.log(req.params);

    const person = await Checkin.findByIdAndUpdate(
      { _id: id },
      { materials: [], status: "out", sId }
    );

    if (!person) {
      return res.status(404).json({ message: "Person Not Checked in" });
    }
    return res
      .status(200)
      .json({ status: "Success", messag: "Checked out Success fully!!!!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default CheckOut;
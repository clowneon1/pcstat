module.exports = {
  notFound: (req, res) => {
    return res
      .status(404)
      .json({ message: `No device found with id : ${req.params.id}` });
  },
  deviceUpdated: (req, res) => {
    return res.status(200).json({ message: `device updated successfully` });
  },
};

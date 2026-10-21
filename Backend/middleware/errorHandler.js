export default function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors)[0].message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
}
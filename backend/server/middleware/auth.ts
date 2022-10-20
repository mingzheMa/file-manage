export default function (req, res, next) {
  if (!req.session.token) {
    res.status(401).send();
  } else {
    next();
  }
}

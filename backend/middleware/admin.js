export default function admin(req, res, next) {

  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ msg: 'Admin resource. Access denied.' });
  }
}

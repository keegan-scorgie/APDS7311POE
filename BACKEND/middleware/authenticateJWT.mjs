import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // send forbidden message
      }

      if (!user) {
        return res.sendStatus(403); // sends forbidden if no user data
      }

      // assing user data based on the users role
      if (user.role === 'user') {
        req.user = { id: user.id, role: user.role };
      } else if (user.role === 'employee' || user.role === 'admin') {
        req.user = { employeeID: user.employeeID, role: user.role, id: user.id };
      } else {
        return res.sendStatus(403); // sends forbidden if thers no role
      }

      next();
    });
  } else {
    res.sendStatus(401); // if theres no jwt then unauthorized message is sent
  }
};
const express = require('express');
const router = express.Router();

const professionalData = {
  professionalName: "Tinny Bothepha Mosimanyana",
  base64Image: "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX///8AAAD29vbw8PDt7e3r6+v5+fnc3Nz09PTi4uLZ2dnV1dXe3t7a2trm5ubq6uq/v7/e3t7s7OzPz8/8/Px+fn7AwMBISEi9vb1dXV0pKSnExMS5ubmQkJAjIyNOcnckAAAHgUlEQVR4nO2diXKqMBCFJWRSQgnISNr8/1+d3IgBICfOZ2rf3dSY4aFK2cwQIAAAAAAAAAAAAAAAAAAAAAAP4FeuNq8n1a3V0Wbq6x7jvGLed3txKz7rw6e3B7Ob7D2TOSaz4smNh7dEvKcn3wd5bKbr0npWiT6nU0aTb0lESnE09a2OekO60ZrUyb2tuNHkzV3rW9oxFaO77u+PbYrLZ5HnqilGywUvb+JDPTt+Y2zTUzBrLqjovrVbsO7jJznsH/UwC/4jv62JHwkuXK7H2cDZOmH5dLuHc+EGOVM5ZL5iRWq1+V26taq7TeS1xXZ6M+T5zM2XTkA27XZkPOqST6Z6rm/O6ZpKPaUV9jsCZuPXO5mfxYj3c84PdyZnWbY+7OqdmvX71RxW0o3LxuaJziyb7ukqlrsiP5OLG6msUPdk1+fM+PzZyNnfEfJPS+Ez9+RPj54z5Xsp39z8mU/x5DvmfFcvBvJZTvf1aZJZ7+LxuVrYeu/v+3VX/AceSrftJ8PXaTRrJ7WfxL8xkp+f+u8f7i1aMWLRs83nYJHr9znPyZ/DsZcPr6vpXKmWx/vh/f30V3t7r63Zr5tI7tnKyQfdgkPRNEmJ+wLzPvSNG/ttD+aYoNhn0NG+D9uZIzFfpNvWTmjGuWDzayhWSTnEvWWKv9W45OdvdO0zYt72F/2pN+v3JNn0kf9a0tb6EJbV9HU8s9aNf/TnSH08o/vxbS4hJPfTVVm07pL4Vqr3vpzRscYhErI8vc7vq2dZnmniFtkb8Wh8Oj++7FbdJqn9obYNL+FutSSUfrOhK7cr62ptJe0xk97j8NPrj1bEr37oh/ewh7u+0vqlpNvT18u4Pf3beZ6s3z/Vn+UX4Sk++z1MXf8/1nf8t2oGL+xLjvl5bW30mvV+xf09rfmL69bnrLXjKq+zbI53J/FhXb2LqZH5Lvc/J7XYdZ9jaM3a0uB5G+r/l9iPX35PIvnhP84H/qscuX/k4tjv/Au+xL7SzJNR7wAAAAAAAAAAAAAAAAAAAAAAAPiN/wCaj39cPcd7RgAAAABJRU5ErkJggg==",
  nameLink: {
    firstName: "Tinny",
    url: "https://github.com/Bo-Tinny"
  },
  primaryDescription: " – Backend Developer | Node.js | MongoDB",
  workDescription1: "I'm a software developer passionate about building secure, scalable backend systems. I enjoy designing APIs and managing data with MongoDB.",
  workDescription2: "My expertise includes JavaScript, Express, MongoDB, and RESTful API development. I love learning and applying new technologies to solve real-world problems.",
  linkTitleText: "Connect with me:",
  linkedInLink: {
    text: "LinkedIn Profile",
    link: "https://www.linkedin.com/in/tinny-bothepha/"
  },
  githubLink: {
    text: "GitHub Portfolio",
    link: "https://github.com/tmosimanyana"
  },
  contactText: "Feel free to reach out for collaboration or to connect!"
};

// GET route to return all professional data
router.get('/', (req, res) => {
  try {
    res.json(professionalData);
  } catch (error) {
    console.error('Error fetching professional data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
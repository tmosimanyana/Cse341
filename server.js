require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true,
}));

app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB client setup
const client = new MongoClient(process.env.MONGO_URI);

let db;
let usersCollection;
let projectsCollection;
let skillsCollection;

// Connect to MongoDB once on server start
async function connectDb() {
  try {
    await client.connect();
    db = client.db('portfolio');
    usersCollection = db.collection('users');
    projectsCollection = db.collection('projects');
    skillsCollection = db.collection('skills');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}
connectDb();

// Validation functions
function validateProject(data) {
  const requiredFields = ['title', 'description', 'technologies', 'status'];
  for (let field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') {
      return false;
    }
  }
  return true;
}

function validateSkill(data) {
  const requiredFields = ['name', 'category', 'proficiency'];
  for (let field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') {
      return false;
    }
  }
  if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(data.proficiency)) {
    return false;
  }
  return true;
}

// Passport Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await usersCollection.findOne({ googleId: profile.id });

    if (!user) {
      user = {
        googleId: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        photos: profile.photos,
        createdAt: new Date()
      };
      await usersCollection.insertOne(user);
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersCollection.findOne({ googleId: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to Professional Portfolio API!</h1>
    <p><a href="/auth/google">Login with Google</a></p>
    <p><a href="/api-docs">View API Documentation</a></p>
  `);
});

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.googleId, displayName: req.user.displayName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.send(`
      <h1>Hello, ${req.user.displayName}!</h1>
      <p>Your JWT token:</p>
      <pre>${token}</pre>
      <p>Use this token to authenticate API requests.</p>
      <p><a href="/api-docs">View API Documentation</a></p>
    `);
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Professional data route (existing)
app.get('/professional', (req, res) => {
  try {
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
    res.status(200).json(professionalData);
  } catch (error) {
    console.error('Error fetching professional data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PROJECTS CRUD OPERATIONS

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await projectsCollection.find({}).toArray();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET project by ID
app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }

    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// CREATE new project
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;
    
    if (!validateProject(projectData)) {
      return res.status(400).json({ 
        error: 'Validation failed. Required fields: title, description, technologies, status' 
      });
    }

    const newProject = {
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await projectsCollection.insertOne(newProject);
    
    if (result.acknowledged) {
      const createdProject = await projectsCollection.findOne({ _id: result.insertedId });
      res.status(201).json(createdProject);
    } else {
      res.status(500).json({ error: 'Failed to create project' });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// UPDATE project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }

    if (!validateProject(updateData)) {
      return res.status(400).json({ 
        error: 'Validation failed. Required fields: title, description, technologies, status' 
      });
    }

    const updatedProject = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await projectsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProject }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid project ID format' });
    }

    const result = await projectsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// SKILLS CRUD OPERATIONS

// GET all skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await skillsCollection.find({}).toArray();
    res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// GET skill by ID
app.get('/api/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid skill ID format' });
    }

    const skill = await skillsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ error: 'Failed to fetch skill' });
  }
});

// CREATE new skill
app.post('/api/skills', async (req, res) => {
  try {
    const skillData = req.body;
    
    if (!validateSkill(skillData)) {
      return res.status(400).json({ 
        error: 'Validation failed. Required fields: name, category, proficiency (Beginner/Intermediate/Advanced/Expert)' 
      });
    }

    const newSkill = {
      ...skillData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await skillsCollection.insertOne(newSkill);
    
    if (result.acknowledged) {
      const createdSkill = await skillsCollection.findOne({ _id: result.insertedId });
      res.status(201).json(createdSkill);
    } else {
      res.status(500).json({ error: 'Failed to create skill' });
    }
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// UPDATE skill
app.put('/api/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid skill ID format' });
    }

    if (!validateSkill(updateData)) {
      return res.status(400).json({ 
        error: 'Validation failed. Required fields: name, category, proficiency (Beginner/Intermediate/Advanced/Expert)' 
      });
    }

    const updatedSkill = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await skillsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedSkill }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const skill = await skillsCollection.findOne({ _id: new ObjectId(id) });
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// DELETE skill
app.delete('/api/skills/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid skill ID format' });
    }

    const result = await skillsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Protected API route example (verify JWT)
app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    res.json({ message: 'Protected profile data', user: decoded });
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await client.close();
  process.exit(0);
});

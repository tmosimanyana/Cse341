let projectsCollection;

function setProjectsCollection(collection) {
  projectsCollection = collection;
}

function validateProject(data) {
  return (
    data.title && typeof data.title === 'string' &&
    data.description && typeof data.description === 'string' &&
    data.url && typeof data.url === 'string'
  );
}

async function getAllProjects() {
  return await projectsCollection.find().toArray();
}

async function getProjectById(id) {
  const { ObjectId } = require('mongodb');
  return await projectsCollection.findOne({ _id: new ObjectId(id) });
}

async function createProject(data) {
  if (!validateProject(data)) throw new Error('Validation failed');
  return await projectsCollection.insertOne(data);
}

async function updateProject(id, data) {
  const { ObjectId } = require('mongodb');
  if (!validateProject(data)) throw new Error('Validation failed');
  return await projectsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
}

async function deleteProject(id) {
  const { ObjectId } = require('mongodb');
  return await projectsCollection.deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  setProjectsCollection,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

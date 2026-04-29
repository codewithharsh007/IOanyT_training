// Ownership checks for freelancer and client scoped resources.
const assertOwnership = (resource, userId) => {
  if (!resource || resource.freelancerId.toString() !== userId) {
    const error = new Error('Not found');
    error.name = 'AppError';
    error.statusCode = 404;
    throw error;
  }
};

const assertClientAccess = (resource, clientId) => {
  if (!resource || resource.clientId.toString() !== clientId) {
    const error = new Error('Not found');
    error.name = 'AppError';
    error.statusCode = 404;
    throw error;
  }
};

module.exports = { assertOwnership, assertClientAccess };

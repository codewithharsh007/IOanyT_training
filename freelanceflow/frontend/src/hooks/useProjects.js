// Projects data hook.
import { useCallback, useState } from 'react';
import { fetchProjects, createProject, updateProject, archiveProject, getProjectById } from '../services/api';

const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProjects = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchProjects(params);
      setProjects(data.projects || []);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (payload) => createProject(payload), []);
  const editProject = useCallback(async (projectId, payload) => updateProject(projectId, payload), []);
  const archive = useCallback(async (projectId) => archiveProject(projectId), []);
  const getById = useCallback(async (projectId) => getProjectById(projectId), []);

  return {
    projects,
    loading,
    error,
    fetchProjects: loadProjects,
    createProject: addProject,
    updateProject: editProject,
    archiveProject: archive,
    getProjectById: getById,
  };
};

export default useProjects;

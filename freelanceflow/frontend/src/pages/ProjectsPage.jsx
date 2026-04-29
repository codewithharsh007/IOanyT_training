// Projects list page.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PrimaryButton from '../components/common/PrimaryButton';
import SearchInput from '../components/common/SearchInput';
import FilterTabBar from '../components/common/FilterTabBar';
import EmptyStateBlock from '../components/common/EmptyStateBlock';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectCreateModal from '../components/projects/ProjectCreateModal';
import useProjects from '../hooks/useProjects';

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Draft', value: 'Draft' },
  { label: 'On Hold', value: 'OnHold' },
];

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, loading, error, fetchProjects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    await fetchProjects({ search: value, status: activeStatus === 'all' ? undefined : activeStatus });
  };

  const handleStatusChange = async (status) => {
    setActiveStatus(status);
    await fetchProjects({ search: searchTerm, status: status === 'all' ? undefined : status });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
            <p className="text-sm text-slate-600">Keep projects organized and on track.</p>
          </div>
          <PrimaryButton onClick={() => setIsModalOpen(true)}>Create Project</PrimaryButton>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="max-w-sm w-full">
            <SearchInput value={searchTerm} onChange={handleSearch} placeholder="Search projects" />
          </div>
          <FilterTabBar tabs={statusTabs} activeTab={activeStatus} onChange={handleStatusChange} />
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        {projects.length === 0 && !loading ? (
          <EmptyStateBlock
            illustration="project"
            heading="No projects yet"
            subtext="Create your first project to track work and billing."
            actionLabel="Create Project"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => navigate(`/projects/${project._id}`)}
              />
            ))}
          </div>
        )}

        <ProjectCreateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => fetchProjects({ search: searchTerm, status: activeStatus === 'all' ? undefined : activeStatus })}
        />
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;

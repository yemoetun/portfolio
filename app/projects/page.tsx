import ProjectsClient from './ProjectsClient'
import { getProjects } from '@/lib/db'

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsClient initialProjects={projects as any} />
}

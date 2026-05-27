import AboutClient from './AboutClient'
import { getContent } from '@/lib/db'

export default async function AboutPage() {
  const [bio, hardSkills, softSkills, languages, photo] = await Promise.all([
    getContent('about_full'),
    getContent('hard_skills'),
    getContent('soft_skills'),
    getContent('languages'),
    getContent('about_photo'),
  ])

  return (
    <AboutClient
      initialBio={bio}
      initialHardSkills={hardSkills}
      initialSoftSkills={softSkills}
      initialLanguages={languages}
      initialPhoto={photo}
    />
  )
}

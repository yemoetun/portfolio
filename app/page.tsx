import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ProjectsCarousel from '@/components/ProjectsCarousel'
import AchievementsSection from '@/components/AchievementsSection'
import ContactSection from '@/components/ContactSection'
import FadeSection from '@/components/FadeSection'
import { getProjects, getAchievements, getContent } from '@/lib/db'

export default async function Home() {
  const [projects, achievements, aboutShort, homePhoto, heroTitle, heroSubtitle] = await Promise.all([
    getProjects(),
    getAchievements(),
    getContent('about_short'),
    getContent('home_photo'),
    getContent('hero_title'),
    getContent('hero_subtitle'),
  ])

  return (
    <main>
      <FadeSection><HeroSection initialTitle={heroTitle} initialSubtitle={heroSubtitle} /></FadeSection>
      <FadeSection><AboutSection initialBio={aboutShort} initialPhoto={homePhoto} /></FadeSection>
      <FadeSection><ProjectsCarousel initialProjects={projects as any} /></FadeSection>
      <FadeSection><AchievementsSection initialAchievements={achievements as any} /></FadeSection>
      <ContactSection />
    </main>
  )
}

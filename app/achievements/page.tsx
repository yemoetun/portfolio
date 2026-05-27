import AchievementsClient from './AchievementsClient'
import { getAchievements } from '@/lib/db'

export default async function AchievementsPage() {
  const achievements = await getAchievements()
  return <AchievementsClient initialAchievements={achievements as any} />
}

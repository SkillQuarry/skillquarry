import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { ContactForm } from '../components/support/ContactForm'

export function ContactPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Contact & Help" description="Send feedback, report a technical issue, or contact the SkillQuarry team." />
      <Card title="Contact us" subtitle="Your authenticated name and email are attached automatically.">
        <ContactForm />
      </Card>
    </div>
  )
}

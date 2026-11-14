import CrudEditor from '../components/CrudEditor'

export default function ExperienceAdmin() {
  return (
    <CrudEditor
      table="experience"
      title="Experience & Certifications"
      description="Internships, work, workshops, certifications, and achievements."
      fields={[
        { name: 'kind', label: 'Type', type: 'select', required: true, options: ['internship', 'work', 'workshop', 'certification', 'achievement'] },
        { name: 'title', label: 'Title', required: true },
        { name: 'organization', label: 'Organization / issuer' },
        { name: 'start_date', label: 'Start' },
        { name: 'end_date', label: 'End' },
        { name: 'description', type: 'textarea' },
        { name: 'link_url', label: 'Certificate / link URL' },
        { name: 'sort_order', type: 'number', label: 'Sort order' },
        { name: 'visible', type: 'checkbox', label: 'Visible on site' },
      ]}
      columns={['kind', 'title', 'organization', 'start_date', 'end_date', 'visible']}
    />
  )
}

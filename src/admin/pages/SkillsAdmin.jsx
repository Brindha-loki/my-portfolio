import CrudEditor from '../components/CrudEditor'

export default function SkillsAdmin() {
  return (
    <CrudEditor
      table="skills"
      title="Skills"
      description="Add, edit, and remove skills shown on the Skills page."
      fields={[
        { name: 'name', label: 'Skill name', required: true },
        { name: 'category', label: 'Category', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'level', type: 'number', label: 'Proficiency (1-5)', min: 1, max: 5 },
        { name: 'sort_order', type: 'number', label: 'Sort order' },
        { name: 'visible', type: 'checkbox', label: 'Visible on site' },
      ]}
      columns={['name', 'category', 'level', 'visible']}
    />
  )
}

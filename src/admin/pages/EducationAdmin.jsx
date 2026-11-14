import CrudEditor from '../components/CrudEditor'

export default function EducationAdmin() {
  return (
    <CrudEditor
      table="education"
      title="Education"
      description="Degrees, institutions, and academic timeline."
      fields={[
        { name: 'degree', label: 'Degree / programme', required: true },
        { name: 'institution', label: 'Institution', required: true },
        { name: 'field', label: 'Field of study' },
        { name: 'start_date', label: 'Start (e.g. 2023)' },
        { name: 'end_date', label: 'End (e.g. 2027 or Expected 2027)' },
        { name: 'description', type: 'textarea' },
        { name: 'coursework', type: 'tags', label: 'Coursework (comma-separated)' },
        { name: 'sort_order', type: 'number', label: 'Sort order' },
        { name: 'visible', type: 'checkbox', label: 'Visible on site' },
      ]}
      columns={['degree', 'institution', 'start_date', 'end_date', 'visible']}
    />
  )
}

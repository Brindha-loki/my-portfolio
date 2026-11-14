import CrudEditor from '../components/CrudEditor'

export default function ProjectsAdmin() {
  return (
    <CrudEditor
      table="projects"
      title="Projects"
      description="Manage portfolio projects. Mark featured projects to show them on the home page."
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'problem', type: 'textarea', label: 'Problem statement' },
        { name: 'technologies', type: 'tags', label: 'Technologies' },
        { name: 'image_url', type: 'image', label: 'Screenshot / image' },
        { name: 'github_url', label: 'GitHub URL' },
        { name: 'demo_url', label: 'Live demo URL' },
        { name: 'featured', type: 'checkbox', label: 'Featured (shows on home)' },
        { name: 'sort_order', type: 'number', label: 'Sort order' },
        { name: 'visible', type: 'checkbox', label: 'Visible on site' },
      ]}
      columns={[
        'title',
        'category',
        { key: 'featured', label: 'Featured', render: (r) => (r.featured ? '★' : '') },
        { key: 'visible', label: 'Visible', render: (r) => (r.visible ? 'Yes' : 'No') },
      ]}
    />
  )
}

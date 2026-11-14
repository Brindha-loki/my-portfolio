import CrudEditor from '../components/CrudEditor'

export default function SocialAdmin() {
  return (
    <CrudEditor
      table="social_links"
      title="Social Links"
      description="Links shown in the footer and on the contact page."
      fields={[
        { name: 'label', label: 'Label (e.g. LinkedIn, GitHub)', required: true },
        { name: 'url', label: 'URL', required: true },
        { name: 'icon', label: 'Icon hint (link, github, linkedin)' },
        { name: 'sort_order', type: 'number', label: 'Sort order' },
        { name: 'visible', type: 'checkbox', label: 'Visible on site' },
      ]}
      columns={['label', 'url', 'sort_order', 'visible']}
      orderBy="sort_order"
    />
  )
}

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      description: 'e.g. "Closed Monday for maintenance." or "New yuzu matcha is here."',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Turn this on to show the banner on the site. Turn it off when it\'s stale.',
      initialValue: false,
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Optional — makes the banner clickable.',
    }),
  ],
  preview: {
    select: {title: 'message', active: 'active'},
    prepare({title, active}) {
      return {
        title,
        subtitle: active ? 'Active' : 'Not shown',
      }
    },
  },
})

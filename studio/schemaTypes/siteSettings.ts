import {defineField, defineType} from 'sanity'

const dayOfWeekNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export default defineType({
  name: 'siteSettings',
  title: 'Shop Info',
  type: 'document',
  fields: [
    defineField({
      name: 'shopName',
      title: 'Shop name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One line under the shop name on the homepage.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        defineField({name: 'street', title: 'Street', type: 'string'}),
        defineField({name: 'city', title: 'City', type: 'string'}),
        defineField({name: 'state', title: 'State', type: 'string'}),
        defineField({name: 'zip', title: 'ZIP', type: 'string'}),
      ],
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Google Maps link',
      type: 'url',
      description: 'Used for the "Directions" button.',
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: ['instagram', 'facebook', 'tiktok', 'yelp', 'google'],
              },
            }),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'orderingLinks',
      title: 'Ordering links',
      description: 'DoorDash, Toast, Square, etc. Shown as "Order" buttons.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'orderingLink',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'array',
      description: 'Turn this off when you sell out. Turn it back on tomorrow.',
      validation: (rule) => rule.max(7),
      of: [
        {
          type: 'object',
          name: 'dayHours',
          fields: [
            defineField({
              name: 'dayOfWeek',
              title: 'Day',
              type: 'number',
              options: {
                list: dayOfWeekNames.map((name, index) => ({title: name, value: index})),
              },
              validation: (rule) => rule.required().min(0).max(6),
            }),
            defineField({
              name: 'closed',
              title: 'Closed all day',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'open',
              title: 'Opens at',
              type: 'string',
              description: '24h time, e.g. 09:00',
              hidden: ({parent}) => Boolean(parent?.closed),
            }),
            defineField({
              name: 'close',
              title: 'Closes at',
              type: 'string',
              description: '24h time, e.g. 17:00',
              hidden: ({parent}) => Boolean(parent?.closed),
            }),
          ],
          preview: {
            select: {dayOfWeek: 'dayOfWeek', closed: 'closed', open: 'open', close: 'close'},
            prepare({dayOfWeek, closed, open, close}) {
              return {
                title: dayOfWeekNames[dayOfWeek] ?? 'Day',
                subtitle: closed ? 'Closed' : `${open ?? '?'}–${close ?? '?'}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'holidayNote',
      title: 'Holiday note',
      type: 'string',
      description: 'e.g. "Closed Dec 24–26." Shown alongside regular hours.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({name: 'metaTitle', title: 'Meta title', type: 'string'}),
        defineField({name: 'metaDescription', title: 'Meta description', type: 'text'}),
        defineField({name: 'ogImage', title: 'Social share image', type: 'image'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'shopName', subtitle: 'tagline'},
  },
})

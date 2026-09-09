import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Dollars, e.g. 4.5. Formatted on the site — do not include "$".',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'priceVariants',
      title: 'Price variants',
      description: 'e.g. 12oz / 16oz. Leave empty for a single price.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'priceVariant',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'price', title: 'Price', type: 'number'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'menuCategory'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Optional — most items won\'t have one, and that\'s fine.',
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      description: 'Turn this off when you sell out. Turn it back on tomorrow.',
      initialValue: true,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: ['vegan', 'gluten-free', 'seasonal', 'new'],
      },
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers show first within the category.',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'category.title', media: 'image', available: 'available'},
    prepare({title, subtitle, media, available}) {
      return {
        title: available === false ? `${title} (86'd)` : title,
        subtitle,
        media,
      }
    },
  },
})

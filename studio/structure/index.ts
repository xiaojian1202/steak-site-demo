import type {StructureResolver} from 'sanity/structure'

// Collapses the default document-type list to the four things a
// non-technical owner needs: Menu, Hours, Announcement, Shop Info.
// They should never see a raw document type list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Menu')
        .child(
          S.list()
            .title('Menu')
            .items([
              S.listItem()
                .title('Categories')
                .child(S.documentTypeList('menuCategory').title('Categories')),
              S.listItem()
                .title('Items')
                .child(S.documentTypeList('menuItem').title('Items')),
            ]),
        ),
      S.listItem()
        .title('Announcement')
        .child(S.documentTypeList('announcement').title('Announcement')),
      S.listItem()
        .title('Shop Info & Hours')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings'),
        ),
      S.listItem()
        .title('Pages')
        .child(S.documentTypeList('page').title('Pages')),
    ])

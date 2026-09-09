export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  shopName,
  tagline,
  logo,
  phone,
  email,
  address,
  mapsUrl,
  social,
  orderingLinks,
  hours,
  holidayNote,
  seo
}`

export const activeAnnouncementQuery = /* groq */ `*[_type == "announcement" && active == true] | order(_updatedAt desc)[0]{
  message,
  link
}`

export const menuQuery = /* groq */ `*[_type == "menuCategory"] | order(order asc){
  _id,
  title,
  description,
  "items": *[_type == "menuItem" && references(^._id)] | order(order asc){
    _id,
    name,
    description,
    price,
    priceVariants,
    image,
    available,
    tags
  }
}`

// Use with sanityClient.fetch(pageQuery, { slug }) — params keep the slug
// out of the query string.
export const pageQuery = /* groq */ `*[_type == "page" && slug.current == $slug][0]{
  title,
  slug,
  heroImage,
  body
}`

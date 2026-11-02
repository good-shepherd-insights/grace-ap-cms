import config from '@payload-config'
import { getPayload } from 'payload'

import { brandGraphic } from '../../../admin/brandGraphic'

// The admin's browser-tab icon: the site global's brand.favicon (brand.logo if
// unset), so the CMS tab shows the same icon as the site. The Location is a
// path when the upload is served by this CMS, so the redirect stays on
// whichever host (LAN, tunnel, domain) the admin was opened on.
export async function GET() {
  const payload = await getPayload({ config })
  const graphic = await brandGraphic(payload, 'favicon')
  if (!graphic) return new Response(null, { status: 404 })

  const target = new URL(graphic.src, 'http://cms.local')
  const location = target.pathname.startsWith('/api/') ? `${target.pathname}${target.search}` : graphic.src
  return new Response(null, { status: 307, headers: { Location: location, 'Cache-Control': 'no-store' } })
}

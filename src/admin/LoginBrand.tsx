import type { Payload } from 'payload'

import { siteGlobalSlug } from '../config/runtime'

type FooterBlock = { blockType?: string; slogan?: string | null; accentWord?: string | null }
type ComponentRef = { component?: { sections?: FooterBlock[] | null } | number | string | null }

// The slogan comes from the site footer's own block, so the login panel never
// carries a second copy of the site's words.
async function footerSlogan(payload: Payload): Promise<FooterBlock | null> {
  const site = await payload.findGlobal({ slug: siteGlobalSlug as never, depth: 2 })
  const components = (site as { components?: ComponentRef[] | null }).components ?? []
  const sections = components.flatMap((c) => (c.component && typeof c.component === 'object' ? c.component.sections ?? [] : []))
  return sections.find((s) => s.blockType === 'siteFooter' && s.slogan) ?? null
}

function SloganLine({ line, accent }: { line: string; accent?: string | null }) {
  const at = accent ? line.toLowerCase().indexOf(accent.toLowerCase()) : -1
  if (!accent || at < 0) return <span>{line}</span>
  return (
    <span>
      {line.slice(0, at)}
      <span className="grace-login-accent">{line.slice(at, at + accent.length)}</span>
      {line.slice(at + accent.length)}
    </span>
  )
}

// Login screen per the Grace canvas (CMS — Login): a black slogan panel beside
// Payload's own form, which keeps all of its sign-in, reset and passkey logic.
// Rendered only on the login view, so these styles touch nothing else.
export default async function LoginBrand({ payload }: { payload: Payload }) {
  const footer = await footerSlogan(payload)

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter:wght@400;500;600&display=swap"
        precedence="default"
      />
      <style>{CSS}</style>
      <aside className="grace-login-panel" aria-hidden="true">
        {footer?.slogan && (
          <p className="grace-login-slogan">
            {footer.slogan.split('\n').map((line, i) => (
              <SloganLine key={i} line={line} accent={footer.accentWord} />
            ))}
          </p>
        )}
      </aside>
      <h1 className="grace-login-heading">Sign in</h1>
    </>
  )
}

const CSS = `
.login.template-minimal { min-height: 100vh; padding: 0; display: grid; grid-template-columns: 1fr 1fr; background: #ffffff; color: #000000; }
.login.template-minimal .template-minimal__wrap { grid-column: 2; align-self: center; justify-self: center; width: min(400px, calc(100% - 96px)); max-width: none; margin: 48px 0; padding: 0; display: flex; flex-direction: column; gap: 40px; font-family: 'Inter', Arial, sans-serif; }
.grace-login-panel { position: fixed; top: 0; bottom: 0; left: 0; width: 50%; box-sizing: border-box; padding: 48px; display: flex; flex-direction: column; justify-content: flex-end; background: #000000; color: #ffffff; }
.grace-login-slogan { margin: 0; display: flex; flex-direction: column; font-family: 'Archivo', Arial, sans-serif; font-weight: 900; font-stretch: 125%; font-size: clamp(56px, 6.7vw, 96px); line-height: 0.86; letter-spacing: -0.01em; text-transform: uppercase; }
.grace-login-accent { color: #ee0a0a; }
.login .login__brand { margin: 0; display: flex; justify-content: flex-start; }
.login .login__brand img { max-height: 52px !important; margin: 0 !important; }
.grace-login-heading { margin: 0; font-family: 'Archivo', Arial, sans-serif; font-weight: 900; font-stretch: 125%; font-size: 48px; line-height: 0.86; letter-spacing: -0.01em; text-transform: uppercase; }
.login .login__form, .login .login__form__inputWrap { display: flex; flex-direction: column; gap: 20px; margin: 0; }
.login .login__form .field-type { margin: 0; }
.login .field-label { margin: 0 0 8px; font: 500 14px/1.4 'Inter', Arial, sans-serif; color: #000000; }
.login .field-label .required { color: #ee0a0a; }
.login .field-type input { height: 48px; padding: 0 14px; border: 1px solid #000000; border-radius: 0; background: #ffffff; box-shadow: none; color: #000000; font: 400 16px 'Inter', Arial, sans-serif; }
.login .field-type input:focus, .login .field-type input:focus-visible { outline: 2px solid #ee0a0a; outline-offset: 1px; box-shadow: none; }
.login .login__form > a { align-self: flex-start; font: 400 14px/1.4 'Inter', Arial, sans-serif; color: #000000; text-decoration: underline; }
.login .login__form > a:hover { color: #ee0a0a; }
.login .form-submit { margin: 0; }
.login .btn { width: 100%; height: 52px; margin: 0; border-radius: 0; font: 600 15px 'Inter', Arial, sans-serif; transition: background-color 0.2s ease, color 0.2s ease; }
.login .form-submit .btn { border: 0; background: #000000; color: #ffffff; }
.login .form-submit .btn:hover, .login .form-submit .btn:focus-visible { background: #ee0a0a; color: #ffffff; }
.passkey-login { display: flex; flex-direction: column; gap: 12px; margin-top: -28px; }
.passkey-login__or { display: flex; align-items: center; gap: 12px; color: rgba(0, 0, 0, 0.5); font: 500 13px 'Inter', Arial, sans-serif; }
.passkey-login__or::before, .passkey-login__or::after { content: ''; flex: 1; height: 1px; background: rgba(0, 0, 0, 0.14); }
.passkey-login .btn { border: 0; box-shadow: inset 0 0 0 1px #000000; background: transparent; color: #000000; }
.passkey-login .btn:hover, .passkey-login .btn:focus-visible { background: #000000; color: #ffffff; }
@media (max-width: 767px) {
  .login.template-minimal { display: block; }
  .login.template-minimal .template-minimal__wrap { justify-self: stretch; width: auto; margin: 0; padding: 0 24px 48px; gap: 32px; }
  .grace-login-panel { position: static; order: -1; width: auto; margin: 0 -24px 8px; padding: 24px; gap: 32px; }
  .grace-login-slogan { font-size: 44px; }
  .passkey-login { margin-top: -20px; }
}
`

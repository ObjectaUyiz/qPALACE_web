import rawSite from '@/data/site.json'
import { getPIs, getPersonBySlug, type Person } from '@/data/people'

type SiteContactConfig = {
  intro?: string
  personSlug?: string
}

type SiteConfig = typeof rawSite & {
  contact?: SiteContactConfig
}

const siteConfig = rawSite as SiteConfig

const primaryContact: Person | undefined =
  (siteConfig.contact?.personSlug && getPersonBySlug(siteConfig.contact.personSlug)) || getPIs()[0]

const contactWebsite =
  primaryContact?.profiles?.personalWebsite || primaryContact?.website || undefined

export const site = {
  ...siteConfig,
  primaryContact,
  contact: {
    ...siteConfig.contact,
    person: primaryContact,
    role: primaryContact?.type === 'pi' ? 'Principal Investigator' : primaryContact?.title,
    website: contactWebsite,
    email: primaryContact?.email,
    phone: primaryContact?.phone,
    office: primaryContact?.office,
  },
  hero: {
    ...siteConfig.hero,
    primaryCta: siteConfig.hero.primaryCta
      ? {
          ...siteConfig.hero.primaryCta,
          href: primaryContact?.email ? `mailto:${primaryContact.email}` : siteConfig.hero.primaryCta.href,
        }
      : undefined,
  },
}

export default site

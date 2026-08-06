import { neon } from '@neondatabase/serverless';
import {
  DocumentItem,
  GalleryItem,
  SectionContent,
  ContactInquiry,
  HeroSlide,
  PhysicalEducationDirector
} from '../context/CMSContext';
import { extractAndStoreImages } from './persistentStorage';

const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_Ko7RbCqA5lsG@ep-winter-bar-azhp79jj.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export const getSql = () => {
  const meta = import.meta as any;
  const connectionString =
    (typeof meta !== 'undefined' && meta.env?.VITE_DATABASE_URL) ||
    DEFAULT_DATABASE_URL;
  return neon(connectionString);
};

// Database helper queries for Documents

export async function fetchDocumentsFromDB(): Promise<DocumentItem[]> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM documents ORDER BY created_at DESC, sr_no DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      srNo: r.sr_no || 1,
      title: r.title,
      category: r.category,
      date: r.date,
      viewUrl: r.view_url,
      downloadUrl: r.download_url,
      showOnNewsMarquee: Boolean(r.show_on_news_marquee)
    }));
  } catch (err) {
    console.warn('Neon DB fetchDocuments error:', err);
    return [];
  }
}

export async function saveDocumentToDB(doc: DocumentItem): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO documents (id, sr_no, title, category, date, view_url, download_url, show_on_news_marquee)
      VALUES (${doc.id}, ${doc.srNo}, ${doc.title}, ${doc.category}, ${doc.date}, ${doc.viewUrl}, ${doc.downloadUrl}, ${Boolean(doc.showOnNewsMarquee)})
      ON CONFLICT (id) DO UPDATE SET
        sr_no = EXCLUDED.sr_no,
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        date = EXCLUDED.date,
        view_url = EXCLUDED.view_url,
        download_url = EXCLUDED.download_url,
        show_on_news_marquee = EXCLUDED.show_on_news_marquee;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB saveDocument error:', err);
    return false;
  }
}

export async function deleteDocumentFromDB(id: string): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`DELETE FROM documents WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.error('Neon DB deleteDocument error:', err);
    return false;
  }
}

// Database helper queries for Gallery

export async function fetchGalleryFromDB(): Promise<GalleryItem[]> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM gallery ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      imageUrl: r.image_url,
      description: r.description || '',
      date: r.date || ''
    }));
  } catch (err) {
    console.warn('Neon DB fetchGallery error:', err);
    return [];
  }
}

export async function saveGalleryItemToDB(item: GalleryItem): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO gallery (id, title, category, image_url, description, date)
      VALUES (${item.id}, ${item.title}, ${item.category}, ${item.imageUrl}, ${item.description}, ${item.date})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        image_url = EXCLUDED.image_url,
        description = EXCLUDED.description,
        date = EXCLUDED.date;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB saveGalleryItem error:', err);
    return false;
  }
}

export async function deleteGalleryItemFromDB(id: string): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`DELETE FROM gallery WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.error('Neon DB deleteGalleryItem error:', err);
    return false;
  }
}

// Database helper queries for Hero Slides

export async function fetchHeroSlidesFromDB(): Promise<HeroSlide[]> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM hero_slides ORDER BY slide_order ASC, created_at ASC`;
    return rows.map((r: any) => ({
      id: r.id,
      eyebrow: r.eyebrow || '',
      title: r.title || '',
      subtitle: r.subtitle || '',
      image: r.media_url || r.image || '',
      ctaText: r.cta_text || 'View Schedule',
      ctaLink: r.cta_link || '/en/documents'
    }));
  } catch (err) {
    console.warn('Neon DB fetchHeroSlides error:', err);
    return [];
  }
}

export async function saveHeroSlideToDB(
  slide: HeroSlide,
  orderIndex: number = 0
): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO hero_slides (id, slide_order, eyebrow, title, subtitle, media_url, cta_text, cta_link)
      VALUES (${slide.id}, ${orderIndex}, ${slide.eyebrow || ''}, ${slide.title || ''}, ${slide.subtitle || ''}, ${slide.image || ''}, ${slide.ctaText || ''}, ${slide.ctaLink || ''})
      ON CONFLICT (id) DO UPDATE SET
        slide_order = EXCLUDED.slide_order,
        eyebrow = EXCLUDED.eyebrow,
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        media_url = EXCLUDED.media_url,
        cta_text = EXCLUDED.cta_text,
        cta_link = EXCLUDED.cta_link;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB saveHeroSlide error:', err);
    return false;
  }
}

export async function deleteHeroSlideFromDB(id: string): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`DELETE FROM hero_slides WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.error('Neon DB deleteHeroSlide error:', err);
    return false;
  }
}

// Database helper queries for Physical Education Directors

export async function fetchPEDirectorsFromDB(): Promise<PhysicalEducationDirector[]> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM physical_education_directors ORDER BY created_at ASC`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      photo: r.photo,
      mobile: r.mobile || '',
      email: r.email || '',
      collegeAddress: r.college_address || ''
    }));
  } catch (err) {
    console.warn('Neon DB fetchPEDirectors error:', err);
    return [];
  }
}

export async function savePEDirectorToDB(director: PhysicalEducationDirector): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO physical_education_directors (id, name, photo, mobile, email, college_address)
      VALUES (${director.id}, ${director.name}, ${director.photo}, ${director.mobile}, ${director.email}, ${director.collegeAddress})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        photo = EXCLUDED.photo,
        mobile = EXCLUDED.mobile,
        email = EXCLUDED.email,
        college_address = EXCLUDED.college_address;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB savePEDirector error:', err);
    return false;
  }
}

export async function deletePEDirectorFromDB(id: string): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`DELETE FROM physical_education_directors WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.error('Neon DB deletePEDirector error:', err);
    return false;
  }
}

// Database helper queries for Contact Inquiries

export async function fetchContactInquiriesFromDB(): Promise<ContactInquiry[]> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM contact_inquiries ORDER BY submitted_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone || '',
      college: r.college || '',
      subject: r.subject || '',
      message: r.message || '',
      submittedAt: r.submitted_at || new Date().toISOString(),
      status: r.status as 'Pending' | 'Answered'
    }));
  } catch (err) {
    console.warn('Neon DB fetchContactInquiries error:', err);
    return [];
  }
}

export async function saveContactInquiryToDB(inquiry: ContactInquiry): Promise<boolean> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO contact_inquiries (id, name, email, phone, college, subject, message, submitted_at, status)
      VALUES (${inquiry.id}, ${inquiry.name}, ${inquiry.email}, ${inquiry.phone || ''}, ${inquiry.college || ''}, ${inquiry.subject || ''}, ${inquiry.message || ''}, ${inquiry.submittedAt}, ${inquiry.status})
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB saveContactInquiry error:', err);
    return false;
  }
}

// Database helper queries for Generic Site Settings (Active Theme, Header Config, etc.)

export async function fetchSiteSettingFromDB<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT value FROM site_settings WHERE key = ${key}`;
    if (rows && rows.length > 0 && rows[0].value) {
      return rows[0].value as T;
    }
    return defaultValue;
  } catch (err) {
    console.warn(`Neon DB fetchSiteSetting error for key [${key}]:`, err);
    return defaultValue;
  }
}

export async function saveSiteSettingToDB(key: string, value: any): Promise<boolean> {
  try {
    const sql = getSql();
    const jsonStr = JSON.stringify(value);
    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${key}, ${jsonStr}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = NOW();
    `;
    // Bust the TTL cache so next page load fetches fresh data from DB
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pczsc_hydrate_ts');
    }
    return true;
  } catch (err) {
    console.error(`Neon DB saveSiteSetting error for key [${key}]:`, err);
    return false;
  }
}


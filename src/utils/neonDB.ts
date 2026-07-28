import { neon } from '@neondatabase/serverless';
import { DocumentItem, GalleryItem, SectionContent, ContactInquiry } from '../context/CMSContext';

const DEFAULT_DATABASE_URL =
  'postgresql://neondb_owner:npg_7SEFtVy4ieJb@ep-crimson-silence-aufuup71-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const getSql = () => {
  const meta = import.meta as any;
  const connectionString =
    (typeof meta !== 'undefined' && meta.env?.VITE_DATABASE_URL) ||
    DEFAULT_DATABASE_URL;
  return neon(connectionString);
};

// Database helper queries

export async function fetchDocumentsFromDB(): Promise<DocumentItem[]> {
  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM documents ORDER BY sr_no ASC, created_at DESC`;
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

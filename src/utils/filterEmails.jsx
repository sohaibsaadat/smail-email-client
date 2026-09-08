// Helper to strip HTML tags from body string
const stripHtml = (html) => {
  if (!html) return '';
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }
  return html.replace(/<[^>]*>?/gm, '');
};

/**
 * Filter emails according to route/folder AND search query.
 *
 * @param {Array} emails - Complete emails array from state/context/Redux
 * @param {string} pathname - Current window.location.pathname (e.g. "/inbox", "/sent")
 * @param {string} searchQuery - Search bar query text
 */
export const filterEmails = (emails = [], pathname = '', searchQuery = '') => {
  if (!Array.isArray(emails)) return [];

  // 1. Identify active route from URL path
  const path = pathname.toLowerCase();

  let folderFiltered = emails;

  if (path.includes('/inbox')) {
    // API folder value casing checks: "Inbox" or "inbox"
    folderFiltered = emails.filter(
      (e) => e.folder === 'Inbox' || e.folder === 'inbox' && e.is_deleted === false
    );
  } else if (path.includes('/sent')) {
    folderFiltered = emails.filter(
      (e) => e.folder === 'Sent' || e.folder === 'sent' && e.is_deleted === false
    );
  }  else if (path.includes('/trash')) {
    folderFiltered = emails.filter(
      (e) => e.is_deleted === true || e.folder === 'Trash' || e.folder === 'trash' 
    );
  } else if (path.includes('/starred')) {
    folderFiltered = emails.filter((e) => e.is_starred === true);
  } else if (path.includes('/all-mail')) {
    // Non-deleted emails for All Mail
    folderFiltered = emails.filter((e) => !e.is_deleted);
  }

  // 2. If search query is empty, return folder-filtered emails
  if (!searchQuery || !searchQuery.trim()) {
    return folderFiltered;
  }

  // 3. Extract Gmail-style filters (from:, to:, subject:, body:, has:attachment)
  const filterRegex = /(from|to|subject|body|has):(\S+)/gi;
  const parsedFilters = {};
  let match;

  while ((match = filterRegex.exec(searchQuery)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].toLowerCase();
    parsedFilters[key] = value;
  }

  const remainingText = searchQuery
    .replace(filterRegex, '')
    .trim()
    .toLowerCase();

  // 4. Apply search criteria over the folderFiltered list
  return folderFiltered.filter((email) => {
    // from: filter
    if (parsedFilters.from) {
      const fromQuery = parsedFilters.from;
      const senderName = (email.sender || '').toLowerCase();
      const senderEmail = (email.sender_email || '').toLowerCase();

      if (!senderName.includes(fromQuery) && !senderEmail.includes(fromQuery)) {
        return false;
      }
    }

    // to: filter
    if (parsedFilters.to) {
      const toQuery = parsedFilters.to;
      const hasMatchingRecipient = (email.recipients || []).some((r) => {
        const rName = (r.name || '').toLowerCase();
        const rEmail = (r.email || '').toLowerCase();
        return r.type === 'to' && (rName.includes(toQuery) || rEmail.includes(toQuery));
      });

      if (!hasMatchingRecipient) return false;
    }

    // subject: filter
    if (parsedFilters.subject) {
      const subjectText = (email.subject || '').toLowerCase();
      if (!subjectText.includes(parsedFilters.subject)) return false;
    }

    // body: filter
    if (parsedFilters.body) {
      const plainBody = stripHtml(email.body).toLowerCase();
      if (!plainBody.includes(parsedFilters.body)) return false;
    }

    // has:attachment filter
    if (parsedFilters.has === 'attachment') {
      const hasFiles = Array.isArray(email.attachments) && email.attachments.length > 0;
      if (!hasFiles) return false;
    }

    // Unstructured query matching across all text fields
    if (remainingText) {
      const senderName = (email.sender || '').toLowerCase();
      const senderEmail = (email.sender_email || '').toLowerCase();
      const subjectText = (email.subject || '').toLowerCase();
      const plainBody = stripHtml(email.body).toLowerCase();

      const matches =
        senderName.includes(remainingText) ||
        senderEmail.includes(remainingText) ||
        subjectText.includes(remainingText) ||
        plainBody.includes(remainingText);

      if (!matches) return false;
    }

    return true;
  });
};
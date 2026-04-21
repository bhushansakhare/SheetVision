const axios = require("axios");

// Convert any Google Sheet URL into a CSV export URL.
// Accepts:
//   https://docs.google.com/spreadsheets/d/{ID}/edit?...#gid=123
//   https://docs.google.com/spreadsheets/d/{ID}/...
//   https://docs.google.com/spreadsheets/d/e/{PUBLISH_ID}/pubhtml
function toCsvUrl(url) {
  if (!url || typeof url !== "string") {
    throw new Error("Invalid sheet URL");
  }

  const trimmed = url.trim();

  // Published ("Publish to the web") variant
  const publishMatch = trimmed.match(
    /docs\.google\.com\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/
  );
  if (publishMatch) {
    const pubId = publishMatch[1];
    const gidMatch = trimmed.match(/[?&#]gid=(\d+)/);
    const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : "";
    return `https://docs.google.com/spreadsheets/d/e/${pubId}/pub?output=csv${gidParam}`;
  }

  // Standard spreadsheet URL
  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) {
    throw new Error("Could not extract Google Sheet ID from URL");
  }
  const sheetId = idMatch[1];

  const gidMatch = trimmed.match(/[?&#]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : "0";

  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

// Very small CSV parser that handles quoted fields and escaped quotes.
function parseCsv(text) {
  const rows = [];
  let cur = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        cur.push(field);
        field = "";
      } else if (c === "\n") {
        cur.push(field);
        rows.push(cur);
        cur = [];
        field = "";
      } else if (c === "\r") {
        // skip - \n will finalize row
      } else {
        field += c;
      }
    }
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  return rows.filter((r) => r.some((cell) => cell !== ""));
}

// Converts parsed rows into { columns, rows (array of objects) }
function toStructured(rawRows) {
  if (!rawRows.length) return { columns: [], rows: [] };
  const [header, ...body] = rawRows;
  const columns = header.map((h) => (h || "").trim());
  const rows = body.map((r) => {
    const obj = {};
    columns.forEach((col, idx) => {
      const value = (r[idx] ?? "").trim();
      const num = Number(value.replace(/,/g, ""));
      obj[col] = value !== "" && !Number.isNaN(num) ? num : value;
    });
    return obj;
  });
  return { columns, rows };
}

async function fetchSheet(sheetUrl) {
  const csvUrl = toCsvUrl(sheetUrl);
  const { data } = await axios.get(csvUrl, {
    responseType: "text",
    timeout: 15000,
    maxRedirects: 5,
    transformResponse: (d) => d,
  });

  if (typeof data !== "string" || data.trim().startsWith("<")) {
    throw new Error(
      "Sheet is not publicly accessible. Share it as 'Anyone with link (Viewer)' or publish to the web."
    );
  }

  const raw = parseCsv(data);
  return toStructured(raw);
}

module.exports = { fetchSheet, toCsvUrl };

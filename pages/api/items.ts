import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  let name = req.query.name;
  let description = req.query.description;
  let type = req.query.type;
  let slot = req.query.slot;

  if (description == '' && name == '' && type == '' && slot == '') {
    let query = `
        SELECT *
        FROM items
        WHERE (description NOT IN ('...', '') AND description IS NOT NULL)
        ORDER BY jname ASC
        LIMIT 20
        
    `;
    const items = await prisma.$queryRawUnsafe(query);
    res.json({ items: items });
  }

  let query = `
        SELECT *
        FROM items
        WHERE 1=1
    `;

  if (description) {
    let words = description.split('&&');
    console.log('words', words);
    for (let i = 0; i < words.length; i++) {
      let trimmed = words[i].trim();
      query += `AND regexp_replace(unaccent(description), '<([^>]+)>', '', 'ig') ILIKE unaccent('%${trimmed}%') `;
    }
    
  }

  if (name) {
    query += `AND unaccent(jname) ILIKE unaccent('%${name}%') `;
  }

  if (type) {
    query += `AND type = ${type} `;
  }

  if (slot) {
    query += `AND slot = ${slot} `;
  }

  // Additional condition to filter out specific description values
  query += `
    AND (description NOT IN ('...', '') AND description IS NOT NULL)
  `;

  console.log('query', query);

  const items = await prisma.$queryRawUnsafe(query);

  res.json({ items });
}

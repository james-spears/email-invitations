import { parse } from 'csv-parse/sync';
import { readFileSync } from 'node:fs';
import handlebars from 'handlebars';
import { createHash } from 'node:crypto';
const { compile } = handlebars;

import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const source = readFileSync('./index.mustache').toString();

const template = compile(source);

const input = readFileSync('./tables.csv');

const msgs = parse(input, {
  columns: true,
  skip_empty_lines: true
}).map((msg) => {
  const hash = createHash('sha256').update(JSON.stringify(msg) + 'bmo-diwali-2024').digest('hex')
  const link = `https://d3figr8qcl36mf.cloudfront.net/ticket/${hash}`;
  msg.link = link;
  return {
    to: msg.email, // Change to your recipient
    from: 'invitations@fastinvites.com', // Change to your verified sender
    subject: `Your Ticket to Diwali! | BMO GTA Diwali 2024`,
    text: `Click here to view your BMO GTA Diwali ticket: ${link}`,
    html: template(msg),
  };
});

msgs.forEach(msg => sendgrid.send(msg));

// console.log(result)
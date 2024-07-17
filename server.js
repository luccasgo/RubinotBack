const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const port = 3000;

const GUILD_URL = 'https://rubinot.com.br/?subtopic=guilds&page=view&GuildName=Ultimate%20Squad';

// Adicionar middleware CORS
app.use(cors());
const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }
  
  const handler = (req, res) => {
    const d = new Date()
    res.end(d.toString())
  }
  
  module.exports = allowCors(handler)
  
  

app.get('/api/guild', async (req, res) => {
  try {
    const response = await axios.get(GUILD_URL);
    const html = response.data;
    const $ = cheerio.load(html);

    const characters = [];
    $('table.TableContent tbody tr').each((index, element) => {
      const columns = $(element).find('td');
      if (columns.length === 6) {
        const rank = $(columns[0]).text().trim();
        const nameAndTitle = $(columns[1]).find('a').text().trim();
        const vocation = $(columns[2]).text().trim();
        const level = $(columns[3]).text().trim();
        const joiningDate = $(columns[4]).text().trim();
        const status = $(columns[5]).find('.green').text().trim();

        if (status.toLowerCase() === 'online') {
          characters.push({
            rank,
            name: nameAndTitle,
            vocation,
            level,
            joiningDate,
            status
          });
        }
      }
    });

    res.json(characters);
  } catch (error) {
    console.error('Error fetching guild data:', error);
    res.status(500).send('Error fetching guild data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

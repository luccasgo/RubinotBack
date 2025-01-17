const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const GUILD_URL = 'https://rubinot.com.br/?subtopic=guilds&page=view&GuildName=New%20Direction';

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.get('/guild', async (req, res) => {
  try {
    const response = await axios.get(GUILD_URL);
    const html = response.data;
    const $ = cheerio.load(html);

    const characters = [];
    $('.TableContent tbody tr').each((index, element) => {
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
    console.error('Erro ao obter os dados da guild:', error);
    res.status(500).send('Erro ao obter os dados da guild');
  }
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  
});

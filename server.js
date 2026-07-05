const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME Types suportados
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ico': 'image/x-icon'
};

// Auxiliar para ler o corpo JSON do POST
function readJSONBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch (err) {
                reject(err);
            }
        });
    });
}

// Auxiliar para enviar resposta JSON
function sendJSON(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

// Servidor de arquivos estáticos com suporte a Range Requests (para áudio/vídeo fluídos)
function serveStaticFile(filePath, req, res) {
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        sendJSON(res, 404, { error: 'Arquivo não encontrado' });
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);
    const totalSize = stat.size;

    const range = req.headers.range;

    if (range) {
        // Trata Range Requests (ex: bytes=0- ou bytes=1000-2000)
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

        if (isNaN(start) || start < 0 || start >= totalSize || end >= totalSize || start > end) {
            res.writeHead(416, { 'Content-Range': `bytes */${totalSize}` });
            return res.end();
        }

        const chunkSize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': mimeType
        });

        fileStream.pipe(res);
    } else {
        // Envio normal completo do arquivo
        res.writeHead(200, {
            'Content-Length': totalSize,
            'Content-Type': mimeType,
            'Accept-Ranges': 'bytes'
        });
        fs.createReadStream(filePath).pipe(res);
    }
}

// Cria o Servidor HTTP
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;

    console.log(`[${method}] ${url.pathname}`);

    // --- ROTAS DE API ---

    // 1. Adicionar Evento
    if (method === 'POST' && url.pathname === '/api/adicionar-evento') {
        try {
            const body = await readJSONBody(req);
            const { titulo, data, fotos, videos } = body;

            if (!titulo || !data) {
                return sendJSON(res, 400, { success: false, error: 'Título e Data são obrigatórios' });
            }

            // Lê eventos.json existente
            let eventosData = { eventos: [] };
            const jsonPath = path.join(__dirname, 'eventos.json');
            if (fs.existsSync(jsonPath)) {
                try {
                    const content = fs.readFileSync(jsonPath, 'utf8');
                    eventosData = JSON.parse(content || '{"eventos":[]}');
                } catch (e) {
                    console.error('Erro ao ler eventos.json:', e);
                }
            }

            // Trata as fotos
            let fotosArray = [];
            if (typeof fotos === 'string') {
                fotosArray = fotos.split(',')
                    .map(f => f.trim())
                    .filter(Boolean)
                    .map(f => f.startsWith('imagens/') ? f : `imagens/${f}`);
            } else if (Array.isArray(fotos)) {
                fotosArray = fotos.map(f => String(f).trim()).filter(Boolean).map(f => f.startsWith('imagens/') ? f : `imagens/${f}`);
            }

            // Trata os vídeos
            let videosArray = [];
            if (typeof videos === 'string') {
                videosArray = videos.split(',')
                    .map(v => v.trim())
                    .filter(Boolean)
                    .map(v => v.startsWith('videos/') ? v : `videos/${v}`);
            } else if (Array.isArray(videos)) {
                videosArray = videos.map(v => String(v).trim()).filter(Boolean).map(v => v.startsWith('videos/') ? v : `videos/${v}`);
            }

            const novoEvento = {
                titulo,
                data,
                fotos: fotosArray,
                videos: videosArray
            };

            eventosData.eventos.push(novoEvento);

            // Grava alterações de volta no arquivo
            fs.writeFileSync(jsonPath, JSON.stringify(eventosData, null, 2), 'utf8');
            return sendJSON(res, 200, { success: true });
        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { success: false, error: 'Erro no processamento do servidor' });
        }
    }

    // 2. Adicionar Set
    if (method === 'POST' && url.pathname === '/api/adicionar-set') {
        try {
            const body = await readJSONBody(req);
            const { titulo, data, audio } = body;

            if (!titulo || !data || !audio) {
                return sendJSON(res, 400, { success: false, error: 'Título, Data e Áudio são obrigatórios' });
            }

            // Lê sets.json existente
            let setsData = { sets: [] };
            const jsonPath = path.join(__dirname, 'sets.json');
            if (fs.existsSync(jsonPath)) {
                try {
                    const content = fs.readFileSync(jsonPath, 'utf8');
                    setsData = JSON.parse(content || '{"sets":[]}');
                } catch (e) {
                    console.error('Erro ao ler sets.json:', e);
                }
            }

            // Garante o prefixo da pasta de audios
            const audioPath = audio.startsWith('audios/') ? audio : `audios/${audio}`;

            const novoSet = {
                titulo,
                data,
                audio: audioPath
            };

            setsData.sets.push(novoSet);

            // Grava de volta no arquivo
            fs.writeFileSync(jsonPath, JSON.stringify(setsData, null, 2), 'utf8');
            return sendJSON(res, 200, { success: true });
        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { success: false, error: 'Erro no processamento do servidor' });
        }
    }

    // 3. Excluir Mídia de Evento
    if (method === 'POST' && url.pathname === '/api/excluir-midia-evento') {
        try {
            const body = await readJSONBody(req);
            const { eventIndex, mediaType, mediaIndex } = body;

            if (eventIndex === undefined || !mediaType || mediaIndex === undefined) {
                return sendJSON(res, 400, { success: false, error: 'Parâmetros insuficientes' });
            }

            const jsonPath = path.join(__dirname, 'eventos.json');
            if (!fs.existsSync(jsonPath)) {
                return sendJSON(res, 404, { success: false, error: 'Arquivo de eventos não encontrado' });
            }

            const content = fs.readFileSync(jsonPath, 'utf8');
            const eventosData = JSON.parse(content || '{"eventos":[]}');

            const ev = eventosData.eventos[eventIndex];
            if (!ev) {
                return sendJSON(res, 404, { success: false, error: 'Evento não encontrado' });
            }

            if (mediaType === 'fotos' && Array.isArray(ev.fotos)) {
                ev.fotos.splice(mediaIndex, 1);
            } else if (mediaType === 'videos' && Array.isArray(ev.videos)) {
                ev.videos.splice(mediaIndex, 1);
            } else {
                return sendJSON(res, 400, { success: false, error: 'Tipo de mídia inválido' });
            }

            fs.writeFileSync(jsonPath, JSON.stringify(eventosData, null, 2), 'utf8');
            return sendJSON(res, 200, { success: true });
        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { success: false, error: 'Erro no servidor' });
        }
    }

    // 4. Excluir Evento Inteiro
    if (method === 'POST' && url.pathname === '/api/excluir-evento') {
        try {
            const body = await readJSONBody(req);
            const { index } = body;

            if (index === undefined) {
                return sendJSON(res, 400, { success: false, error: 'Index do evento é necessário' });
            }

            const jsonPath = path.join(__dirname, 'eventos.json');
            if (!fs.existsSync(jsonPath)) {
                return sendJSON(res, 404, { success: false, error: 'Arquivo de eventos não encontrado' });
            }

            const content = fs.readFileSync(jsonPath, 'utf8');
            const eventosData = JSON.parse(content || '{"eventos":[]}');

            if (index < 0 || index >= eventosData.eventos.length) {
                return sendJSON(res, 404, { success: false, error: 'Evento não encontrado no índice especificado' });
            }

            eventosData.eventos.splice(index, 1);

            fs.writeFileSync(jsonPath, JSON.stringify(eventosData, null, 2), 'utf8');
            return sendJSON(res, 200, { success: true });
        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { success: false, error: 'Erro no servidor' });
        }
    }

    // 5. Excluir Set
    if (method === 'POST' && url.pathname === '/api/excluir-set') {
        try {
            const body = await readJSONBody(req);
            const { index } = body;

            if (index === undefined) {
                return sendJSON(res, 400, { success: false, error: 'Index do set é necessário' });
            }

            const jsonPath = path.join(__dirname, 'sets.json');
            if (!fs.existsSync(jsonPath)) {
                return sendJSON(res, 404, { success: false, error: 'Arquivo de sets não encontrado' });
            }

            const content = fs.readFileSync(jsonPath, 'utf8');
            const setsData = JSON.parse(content || '{"sets":[]}');

            if (index < 0 || index >= setsData.sets.length) {
                return sendJSON(res, 404, { success: false, error: 'Set não encontrado no índice especificado' });
            }

            setsData.sets.splice(index, 1);

            fs.writeFileSync(jsonPath, JSON.stringify(setsData, null, 2), 'utf8');
            return sendJSON(res, 200, { success: true });
        } catch (err) {
            console.error(err);
            return sendJSON(res, 500, { success: false, error: 'Erro no servidor' });
        }
    }

    // --- SERVIÇO DE ARQUIVOS ESTÁTICOS ---
    let reqPath = url.pathname;
    
    // Mapeamento padrão do diretório raiz
    if (reqPath === '/') {
        reqPath = '/index.html';
    }

    // Resolve o caminho completo no sistema de arquivos local
    const filePath = path.join(__dirname, reqPath);
    
    // Proteção básica contra Path Traversal
    const relative = path.relative(__dirname, filePath);
    const isSafe = relative && !relative.startsWith('..') && !path.isAbsolute(relative);

    if (isSafe || reqPath === '/index.html') {
        serveStaticFile(filePath, req, res);
    } else {
        sendJSON(res, 403, { error: 'Acesso proibido' });
    }
});

server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🎧 DJ Oz - Servidor Local Executando com Sucesso!`);
    console.log(`🌐 Acesse o site em: http://localhost:${PORT}`);
    console.log(`⚙️ Painel Admin disponível em: http://localhost:${PORT}/admin.html`);
    console.log(`==================================================`);
});

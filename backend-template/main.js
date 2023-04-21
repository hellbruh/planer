// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})
const Pool = require('pg-pool')
const pool = new Pool({
    database: 'postgres',
    user: 'postgres',
    password: '123456789',
    ssl: false,
    port: 5432,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
  })
//   передавать через енв

pool.on('error', (error, client) => {
    console.error(error)
    process.exit(-1)
})
pool.on('connect', client => {
    console.log('New client')
})
pool.on('remove', client => {
    console.log('Client pool removed')
})

// Блок кода, который нужен для исправления ошибки с CORS
fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})


//достаем папки
fastify.get('/folders', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
    const data = {
        message:'error'
    }
    try{
        const folders = await client.query('select * from folders')
        console.log('!')
        console.log(folders.rows)
        data.message = folders.rows
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

//создание папки
fastify.post('/createfolder', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
    let data = {
        message:'error'
    }
    try{
        const result = await client.query(`insert into folders ("folderName", "folderColor") values ($1,$2) returning "folderid" `, [request.body.name, request.body.color])
        console.log(result)
        data.message = result.rows
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})
//менять имя
fastify.post('/editfoldername', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const result = await client.query(`update folders set "folderName" = '$2' where "id" = $1;,`, [request.body.id, request.body.name])
        console.log('new name')
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(result)
})

// сменить цвет
fastify.post('/editfoldercolor', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const result = await client.query(`update folders set "folderColor" = '$2' where "id" = $1;,`, [request.body.id, request.body.color])
        console.log('new color')
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(result)
})

// delete folder
fastify.post('/deletefolder', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const result = await client.query(`delete from folders  where "id" = $1;,`, [request.body.id])
        console.log('succesfully deleted')
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(result)
})

//read deals
fastify.get('/tasks', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const tasks = await client.query('select * from tasks')
        console.log('!')
        console.log(tasks.rows)
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
})

//создание taska
fastify.post('/createtask', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const result = await client.query(`insert into tasks ("taskText", "folderid") values ($1,$2)' returning "id",`, [request.body.name, request.body.folderid])
        console.log(result)
        console.log('created a task')
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(result)
})

//done task
fastify.post('/taskdone', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const result = await client.query(`update tasks set "isDone" = 'true' where "id" = $1;,`, [request.body.id])
        console.log(result)
        console.log('hooray, task is done')
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(result)
})

//rename task
fastify.post('/renametask', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const result = await client.query(`update tasks set "taskText" = $2 where "id" = $1;,`, [request.body.id, request.body.name])
        console.log(result)
        vonsole.log('renamed a task')
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(result)
})

//del a task
fastify.post('/deletetask', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд

    try{
        const result = await client.query(`delete from tasks  where "id" = $1;,`, [request.body.id])
        console.log(result)
        vonsole.log('deleted a task')
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(result)
})

// Создание маршрута для post запроса
fastify.post('/post',function (request, reply) {
    console.log(`Тело запроса: `,JSON.stringify(request.body))
    reply.send(request.body)
})

// Создание запроса с использование path параметров
fastify.get('/:id',function (request, reply) {
    console.log(`Path параметры, переданные в запросе: `,JSON.stringify(request.params))
    reply.send(request.params)
})

// Создание запроса с использованием query параметров
fastify.get('/query',function (request, reply) {
    console.log(`Query параметры, переданные в запросе`, JSON.stringify(request.query))
    reply.send(request.query)
})

// Запускаем сервер на порту 3000
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
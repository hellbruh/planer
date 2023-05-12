// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})
const pdfMakePrinter = require('pdfmake/src/printer')

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



const fonts = {
    Roboto: {
      normal: './fonts/Roboto-Black.ttf',
      bold: './fonts/Roboto-Bold.ttf',
      italics: './fonts/Roboto-Italic.ttf',
    }
}
const pdfmake = require('pdfmake');

//достаем папки
fastify.get('/folders', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
    const data = {
        message:'error',
    }
    const urlName = '/folders'
    try{
        const folders = await client.query('select * from folders')
        console.log(folders.rows)
        data.message = folders.rows
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
        console.log(urlName, 'client Release()')
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
        const result = await client.query(`insert into folders ("folderName", "folderColor") values ($1,$2) returning "folderid", "folderName", "folderColor" `, [request.body.name, request.body.color])
        if (result.rowCount>0 && result.rows.length>0){
            console.log(result)
            data.message = result.rows[0]
        }
        else{
            data.message = 'We didnt created some shit'
        }
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
        let data = {
        message:'error'
    }
    try{
        const result = await client.query(`update folders set "folderName" = $2 where "folderid" = $1 returning "folderid","folderName","folderColor"`, [request.body.id, request.body.name])
        if (result.rowCount>0 && result.rows.length>0){
            data.result = 'we have changed the name!'
            data.message = result.rows
        }
        else{
            data.message = 'We didnt renamed some shit'
        }
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

// сменить цвет
fastify.post('/editfoldercolor', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
        let data = {
        message:'error'
    }
    try{
        const result = await client.query(`update folders set "folderColor" = $2 where "folderid" = $1 returning "folderid","folderName","folderColor"`, [request.body.id, request.body.color])
        if (result.rowCount>0 && result.rows.length>0){
            data.result = 'we have changed the color!'
            data.message = result.rows
        }
        else{
            data.message = 'We didnt recolored some shit'
        }
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

// delete folder
fastify.post('/deletefolder', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
        let data = {
        message:'error'
    }
    try{
        const result = await client.query(`delete from folders  where folderid = $1 order by folderid desc`, [request.body.id])
        console.log('succesfully deleted')
        data. result = 'we have deleted it'
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

//read deals
fastify.get('/tasks', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
        let data = {
        message:'error'
    }
    try{
        const tasks = await client.query('select * from tasks t left join folders f on t.folderid = f.folderid')
        console.log('!')
        data.message = tasks.rows
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

//создание taska 
    fastify.post('/createtask', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
        let data = {
        message:'error'
    }
    try{
        const result = await client.query(`insert into tasks ("taskText", "folderid") values ($1,$2) returning "taskid","folderid"`, [request.body.name, request.body.folderid])
        if (result.rowCount>0 && result.rows.length>0){
        data.message = result.rows
        data.y = 'we have created it'
            }
        else{
            data.message = 'We didnt created some shit'
            }
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

fastify.post('/dotasks', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
    let data = {
        message:'error'
    }
    try{
        const tasks = await client.query('select "isDone" from tasks  where "taskid" = $1', [request.body.id])
        if(tasks.rows.length > 0){
            const result = await client.query(`update tasks set "isDone" = $2 where "taskid" = $1 returning "taskid","isDone","folderid","taskText"`, [request.body.id,!tasks.rows[0].isDone])
            if (result.rowCount>0){
                data.message = {
                    success:true
                }
            }
            else{
                data.message = 'we was on finish but task isnt done'
            }
        }
        else{
            data.message = 'error we didnt do this task'
        }
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})


//renme task
fastify.post('/renametask', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к 
        let data = {
        message:'error'
    }
    try{
        const result = await client.query(`update tasks set "taskText" = $2 where "taskid" = $1;`, [request.body.id, request.body.name])
        if (result.rowCount>0 && result.rows.length>0){
            data.result = 'we have renamed a task'
            data.message = result.rows
        }
        else{
            data.message = 'We didnt renamed some shit'
        }
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

//del a task
fastify.post('/deletetask', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
        let data = {
        message:'error'
    }

    try{
        const result = await client.query(`delete from tasks  where "taskid" = $1;`, [request.body.id])
        console.log(result)
        console.log('deleted a task')
        data.message = 'we have deleted a task!'
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})

fastify.post('/folder', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
        let data = {
        message:'error'
    }
    try{
        const tasks = await client.query(`select f."folderName", 
                                                f."folderColor", 
                                                t."taskText",
                                                t."taskid", 
                                                f."folderid" 
                                                from tasks t left join folders f on t.folderid = f.folderid where t.folderid = $1`,[request.body.folderid])
        data.message = tasks.rows
    }
    catch(e){
        console.log(e)
    }
    finally{
        client.release()
    }
    reply.send(data)
})




async function docFileFromStream(document) {
    const chunks = [];
    let result = null;
    return new Promise(function (resolve, reject) {
        try {
            document.on('data', function (chunk) {
                chunks.push(chunk);
            });
            document.on('end', async function () {
                result = Buffer.concat(chunks);
                console.log('end');
                resolve(result);
                
            });
            document.on('error', reject);
            document.end();
        } catch (error) {
            console.log('docFileFromStream ERROR');
            console.log(error);
            reject(null);
        }
    });
}


// PDF
fastify.post('/pdf', async function(request,reply) {

    try{
        const printer = new pdfMakePrinter(fonts)
        const docFile = printer.createPdfKitDocument({
                content: [
                    'First paragraph',
                    'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
                ]
            })
            const doc = await docFileFromStream(docFile)
            reply.header('Content-type','application/pdf')
            reply.send(doc)
    }
    catch(e){
        console.log(e)
    }

})

fastify.post('/taskspdf', async function(request,reply) {
    const client = await pool.connect()
    // непосредственное подкллючение к бд
    const data = {
        message:'error',
    }
    try{
        const tasks = await client.query('select * from tasks')
        console.log(tasks.rows)
        data.message = tasks.rows
        if (tasks.rowCount>0){
            try{
                let s=``
                for ( const task of data.message){
                    s+=`${task.taskText} \n`
                }
                const taskk=[]
                for ( const task of data.message){
                    taskk.push(task.taskText)
                }
                let erer=[...taskk]
                console.log(1);
                console.log(taskk);
                const content = [
                    {text: 'Unordered list', style: 'header'},
		            {
                        ul: taskk
		            },
                    
                {text: '\n\nOrdered list', style: 'header'},
                {
                    ol: erer
                }]
                const printer = new pdfMakePrinter(fonts)
                const docFile = printer.createPdfKitDocument({
                content: content
            })
            const doc = await docFileFromStream(docFile)
            reply.header('Content-type','application/pdf')
            reply.send(doc)
            }
            catch(e){
                console.log(e)
                reply.send('failed 2nd by catch')
            }
        }
        else{
            reply.send('failed 2nd by else ')
        }
    }
    catch(e){
        console.log(e)
        data.message = 'failed 1st'
        readonly.send(data)
    }
    finally{
        client.release()
    }
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
import amqp from 'amqplib'

class Reciever {
    amqpURL!: string;
    con!: amqp.Connection;
    ch!: amqp.Channel
    constructor(url: string) {
        this.amqpURL = url;
    }
    public async recieveMessageFromExchange(ex: string) {
        this.con = await amqp.connect(this.amqpURL)
        this.ch = await this.con.createChannel()
        this.ch.assertExchange(ex, 'fanout', { durable: false })
        var q = await this.ch.assertQueue('', { exclusive: true })
        this.ch.bindQueue(q.queue, ex, '')
        console.log("Listen to exchange from quere:"+q.queue.toString())
        this.ch.consume(q.queue, msg => {
            if (msg) {
                console.log('Messege from ' + ex + ":" + msg.content.toString())
            }
        }, { noAck: true })
    }
}

let reciever = new Reciever('amqp://localhost')
reciever.recieveMessageFromExchange('logs')

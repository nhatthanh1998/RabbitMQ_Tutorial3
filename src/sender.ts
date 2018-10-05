import amqp from 'amqplib'
class Send{
    amqpURL:string;
    con!:amqp.Connection;
    ch!:amqp.Channel;
    constructor(url:string){
        this.amqpURL = url;
    }
    public async send(msg:string){
        this.con = await amqp.connect(this.amqpURL)
        this.ch = await this.con.createChannel()
        this.ch.assertExchange('log','fanout',{durable:false})
        this.ch.publish('logs','',Buffer.from(msg));
        console.log("exhange message from logs:"+msg)
        setTimeout(()=>{
            this.con.close();
            process.exit(0)
        },300)
    }
}

var sender = new Send('amqp://localhost');
sender.send('Hello there');
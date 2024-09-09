export interface MailerGateway {
    send(recepient: string, subject: string, content: string): Promise<void>
}

export class MailerGatewayMemory implements MailerGateway {

    async send(recepient: string, subject: string, content: string) {
        console.log(`Sending email to ${recepient} with subject ${subject} and content ${content}`)
    }
}
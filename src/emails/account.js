const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.welcomeMail = (email , name) => {
    sendgrid.send({
        to: email,
        from: "animeshp.work@gmail.com",
        subject: "Thanks for joining",
        text: `Welcome to the library, ${name}. We hope you find the books you need`
    });
}

exports.deleteMail = (email , name) => {
    sendgrid.send({
        to: email,
        from: "animeshp.work@gmail.com",
        subject: "Account Deleted",
        text: `Sorry , for the inconvinence caused by us. Hope you have returned all the books before deleting account. ${name} please tell us the reason.`
    })
}
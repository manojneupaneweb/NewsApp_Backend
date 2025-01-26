import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "achyutneupane2004@gmail.com",
        pass: "hloa tzgb psoi imdq",
    },
});


const sendremail = async()=>{
    const otp ="3454534"
    await transporter.sendMail({
        from: '"NewsApp 📩" <noreply@newsapp.com>',
        to: "randome255@gmail.com",  
        subject: "Your OTP for NewsApp Registration",
        text: `Your OTP for completing registration is ${otp}. It is valid for 5 minutes.`,
        html: `
          <h2>Welcome to NewsApp!</h2>
          <p>Your OTP for completing registration is:</p>
          <h3 style="color: #2d89ef;">${otp}</h3>
          <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        `,
    });
    console.log("Email sent successfully");
}

export {sendremail}

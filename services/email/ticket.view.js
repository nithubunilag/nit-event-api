const sendTicketMails = (data) => `
<!DOCTYPE html>

<html lang="en-US">

  <head>
    <meta charset="UTF-8" />
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Green hub email">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <title>Green hub email: Verify Account</title>
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
  </head>
  
  

  <body 
      marginheight="0" 
      topmargin="0" 
      marginwidth="0" 
      style="
             margin: 0px; 
             background-color: #FAFAFA; 
             color: #1C1C1C;
             font-family: 'Lexend', sans-serif;
             " 
      leftmargin="0"
  >
    
    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; ">
      <tr>
        <td>
          <table 
                 style="
                        max-width:670px;  
                        margin:0 auto;
                        " 
                 width="100%" 
                 border="0"
                 align="center" 
                 cellspacing="0"
           >
            <tr>
                <td 
                  style="
                         
                         text-align:center;
                          background-color: #355312; 
                          border-radius:10px;
                          padding: 10px;
                        "
                    >
                <img 
                    src="https://i.ibb.co/9Vh4v0S/Green-HUrb-Logo3-removebg-preview-2.png"
                     alt="logo" 
                     loading="lazy" 
                     style="margin: 0; padding: 0; box-sizing: border-box;" />

                             <img src="${data?.qrCodeDataUrl}" alt="Ticket QR Code" style="width: 200px; height: 200px;"/>

            </td>
            </tr>
            
             <tr>
               <td style="height:20px;">&nbsp;</td>
             </tr>
            
            <tr  
                
              >
              <td style="
            
                  gap: 15px;
                  color: #1C1C1C;
                  margin: 0;
                ">
               <h2 style="
                  
                  margin: 0 0 1em;
                  font-size: 20px;
                  font-weight: 500;
                  line-height: 26.6px;
                  letter-spacing: 0.4px;
                  text-transform: capitalize;
                 
                "
               >
                Hello ${data?.firstName} ${data?.lastName}
                </h2>
                 <p
          style="
            margin: 0 0 1em;
     
            font-size: 16px;
            font-weight: 300;
            line-height: 24px;
            letter-spacing: 0.3px;
          "
        >
          It seems you've just created a new account and you are in the process of verifying your account and we're here to assist you every step of the way
        </p>
        <p
          style="
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 300;
            line-height: 24px;
            letter-spacing: 0.3px;
          "
        >
          Below is the 4 Digit Code that has been provided for you to verify your account:
        </p>
              </td>
              
              
            </tr>
            
               <tr>
               <td style="height:20px;">&nbsp;</td>
             </tr>
            
            <tr>
              <td>
                 <button
        style="
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-size: 18px;
          font-weight: 700;
          line-height: 24.3px;
          color: #ffffff;
          text-align: center;
          width: 236px;
          max-width: 100%;
          border-radius: 10px;
          padding: 10px 22px;
          background-color: #50870e;
          outline: none;
          border: none;
          letter-spacing: 1rem;
        "
      >
      </button>
      <p
        style="
          margin: 1em 0 0;
          padding: 0;
          box-sizing: border-box;
          font-size: 16px;
          font-weight: 300;
          line-height: 24px;
          letter-spacing: 0.3px;
               color:#1C1C1C;
        "
      >
        We take the security of your account seriously as This code will be invalid after 10 Mins. Ensure not to share this code with anyone
      </p>
              </td>
            </tr>
            
            <tr>
              <td>
                
                   <a
          href="#"
          style="
            margin: .5em 0 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 14px;
            font-weight: 300;
            line-height: 20.3px;
            letter-spacing: 0.28px;
            color: #50870e;
            text-decoration: none;
            margin-bottom: 15px;
            display: block;
          "
          >Contact support
          </a>
                <span style=" font-size: 16px;
            font-weight: 300;
            letter-spacing: 0.32px;">
                 <p style="margin: 0; padding: 0; box-sizing: border-box">
            Warm regards,
          </p>
          <p style="margin: 0; padding: 0; box-sizing: border-box">
            The Nithub Team
          </p>
                </span>
              </td>
            </tr>
              <tr>
               <td style="height:20px;">&nbsp;</td>
             </tr>
            
            <tr>
              <td
        style="
        
          border-radius: 10px;
          width: 100%;
          background-color: #355312;
          padding: 31px 20px;
       
        "
      >
        <p
          style="
           
            font-size: 16px;
            font-weight: 300;
            letter-spacing: 0.32px;
            color: #ffffff;
          "
        >
          House C32, Engr Ebele Okeke Housing Estate, FHA Lugbe. Abuja. Nigeria.
        </p>
        <div
          style="
          
          margin:0 0 1em;
          "
        >
          <img style="width:30px; margin-right:30px;" src='https://svgshare.com/i/yBm.svg' alt='facebook' />
          <img style="width:35px; margin-right:30px;" src='https://svgshare.com/i/yBZ.svg' alt='Linkedin' />
          <img style="width:35px; margin-right:30px;" src='https://svgshare.com/i/yBq.svg' alt='instagram' />
          <img style="width:30px; margin-right:30px;" src='https://svgshare.com/i/yCA.svg' title='twitter' />
        </div>
        <p
          style="
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-size: 14px;
            font-weight: 300;
            line-height: 20.3px;
            letter-spacing: 0.28px;
            color: #ffffff;
          "
        >
          @ copyright 2023. All rights reserved
        </p>

              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      
      
   
    </table>
    <!--/100% body table-->
</body>

</html>

`;


const sendTicketMail = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ICAIR - Your Ticket Information</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #190577;">
                <h1 style="color: #ffffff; margin: 0;">Welcome to ICAIR</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p style="text-transform:capitalize;">Dear ${data?.firstName} ${data?.lastName},</p>
                <p>Thank you for registering for the 4th International Conference on AI and Robotics (ICAIR 2024). We're excited to have you join us for this groundbreaking event!</p>
                <h2 style="color: #190577;">Event Details</h2>
                <p><strong>Date:</strong> 26th - 28th, November, 2024</p>
                <p><strong>Venue:</strong> Glass House, Faculty of education UNILAG</p>
                <p><strong>Time:</strong> 9:00AM</p>
                <h2 style="color: #190577;">Your Ticket Information</h2>
                <table cellpadding="10" cellspacing="0" width="100%" style="border: 1px solid #dddddd; border-collapse: collapse;">
                    <tr>
                        <td style="border: 1px solid #dddddd;"><strong>Ticket ID:</strong></td>
                        <td style="border: 1px solid #dddddd; text-transform:capitalize;">${data?.ticketId}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dddddd;"><strong>Attending As:</strong></td>
                        <td style="border: 1px solid #dddddd; text-transform:capitalize;">${data?.attendedAs}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dddddd;"><strong>Registration Type:</strong></td>
                        <td style="border: 1px solid #dddddd; text-transform:capitalize;">${data?.registeredAs}</td>
                    </tr>
                </table>
                <div style="text-align: center; margin-top: 20px;">
                    <h3 style="color: #190577;">Your Ticket QR Code</h3>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data?.ticketId}" alt="Ticket QR Code" style="max-width: 150px; height: auto;">
                    <p style="font-size: 14px; color: #666666;">Scan this QR code at the event for quick check-in</p>
                </div>
                <p style="margin-top: 20px;">Please keep this information handy for check-in at the event. You can either print this email, show it on your mobile device, or use the QR code for a smooth check-in experience.</p>
                <h2 style="color: #190577;">About ICAIR</h2>
                <p>ICAIR is a premier conference that brings together experts, researchers, and enthusiasts in the fields of Artificial Intelligence and Robotics. This year's theme is "Artificial Intelligence for the Future Industrialization of Medicine in Sub-Saharan Africa", and we have an exciting lineup of speakers and workshops planned.</p>
                <h2 style="color: #190577;">What to Expect</h2>
                <ul>
                    <li>Keynote speeches from industry leaders</li>
                    <li>Interactive workshops and demonstrations</li>
                    <li>Networking opportunities with peers and experts</li>
                    <li>Showcase of cutting-edge AI and robotics technologies</li>
                </ul>
                <p>If you have any questions or need additional information, please don't hesitate to contact us at mirg-icair@unilag.edu.ng.</p>
                <p>We look forward to seeing you at ICAIR!</p>
                <p>Best regards,<br>The ICAIR Team</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #f0f0f0;">
                <p style="margin: 0; font-size: 12px; color: #666666;">This email was sent to ${data?.email}. If you believe this is a mistake, please contact us.</p>
                <p style="margin: 5px 0 0; font-size: 12px; color: #666666;">&copy; 2024 NITDA ICAIR. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;


module.exports = sendTicketMail;

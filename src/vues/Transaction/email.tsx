import emailjs from 'emailjs-com';

const sendEmail = (email: string, message: string) => {
  return emailjs.send('service_id', 'template_id', {
    to_email: email,
    message: message,
  }, 'user_id')
    .then((response) => {
      console.log('Success:', response);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
};

export default sendEmail;
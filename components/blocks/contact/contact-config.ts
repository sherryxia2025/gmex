export const contactConfig = {
  // contact methods
  contactMethods: {
    email: {
      title: "Send E-Mail",
      value: "sherryxia05061@gmail.com",
    },
    phone: {
      title: "Call Anytime",
      value: "+86 15895423425",
    },
    whatsapp: {
      title: "Whatsapp",
      value: "15895423425",
    },
  },
  // form title
  formTitle: "Write Us Something",
  // form fields
  formFields: {
    name: {
      label: "Your Name",
      placeholder: "Your name here",
      error: "Name is required",
    },
    email: {
      label: "Your Email",
      placeholder: "Your email here",
      error: "Invalid email address",
    },
    contactNumber: {
      label: "Contact Number",
      placeholder: "Contact number here",
      error: "Contact number is required",
    },
    subject: {
      label: "Subject",
      placeholder: "Subject here",
      error: "Subject is required",
    },
    message: {
      label: "Message",
      placeholder: "Tell us a few words",
      error: "Message is required",
    },
  },
  // button text
  button: {
    submit: "Send Message",
    submitting: "Sending...",
  },
  // messages
  messages: {
    success: "Message sent successfully!",
    error: "Failed to send message",
  },
} as const;

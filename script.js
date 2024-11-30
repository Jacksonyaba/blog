// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form submission handling
document.getElementById("contact-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        if (validateEmail(email)) {
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("/.netlify/functions/email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || `Thank you, ${name}! Your message has been sent.`);
                    setTimeout(() => window.location.href = '/', 2000);
                } else {
                    alert(result.error || "An error occurred. Please try again.");
                }
            } catch (error) {
                alert("An error occurred while sending the email.");
                console.error("Error:", error);
            }
        } else {
            alert('Please enter a valid email address.');
        }
    } else {
        alert('Please fill out all fields.');
    }
});

const sendEmail = async (formData) => {
    try {
      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send email. Please try again later.");
    }
  };
  
  // Example form submission handler
  document.querySelector("#contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const message = document.querySelector("#message").value;
  
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }
  
    await sendEmail({ name, email, message });
  });
  


